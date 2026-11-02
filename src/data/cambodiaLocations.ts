export interface ProvinceOption {
  nameKm: string;
  nameEn: string;
  districts: {
    nameKm: string;
    nameEn: string;
  }[];
}

export const CAMBODIA_PROVINCES: ProvinceOption[] = [
  {
    nameKm: 'រាជធានីភ្នំពេញ (Phnom Penh)',
    nameEn: 'Phnom Penh',
    districts: [
      { nameKm: 'ខណ្ឌដូនពេញ (Daun Penh)', nameEn: 'Daun Penh' },
      { nameKm: 'ខណ្ឌចំការមន (Chamkar Mon)', nameEn: 'Chamkar Mon' },
      { nameKm: 'ខណ្ឌទួលគោក (Toul Kork)', nameEn: 'Toul Kork' },
      { nameKm: 'ខណ្ឌ៧មករា (7 Makara)', nameEn: 'Prampir Makara' },
      { nameKm: 'ខណ្ឌមានជ័យ (Mean Chey)', nameEn: 'Mean Chey' },
      { nameKm: 'ខណ្ឌសែនសុខ (Sen Sok)', nameEn: 'Sen Sok' },
      { nameKm: 'ខណ្ឌបឹងកេងកង (Boeung Keng Kang)', nameEn: 'Boeung Keng Kang' },
      { nameKm: 'ខណ្ឌច្បារអំពៅ (Chbar Ampov)', nameEn: 'Chbar Ampov' },
      { nameKm: 'ខណ្ឌឫស្សីកែវ (Russey Keo)', nameEn: 'Russey Keo' },
      { nameKm: 'ខណ្ឌពោធិ៍សែនជ័យ (Por Senchey)', nameEn: 'Por Senchey' },
      { nameKm: 'ខណ្ឌជ្រោយចង្វារ (Chroy Changvar)', nameEn: 'Chroy Changvar' },
      { nameKm: 'ខណ្ឌដង្កោ (Dangkao)', nameEn: 'Dangkao' },
      { nameKm: 'ខណ្ឌព្រែកព្នៅ (Prek Pnov)', nameEn: 'Prek Pnov' },
      { nameKm: 'ខណ្ឌកំបូល (Kamboul)', nameEn: 'Kamboul' },
    ],
  },
  {
    nameKm: 'ខេត្តសៀមរាប (Siem Reap)',
    nameEn: 'Siem Reap',
    districts: [
      { nameKm: 'ក្រុងសៀមរាប (Siem Reap Municipality)', nameEn: 'Siem Reap Municipality' },
      { nameKm: 'ស្រុកប្រាសាទបាគង (Prasat Bakong)', nameEn: 'Prasat Bakong' },
      { nameKm: 'ស្រុកបន្ទាយស្រី (Banteay Srei)', nameEn: 'Banteay Srei' },
      { nameKm: 'ស្រុកពួក (Pouck)', nameEn: 'Pouck' },
      { nameKm: 'ស្រុកសូទ្រនិគម (Soutr Nikom)', nameEn: 'Soutr Nikom' },
      { nameKm: 'ស្រុកជីក្រែង (Chi Kraeng)', nameEn: 'Chi Kraeng' },
    ],
  },
  {
    nameKm: 'ខេត្តព្រះសីហនុ (Preah Sihanouk)',
    nameEn: 'Preah Sihanouk',
    districts: [
      { nameKm: 'ក្រុងព្រះសីហនុ (Preah Sihanouk Municipality)', nameEn: 'Preah Sihanouk Municipality' },
      { nameKm: 'ស្រុកព្រៃនប់ (Prey Nob)', nameEn: 'Prey Nob' },
      { nameKm: 'ក្រុងកោះរ៉ុង (Koh Rong)', nameEn: 'Koh Rong' },
      { nameKm: 'ស្រុកស្ទឹងហាវ (Stung Hav)', nameEn: 'Stung Hav' },
      { nameKm: 'ស្រុកកំពង់សិលា (Kampong Seila)', nameEn: 'Kampong Seila' },
    ],
  },
  {
    nameKm: 'ខេត្តបាត់ដំបង (Battambang)',
    nameEn: 'Battambang',
    districts: [
      { nameKm: 'ក្រុងបាត់ដំបង (Battambang Municipality)', nameEn: 'Battambang Municipality' },
      { nameKm: 'ស្រុកថ្មគោល (Thma Koul)', nameEn: 'Thma Koul' },
      { nameKm: 'ស្រុកបាណន់ (Banan)', nameEn: 'Banan' },
      { nameKm: 'ស្រុកសង្កែ (Sangkae)', nameEn: 'Sangkae' },
      { nameKm: 'ស្រុកមោងឫស្សី (Moung Ruessei)', nameEn: 'Moung Ruessei' },
    ],
  },
  {
    nameKm: 'ខេត្តកណ្តាល (Kandal)',
    nameEn: 'Kandal',
    districts: [
      { nameKm: 'ក្រុងតាខ្មៅ (Ta Khmau Municipality)', nameEn: 'Ta Khmau Municipality' },
      { nameKm: 'ស្រុកកៀនស្វាយ (Kien Svay)', nameEn: 'Kien Svay' },
      { nameKm: 'ស្រុកមុខកំពូល (Mukh Kampul)', nameEn: 'Mukh Kampul' },
      { nameKm: 'ស្រុកអង្គស្នួល (Angk Snuol)', nameEn: 'Angk Snuol' },
      { nameKm: 'ស្រុកស្អាង (Saang)', nameEn: 'Saang' },
    ],
  },
  {
    nameKm: 'ខេត្តកំពង់ចាម (Kampong Cham)',
    nameEn: 'Kampong Cham',
    districts: [
      { nameKm: 'ក្រុងកំពង់ចាម (Kampong Cham Municipality)', nameEn: 'Kampong Cham Municipality' },
      { nameKm: 'ស្រុកជើងព្រៃ (Cheung Prey)', nameEn: 'Cheung Prey' },
      { nameKm: 'ស្រុកបាធាយ (Batheay)', nameEn: 'Batheay' },
      { nameKm: 'ស្រុកព្រៃឈរ (Prey Chhor)', nameEn: 'Prey Chhor' },
    ],
  },
  {
    nameKm: 'ខេត្តកំពត (Kampot)',
    nameEn: 'Kampot',
    districts: [
      { nameKm: 'ក្រុងកំពត (Kampot Municipality)', nameEn: 'Kampot Municipality' },
      { nameKm: 'ស្រុកទឹកឈូ (Tuek Chhou)', nameEn: 'Tuek Chhou' },
      { nameKm: 'ស្រុកបន្ទាយមាស (Banteay Meas)', nameEn: 'Banteay Meas' },
      { nameKm: 'ស្រុកអង្គរជ័យ (Angkor Chey)', nameEn: 'Angkor Chey' },
    ],
  },
  {
    nameKm: 'ដឹកជញ្ជូនទៅប្រទេសជប៉ុន (Pickup / Delivery in Japan)',
    nameEn: 'Japan Delivery / Airport Pickup',
    districts: [
      { nameKm: 'អាកាសយានដ្ឋាន Narita (NRT Tokyo)', nameEn: 'Narita Airport (NRT)' },
      { nameKm: 'អាកាសយានដ្ឋាន Haneda (HND Tokyo)', nameEn: 'Haneda Airport (HND)' },
      { nameKm: 'អាកាសយានដ្ឋាន Kansai (KIX Osaka)', nameEn: 'Kansai Airport (KIX)' },
      { nameKm: 'អាកាសយានដ្ឋាន Fukuoka (FUK)', nameEn: 'Fukuoka Airport (FUK)' },
      { nameKm: 'ផ្ញើទៅសណ្ឋាគារ/ផ្ទះជួលនៅជប៉ុន (Hotel/Residence in Japan)', nameEn: 'Hotel/Residence in Japan' },
    ],
  },
];
