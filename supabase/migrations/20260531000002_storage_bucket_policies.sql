insert into storage.buckets (id, name, public)
values ('plant-images', 'plant-images', false)
on conflict (id) do update
set public = excluded.public;

create policy "plant_images_select_own"
  on storage.objects for select
  to authenticated
  using (
    bucket_id = 'plant-images'
    and (storage.foldername(name))[1] = (select auth.uid()::text)
  );

create policy "plant_images_insert_own"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'plant-images'
    and (storage.foldername(name))[1] = (select auth.uid()::text)
  );

create policy "plant_images_update_own"
  on storage.objects for update
  to authenticated
  using (
    bucket_id = 'plant-images'
    and (storage.foldername(name))[1] = (select auth.uid()::text)
  )
  with check (
    bucket_id = 'plant-images'
    and (storage.foldername(name))[1] = (select auth.uid()::text)
  );

create policy "plant_images_delete_own"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'plant-images'
    and (storage.foldername(name))[1] = (select auth.uid()::text)
  );
