<script lang="ts" module>
  import type { Metadata } from '$lib/posts/index.ts';
  import Author from '$lib/component/post/Author.svelte';
  import Reference from '$lib/component/post/Reference.svelte';
  import UrlLink from '$lib/component/post/UrlLink.svelte';
  import Footnote from '$lib/component/post/Footnote.svelte';

  export const metadata: Metadata = {
    published: true,
    publicatedAt: '2024-09-09T20:00:02+0900',
    title: '『パイレーツ・オブ・カリビアン』より',
    composerSlug: 'badelt',
    arrangerSlug: 'ricketts',
    concertSlug: 'regular-11',
    youTubeVideoId: 'B_7sFmrJDR4',
    tags: ['曲目解説', '第11回定期', 'クラウス・バデルト', 'テッド・リケッツ']
  };
</script>

<h3>作品について</h3>
<p>
  『パイレーツ・オブ・カリビアン』は、ディズニーランドのアトラクション「カリブの海賊<sup>*1</sup
  >」を元に作られた映画である。
</p>
<p>
  舞台は、17世紀のカリブ海のとある港町。美しい娘エリザベスは昔海上でウィルという少年を助け、その時彼が身につけていた黄金のメダルを貰っていた。そんなある日、ブラックパール号を名乗る海賊たちが街に現れ、エリザベスが拐われてしまう。海賊の目的は、彼女が持っているメダルだった。そこで、成長したウィルは、幽閉されていた海賊ジャック・スパロウと手を組み、エリザベスの救出に向かう。
</p>

<h3>PIRATES OF THE CARIBBEAN</h3>
<p>
  本曲は、シリーズ第1作目の「Pirates of the Caribbean：The Curse of the Black
  Pearl（パイレーツ・オブ・カリビアン／呪われた海賊たち）」の挿入歌(一部)の編曲である。
</p>

<h4>Fog Bound(霧の境界線)</h4>
<p>エリザベスが船に乗っているシーンで流れた曲。</p>
<p>
  前半は明るく軽快に曲が紡がれる。だが、映画の序盤、濃い霧が立ち込めている船が映し出されるシーンに合わせ、途中から不穏な雰囲気を思わせる曲調になってゆく。
</p>

<h4>The Medallion Calls(黄金のメダル)</h4>
<p>ウィルがエリザベスを見送る際に流れた曲。</p>
<p>
  切なさを感じさせる曲調で始まるが、その後スネアの厳かな刻みをきっかけに、ジャック・スパロウが風を受け船に乗る姿が映し出され、壮大なテーマが流れ始める。
</p>

<h4>To the Pirates Cave(海賊の洞窟へ)</h4>
<p>ジャックと悪役・バルボッサが洞窟で剣を交えるシーンで流れた曲。</p>
<p>
  まくし立てるようなアップテンポの打楽器のリズムに、曲の後半では16分音符で波の音が表現されている。また、ジャックがバルボッサの身体を剣で貫いた瞬間、全ての楽器が休符となり、静寂を作り出す瞬間も見所である。
</p>

<h4>The Black Pearl(ブラック・パール号)</h4>
<p>エリザベスを助けたジャックが海兵から逃げるシーンで流れた曲。</p>
<p>
  おどろおどろしさを感じさせる曲調に始まるが、次第に颯爽と航海をしていくようなパワフルな雰囲気に変わっていく。
</p>

<h4>One Last Shot(ワン・ラスト・ショット)</h4>
<p>ウィルとエリザベスがキスをするシーンで流れた曲。</p>
<p>
  フルートによる切なげなメロディーから始まり、徐々に管楽器のアンサンブルへと広まった後に、次なる冒険の始まりを告げるような曲調になる。
</p>

<h4>He’s A Pirate(彼こそが海賊)</h4>
<p>エンドロールで流れていて、同映画の代名詞ともいえる曲。</p>
<p>
  日本でも海のロケシーン等でよく使用されている。作曲者のハンス・ジマーは、インタビューで同曲について、ジャックの頭の中で流れている音楽を具現化したものであると答えている。
</p>

<figure>
  <blockquote>
    「あの音楽は本当に壮大です。彼が小さな手漕ぎボートに乗っているところ、あの雄大なオーケストラが聴こえてくる。あの音楽は、彼の頭の中で流れていたものなんです。なぜなら彼は、彼の空想の中で、史上最も偉大な海賊なのですから。」
  </blockquote>
  <figcaption>
    （SCREEN RANT『Why Pirates of the Caribbean's Music Is So Epic Explained by Hans Zimmer』）
  </figcaption>
</figure>

<Footnote>
  *1：同アトラクションは、ウォルト・ディズニー自身が設計に携わった最後のアトラクション。彼の死から３ヶ月後にディズニーランドで初めて公開された。
</Footnote>

<Author>Perc. 大田こるり</Author>

<Reference>
  <li>
    映画.com. ”映画「パイレーツ・オブ・カリビアン　呪われた海賊たち」”. 映画.com.
    <UrlLink url="https://eiga.com/movie/1148/" />, (参照:2024年5月11日)
  </li>
</Reference>
