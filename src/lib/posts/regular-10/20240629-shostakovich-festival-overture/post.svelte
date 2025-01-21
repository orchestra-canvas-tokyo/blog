<script lang="ts" context="module">
  import type { Metadata } from '$lib/posts/index.ts';
  import Author from '$lib/component/post/Author.svelte';
  import Figure from '$lib/component/post/Figure.svelte';
  import Reference from '$lib/component/post/Reference.svelte';
  import UrlLink from '$lib/component/post/UrlLink.svelte';

  import figure1 from './譜例1.jpg';
  import figure2 from './譜例2.jpg';
  import Footnote from '$lib/component/post/Footnote.svelte';

  export const metadata: Metadata = {
    published: true,
    publicatedAt: '2024-06-29T20:00:00+0900',
    title: '祝典序曲',
    composerSlug: 'shostakovich',
    concertSlug: 'regular-10',
    youTubeVideoId: 'xx7afrbRqoo',
    tags: ['曲目解説', '第10回定期', 'ショスタコーヴィチ']
  };
</script>

<p>
  《祝典序曲》は、ソヴィエト共産党中央委員会からの委嘱作品として作曲され、1954年11月、第37回ロシア革命記念日の祝典で初演された。本作は、ソ連の政治的転換期の中で発表され、共産主義の祝祭的な雰囲気を纏いつつも、ショスタコーヴィチの胸中に秘められた機微を示唆するものとなっている。
</p>

<h3>スターリン時代の終焉</h3>

<p>
  本作が発表される前年の1953年3月5日、ソ連の最高指導者であったスターリンはその生涯を終えた。スターリンはロシア革命を主導したレーニンの後継者として絶対的権勢を誇り、芸術や文化に対してさえも強い統制を敷いていた。芸術作品はプロレタリアートの理念を宣伝し、共産主義のイデオロギーに忠実であることが求められた。《交響曲第10番》の解説で詳述するとおり、ショスタコーヴィチもスターリン政権下での抑圧に晒され、その作品群は文字通り”生き残るため”に共産党あるいはスターリン個人への忠誠心を顕すものと化していた。スターリンの死は、斯くなる体制を揺さぶる転機となった。フルシチョフが新たな指導者となり「スターリン批判」へと舵を切るのは少し先のことになるが、ソヴィエト社会には確かに変革の兆しが訪れたのである。《祝典序曲》はこの転換期に創作され、ショスタコーヴィチは湧き上がる希望、創作への情熱を胸に、変革への期待や葛藤を本作へ投影していったのである。
</p>

<h3>楽曲解説</h3>

<p>
  《祝典序曲》は、荘厳なファンファーレ、闊達なリズム・旋律により祝典の雰囲気を体現している。「近代ロシア音楽の父」と呼ばれたミハイル・グリンカ（1804-1857）のオペラ《ルスランとリュドミラ》序曲に倣い、伝統的な楽式や和声法に則っている。冒頭のファンファーレ（譜例1）は、ショスタコーヴィチが娘ガリーナの誕生日を祝うために作曲した７つのピアノ小品曲「子供のノート」から引用されており、トランペットによって晴れやかに奏でられる。プレストではクラリネットが第1主題（譜例2）を奏でるが、これは彼が1949年に作曲したオラトリオ《森の歌》から第5曲「スターリングラード市民は前進する」を引用した旋律である。弦楽器が主旋律を引き継ぎクライマックスへと至ると、スターリン賛美の第1主題はやがて鳴りを潜め、代わりにホルンとチェロが情感豊かな第2主題を唄う。最後は再度ファンファーレがバンダ付きで壮麗に奏され、盛大なコーダに至る。
</p>

<Figure src={figure1} caption="譜例1. ファンファーレ" maxHeightPx={80}></Figure>

<Figure src={figure2} caption="譜例2. 第1主題" maxHeightPx={70}></Figure>

<h3>「祝典」とは？</h3>

<p>
  「人類の理想を体現した国家」と称したソ連。そこに「個人」はなかった。「神」とも崇められた独裁者スターリンの死は、彼が行なってきた大粛清の全貌を露わにし、残されたソヴィエト共産党の重鎮たちは社会の変革を模索していくこととなった。ソ連の変化を感じ取った東欧諸国の市民らは、民主化や個人の自由を求め立ち上がった。この展開は、《祝典序曲》の構造―スターリン賛美の第1主題が退場し、「子供のノート」という”私的な作品”からの引用で締め括られる―と重なる。然れば本作は、ロシア革命記念日の慶祝という表層的役割を果たしつつも、その実、澄明に自由と変革を求める人々の姿を、情実を尊ぶ芸術観が復興する萌しを、祝い、祈り、讃えるものだったのではなかろうか。
</p>

<Author>Vn. 橋床 亜伊瑠</Author>

<Reference>
  <li>大輪公壱, 2005, 『ショスタコーヴィチ 祝典序曲 作品96』, 東京都, 全音楽譜出版社</li>
  <li>
    ソロモン・ヴォルコフ著, 水野忠夫訳 , 2001, 『ショスタコーヴィチの証言』, 東京都 , 中央公論新社
  </li>
  <li>
    梅津紀雄. (2014). 雪どけ期のソ連音楽政策の転換過程：中央委員会文化部文書に見るその実態(The
    Process of Transition in the Musical Politics of the USSR in the Khrushchev Years: Documents
    from the Cultural Department of the Central Committee of CPSU.). 日本ロシア文学会,
    ロシア語ロシア文学研究 46, 111-130.
  </li>
  <li>
    和田春樹, 2016,
    『スターリン批判　１９５３～５６年―一人の独裁者の死が、いかに２０世紀世界を揺り動かしたか』,
    東京都, 作品社
  </li>
  <li>
    相場ひろ. “プロコフィエフ　ピアノ協奏曲第3番　ハ長調　作品26”, 讀賣交響楽団プログラム,
    <UrlLink url="https://yomikyo.or.jp/pdf/book/orchestra-201506-01.pdf" /> (参照 2024-01-19)
  </li>
  <li>
    一般社団法人全日本ピアノ指導者協会. “プロコフィエフ 1891-1953 Prokofʼev, Sergei Sergeevich”.
    ピティナ・ピアノ曲事典. 2019-06-25. <UrlLink url="https://enc.piano.or.jp/persons/296" /> (参照 2024-01-19)
  </li>
  <li>音楽之友社編, 1995, 『作曲家別名曲解説ライブラリー⑳　プロコフィエフ』, 東京都, 音楽之友社</li>
  <li>伊藤恵子, 2002, 『革命と音楽―ロシア・ソヴィエト音楽文化史』, 東京都, 音楽之友社</li>
  <li>恩田陸, 2019, 『蜜蜂と遠雷（下）』, 東京都, 幻冬舎文庫</li>
  <li>
    武内俊之. (2010). プロコフィエフの音楽:その本質空間をめぐる一考察. 福岡教育大学紀要. 第五分冊,
    芸術・保健体育・家政科編 = Bulletin of Fukuoka University of Education. Part V, Art, health and
    physical education, and home economics, 59, 9-20.
  </li>
  <li>
    田中陽兒・倉持俊一・和田春樹編, 1997, 『世界歴史大系　ロシア史3―20世紀―』, 東京都, 山川出版社
  </li>
  <li>
    長瀬賢弘, & ナガセヨシヒロ. (2014).
    セルゲイ・プロコフィエフのピアノ作品解釈に関する一考察:ピアノソナタ第5番と第9番を巡って.
  </li>
  <li>
    沼野充義・沼野恭子・平松潤奈・乗松享平編, 2021, 『世界文化シリーズ⑦ ロシア文化　55
    のキーワード』, 京都府, ミネルヴァ書房
  </li>
  <li>千葉潤. 2005, 『作曲家◎人と作品　ショスタコーヴィチ』, 東京都, 音楽之友社.</li>
  <li>音楽之友社編, 1979, 『最新名曲解説全集 第2巻 交響曲2』, 東京都, 音楽之友社.</li>
  <li>
    Payser, Herbert F. 1954, “Symphony No. 10 Dmitri SHOSTAKOVICH (Program Notes)”, 1954 October
    14-15, Mitropoulos(cond.), New York Philharmonic, New York, Carnegie Hall.
    <UrlLink
      url="https://archives.nyphil.org/index.php/artifact/eb46c5d4-8b6f-4c83-be3a-804739d794eb-0.1/fullview#page/1/mode/1up"
    />
    (参照 2024-1-20)
  </li>
  <li>
    マース, F., 森田 稔ほか(訳), 2006,
    『ロシア音楽史―《カマーリンスカヤ》から《バービイ・ヤール》まで』, 東京都, 春秋社.
  </li>
  <li>
    梅津紀雄, 2006, 『ショスタコーヴィチ―揺れる作曲家像と作品解釈（ユーラシア・ブックレット）』,
    東京都, 東洋書店.
  </li>
</Reference>

<Footnote>※ 第10回定期演奏会の曲目解説を通しての参考文献</Footnote>
