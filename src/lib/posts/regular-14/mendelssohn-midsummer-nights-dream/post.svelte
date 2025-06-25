<script lang="ts" module>
  import type { Metadata } from '$lib/posts/index.ts';
  import Author from '$lib/component/post/Author.svelte';
  import Reference from '$lib/component/post/Reference.svelte';
  import Figure from '$lib/component/post/Figure.svelte';

  import overtureExample1 from './overture-example-1.png';
  import overtureExample2 from './overture-example-2.png';
  import scherzo from './scherzo.png';
  import intermezzo from './intermezzo.png';
  import nocturne from './nocturne.png';
  import weddingMarch from './wedding-march.png';
  import characterRelationship from './character-relationship.png';

  export const metadata: Metadata = {
    published: true,
    publicatedAt: '2025-06-21T19:00:00+0900',
    title: '劇付随音楽『真夏の夜の夢』',
    composerSlug: 'mendelssohn',
    concertSlug: 'regular-14',
    tags: ['曲目解説', '第14回定期', 'メンデルスゾーン']
  };
</script>

<p>
  メンデルスゾーンの劇付随音楽『真夏の夜の夢』は、シェイクスピアの同名の喜劇に基づく作品である。この作品は2つの時期に分けて作曲された。序曲は1826年、メンデルスゾーンがわずか17歳の時に作曲され、その後1843年にプロイセン王フリードリヒ・ヴィルヘルム4世の依頼により、劇の上演のために残りの楽曲が追加された。17年の歳月を経ても、音楽的な統一感が保たれているのは驚くべきことである。
</p>

<h3>序曲</h3>

<p>
  序曲は、4つの和音で始まる魔法の世界への扉である（譜例1）。この神秘的な和音は、妖精の世界への入り口を示している。続いて現れる軽やかな弦楽器の動きは、妖精たちの羽ばたきを表現している。
</p>

<Figure src={overtureExample1} caption="譜例1：序曲冒頭の4つの和音" maxHeightPx={150} />

<p>
  第1主題は妖精たちの軽やかな舞踏を表し、第2主題では恋人たちの情熱的な愛が歌われる（譜例2）。展開部では、ロバの鳴き声を模した音型が現れ、職人ボトムの変身を暗示する。再現部を経て、冒頭の4つの和音が回帰し、夢の世界が静かに閉じられる。
</p>

<Figure src={overtureExample2} caption="譜例2：恋人たちの主題" maxHeightPx={200} />

<h3>劇付随音楽</h3>

<p>
  1843年に作曲された劇付随音楽は、序曲を含めて全13曲から成る。今回の演奏会では、特に有名な4曲を抜粋して演奏する。
</p>

<h4>スケルツォ（第1曲）</h4>

<p>
  第1幕と第2幕の間に演奏される間奏曲。妖精パックの軽快な動きを描写している。フルートが奏でる主題は、いたずら好きな妖精の性格を巧みに表現している。
</p>

<Figure src={scherzo} caption="スケルツォの主題" maxHeightPx={150} />

<h4>間奏曲（第5曲）</h4>

<p>
  第2幕の終わりに演奏される。ハーミアが森で迷子になる場面の音楽で、不安と神秘が入り混じった雰囲気を醸し出す。
</p>

<Figure src={intermezzo} caption="間奏曲" maxHeightPx={150} />

<h4>夜想曲（第7曲）</h4>

<p>
  第3幕の後に演奏される、ホルンの美しい独奏で有名な楽曲。恋人たちが眠りに落ちる場面を描写し、夢幻的な雰囲気を作り出している。
</p>

<Figure src={nocturne} caption="夜想曲のホルン独奏" maxHeightPx={150} />

<h4>結婚行進曲（第9曲）</h4>

<p>
  第4幕と第5幕の間に演奏される、世界で最も有名な結婚行進曲。アテネ公テーセウスとアマゾンの女王ヒポリタ、そして若い恋人たち（ライサンダーとハーミア、デメトリアスとヘレナ）の結婚を祝福する華やかな音楽である。
</p>

<Figure src={weddingMarch} caption="結婚行進曲の主題" maxHeightPx={150} />

<h3>物語と音楽の融合</h3>

<p>
  シェイクスピアの『真夏の夜の夢』は、3つの世界が交錯する物語である。アテネの宮廷、職人たちの世界、そして妖精の世界。メンデルスゾーンの音楽は、これらの世界を見事に音で描き分けている。
</p>

<Figure src={characterRelationship} caption="真夏の夜の夢の人物相関図" maxHeightPx={300} />

<p>
  特筆すべきは、17歳で作曲した序曲と、34歳で作曲した劇付随音楽の間に、まったく違和感がないことである。メンデルスゾーンは序曲で確立した音楽的語法を見事に発展させ、シェイクスピアの詩的世界を音楽で表現することに成功した。妖精の軽やかさ、恋人たちの情熱、職人たちの素朴さ、そして夢と現実が交錯する不思議な世界観が、音楽によって鮮やかに描き出されている。
</p>

<Author>Fl. 細野 雄平</Author>

<Reference>
  <li>W. シェイクスピア（松岡和子訳）『夏の夜の夢・間違いの喜劇』筑摩書房、1997年</li>
  <li>西原稔『作曲家◎人と作品 メンデルスゾーン』音楽之友社、2006年</li>
  <li>吉田泰輔『メンデルスゾーン―美しくも厳しき人生』筑摩書房、2018年</li>
  <li>門馬直美『西洋音楽史概説』春秋社、1976年</li>
</Reference>
