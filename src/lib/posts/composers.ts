/**
 * 作曲者の情報をまとめるオブジェクトの型
 */
export type Composer = {
  shortName: string;
  fullName: string;
  yearOfBirth: number;
  yearOfDeath?: number;
};

/**
 * 作曲者の情報をまとめたオブジェクト
 */
export const composers = {
  beethoven: {
    shortName: 'ベートーヴェン',
    fullName: 'ルートヴィヒ・ヴァン・ベートーヴェン',
    yearOfBirth: 1770,
    yearOfDeath: 1827
  },
  brahms: {
    shortName: 'ブラームス',
    fullName: 'ヨハネス・ブラームス',
    yearOfBirth: 1833,
    yearOfDeath: 1897
  },
  liszt: {
    shortName: 'リスト',
    fullName: 'フランツ・リスト',
    yearOfBirth: 1811,
    yearOfDeath: 1886
  },
  gershwin: {
    shortName: 'ガーシュウィン',
    fullName: 'ジョージ・ガーシュウィン',
    yearOfBirth: 1898,
    yearOfDeath: 1937
  },
  copland: {
    shortName: 'コープランド',
    fullName: 'アーロン・コープランド',
    yearOfBirth: 1900,
    yearOfDeath: 1990
  },
  dvorak: {
    shortName: 'ドヴォルザーク',
    fullName: 'アントニン・ドヴォルザーク',
    yearOfBirth: 1841,
    yearOfDeath: 1904
  },
  chabrier: {
    shortName: 'シャブリエ',
    fullName: 'エマニュエル・シャブリエ',
    yearOfBirth: 1841,
    yearOfDeath: 1894
  },
  bizet: {
    shortName: 'ビゼー',
    fullName: 'ジョルジュ・ビゼー',
    yearOfBirth: 1838,
    yearOfDeath: 1875
  },
  berlioz: {
    shortName: 'ベルリオーズ',
    fullName: 'エクトル・ベルリオーズ',
    yearOfBirth: 1803,
    yearOfDeath: 1869
  },
  rachmaninoff: {
    shortName: 'ラフマニノフ',
    fullName: 'セルゲイ・ラフマニノフ',
    yearOfBirth: 1873,
    yearOfDeath: 1943
  },
  mozart: {
    shortName: 'モーツァルト',
    fullName: 'ヴォルフガング・アマデウス・モーツァルト',
    yearOfBirth: 1756,
    yearOfDeath: 1791
  },
  rStrauss: {
    shortName: 'R.シュトラウス',
    fullName: 'リヒャルト・シュトラウス',
    yearOfBirth: 1756,
    yearOfDeath: 1791
  },
  mahler: {
    shortName: 'マーラー',
    fullName: 'グスタフ・マーラー',
    yearOfBirth: 1860,
    yearOfDeath: 1911
  },
  smetana: {
    shortName: 'スメタナ',
    fullName: 'ベドジフ・スメタナ',
    yearOfBirth: 1824,
    yearOfDeath: 1884
  },
  falla: {
    shortName: 'ファリャ',
    fullName: 'マヌエル・デ・ファリャ',
    yearOfBirth: 1876,
    yearOfDeath: 1946
  },
  sibelius: {
    shortName: 'シベリウス',
    fullName: 'ジャン・シベリウス',
    yearOfBirth: 1865,
    yearOfDeath: 1957
  },
  tchaikovsky: {
    shortName: 'チャイコフスキー',
    fullName: 'ピョートル・チャイコフスキー',
    yearOfBirth: 1865,
    yearOfDeath: 1957
  },
  elgar: {
    shortName: 'エルガー',
    fullName: 'エドワード・エルガー',
    yearOfBirth: 1857,
    yearOfDeath: 1934
  },
  shostakovich: {
    shortName: 'ショスタコーヴィチ',
    fullName: 'ドミートリイ・ショスタコーヴィチ',
    yearOfBirth: 1906,
    yearOfDeath: 1975
  },
  prokofiev: {
    shortName: 'プロコフィエフ',
    fullName: 'セルゲイ・プロコフィエフ',
    yearOfBirth: 1891,
    yearOfDeath: 1953
  },
  hisaishi: {
    shortName: '久石譲',
    fullName: '久石譲',
    yearOfBirth: 1950
  },
  badelt: {
    shortName: 'クラウス・バデルト',
    fullName: 'クラウス・バデルト',
    yearOfBirth: 1967
  },
  ricketts: {
    shortName: 'テッド・リケッツ',
    fullName: 'テッド・リケッツ',
    yearOfBirth: NaN // 情報を見つけられず。編曲者は生没年表記がないので暫定対応。
  },
  williams: {
    shortName: 'ジョン・ウィリアムズ',
    fullName: 'ジョン・ウィリアムズ',
    yearOfBirth: 1932
  }
} as const satisfies {
  [slug: string]: Composer;
};

/** Composersのkeyを抽出した型 */
export type composerSlug = keyof typeof composers;
