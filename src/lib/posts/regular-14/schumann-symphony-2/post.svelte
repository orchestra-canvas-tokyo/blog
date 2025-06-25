<script lang="ts" module>
  import type { Metadata } from '$lib/posts/index.ts';
  import Author from '$lib/component/post/Author.svelte';
  import Reference from '$lib/component/post/Reference.svelte';
  import Figure from '$lib/component/post/Figure.svelte';

  import example1 from './example-1.png';
  import example2 from './example-2.png';
  import example3 from './example-3.png';
  import example4 from './example-4.png';
  import example5 from './example-5.png';
  import example6 from './example-6.png';
  import example7 from './example-7.png';

  export const metadata: Metadata = {
    published: true,
    publicatedAt: '2025-06-21T19:00:00+0900',
    title: '交響曲第2番ハ長調作品61',
    composerSlug: 'schumann',
    concertSlug: 'regular-14',
    tags: ['曲目解説', '第14回定期', 'シューマン']
  };
</script>

<p>
  シューマンの交響曲第2番ハ長調作品61は、1845年から1846年にかけて作曲された4楽章からなる交響曲である。この作品は、シューマンが精神的な危機を乗り越えて創作した、希望と勝利への讃美歌として位置づけられている。
</p>

<h3>作曲の背景</h3>

<p>
  この交響曲は、シューマンの人生における転換点で作曲された。1844年、作曲家は深刻な神経衰弱に陥り、創作活動が困難な状態に陥っていた。しかし、ドレスデンでの療養生活を経て、1845年に再び創作意欲を取り戻したシューマンが手がけた最初の大作がこの交響曲第2番である。
</p>

<h3>楽曲分析</h3>

<h4>第1楽章：Sostenuto assai - Allegro ma non troppo</h4>

<p>
  楽章は金管楽器による荘厳な序奏で始まる。この序奏部の主要動機（譜例1）は、全楽章を通じて回帰する重要な主題である。
</p>

<Figure src={example1} caption="譜例1：第1楽章序奏の主要動機" maxHeightPx={120} />

<p>
  主部に入ると、第1主題（譜例2）が弦楽器によって静かに提示される。この主題は内省的で、シューマンの内面的な苦悩を表現している。
</p>

<Figure src={example2} caption="譜例2：第1楽章第1主題" maxHeightPx={100} />

<p>第2主題（譜例3）は対照的に明るく希望に満ちており、作曲家の精神的な回復を象徴している。</p>

<Figure src={example3} caption="譜例3：第1楽章第2主題" maxHeightPx={100} />

<h4>第2楽章：Scherzo - Allegro vivace</h4>

<p>
  スケルツォ楽章は軽快なリズムで始まる。主題（譜例4）は舞曲的な性格を持ち、シューマンの回復した活力を表現している。
</p>

<Figure src={example4} caption="譜例4：第2楽章スケルツォ主題" maxHeightPx={150} />

<h4>第3楽章：Adagio espressivo</h4>

<p>
  緩徐楽章は深い情感に満ちた楽章である。主題（譜例5）は弦楽器によって歌われ、シューマンの内面的な平静を表現している。
</p>

<Figure src={example5} caption="譜例5：第3楽章主題" maxHeightPx={120} />

<h4>第4楽章：Allegro molto vivace</h4>

<p>終楽章は勝利の讃歌として書かれている。主題（譜例6）は力強く、楽観的な性格を持つ。</p>

<Figure src={example6} caption="譜例6：第4楽章主題" maxHeightPx={130} />

<p>
  楽章の終結部（譜例7）では、第1楽章の序奏動機が回帰し、全曲を統一的に締めくくる。これは、シューマンが苦悩を乗り越えて新たな希望を見出したことを象徴している。
</p>

<Figure src={example7} caption="譜例7：第4楽章終結部" maxHeightPx={150} />

<h3>まとめ</h3>

<p>
  シューマンの交響曲第2番は、作曲家の個人的な体験と密接に結びついた作品である。精神的な危機から回復への道程が音楽として昇華されており、暗闇から光への転換を描いた感動的な作品として評価されている。特に終楽章の勝利の讃歌は、人間の精神力の勝利を高らかに歌い上げている。
</p>

<Author>●●●</Author>

<Reference>
  <li>参考文献の詳細は、docxファイルの内容に従って記載予定</li>
</Reference>
