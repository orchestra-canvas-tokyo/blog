import regular1 from './regular-1/flyer.webp?enhanced';
import regular2 from './regular-2/flyer.webp?enhanced';
import regular3 from './regular-3/flyer.webp?enhanced';
import regular4 from './regular-4/flyer.webp?enhanced';
import regular5 from './regular-5/flyer.webp?enhanced';
import regular6 from './regular-6/flyer.webp?enhanced';
import regular7 from './regular-7/flyer.webp?enhanced';
import regular8 from './regular-8/flyer.webp?enhanced';
import regular9 from './regular-9/flyer.webp?enhanced';
import regular10 from './regular-10/flyer.webp?enhanced';
import regular11 from './regular-11/flyer.png?enhanced';
import regular12 from './regular-12/flyer.png?enhanced';

import type { Picture } from 'vite-imagetools';

/** 演奏会の基本情報をまとめた型 */
type Concert = {
  title: string;
  date: string;
  url: string;
  flyer: Picture;
};

/** 演奏会の基本情報をまとめたオブジェクト */
export const concerts = {
  'regular-1': {
    title: '第1回定期',
    date: '2021-08-29',
    url: 'https://www.orch-canvas.tokyo/concerts/regular-1',
    flyer: regular1
  },
  'regular-2': {
    title: '第2回定期',
    date: '2021-11-23',
    url: 'https://www.orch-canvas.tokyo/concerts/regular-2',
    flyer: regular2
  },
  'regular-3': {
    title: '第3回定期',
    date: '2022-02-23',
    url: 'https://www.orch-canvas.tokyo/concerts/regular-3',
    flyer: regular3
  },
  'regular-4': {
    title: '第4回定期',
    date: '2022-05-29',
    url: 'https://www.orch-canvas.tokyo/concerts/regular-4',
    flyer: regular4
  },
  'regular-5': {
    title: '第5回定期',
    date: '2022-09-03',
    url: 'https://www.orch-canvas.tokyo/concerts/regular-5',
    flyer: regular5
  },
  'regular-6': {
    title: '第6回定期',
    date: '2022-12-04',
    url: 'https://www.orch-canvas.tokyo/concerts/regular-6',
    flyer: regular6
  },
  'regular-7': {
    title: '第7回定期',
    date: '2022-04-08',
    url: 'https://www.orch-canvas.tokyo/concerts/regular-7',
    flyer: regular7
  },
  'regular-8': {
    title: '第8回定期',
    date: '2023-07-02',
    url: 'https://www.orch-canvas.tokyo/concerts/regular-8',
    flyer: regular8
  },
  'regular-9': {
    title: '第9回定期',
    date: '2023-10-29',
    url: 'https://www.orch-canvas.tokyo/concerts/regular-9',
    flyer: regular9
  },
  'regular-10': {
    title: '第10回定期',
    date: '2024-02-24',
    url: 'https://www.orch-canvas.tokyo/concerts/regular-10',
    flyer: regular10
  },
  'regular-11': {
    title: '第11回定期',
    date: '2024-06-02',
    url: 'https://www.orch-canvas.tokyo/concerts/regular-11',
    flyer: regular11
  },
  'regular-12': {
    title: '第12回定期',
    date: '2024-09-22',
    url: 'https://www.orch-canvas.tokyo/concerts/regular-12',
    flyer: regular12
  }
} as const satisfies {
  [slug: string]: Concert;
};

/** Concertsのkeyを抽出した型 */
export type concertSlug = keyof typeof concerts;
