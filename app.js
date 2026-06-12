"use strict";
const $=s=>document.querySelector(s);
let media="threads";

/* 媒体切り替え */
document.querySelectorAll(".media-btn").forEach(b=>{
  b.addEventListener("click",()=>{
    document.querySelectorAll(".media-btn").forEach(x=>x.classList.remove("on"));
    document.querySelectorAll(".opt").forEach(x=>x.classList.remove("on"));
    b.classList.add("on");
    media=b.dataset.m;
    $("#opt-"+media).classList.add("on");
  });
});

/* 入力の自動保存・復元 */
const FIELDS=["theme","target","bg"];
FIELDS.forEach(id=>{
  const el=$("#"+id);
  el.value=localStorage.getItem("snspm-"+id)||"";
  el.addEventListener("input",()=>localStorage.setItem("snspm-"+id,el.value));
});

/* ===== プロンプト生成 ===== */
function commonParts(){
  const theme=$("#theme").value.trim();
  const target=$("#target").value.trim()||"このテーマに関心のある一般の読者";
  const bg=$("#bg").value.trim();
  return {theme,target,bg};
}

function buildThreads(){
  const {theme,target,bg}=commonParts();
  const count=$("#th-count").value;
  const funnel=$("#th-funnel").value;
  return `あなたはThreadsの運用とSNSマーケティングのプロです。以下のテーマでThreads投稿を${count}作成してください。

■ 目的
「${theme}」について、${target}に届く投稿を作り、${funnel.replace(/（.*）/,"")}の段階を進めることがゴールです。

■ 背景情報
${bg||"[補足があればここに記載]"}
- ファネル段階：${funnel}
- 投稿者は足・歩行・靴の専門知識を持つ発信者です

■ 制約条件
- 各投稿は500字以内とすること
- 1行目は必ずスクロールの指を止めるフックにすること（疑問形・意外な事実・数字のいずれかを使う）
- エンゲージメントベイト（「いいねして」等の直接的な反応の要求）は使わないこと
- ハッシュタグは使わないこと
- 絵文字は1投稿につき2個まで
- 誇大表現・効果の断定は避けること
- 専門用語には短い言い換えを添えること

【出力形式】
投稿ごとに以下の形式で出力してください。
---
投稿◯（フックタイプ：[種類]／狙い：[一言]）
[本文]
---

【出力例】
---
投稿1（フックタイプ：意外な事実／狙い：保存を促す）
靴のサイズ、実は夕方に測るのが正解です。
[本文の続き…]
---`;
}

function buildFeed(){
  const {theme,target,bg}=commonParts();
  const goal=$("#fd-goal").value;
  const url=$("#fd-url").value.trim();
  return `あなたはSNSマーケティングと日本語コピーライティングのプロです。以下のテーマでInstagramフィード投稿のキャプションを作成してください。

■ 目的
「${theme}」について、${target}に向けたキャプションを作成し、「${goal}」を達成することがゴールです。

■ 背景情報
${bg||"[補足があればここに記載]"}${url?`\n- 参考URL：${url}（内容を確認して反映してください）`:""}

■ 制約条件
- 文体は「です・ます」調の専門的かつ親しみやすいトーン
- キャプション本文は150〜250字以内
- 冒頭1文はユーザーの興味を引くフックにすること
- 伝えるベネフィット・特徴は3点以内に絞ること
- ハッシュタグは末尾に5〜8個まとめて記載すること
- 絵文字は使用しないこと
- 誇大表現・断定的な効果保証の表現は避けること

【出力形式】
キャプション本文→空行→ハッシュタグの順で出力してください。説明や前置きは不要です。

【出力例】
[フックとなる冒頭文]
[ベネフィットを含む本文]
[行動を促す一文]

#ハッシュタグ1 #ハッシュタグ2 …`;
}

function buildStory(){
  const {theme,target,bg}=commonParts();
  const count=$("#st-count").value;
  const cta=$("#st-cta").value;
  return `あなたはInstagramストーリーズの構成と視聴維持のプロです。以下のテーマでストーリーズ${count}構成を作成してください。

■ 目的
「${theme}」について、${target}が最後まで見たくなる${count}構成を作り、最終枚で「${cta}」につなげることがゴールです。

■ 背景情報
${bg||"[補足があればここに記載]"}

■ 制約条件
- 1枚あたりのテキストは50字以内（スマホで2秒で読める量）
- 1枚目は次をタップしたくなるフックにすること
- 各枚に「画面に載せるテキスト」と「演出・素材の指示」を分けて書くこと
- 最終枚は必ず「${cta}」のアクションで締めること
- 絵文字は各枚2個まで
- 誇大表現は避けること

【出力形式】
枚数ごとに以下の形式で出力してください。
---
◯枚目
テキスト：[画面に載せる文字]
演出：[背景・スタンプ・素材の指示]
---

【出力例】
---
1枚目
テキスト：その靴、あと1年で足を変形させるかも
演出：足元の写真背景＋テキストは画面中央に大きく
---`;
}

function buildNote(){
  const {theme,target,bg}=commonParts();
  const len=$("#nt-len").value;
  const type=$("#nt-type").value;
  return `あなたはNoteでの発信と読まれる記事構成のプロの編集者です。以下のテーマでNote記事（${type}）を作成してください。

■ 目的
「${theme}」について、${target}に最後まで読まれる${len.replace(/（.*）/,"")}の記事を作成することがゴールです。

■ 背景情報
${bg||"[補足があればここに記載]"}
- 記事タイプ：${type}
- 筆者は足・歩行・靴の専門知識を持つ発信者です

■ 制約条件
- タイトル案を3つ提示すること（クリックしたくなるが釣りすぎないもの）
- 導入は読者の悩みへの共感から始めること
- 見出し（##）で構成を区切り、1見出しあたり400〜600字を目安にすること
- 専門用語には短い説明を添えること
- 誇大表現・効果の断定は避けること
- まとめでは要点の整理と次の行動の提案を入れること${type.includes("有料")?"\n- 無料部分と有料部分の境界を明示し、無料部分の最後に「続きを読みたくなる引き」を作ること":""}

【出力形式】
Markdown形式で、タイトル案→本文（見出し付き）→まとめの順に出力してください。

【出力例】
# タイトル案
1. [案1]
2. [案2]
3. [案3]

# 本文
[導入：共感から始まる書き出し]
## [見出し1]
[本文…]`;
}

const BUILDERS={threads:buildThreads,feed:buildFeed,story:buildStory,note:buildNote};

$("#btn-gen").addEventListener("click",()=>{
  if(!$("#theme").value.trim()){ alert("テーマ・キーワードを入力してください"); return; }
  const text=BUILDERS[media]();
  const out=$("#output");
  out.textContent=text;
  out.classList.remove("empty");
  $("#charinfo").textContent="約"+text.length.toLocaleString()+"字";
});

$("#btn-copy").addEventListener("click",async()=>{
  const out=$("#output");
  if(out.classList.contains("empty")){ alert("先にプロンプトを生成してください"); return; }
  try{
    await navigator.clipboard.writeText(out.textContent);
  }catch(e){
    const r=document.createRange(); r.selectNodeContents(out);
    const sel=getSelection(); sel.removeAllRanges(); sel.addRange(r);
    document.execCommand("copy"); sel.removeAllRanges();
  }
  const b=$("#btn-copy");
  b.textContent="コピーしました ✓"; b.classList.add("ok");
  setTimeout(()=>{ b.textContent="コピー"; b.classList.remove("ok"); },1800);
});
