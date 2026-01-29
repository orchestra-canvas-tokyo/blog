<script lang="ts" context="module">
  import type { Metadata } from '../../index.ts';
  import Author from '$lib/component/post/Author.svelte';
  import Reference from '$lib/component/post/Reference.svelte';

  import figure1 from './譜例1.png';
  import figure2 from './譜例2.png';
  import figure3 from './譜例3.png';
  import figure4 from './譜例4.png';
  import Figure from '$lib/component/post/Figure.svelte';
  import UrlLink from '$lib/component/post/UrlLink.svelte';

  export const metadata: Metadata = {
    published: true,
    publicatedAt: '2026-01-31T20:00:05+0900',
    title: '「ウェストサイドストーリー」よりシンフォニックダンス',
    composerSlug: 'bernstein',
    concertSlug: 'regular-16',
    // youTubeVideoIds: [''],
    tags: ['曲目解説', '第16回定期', 'バーンスタイン']
  };
</script>

<figure>
  <blockquote>どこかに、私たちのための場所があるはず。平和で静かな、息ができる場所が。</blockquote>
  <figcaption>スティーヴン・ソンドハイム作詞〈Somewhere〉より引用</figcaption>
</figure>

<h3>はじめに</h3>

<p>
  《ウエストサイドストーリー》は、1949年にジェローム・ロビンスがバーンスタインらへ現代版『ロミオとジュリエット』の構想を持ちかけたことに始まる。1957年にブロードウェイで初演を迎え、その約3年後、演奏会用組曲として書かれたのが《シンフォニックダンス》である。
</p>

<p>
  舞台は、再開発で取り壊しが進む1950年代のNYスラム街。テリトリーの支配権を巡り、白人系グループ(Jets)とプエルトリコ系移民(Sharks)が衝突する。対立する両陣営ながら恋に落ちたJetsの元リーダーのトニーとSharksのリーダーの妹マリアだったが、根深い人種差別と居場所を失う恐怖が二人を悲劇へと追い詰めていく。バーンスタインはジャズ、ラテン、クラシックを散りばめ、物語を鮮やかに描き出している。
</p>

<h3>楽曲解説</h3>

<h4>〈Prologue〉</h4>

<p>
  JetsとSharksの対立を提示する序曲。ド−ファ#のトライトーン（減5度不協和音）の動機（譜例１）により作品は幕を開ける。トライトーンは愛と憎しみの表裏一体の象徴として作品を通して繰り返される。JetsのスウィングジャズとSharksのラテンリズムが、両陣営のアイデンティティとして提示される。
</p>

<Figure src={figure1} caption="譜例1" maxHeightPx={100}></Figure>

<h4>〈Somewhere〉</h4>

<p>
  生きづらさを抱え、なお居場所を信じる者たちの祈りの歌。ベートーヴェンのピアノ協奏曲5番《皇帝》を彷彿させる旋律や、トライトーンとは対照的な短7度（シ−ラ）が提示される（譜例２）。戦争や差別の時代を生き、憎しみの連鎖を拒絶し続けたバーンスタインは、この旋律に平和への願いを託した歌詞をのせることに強くこだわった。当初は器楽曲としての構想もあったが、「この旋律には歌が必要だ」という彼の信念にスティーヴン・ソンドハイムの歌詞が伴い、この曲のメッセージは作品を貫く普遍的なテーマとなった。
</p>

<Figure src={figure2} caption="譜例2" maxHeightPx={100}></Figure>

<h4>〈Scherzo〉</h4>

<p>
  〈Somewhere〉で捧げられた祈りを体現するかのように、両陣営が憎しみから解き放たれ、友情で結ばれる幻の情景を描き出す。軽快な変拍子の中で踊る木管楽器のスタッカートや弦楽器のピッツィカートは本作を支配する重苦しい緊張感とは無縁である。
</p>

<h4>〈Mambo〉</h4>

<p>
  ダンスパーティーに集った両陣営が、マンボのリズムにのせ、決闘の火花を散らし縄張りを主張し合う一曲。本演奏会の冒頭のダンソン第２番と同じく、キューバに起源を持つこのリズムは、自らの存在を誇示し、ぶつけ合うための熱狂的なエネルギーとして響き渡る。鋭い16分音符の刻みは一触即発の緊迫感を煽り、途中炸裂する「Mambo!」の掛け声は、ダンスを激しい格闘へと変貌させる。
</p>

<h4>〈Cha-Cha〉</h4>

<p>
  激しいダンスの渦中でトニーとマリアが出会う場面の曲。熱狂的なマンボの裏側で、それとは対照的な落ち着いたチャチャチャのリズムが流れ出す。周囲の喧騒から切り離され、互いを見つめ合い踊る二人だけの世界が描かれる。
</p>

<h4>〈Meeting Scene〉</h4>

<p>
  踊っていた二人が初めて言葉を交わし、恋に落ちる場面の曲。二人の話す言葉に寄り添う旋律を4台のソロヴァイオリンが奏でる。劇中歌〈Maria〉のメロディに含まれるトライトーン（ラ−レ#）が、直後に完全5度のミへと解決する（譜例３）が、これは憎しみの連鎖の中に生まれた唯一の光を象徴する、切ない瞬間である。
</p>

<Figure src={figure3} caption="譜例3" maxHeightPx={110}></Figure>

<h4>〈Cool〉</h4>

<p>
  仲間を失ったJetsが怒りを押し殺そうとする場面の曲。スウィングやクールジャズの影響が伺える。荒ぶる感情をあえて厳格なフーガの形式に閉じ込めることで、今にも爆発しそうな若者たちの焦燥感が描かれる。
</p>

<h4>〈Rumble〉</h4>

<p>
  JetsとSharksの決闘の場面。暴力の連鎖を表すかのように、打楽器の強打と攻撃的な金管楽器の音が響く。音楽は3連符を反復しながら熱量を増し、両陣営のリーダーが命を落とす凄惨な結末へと物語を追い詰める。
</p>

<h4>〈Finale〉</h4>

<p>
  劇中歌〈I have a
  love〉と〈Somewhere〉のメロディが挿入される。曲の最後、全体は変ハ長調の主和音だが、低音のみトライトーンの関係にあるファ♮を鳴らし続け（譜例４）、愛する人々を失ったマリアの悲しみと、終わることのない憎しみの連鎖を象徴している。
</p>

<Figure src={figure4} caption="譜例4" maxHeightPx={200}></Figure>

<h3>おわりに</h3>

<p>
  筆者は6年間アメリカで生活しニューヨークにも住んだが、初演から約70年経過した現代においても、さまざまな壁に直面しもがく移民の姿を、我が事として痛感してきた。本作が描く分断は、決して過去の物語ではない。誰もが自らのアイデンティティを守りながら、かつ受容される“Somewhere”を求める願いは、今も切実な祈りとして響く。
</p>

<Author>Vn. 上原 さら</Author>

<Reference>
  <li>
    Barnes, E., 2019, 『SOMEWHERE: The Music Explained』, YouTube, (Accessed 2025/01/16,
    <UrlLink url="https://youtu.be/E0AoMPZybXk" />), Songbook Station
  </li>
  <li>
    Jack Gottlieb, [n.d.], "Guide and Commentary", 『West Side Story (1957)』, New York, The Leonard
    Bernstein Office, Inc. (Accessed 2025/01/16,
    <UrlLink url="https://leonardbernstein.com/works/view/9/west-side-story" />)
  </li>
  <li>
    Jamie Bernstein, [n.d.], "My Father's Idealism", 『About Leonard Bernstein: Humanitarian』, New
    York, The Leonard Bernstein Office, Inc. (Accessed 2025/01/16,
    <UrlLink url="https://leonardbernstein.com/about/humanitarian" />)
  </li>
  <li>
    Knapp, R., 2006, 『The American Musical and the Formation of National Identity』,
    ニュージャージー, Princeton University Press
  </li>
  <li>
    Wells, E. A., 2010, 『West Side Story: Cultural Perspectives on an American Musical』,
    ニュージャージー, Rutgers University Press
  </li>
</Reference>
