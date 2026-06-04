export const DEFAULT_PLANT_IMAGE =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuAohnmcFy_ur9CfvLYw1cP-ZA_85iBvpxFt8cPF-TdfbhV9UOWqtT1iZ5gewf_MyoWWVKgYmmybDBub4lmHaoDpWvsmIk-41cTJ687LPex4mKQQV9UDifZL1T-Rx6qbsRvHPvbYhPJGUfEMFPzClDPXrOeBFVAgm8zhjB-pmdMt90Q_cOF9jg0c-Iu0RIh4Ms2fZcfFClZGZb0h8qoUDUIcnueSb6oe9P45pXmrnqKCliTG0xeOlu9aKDUleUcujDBSaKbvzq6dAXuW';

export const DEFAULT_SCAN_IMAGE =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuCHJ6mn-qcImWqPzq0th88jaEwwUqMPmz-lCF8Z7dOQygKf0jhsYRHU45RiywzuWD9J5sF_D13KDjovfizKZMegD9iLzIFIS72RMUHFzTjDQUKZvPxLdCMevMaeh7exR_B9APPuyu9zSm-I9UVlMRuN9zCckb6vWadv_is_tPXVidZYvP6UrxpOPwXYkOwz21ZBwUNbwiLhKHSkIL5v5c8gE2GIr15VEz68mwRQpaE_V9miyuyahfFo1hgYKzfmWFdNTluARJWky6jk';

export const MOCK_ANALYSIS_RESULT = {
  plantName: 'Monstera Deliciosa',
  scientificName: 'Monstera deliciosa',
  healthStatus: 'healthy',
  diagnosis:
    '잎 상태가 양호하며 새 잎 발달이 관찰됩니다. 간접광 환경에 잘 적응하고 있습니다.',
  recommendation:
    '토양 표면이 마르면 충분히 관수하고, 주 1–2회 잎에 분무해 주세요.',
  symbolism: '긴 수명과 건강, 그리고 관계의 결속을 상징합니다.',
  careSummary: [
    {
      icon: 'water_drop',
      title: '물 주기',
      text: '토양 표면이 마르면 충분히 관수하세요.',
    },
    {
      icon: 'light_mode',
      title: '햇빛',
      text: '밝은 간접광 환경을 선호합니다.',
    },
    {
      icon: 'thermostat',
      title: '온도',
      text: '18–27°C의 실내 온도가 적합합니다.',
    },
  ] as const,
};
