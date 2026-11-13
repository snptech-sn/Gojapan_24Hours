export interface JapanPrefectureOption {
  nameKm: string;
  nameEn: string;
  cities: {
    nameKm: string;
    nameEn: string;
  }[];
}

export const JAPAN_PREFECTURES: JapanPrefectureOption[] = [
  {
    nameKm: 'តូក្យូ (Tokyo - 東京都)',
    nameEn: 'Tokyo (東京都)',
    cities: [
      { nameKm: 'ស៊ិនជូគុ (Shinjuku-ku / 新宿区)', nameEn: 'Shinjuku-ku' },
      { nameKm: 'ស៊ីប៊ូយ៉ា (Shibuya-ku / 渋谷区)', nameEn: 'Shibuya-ku' },
      { nameKm: 'មីណាតូ (Minato-ku / 港区)', nameEn: 'Minato-ku' },
      { nameKm: 'ឆិយ៉ូដា (Chiyoda-ku / 千代田区)', nameEn: 'Chiyoda-ku' },
      { nameKm: 'ឈូអូ (Chuo-ku / 中央区)', nameEn: 'Chuo-ku' },
      { nameKm: 'តូស៊ីម៉ា / អ៊ីកេប៊ូគូរ៉ូ (Toshima-ku / 豊島区)', nameEn: 'Toshima-ku' },
      { nameKm: 'តៃតូ / អ៊ុអេណូ (Taito-ku / 台東区)', nameEn: 'Taito-ku' },
      { nameKm: 'ស៊ីណាហ្គាវ៉ា (Shinagawa-ku / 品川区)', nameEn: 'Shinagawa-ku' },
      { nameKm: 'អូតា / ព្រលានយន្តហោះ Haneda (Ota-ku / 大田区)', nameEn: 'Ota-ku / Haneda' },
      { nameKm: 'សេតាហ្គាយ៉ា (Setagaya-ku / 世田谷区)', nameEn: 'Setagaya-ku' },
      { nameKm: 'ស៊ុហ្គីណាមិ (Suginami-ku / 杉並区)', nameEn: 'Suginami-ku' },
      { nameKm: 'ណាកាណូ (Nakano-ku / 中野区)', nameEn: 'Nakano-ku' },
      { nameKm: 'គីតា (Kita-ku / 北区)', nameEn: 'Kita-ku' },
      { nameKm: 'អាដាឈិ (Adachi-ku / 足立区)', nameEn: 'Adachi-ku' },
      { nameKm: 'អេដូហ្គាវ៉ា (Edogawa-ku / 江戸川区)', nameEn: 'Edogawa-ku' },
      { nameKm: 'កូតូ (Koto-ku / 江東区)', nameEn: 'Koto-ku' },
      { nameKm: 'ហាឈិអូជិ (Hachioji-shi / 八王子市)', nameEn: 'Hachioji-shi' },
      { nameKm: 'ម៉ាឈិដា (Machida-shi / 町田市)', nameEn: 'Machida-shi' },
      { nameKm: 'តាឈិកាវ៉ា (Tachikawa-shi / 立川市)', nameEn: 'Tachikawa-shi' },
      { nameKm: 'ផ្សេងៗក្នុងតូក្យូ (Other City/Ward in Tokyo)', nameEn: 'Other City/Ward in Tokyo' },
    ],
  },
  {
    nameKm: 'អូសាកា (Osaka - 大阪府)',
    nameEn: 'Osaka (大阪府)',
    cities: [
      { nameKm: 'ឈូអូ / ណាមបា (Chuo-ku / 中央区)', nameEn: 'Chuo-ku / Namba' },
      { nameKm: 'គីតា / អ៊ុមេដា (Kita-ku / 北区)', nameEn: 'Kita-ku / Umeda' },
      { nameKm: 'ណានិវ៉ា (Naniwa-ku / 浪速区)', nameEn: 'Naniwa-ku' },
      { nameKm: 'តេណូជិ (Tennoji-ku / 天王寺区)', nameEn: 'Tennoji-ku' },
      { nameKm: 'នីស៊ី (Nishi-ku / 西区)', nameEn: 'Nishi-ku' },
      { nameKm: 'ហ្សាគៃ (Sakai-shi / 堺市)', nameEn: 'Sakai-shi' },
      { nameKm: 'ហ៊ីហ្គាស៊ីអូសាកា (Higashiosaka-shi / 東大阪市)', nameEn: 'Higashiosaka-shi' },
      { nameKm: 'តូយ៉ូណាកា (Toyonaka-shi / 豊中市)', nameEn: 'Toyonaka-shi' },
      { nameKm: 'ស៊ុយតា (Suita-shi / 吹田市)', nameEn: 'Suita-shi' },
      { nameKm: 'ផ្សេងៗក្នុងអូសាកា (Other City/Ward in Osaka)', nameEn: 'Other City/Ward in Osaka' },
    ],
  },
  {
    nameKm: 'កាណាហ្គាវ៉ា (Kanagawa - 神奈川県)',
    nameEn: 'Kanagawa (神奈川県)',
    cities: [
      { nameKm: 'យ៉ូកូហាម៉ា (Yokohama-shi / 横浜市)', nameEn: 'Yokohama-shi' },
      { nameKm: 'កាវ៉ាសាគី (Kawasaki-shi / 川崎市)', nameEn: 'Kawasaki-shi' },
      { nameKm: 'សាហ្គាមិហារ៉ា (Sagamihara-shi / 相模原市)', nameEn: 'Sagamihara-shi' },
      { nameKm: 'ហ្វុជីសាវ៉ា (Fujisawa-shi / 藤沢市)', nameEn: 'Fujisawa-shi' },
      { nameKm: 'អាត្ស៊ុហ្គី (Atsugi-shi / 厚木市)', nameEn: 'Atsugi-shi' },
      { nameKm: 'យ៉ូកូស៊ុគា (Yokosuka-shi / 横須賀市)', nameEn: 'Yokosuka-shi' },
      { nameKm: 'ផ្សេងៗក្នុងកាណាហ្គាវ៉ា (Other City in Kanagawa)', nameEn: 'Other City in Kanagawa' },
    ],
  },
  {
    nameKm: 'អៃឈិ / ណាហ្គោយ៉ា (Aichi - 愛知県)',
    nameEn: 'Aichi (愛知県)',
    cities: [
      { nameKm: 'ណាហ្គោយ៉ា (Nagoya-shi / 名古屋市)', nameEn: 'Nagoya-shi' },
      { nameKm: 'តូយ៉ូតា (Toyota-shi / 豊田市)', nameEn: 'Toyota-shi' },
      { nameKm: 'អូកាហ្សាគី (Okazaki-shi / 岡崎市)', nameEn: 'Okazaki-shi' },
      { nameKm: 'អ៊ីឈិណូមិយ៉ា (Ichinomiya-shi / 一宮市)', nameEn: 'Ichinomiya-shi' },
      { nameKm: 'តូយ៉ូហាស៊ី (Toyohashi-shi / 豊橋市)', nameEn: 'Toyohashi-shi' },
      { nameKm: 'ផ្សេងៗក្នុងអៃឈិ (Other City in Aichi)', nameEn: 'Other City in Aichi' },
    ],
  },
  {
    nameKm: 'សៃតាម៉ា (Saitama - 埼玉県)',
    nameEn: 'Saitama (埼玉県)',
    cities: [
      { nameKm: 'សៃតាម៉ា (Saitama-shi / さいたま市)', nameEn: 'Saitama-shi' },
      { nameKm: 'កាវ៉ាហ្គូឈិ (Kawaguchi-shi / 川口市)', nameEn: 'Kawaguchi-shi' },
      { nameKm: 'កាវ៉ាហ្គូអេ (Kawagoe-shi / 川越市)', nameEn: 'Kawagoe-shi' },
      { nameKm: 'តូកូរ៉ូហ្សាវ៉ា (Tokorozawa-shi / 所沢市)', nameEn: 'Tokorozawa-shi' },
      { nameKm: 'កូស៊ីហ្គាយ៉ា (Koshigaya-shi / 越谷市)', nameEn: 'Koshigaya-shi' },
      { nameKm: 'ផ្សេងៗក្នុងសៃតាម៉ា (Other City in Saitama)', nameEn: 'Other City in Saitama' },
    ],
  },
  {
    nameKm: 'ឈីបា (Chiba - 千葉県)',
    nameEn: 'Chiba (千葉県)',
    cities: [
      { nameKm: 'ឈីបា (Chiba-shi / 千葉市)', nameEn: 'Chiba-shi' },
      { nameKm: 'ណារីតា (Narita-shi / 成田市)', nameEn: 'Narita-shi' },
      { nameKm: 'ហ្វូណាបាស៊ី (Funabashi-shi / 船橋市)', nameEn: 'Funabashi-shi' },
      { nameKm: 'ម៉ាត់ស៊ុដូ (Matsudo-shi / 松戸市)', nameEn: 'Matsudo-shi' },
      { nameKm: 'អ៊ីឈិកាវ៉ា (Ichikawa-shi / 市川市)', nameEn: 'Ichikawa-shi' },
      { nameKm: 'កាស៊ីវ៉ា (Kashiwa-shi / 柏市)', nameEn: 'Kashiwa-shi' },
      { nameKm: 'អ៊ូរ៉ាយ៉ាស៊ុ (Urayasu-shi / 浦安市)', nameEn: 'Urayasu-shi' },
      { nameKm: 'ផ្សេងៗក្នុងឈីបា (Other City in Chiba)', nameEn: 'Other City in Chiba' },
    ],
  },
  {
    nameKm: 'ហ្វុគុអូកា (Fukuoka - 福岡県)',
    nameEn: 'Fukuoka (福岡県)',
    cities: [
      { nameKm: 'ហ្វុគុអូកា / ហាកាតា (Fukuoka-shi / 福岡市)', nameEn: 'Fukuoka-shi' },
      { nameKm: 'គីតាគ្យូស៊ូ (Kitakyushu-shi / 北九州市)', nameEn: 'Kitakyushu-shi' },
      { nameKm: 'គូរូមេ (Kurume-shi / 久留米市)', nameEn: 'Kurume-shi' },
      { nameKm: 'ផ្សេងៗក្នុងហ្វុគុអូកា (Other City in Fukuoka)', nameEn: 'Other City in Fukuoka' },
    ],
  },
  {
    nameKm: 'ហុកកៃដូ (Hokkaido - 北海道)',
    nameEn: 'Hokkaido (北海道)',
    cities: [
      { nameKm: 'សាប៉ូរ៉ូ (Sapporo-shi / 札幌市)', nameEn: 'Sapporo-shi' },
      { nameKm: 'អាសាហ៊ីកាវ៉ា (Asahikawa-shi / 旭川市)', nameEn: 'Asahikawa-shi' },
      { nameKm: 'ហាកូដាតេ (Hakodate-shi / 函館市)', nameEn: 'Hakodate-shi' },
      { nameKm: 'ឈីតូសេ (Chitose-shi / 千歳市)', nameEn: 'Chitose-shi' },
      { nameKm: 'ផ្សេងៗក្នុងហុកកៃដូ (Other City in Hokkaido)', nameEn: 'Other City in Hokkaido' },
    ],
  },
  {
    nameKm: 'ហ្យូហ្គោ / កូបេ (Hyogo - 兵庫県)',
    nameEn: 'Hyogo (兵庫県)',
    cities: [
      { nameKm: 'កូបេ (Kobe-shi / 神戸市)', nameEn: 'Kobe-shi' },
      { nameKm: 'ហ៊ីមេជិ (Himeji-shi / 姫路市)', nameEn: 'Himeji-shi' },
      { nameKm: 'នីស៊ីណូមិយ៉ា (Nishinomiya-shi / 西宮市)', nameEn: 'Nishinomiya-shi' },
      { nameKm: 'អាម៉ាហ្គាសាគី (Amagasaki-shi / 尼崎市)', nameEn: 'Amagasaki-shi' },
      { nameKm: 'ផ្សេងៗក្នុងហ្យូហ្គោ (Other City in Hyogo)', nameEn: 'Other City in Hyogo' },
    ],
  },
  {
    nameKm: 'ក្យូតូ (Kyoto - 京都府)',
    nameEn: 'Kyoto (京都府)',
    cities: [
      { nameKm: 'ក្យូតូ (Kyoto-shi / 京都市)', nameEn: 'Kyoto-shi' },
      { nameKm: 'អ៊ុជិ (Uji-shi / 宇治市)', nameEn: 'Uji-shi' },
      { nameKm: 'ផ្សេងៗក្នុងក្យូតូ (Other City in Kyoto)', nameEn: 'Other City in Kyoto' },
    ],
  },
  {
    nameKm: 'ស៊ីហ្ស៊ុអូកា (Shizuoka - 静岡県)',
    nameEn: 'Shizuoka (静岡県)',
    cities: [
      { nameKm: 'ស៊ីហ្ស៊ុអូកា (Shizuoka-shi / 静岡市)', nameEn: 'Shizuoka-shi' },
      { nameKm: 'ហាម៉ាម៉ាត់ស៊ុ (Hamamatsu-shi / 浜松市)', nameEn: 'Hamamatsu-shi' },
      { nameKm: 'ហ្វុជិ (Fuji-shi / 富士市)', nameEn: 'Fuji-shi' },
      { nameKm: 'នុម៉ាហ្ស៊ុ (Numazu-shi / 沼津市)', nameEn: 'Numazu-shi' },
      { nameKm: 'ផ្សេងៗក្នុងស៊ីហ្ស៊ុអូកា (Other City in Shizuoka)', nameEn: 'Other City in Shizuoka' },
    ],
  },
  {
    nameKm: 'អ៊ីបារ៉ាគី (Ibaraki - 茨城県)',
    nameEn: 'Ibaraki (茨城県)',
    cities: [
      { nameKm: 'មីតូ (Mito-shi / 水戸市)', nameEn: 'Mito-shi' },
      { nameKm: 'ត្ស៊ុគុបា (Tsukuba-shi / つくば市)', nameEn: 'Tsukuba-shi' },
      { nameKm: 'ហ៊ីតាឈិ (Hitachi-shi / 日立市)', nameEn: 'Hitachi-shi' },
      { nameKm: 'ផ្សេងៗក្នុងអ៊ីបារ៉ាគី (Other City in Ibaraki)', nameEn: 'Other City in Ibaraki' },
    ],
  },
  {
    nameKm: 'ហ៊ីរ៉ូស៊ីម៉ា (Hiroshima - 広島県)',
    nameEn: 'Hiroshima (広島県)',
    cities: [
      { nameKm: 'ហ៊ីរ៉ូស៊ីម៉ា (Hiroshima-shi / 広島市)', nameEn: 'Hiroshima-shi' },
      { nameKm: 'ហ្វុគុយ៉ាម៉ា (Fukuyama-shi / 福山市)', nameEn: 'Fukuyama-shi' },
      { nameKm: 'គុរេ (Kure-shi / 呉市)', nameEn: 'Kure-shi' },
      { nameKm: 'ផ្សេងៗក្នុងហ៊ីរ៉ូស៊ីម៉ា (Other City in Hiroshima)', nameEn: 'Other City in Hiroshima' },
    ],
  },
  {
    nameKm: 'មីយ៉ាហ្គី / សេនដៃ (Miyagi - 宮城県)',
    nameEn: 'Miyagi (宮城県)',
    cities: [
      { nameKm: 'សេនដៃ (Sendai-shi / 仙台市)', nameEn: 'Sendai-shi' },
      { nameKm: 'អ៊ីស៊ីណូម៉ាគី (Ishinomaki-shi / 石巻市)', nameEn: 'Ishinomaki-shi' },
      { nameKm: 'ផ្សេងៗក្នុងមីយ៉ាហ្គី (Other City in Miyagi)', nameEn: 'Other City in Miyagi' },
    ],
  },
  {
    nameKm: 'គុនម៉ា (Gunma - 群馬県)',
    nameEn: 'Gunma (群馬県)',
    cities: [
      { nameKm: 'ម៉ាអេបាស៊ី (Maebashi-shi / 前橋市)', nameEn: 'Maebashi-shi' },
      { nameKm: 'តាកាសាគី (Takasaki-shi / 高崎市)', nameEn: 'Takasaki-shi' },
      { nameKm: 'អូតា (Ota-shi / 太田市)', nameEn: 'Ota-shi' },
      { nameKm: 'អ៊ីសេសាគី (Isesaki-shi / 伊勢崎市)', nameEn: 'Isesaki-shi' },
      { nameKm: 'ផ្សេងៗក្នុងគុនម៉ា (Other City in Gunma)', nameEn: 'Other City in Gunma' },
    ],
  },
  {
    nameKm: 'តូឈិហ្គី (Tochigi - 栃木県)',
    nameEn: 'Tochigi (栃木県)',
    cities: [
      { nameKm: 'អ៊ុត្ស៊ុណូមិយ៉ា (Utsunomiya-shi / 宇都宮市)', nameEn: 'Utsunomiya-shi' },
      { nameKm: 'អូយ៉ាម៉ា (Oyama-shi / 小山市)', nameEn: 'Oyama-shi' },
      { nameKm: 'ផ្សេងៗក្នុងតូឈិហ្គី (Other City in Tochigi)', nameEn: 'Other City in Tochigi' },
    ],
  },
  {
    nameKm: 'ហ្គីហ្វុ (Gifu - 岐阜県)',
    nameEn: 'Gifu (岐阜県)',
    cities: [
      { nameKm: 'ហ្គីហ្វុ (Gifu-shi / 岐阜市)', nameEn: 'Gifu-shi' },
      { nameKm: 'អូហ្គាគី (Ogaki-shi / 大垣市)', nameEn: 'Ogaki-shi' },
      { nameKm: 'កាកាមិហ្គាហារ៉ា (Kakamigahara-shi / 各務原市)', nameEn: 'Kakamigahara-shi' },
    ],
  },
  {
    nameKm: 'មីអេ (Mie - 三重県)',
    nameEn: 'Mie (三重県)',
    cities: [
      { nameKm: 'យ៉ុកកៃឈិ (Yokkaichi-shi / 四日市市)', nameEn: 'Yokkaichi-shi' },
      { nameKm: 'ត្ស៊ុ (Tsu-shi / 津市)', nameEn: 'Tsu-shi' },
      { nameKm: 'ស៊ុហ្ស៊ុគា (Suzuka-shi / 鈴鹿市)', nameEn: 'Suzuka-shi' },
    ],
  },
  {
    nameKm: 'អូកាយ៉ាម៉ា (Okayama - 岡山県)',
    nameEn: 'Okayama (岡山県)',
    cities: [
      { nameKm: 'អូកាយ៉ាម៉ា (Okayama-shi / 岡山市)', nameEn: 'Okayama-shi' },
      { nameKm: 'គុរ៉ាស៊ីគី (Kurashiki-shi / 倉敷市)', nameEn: 'Kurashiki-shi' },
    ],
  },
  {
    nameKm: 'នីហ្គាតា (Niigata - 新潟県)',
    nameEn: 'Niigata (新潟県)',
    cities: [
      { nameKm: 'នីហ្គាតា (Niigata-shi / 新潟市)', nameEn: 'Niigata-shi' },
      { nameKm: 'ណាហ្គាអូកា (Nagaoka-shi / 長岡市)', nameEn: 'Nagaoka-shi' },
    ],
  },
  {
    nameKm: 'ណាហ្គាណូ (Nagano - 長野県)',
    nameEn: 'Nagano (長野県)',
    cities: [
      { nameKm: 'ណាហ្គាណូ (Nagano-shi / 長野市)', nameEn: 'Nagano-shi' },
      { nameKm: 'ម៉ាត់ស៊ុម៉ូតូ (Matsumoto-shi / 松本市)', nameEn: 'Matsumoto-shi' },
    ],
  },
  {
    nameKm: 'អូគីណាវ៉ា (Okinawa - 沖縄県)',
    nameEn: 'Okinawa (沖縄県)',
    cities: [
      { nameKm: 'ណាហា (Naha-shi / 那覇市)', nameEn: 'Naha-shi' },
      { nameKm: 'អូគីណាវ៉ា (Okinawa-shi / 沖縄市)', nameEn: 'Okinawa-shi' },
    ],
  },
  {
    nameKm: 'គុម៉ាម៉ូតូ (Kumamoto - 熊本県)',
    nameEn: 'Kumamoto (熊本県)',
    cities: [{ nameKm: 'គុម៉ាម៉ូតូ (Kumamoto-shi / 熊本市)', nameEn: 'Kumamoto-shi' }],
  },
  {
    nameKm: 'កាហ្គោស៊ីម៉ា (Kagoshima - 鹿児島県)',
    nameEn: 'Kagoshima (鹿児島県)',
    cities: [{ nameKm: 'កាហ្គោស៊ីម៉ា (Kagoshima-shi / 鹿児島市)', nameEn: 'Kagoshima-shi' }],
  },
  {
    nameKm: 'ស៊ីហ្គា (Shiga - 滋賀県)',
    nameEn: 'Shiga (滋賀県)',
    cities: [
      { nameKm: 'អូត្ស៊ុ (Otsu-shi / 大津市)', nameEn: 'Otsu-shi' },
      { nameKm: 'គុសាត់ស៊ុ (Kusatsu-shi / 草津市)', nameEn: 'Kusatsu-shi' },
    ],
  },
  {
    nameKm: 'ណារ៉ា (Nara - 奈良県)',
    nameEn: 'Nara (奈良県)',
    cities: [{ nameKm: 'ណារ៉ា (Nara-shi / 奈良市)', nameEn: 'Nara-shi' }],
  },
  {
    nameKm: 'ហ្វុគុស៊ីម៉ា (Fukushima - 福島県)',
    nameEn: 'Fukushima (福島県)',
    cities: [
      { nameKm: 'កូរីយ៉ាម៉ា (Koriyama-shi / 郡山市)', nameEn: 'Koriyama-shi' },
      { nameKm: 'ហ្វុគុស៊ីម៉ា (Fukushima-shi / 福島市)', nameEn: 'Fukushima-shi' },
      { nameKm: 'អ៊ីវ៉ាគី (Iwaki-shi / いわき市)', nameEn: 'Iwaki-shi' },
    ],
  },
  {
    nameKm: 'អាអូម៉ូរី (Aomori - 青森県)',
    nameEn: 'Aomori (青森県)',
    cities: [{ nameKm: 'អាអូម៉ូរី (Aomori-shi / 青森市)', nameEn: 'Aomori-shi' }],
  },
  {
    nameKm: 'អ៊ីវ៉ាតេ (Iwate - 岩手県)',
    nameEn: 'Iwate (岩手県)',
    cities: [{ nameKm: 'ម៉ូរីអូកា (Morioka-shi / 盛岡市)', nameEn: 'Morioka-shi' }],
  },
  {
    nameKm: 'អាគីតា (Akita - 秋田県)',
    nameEn: 'Akita (秋田県)',
    cities: [{ nameKm: 'អាគីតា (Akita-shi / 秋田市)', nameEn: 'Akita-shi' }],
  },
  {
    nameKm: 'យ៉ាម៉ាហ្គាតា (Yamagata - 山形県)',
    nameEn: 'Yamagata (山形県)',
    cities: [{ nameKm: 'យ៉ាម៉ាហ្គាតា (Yamagata-shi / 山形市)', nameEn: 'Yamagata-shi' }],
  },
  {
    nameKm: 'តូយ៉ាម៉ា (Toyama - 富山県)',
    nameEn: 'Toyama (富山県)',
    cities: [{ nameKm: 'តូយ៉ាម៉ា (Toyama-shi / 富山市)', nameEn: 'Toyama-shi' }],
  },
  {
    nameKm: 'អ៊ីស៊ីកាវ៉ា (Ishikawa - 石川県)',
    nameEn: 'Ishikawa (石川県)',
    cities: [{ nameKm: 'កាណាហ្សាវ៉ា (Kanazawa-shi / 金沢市)', nameEn: 'Kanazawa-shi' }],
  },
  {
    nameKm: 'ហ្វុគុអ៊ី (Fukui - 福井県)',
    nameEn: 'Fukui (福井県)',
    cities: [{ nameKm: 'ហ្វុគុអ៊ី (Fukui-shi / 福井市)', nameEn: 'Fukui-shi' }],
  },
  {
    nameKm: 'យ៉ាម៉ាណាស៊ី (Yamanashi - 山梨県)',
    nameEn: 'Yamanashi (山梨県)',
    cities: [{ nameKm: 'កូហ្វុ (Kofu-shi / 甲府市)', nameEn: 'Kofu-shi' }],
  },
  {
    nameKm: 'វ៉ាកាយ៉ាម៉ា (Wakayama - 和歌山県)',
    nameEn: 'Wakayama (和歌山県)',
    cities: [{ nameKm: 'វ៉ាកាយ៉ាម៉ា (Wakayama-shi / 和歌山市)', nameEn: 'Wakayama-shi' }],
  },
  {
    nameKm: 'តុតតូរី (Tottori - 鳥取県)',
    nameEn: 'Tottori (鳥取県)',
    cities: [{ nameKm: 'តុតតូរី (Tottori-shi / 鳥取市)', nameEn: 'Tottori-shi' }],
  },
  {
    nameKm: 'ស៊ីម៉ាណេ (Shimane - 島根県)',
    nameEn: 'Shimane (島根県)',
    cities: [{ nameKm: 'ម៉ាត់ស៊ុអេ (Matsue-shi / 松江市)', nameEn: 'Matsue-shi' }],
  },
  {
    nameKm: 'យ៉ាម៉ាហ្គុឈិ (Yamaguchi - 山口県)',
    nameEn: 'Yamaguchi (山口県)',
    cities: [
      { nameKm: 'ស៊ីម៉ូណូសេគី (Shimonoseki-shi / 下関市)', nameEn: 'Shimonoseki-shi' },
      { nameKm: 'យ៉ាម៉ាហ្គុឈិ (Yamaguchi-shi / 山口市)', nameEn: 'Yamaguchi-shi' },
    ],
  },
  {
    nameKm: 'តូគុស៊ីម៉ា (Tokushima - 徳島県)',
    nameEn: 'Tokushima (徳島県)',
    cities: [{ nameKm: 'តូគុស៊ីម៉ា (Tokushima-shi / 徳島市)', nameEn: 'Tokushima-shi' }],
  },
  {
    nameKm: 'កាហ្គាវ៉ា (Kagawa - 香川県)',
    nameEn: 'Kagawa (香川県)',
    cities: [{ nameKm: 'តាកាម៉ាត់ស៊ុ (Takamatsu-shi / 高松市)', nameEn: 'Takamatsu-shi' }],
  },
  {
    nameKm: 'អេហ៊ីមេ (Ehime - 愛媛県)',
    nameEn: 'Ehime (愛媛県)',
    cities: [{ nameKm: 'ម៉ាត់ស៊ុយ៉ាម៉ា (Matsuyama-shi / 松山市)', nameEn: 'Matsuyama-shi' }],
  },
  {
    nameKm: 'កូឈិ (Kochi - 高知県)',
    nameEn: 'Kochi (高知県)',
    cities: [{ nameKm: 'កូឈិ (Kochi-shi / 高知市)', nameEn: 'Kochi-shi' }],
  },
  {
    nameKm: 'សាហ្គា (Saga - 佐賀県)',
    nameEn: 'Saga (佐賀県)',
    cities: [{ nameKm: 'សាហ្គា (Saga-shi / 佐賀市)', nameEn: 'Saga-shi' }],
  },
  {
    nameKm: 'ណាហ្គាសាគី (Nagasaki - 長崎県)',
    nameEn: 'Nagasaki (長崎県)',
    cities: [{ nameKm: 'ណាហ្គាសាគី (Nagasaki-shi / 長崎市)', nameEn: 'Nagasaki-shi' }],
  },
  {
    nameKm: 'អូអ៊ីតា (Oita - 大分県)',
    nameEn: 'Oita (大分県)',
    cities: [{ nameKm: 'អូអ៊ីតា (Oita-shi / 大分市)', nameEn: 'Oita-shi' }],
  },
  {
    nameKm: 'មីយ៉ាហ្សាគី (Miyazaki - 宮崎県)',
    nameEn: 'Miyazaki (宮崎県)',
    cities: [{ nameKm: 'មីយ៉ាហ្សាគី (Miyazaki-shi / 宮崎市)', nameEn: 'Miyazaki-shi' }],
  },
  {
    nameKm: 'ទទួលនៅអាកាសយានដ្ឋានជប៉ុន (Japan Airport Pickup)',
    nameEn: 'Japan Airport Pickup (空港受取)',
    cities: [
      { nameKm: 'អាកាសយានដ្ឋាន Narita (NRT Tokyo)', nameEn: 'Narita Airport (NRT)' },
      { nameKm: 'អាកាសយានដ្ឋាន Haneda (HND Tokyo)', nameEn: 'Haneda Airport (HND)' },
      { nameKm: 'អាកាសយានដ្ឋាន Kansai (KIX Osaka)', nameEn: 'Kansai Airport (KIX)' },
      { nameKm: 'អាកាសយានដ្ឋាន Chubu Centrair (NGO Nagoya)', nameEn: 'Chubu Centrair Airport (NGO)' },
      { nameKm: 'អាកាសយានដ្ឋាន Fukuoka (FUK)', nameEn: 'Fukuoka Airport (FUK)' },
      { nameKm: 'អាកាសយានដ្ឋាន New Chitose (CTS Sapporo)', nameEn: 'New Chitose Airport (CTS)' },
    ],
  },
];
