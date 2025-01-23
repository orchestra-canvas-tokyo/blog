<script lang="ts" context="module">
  import Author from '$lib/component/post/Author.svelte';
  import Figure from '$lib/component/post/Figure.svelte';
  import Reference from '$lib/component/post/Reference.svelte';
  import UrlLink from '$lib/component/post/UrlLink.svelte';
  import type { Metadata } from '$lib/posts/index.ts';
  import figure1 from './totoro029.jpg';
  import figure2 from './totoro036.jpg';

  export const metadata: Metadata = {
    published: true,
    publicatedAt: '2024-09-09T20:00:01+0900',
    title: 'となりのトトロ',
    composerSlug: 'hisaishi',
    concertSlug: 'regular-11',
    youTubeVideoId: '-zJ6M747jwI',
    tags: ['曲目解説', '第11回定期', '久石譲']
  };
</script>

<figure>
  <blockquote>
    このへんないきものは、まだ日本にいるのです。たぶん。「そりゃスゴイ、お化け屋敷に住むのが父さんの夢だったんだ」と、こんなことを言うお父さんの娘が、小学六年生のサツキと四歳のメイ。このふたりが、大きな袋にどんぐりをいっぱいつめた、たぬきのようでフクロウのようで、クマのような、へんないきものに会います。ちょっと昔の森の中には、こんなへんないきものが、どうもいたらしいのです。でもよおく探せば、まだきっといる。見つからないのは、いないと思いこんでいるから。
  </blockquote>
  <figcaption>（The Walt Disney Studios ホームページより）</figcaption>
</figure>

<p>
  ここでいう「へんないきもの」とは、「トトロ」のことである。「トトロ」がいる世界では、庭の花や木が一晩で急成長したり、不思議な乗り物に乗って会いたい人に会いに行けたりする。そして「トトロ」自体もいつも目の焦点が合っておらず、何を見ているのか、何を考えているのか、それすらあまり読み取れない存在である。
</p>

<p>
  では、その「へんないきもの」は何を意味しているのか。それは自然ではないかと推測できる。自然は奥深く、人間が簡単に理解したり支配したりできるものではない。そういうメッセージを、「へんないきもの」トトロと自然とを重ね合わせることによって、土地開発などで安易に自然をコントロールしようとする現代人に伝えようとしていたのではないだろうか。
</p>

<h3>メディア展開について</h3>

<p>
  最近では、イギリスの名門演劇カンパニー「ロイヤル・シェイクスピア・カンパニー」によって世界で初めて舞台化された。もちろんプロデューサーは久石譲である。2022年10月8日から2023年1月21日まで、イギリス・ロンドンのバービカン劇場で上演された。そして、2023年2月12日に発表された演劇賞「第23回WhatsOnStage
  Awards」で最優秀演出賞などの最多の5冠を獲得し、世界中で大きな話題となったのである。
</p>

<Figure src={figure1} maxHeightPx={300}></Figure>
<Figure src={figure2} caption="（スタジオジブリ公式サイトから）" maxHeightPx={300}></Figure>

<h3>MY NEIGHBOR TOTORO</h3>

<p>
  本曲はフルオーケストラの演奏向けに作曲者の久石譲自身によって編曲されており、映画の終盤を彩る「よかったね」や「となりのトトロ」といった楽曲が使用されている。
</p>

<p>
  劇中、ねこバスが二人を乗せて駆けて行くシーンがフルオーケストラで壮大に演奏されているのに対し、病室のシーンは弦楽器中心の優しい音色のアンサンブルに変わるように構成されている。この曲でサウンドトラックとしての「となりのトトロ」のフレーズを使うことで、エンディングで流れる主題歌「となりのトトロ」への前奏的な効果をもたらしていると言える。
</p>

<Author>Perc. 大田 こるり</Author>

<Reference>
  <li>
    映画.com. “映画「となりのトトロ」”. 映画.com. <UrlLink url="https://eiga.com/movie/21235/" />,
    (参照:2024年5月11日)
  </li>
</Reference>
