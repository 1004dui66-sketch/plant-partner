import { loadEnvFile, projectRefFromUrl } from './lib/load-env.mjs';

const STORAGE_BUCKET = 'plant-images';
const POLICY_SQL = `
create policy "plant_images_select_own"
  on storage.objects for select to authenticated
  using (
    bucket_id = '${STORAGE_BUCKET}'
    and (storage.foldername(name))[1] = (select auth.uid()::text)
  );

create policy "plant_images_insert_own"
  on storage.objects for insert to authenticated
  with check (
    bucket_id = '${STORAGE_BUCKET}'
    and (storage.foldername(name))[1] = (select auth.uid()::text)
  );

create policy "plant_images_update_own"
  on storage.objects for update to authenticated
  using (
    bucket_id = '${STORAGE_BUCKET}'
    and (storage.foldername(name))[1] = (select auth.uid()::text)
  )
  with check (
    bucket_id = '${STORAGE_BUCKET}'
    and (storage.foldername(name))[1] = (select auth.uid()::text)
  );

create policy "plant_images_delete_own"
  on storage.objects for delete to authenticated
  using (
    bucket_id = '${STORAGE_BUCKET}'
    and (storage.foldername(name))[1] = (select auth.uid()::text)
  );
`.trim();

const env = loadEnvFile();
const url = env.NEXT_PUBLIC_SUPABASE_URL?.trim();
const adminKey =
  env.SUPABASE_SECRET_KEY?.trim() ??
  env.SUPABASE_SERVICE_ROLE_KEY?.trim() ??
  '';
const accessToken = env.SUPABASE_ACCESS_TOKEN?.trim() ?? '';
const dbPassword = env.SUPABASE_DB_PASSWORD?.trim() ?? '';

const fail = (message) => {
  console.error(JSON.stringify({ ok: false, error: message }));
  process.exit(1);
};

if (!url) {
  fail('NEXT_PUBLIC_SUPABASE_URL이 .env.local에 없습니다.');
}

if (!adminKey) {
  fail(
    'SUPABASE_SECRET_KEY(또는 SUPABASE_SERVICE_ROLE_KEY)가 필요합니다. Dashboard → Settings → API Keys → Secret key를 .env.local에 추가하세요.',
  );
}

const projectRef = projectRefFromUrl(url);

const bucketExists = async () => {
  const response = await fetch(`${url}/storage/v1/bucket/${STORAGE_BUCKET}`, {
    headers: {
      apikey: adminKey,
      Authorization: `Bearer ${adminKey}`,
    },
  });

  return response.ok;
};

const createBucket = async () => {
  if (await bucketExists()) {
    return { created: false, reason: 'already_exists' };
  }

  const response = await fetch(`${url}/storage/v1/bucket`, {
    method: 'POST',
    headers: {
      apikey: adminKey,
      Authorization: `Bearer ${adminKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      id: STORAGE_BUCKET,
      name: STORAGE_BUCKET,
      public: false,
      file_size_limit: 5_242_880,
      allowed_mime_types: [
        'image/jpeg',
        'image/png',
        'image/webp',
        'image/heic',
      ],
    }),
  });

  const body = await response.text();

  if (!response.ok && !body.includes('already exists')) {
    throw new Error(`버킷 생성 실패 (${response.status}): ${body.slice(0, 200)}`);
  }

  return { created: true, reason: response.ok ? 'created' : 'already_exists' };
};

const applyPoliciesWithManagementApi = async () => {
  if (!accessToken) {
    return { applied: false, reason: 'no_access_token' };
  }

  const response = await fetch(
    `https://api.supabase.com/v1/projects/${projectRef}/database/query`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query: POLICY_SQL }),
    },
  );

  const body = await response.text();

  if (!response.ok) {
    if (body.includes('already exists')) {
      return { applied: true, reason: 'policies_exist' };
    }

    throw new Error(`정책 SQL 실패 (${response.status}): ${body.slice(0, 200)}`);
  }

  return { applied: true, reason: 'policies_created' };
};

const applyPoliciesWithPostgres = async () => {
  if (!dbPassword) {
    return { applied: false, reason: 'no_db_password' };
  }

  const { default: postgres } = await import('postgres');
  const sql = postgres({
    host: `db.${projectRef}.supabase.co`,
    port: 5432,
    database: 'postgres',
    user: 'postgres',
    password: dbPassword,
    ssl: 'require',
    max: 1,
  });

  try {
    await sql.unsafe(POLICY_SQL);
    return { applied: true, reason: 'policies_created' };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    if (message.includes('already exists')) {
      return { applied: true, reason: 'policies_exist' };
    }
    throw error;
  } finally {
    await sql.end({ timeout: 5 });
  }
};

const verify = async () => {
  const bucketOk = await bucketExists();
  const listResponse = await fetch(`${url}/storage/v1/bucket`, {
    headers: {
      apikey: adminKey,
      Authorization: `Bearer ${adminKey}`,
    },
  });
  const buckets = await listResponse.json();

  return {
    bucketOk,
    buckets: Array.isArray(buckets)
      ? buckets.map((bucket) => bucket.name ?? bucket.id)
      : [],
  };
};

try {
  const bucketResult = await createBucket();
  let policyResult = await applyPoliciesWithManagementApi();
  if (!policyResult.applied) {
    policyResult = await applyPoliciesWithPostgres();
  }
  const verification = await verify();

  console.log(
    JSON.stringify(
      {
        ok: verification.bucketOk,
        projectRef,
        bucket: bucketResult,
        policies: policyResult,
        verification,
      },
      null,
      2,
    ),
  );

  if (!verification.bucketOk) {
    process.exit(1);
  }
} catch (error) {
  fail(error instanceof Error ? error.message : String(error));
}
