export type VerifiedStrokeName = { hanzi: string; pinyin: string };

// The compact sequences come from cnchar-order 3.2.6 (MIT). They are kept as
// static audited data so the learning UI does not depend on a runtime package.
const sequences: Record<string, string> = {
  你:'sfsegsk',好:'msjegj',我:'sjgiysk',叫:'fcjhf',什:'sfjf',么:'snk',请:'kpjjfjfrjj',问:'kfrfcj',名:'sekfcj',字:'kdeegj',姓:'msjsjjfj',认:'kpsl',识:'kpfcjsk',很:'ssfcjjhsl',高:'kjfcjfrfcj',兴:'kksjsk',也:'rfu',
  老:'jfjssu',师:'fsjfrf',再:'jfrfjj',见:'fcsu',早:'fcjjjf',上:'fjj',午:'sjjf',下:'jfk',晚:'fcjjsefcjsu',安:'kdemsj',一:'j',二:'jj',三:'jjj',四:'fcsbj',五:'jfcj',六:'kjsk',七:'ju',八:'sl',九:'so',十:'jf',百:'jsfcjj',千:'sjf',您:'sfsegskdykk',
  在:'jsfjfj',吗:'fcjczj',进:'jjsfkal',坐:'skskjfj',谢:'kpsfrjjjsjgk',最:'fcjjjffjjiel',近:'ssjfkal',怎:'sjfjjdykk',样:'jfskksjjjf',忙:'dkfkjb',呢:'fcjcjssu',不:'jsfk',太:'jslk',他:'sfrfu',困:'fcjfskj',渴:'kkifcjjsrskb',饿:'sehsjgiysk',累:'fcjfjnnkgsk',
  陈:'wfjngsk',们:'sfkfr',这:'kjskkal',那:'rjjswf',是:'fcjjjfjsl',谁:'kpsfkjjjfj',朋:'srjjsrjj',友:'jsel',刚:'frskfg',到:'jnkjfifg',北:'fjisu',京:'kjfcjgsk',贵:'fcjfjfcsk',哪:'fcjrjjswf',国:'fcjjfjkj',人:'sl',学:'kksdeegj',生:'sjjfj',习:'rki',汉:'kkiel',语:'kpjfcjfcj',美:'ksjjfjjsl',中:'fcjf',秘:'sjfskdyksk',鲁:'sefcjfjjfcjj',
  英:'jfffcjsl',德:'ssfjsfcffjjdykk',法:'kkijfjnk',日:'fcjj',本:'jfslj',西:'jfcsbj',班:'jjfidsjjfj',牙:'jngs',加:'rsfcj',拿:'sljfcjsjjg',大:'jsl',墨:'fcksjfjjdkkkjfj',哥:'jfcjfjfcjg',澳:'kkisfcksjfskjsl',利:'sjfskfg',亚:'jffksj',会:'sljjnk',说:'kpksfcjsu',俄:'sfsjgiysk',韩:'jffcjjjfjjrf',
  点:'fjfcjdkkk',心:'dykk',吃:'fcjsjo',爸:'skslcfju',海:'kkisjbrkjk',喜:'jfjfcjksjfcj',欢:'eksesl',米:'ksjfsl',饭:'sehssel',妈:'msjczj',面:'jsfcffjjj',条:'seljgsk',饺:'sehkjsksl',子:'egj',包:'srcju',小:'gsk',看:'sjjsfcjjj',都:'jfjsfcjjwf',要:'jfcffjmsj',和:'sjfskfcj',王:'jjfj',云:'jjnk',
  喝:'fcjfcjjsrskb',水:'gesl',茶:'jffsljgsk',咖:'fcjrsfcj',啡:'fcjfjjjfjjj',可:'jfcjg',乐:'sbgsk',牛:'sjjf',奶:'msjws',饮:'sehsesl',料:'ksjfskkkjf',果:'fcjjjfsl',汁:'kkijf',
  家:'kdejstsssl',有:'jsfrjj',几:'so',口:'fcj',的:'sfcjjsrk',照:'fcjjrsfcjdkkk',片:'sfjc',做:'sfjffcjsjsl',工:'jfj',作:'sfsjfjj',医:'jsjjskb',弟:'kscjzfs',共:'jffjsk',个:'slf',两:'jfrsksk',姐:'msjfcjjj',还:'jsfkkal',妹:'msjjjfsl',没:'kkisvel',狗:'stssrfcj',贝:'fcsk',张:'cjzsjhl',
  爷:'skslrf',外:'sekfk',公:'slnk',婆:'kkiesfelmsj',姥:'msjjfjssu',猫:'stsjfffcjfj',只:'fcjsk',真:'jffcjjjjsk',漂:'kkijfcffjjjgsk',亮:'kjfcjdeso',女:'msj',儿:'su',今:'slke',年:'sjjfjf',岁:'fbfsek',天:'jjsl',钢:'sjjjhfrsk',琴:'jjfjjjfjslke',课:'kpfcjjjfsl',孩:'egikjnssk',啊:'fcjwfjfcjg',陆:'wfjjfbf',雨:'jfrfkkkk',平:'jksjf',爱:'skksdejsel',男:'fcjfjrs',帅:'fsfrf',餐:'fjsekekslkcjjhsk',厅:'jsjg',去:'jfjnk',找:'jgijysk',弹:'cjzksfcjjjf',
};

// Names and Hanyu Pinyin follow the Unicode CJK Strokes catalog. When cnchar
// intentionally shares one code between two stroke variants, both documented
// names are shown instead of selecting one from the geometric direction.
const catalog: Record<string, VerifiedStrokeName> = {
  a: { hanzi: '横折折撇', pinyin: 'héngzhézhépiě' },
  b: { hanzi: '竖弯', pinyin: 'shùwān' },
  c: { hanzi: '横折', pinyin: 'héngzhé' },
  d: { hanzi: '点', pinyin: 'diǎn' },
  e: { hanzi: '横撇 / 横钩', pinyin: 'héngpiě / hénggōu' },
  f: { hanzi: '竖', pinyin: 'shù' },
  g: { hanzi: '竖钩', pinyin: 'shùgōu' },
  h: { hanzi: '竖提', pinyin: 'shùtí' },
  i: { hanzi: '提', pinyin: 'tí' },
  j: { hanzi: '横', pinyin: 'héng' },
  k: { hanzi: '点', pinyin: 'diǎn' },
  l: { hanzi: '捺', pinyin: 'nà' },
  m: { hanzi: '撇点', pinyin: 'piědiǎn' },
  n: { hanzi: '撇折', pinyin: 'piězhé' },
  o: { hanzi: '横斜钩', pinyin: 'héngxiégōu' },
  p: { hanzi: '横折提', pinyin: 'héngzhétí' },
  r: { hanzi: '横折钩', pinyin: 'héngzhégōu' },
  s: { hanzi: '撇', pinyin: 'piě' },
  t: { hanzi: '弯钩', pinyin: 'wāngōu' },
  u: { hanzi: '竖弯钩', pinyin: 'shùwāngōu' },
  v: { hanzi: '横折折 / 横折弯', pinyin: 'héngzhézhé / héngzhéwān' },
  w: { hanzi: '横折折折钩 / 横撇弯钩', pinyin: 'héngzhézhézhégōu / héngpiěwāngōu' },
  y: { hanzi: '斜钩 / 卧钩', pinyin: 'xiégōu / wògōu' },
  z: { hanzi: '竖折折钩', pinyin: 'shùzhézhégōu' },
};

export function strokeNamesForCharacter(character: string, strokeCount: number): Array<VerifiedStrokeName | null> {
  const sequence = sequences[character];
  if (!sequence || [...sequence].length !== strokeCount) return Array.from({ length: strokeCount }, () => null);
  return [...sequence].map((code) => catalog[code] ?? null);
}
