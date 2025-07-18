<script lang="ts" module>
  import type { Metadata } from '$lib/posts/index.ts';
  import Author from '$lib/component/post/Author.svelte';
  import Reference from '$lib/component/post/Reference.svelte';

  import figure1 from './譜例1.png';
  import figure2 from './譜例2.png';
  import figure3 from './譜例3.png';
  import figure4 from './譜例4.png';
  import figure5 from './譜例5.png';
  import Figure from '$lib/component/post/Figure.svelte';
  import UrlLink from '$lib/component/post/UrlLink.svelte';

  export const metadata: Metadata = {
    published: true,
    publicatedAt: '2025-01-18T20:00:00+0900',
    title: '楽劇『トリスタンとイゾルデ』 より前奏曲と愛の死',
    composerSlug: 'wagner',
    concertSlug: 'regular-13',
    tags: ['曲目解説', '第13回定期', 'ワーグナー'],
    youTubeVideoId: 's8h-xLJUdDc'
  };
</script>

<p>
  楽劇『トリスタンとイゾルデ』は、ワーグナーがその初演に先立って第1幕への前奏曲と第3幕の終結部（愛の死）を連続して演奏したことから、「前奏曲と愛の死」は独立したオーケストラ作品として扱われており、現在でも重要なレパートリーの一つとなっている。作曲の経緯や音楽史上で果たした役割など、この楽劇にまつわる裏話は尽きないが、本稿では楽劇のあらすじと音楽を、前奏曲と愛の死に関連する内容を中心に紹介する。
</p>

<h3>前奏曲と第1幕</h3>

<p>
  前奏曲は第1幕で登場する重要な動機が多数登場する。まず冒頭は「憧れの動機」（譜例1）で始まる。前半部分がトリスタンの、後半部分がイゾルデの愛を表していると言われているが、両者の愛はトリスタン和音と呼ばれる不協和音で重なっており、動機全体も和声的に解決しない。その後チェロによって「愛の眼差しの動機」（譜例2）や「愛の魔酒の動機」（譜例3）が提示される。さらにその後にヴァイオリンによって繰り返される「法悦の動機」（譜例4）は、留まる所のない愛の法悦と、それがいつまで経っても満たされないことを表現している。様々な動機が複雑に絡み合いながら最高潮に達すると、その後は次第に力を失い消えるようにして第1幕へと繋がっていく。チェロによる「愛の眼差しの動機」からここまでの間、一度も明確な終止和音と捉えられる三和音は鳴らず、かつ一度も旋律が途切れることがない。目的地の見えない2人の愛の苦しみや憧れに観客が浸り続け、酩酊感を味わったところで舞台の幕が上がるのである。
</p>

<p>
  第1幕は、アイルランドの王女イゾルデがコーンウォールの王マルケに嫁ぐため、侍女ブランゲーネと共に、マルケ王の甥の勇者トリスタンが率いる船で移動するところから始まる。船旅の途中で、トリスタンはイゾルデのかつての婚約者を殺した仇だが、2人は内心では惹かれあっていることが仄めかされる。船がコーンウォールに近づく頃、イゾルデが毒薬を「和解の杯」と偽りトリスタンと心中を図る。しかし、イゾルデに死なれては困るブランゲーネが機転を効かせ、杯の中身を愛の魔酒（元々はイゾルデとマルケ王を結ぶためのもの）にすり替えたことで、2人は恋に落ちる。
</p>

<p>
  愛の魔酒を飲む場面から、前奏曲で登場した動機が再び集合する。魔酒を飲んだ2人は「愛の眼差しの動機」に乗って互いの名を呼ぶが、突如として興奮の渦に飲まれるように音楽は加速し、最後には水夫たちが『マルケ王万歳』と合唱する中、『私は生きねばならぬのか』（イゾルデ）、『欺瞞の生んだ幸せよ』（トリスタン）と叫ぶこととなる。前奏曲から第1幕が終わるまでの約70分間をかけて、現世では成就しない愛と本来絶望的なはずの死に憧れ続ける、異様な物語が始まることが、劇的に印象づけられる。
</p>

<Figure src={figure1} caption="譜例1" maxHeightPx={110} />
<Figure src={figure2} caption="譜例2" maxHeightPx={60} />
<Figure src={figure3} caption="譜例3" maxHeightPx={70} />
<Figure src={figure4} caption="譜例4" maxHeightPx={120} />

<h3>第2幕と第3幕、そして「愛の死」</h3>

<p>
  第2幕は、マルケ王と側近メロートが狩りに行く間に、コーンウォール城内でトリスタンとイゾルデが逢引きをする場面から始まる。2人の逢引きの場面は、激しい興奮の後に甘美な二重唱へと移る。しかし歌詞は徐々に愛の法悦から死への憧れへと変わっていく。『こうして私たちは死ねばよい』（トリスタン）から始まる二重唱は、実は第3幕最後の「愛の死」とほぼ同じ展開である。2人が永遠の夜（愛と死）への憧れを歌いながら頂点に達しようとする直前で、外を見張っていた侍女ブランゲーネの絶叫とともにマルケ王たちが現れる。狩りは2人の密会現場を押さえるためのメロートの罠であり、禁断の愛が露見する。信頼する部下に裏切られたマルケ王は深く嘆くが、トリスタンはそれに答えることなく、自らメロートの剣に飛び込むようにして重傷を負う。
</p>

<p>
  第3幕はトリスタンの居城に舞台を移し、運ばれたトリスタンはイゾルデの到来を夢見る。しかしイゾルデの腕に抱かれた直後、虫の息で『イゾルデ』と呼びかけると息絶え、イゾルデも気を失う。ブランゲーネから愛の魔酒の秘密を聞いたマルケ王は、2人を許すために共にイゾルデを追いかけて来るが、勘違いにより殺し合いとなり、トリスタンの部下とメロートは死ぬ。再び悲嘆するマルケ王をよそに、イゾルデが滔々と歌い出すのが「愛の死」である。『彼が微笑み、目を優しく開けているのがあなた方には見えないのですか』（イゾルデ）といった、あまりにも切ない歌詞で始まるが、官能的なうねりの音楽とともに、流れに身を任せるような達観した歌詞へと変化していく。そして第2幕の二重唱では迎えられなかった頂点を1人で迎えると、「至上の快楽よ」と呟きながら息絶える。最後に冒頭の「憧れの動機」がロ音上の長和音に解決し（譜例5）、2人が死によって愛の苦しみから解放されたことが表現される。第1幕への前奏曲から4時間近く興奮と酩酊を味わった観客に、ようやく永遠の愛の形が示されるのである。
</p>

<Figure src={figure5} caption="譜例5" maxHeightPx={55} />

<h3>さいごに</h3>

<p>
  筆者が約2年前に初めてオペラを聴いて以来、ドイツ・イタリアオペラを生演奏もしくは映像で合計9作品鑑賞してきたが、「オペラ沼」の途方もない深さを思うと、まだまだ「にわかファン」の域を出ないと思っている。しかし、オペラの良さを知り始めた頃を新鮮に覚えている者としては、前奏曲だけでなく本編も頻繁に演奏される本楽劇を紹介するにあたって、オペラの本編の内容に触れずにはいられなかった。オペラが敷居の高いジャンルなのは事実だが、没入感や充実感はオペラにしかないものがあると感じている。本演奏会をきっかけに、新たに「オペラ沼」に足を踏み入れる方がいらっしゃれば幸いである。
</p>

<Author>Vn. 佐藤 祐希</Author>

<Reference>
  <li>
    渡辺護による曲解説, トリスタンとイゾルデ、
    リヒャルト・ワーグナー、カルロス・クライバー　ドレスデン国立管弦楽団ほか、ドイツ・グラムフォン,
    1980〜1982年録音
  </li>
  <li>
    連載《トリスタンとイゾルデ》講座,東京・春・音楽祭,
    <UrlLink url="https://www.tokyo-harusai.com/harusai_journal/tristan-und-isolde-lecture-1/" /> (参照
    2024-11-17)
  </li>
  <li>島田雅彦,2008,知るを楽しむ この人この世界 2008年6-7月「オペラ偏愛主義」,日本放送出版協会</li>
</Reference>
