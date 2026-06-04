import { describe, expect, it } from 'vitest';
import type { Analysis, Database, GrowthLog, Plant, Profile } from './database';

const sampleProfile: Profile = {
  id: '00000000-0000-4000-8000-000000000001',
  created_at: '2026-05-31T00:00:00.000Z',
  display_name: '초보 식물 집사',
  bio: null,
  care_alerts_enabled: true,
};

const samplePlant: Plant = {
  id: '00000000-0000-4000-8000-000000000002',
  user_id: sampleProfile.id,
  nickname: '몬스',
  plant_name: '몬스테라',
  scientific_name: 'Monstera deliciosa',
  image_url: null,
  category: '실내',
  created_at: sampleProfile.created_at,
};

const sampleAnalysis: Analysis = {
  id: '00000000-0000-4000-8000-000000000003',
  user_id: sampleProfile.id,
  plant_id: samplePlant.id,
  image_url: 'https://example.com/plant.jpg',
  plant_name: samplePlant.plant_name,
  scientific_name: samplePlant.scientific_name,
  health_status: 'healthy',
  diagnosis: '잎 상태 양호',
  recommendation: '간접광 유지',
  care_summary: null,
  confidence: 0.98,
  symbolism: null,
  created_at: sampleProfile.created_at,
};

const sampleGrowthLog: GrowthLog = {
  id: '00000000-0000-4000-8000-000000000004',
  plant_id: samplePlant.id,
  image_url: null,
  memo: '새 잎 펼침',
  activity_type: 'water',
  created_at: sampleProfile.created_at,
};

type AssertEqual<T, U> = T extends U ? (U extends T ? true : false) : false;

describe('database types', () => {
  it('Profile Row matches Database public schema', () => {
    type Result = AssertEqual<
      Database['public']['Tables']['profiles']['Row'],
      Profile
    >;
    const assertion: Result = true;
    expect(assertion).toBe(true);
  });

  it('Plant Row matches Database public schema', () => {
    type Result = AssertEqual<
      Database['public']['Tables']['plants']['Row'],
      Plant
    >;
    const assertion: Result = true;
    expect(assertion).toBe(true);
  });

  it('Analysis Row matches Database public schema', () => {
    type Result = AssertEqual<
      Database['public']['Tables']['analyses']['Row'],
      Analysis
    >;
    const assertion: Result = true;
    expect(assertion).toBe(true);
  });

  it('GrowthLog Row matches Database public schema', () => {
    type Result = AssertEqual<
      Database['public']['Tables']['growth_logs']['Row'],
      GrowthLog
    >;
    const assertion: Result = true;
    expect(assertion).toBe(true);
  });

  it('sample records satisfy row types', () => {
    expect(sampleProfile.id).toBeTruthy();
    expect(samplePlant.user_id).toBe(sampleProfile.id);
    expect(sampleAnalysis.plant_id).toBe(samplePlant.id);
    expect(sampleGrowthLog.plant_id).toBe(samplePlant.id);
  });
});
