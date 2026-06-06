import type { PlantCardData } from '@/types/plant-card';

export type { PlantCardData } from '@/types/plant-card';

export const MOCK_PLANTS: PlantCardData[] = [
  {
    id: 'monstera-1',
    plantName: 'Monstera Deliciosa',
    nickname: '거실 구석',
    imageUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAohnmcFy_ur9CfvLYw1cP-ZA_85iBvpxFt8cPF-TdfbhV9UOWqtT1iZ5gewf_MyoWWVKgYmmybDBub4lmHaoDpWvsmIk-41cTJ687LPex4mKQQV9UDifZL1T-Rx6qbsRvHPvbYhPJGUfEMFPzClDPXrOeBFVAgm8zhjB-pmdMt90Q_cOF9jg0c-Iu0RIh4Ms2fZcfFClZGZb0h8qoUDUIcnueSb6oe9P45pXmrnqKCliTG0xeOlu9aKDUleUcujDBSaKbvzq6dAXuW',
    category: '실내',
    status: 'needs-water',
    statusLabel: '물 필요',
    lastWatered: '12일 전',
  },
  {
    id: 'snake-1',
    plantName: 'Snake Plant',
    nickname: '침실 창가',
    imageUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBGJxRS0du7rpa8yexfgRWNC-DSC3kocccTb85Lc821aS2sI9MFrtaNeOtruCvmFQkYlbLBDdQSdyGzi9Dmskct34OnTsxWI9v37lNmYLccrF8W1ctGBlZcSUZZk2395U4NWZAMAlxsPn2xYltWoxuL29azdUY_f4qM_lo9-M3s5IgGrap4t-Fg-LniDDOkjj7ujZmduL9sQ-qFdibDj0hKiMg7NqnhIg4B1s_EyQBM0QCuy4bjLp_S6W94H-dOKq1fPOlc0nDVAcvQ',
    category: '실내',
    status: 'healthy',
    statusLabel: '성장 중',
    lastWatered: '4일 전',
  },
  {
    id: 'pothos-1',
    plantName: 'Golden Pothos',
    nickname: '주방 선반',
    imageUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDxLh3DmyMees1hD7SyQ-MVpYTK-c1o8DrTpYORBKRoVQdZdIsDVa9U4tiYTMpPzlmW4JNYjOoCCuinmJJEcu5fIN7ipTZgKDC9fk_s8zFsve8T1NYHlbNUaXxBYVuLewrXjgk-9r34cjnd9G0ji80qyGxLyPWCBkeE64FGj1IaD4XhRbQ8LKJv-IIJaK4za6GIf2i48UObAwSCre8EZCg_Odi6L3PZerZFw0z8-hmWmMGAWfnEmvhbbBhecDx-EClsJHpN5N0z2X-d',
    category: '실내',
    status: 'healthy',
    statusLabel: '건강함',
    lastWatered: '6일 전',
  },
  {
    id: 'echeveria-1',
    plantName: 'Echeveria Elegans',
    nickname: '사무실 책상',
    imageUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuB0YvHHyqcJ69k6JxMnKyY_btaWuXsr3wptIK7BlPxyuRXwxjV7a7jFcm1zuf3FQI6jx0vQU4P4Z-CJ7-uir7KEpISaPmF5udKG4TTXKuOO1q5GCwyGGcqJeWdNZlxuAUGVhZzUnDMz9rUIVMl-g3RSxHWgPK3HiGY2GqgL8ZLB2_PaGWmFjL8T3A2qs9Jp4DDrJYiV60kHdhiw2xNjWsueL6NJp99NRQpuV3LVh_RDZXhNwXZx3Ok9ZFCUoA4LIClFO6pIYZHRo8d4',
    category: '다육식물',
    status: 'needs-sun',
    statusLabel: '햇빛 필요',
    lastWatered: '20일 전',
  },
];

export const getPlantById = (id: string): PlantCardData | undefined =>
  MOCK_PLANTS.find((plant) => plant.id === id);
