"use strict";
const $=s=>document.querySelector(s);
let media="threads", targetMode="auto";

/* ===== 媒体切り替え ===== */
document.querySelectorAll(".media-btn").forEach(b=>{
  b.addEventListener("click",()=>{
    document.querySelectorAll(".media-btn").forEach(x=>x.classList.remove("on"));
    document.querySelectorAll(".opt").forEach(x=>x.classList.remove("on"));
    b.classList.add("on");
    media=b.dataset.m;
    $("#opt-"+media).classList.add("on");
  });
});

/* ===== ターゲット切り替え ===== */
document.querySelectorAll(".toggle button").forEach(b=>{
  b.addEventListener("click",()=>{
    document.querySelectorAll(".toggle button").forEach(x=>x.classList.remove("on"));
    b.classList.add("on");
    targetMode=b.dataset.t;
    $("#target-field").style.display = targetMode==="manual" ? "block" : "none";
  });
});

/* ===== 入力の自動保存 ===== */
["wants","target"].forEach(id=>{
  const el=$("#"+id);
  el.value=localStorage.getItem("snspm2-"+id)||"";
  el.addEventListener("input",()=>localStorage.setItem("snspm2-"+id,el.value));
});

/* ===== ストーリーズ：日数自動計算 ===== */
function calcDays(){
  const s=$("#st-start").value, e=$("#st-event").value;
  const box=$("#st-calc");
  if(!s||!e){ box.classList.remove("show"); return null; }
  const start=new Date(s), event=new Date(e);
  const diff=Math.round((event-start)/86400000)+1;
  if(diff<1){ box.classList.add("show"); box.innerHTML="⚠ 開催日が開始日より前になっています"; return null; }
  const perday=parseInt($("#st-perday").value);
  box.classList.add("show");
  box.innerHTML=`投稿期間：<b>${diff}日間</b>（開催日当日を含む）× 1日${perday}枚 = 合計 <b>${diff*perday}枚</b>`;
  return diff;
}
["st-start","st-event","st-perday"].forEach(id=>$("#"+id).addEventListener("change",calcDays));

/* ===== 共通部品 ===== */
function getWants(){
  const raw=$("#wants").value.trim();
  if(!raw) return null;
  const lines=raw.split("\n").map(l=>l.trim()).filter(l=>l)
    .map(l=>l.replace(/^[・\-*●○]\s*/,""))
    .map(l=>"- "+l);
  return lines.join("\n");
}
function targetPart(){
  if(targetMode==="manual" && $("#target").value.trim()){
    return {desc:$("#target").value.trim(), auto:false};
  }
  return {desc:"[AIが最適なペルソナを設定]", auto:true};
}
function personaRule(auto){
  return auto
    ? "- 最初に、テーマと「やりたいこと」から最適なターゲットペルソナを1つ設定し、冒頭で「■ 設定ペルソナ：[年代・性別・悩み・状況]」として簡潔に提示してから本文を作成すること"
    : "";
}

/* ===== 媒体別ビルダー ===== */
function buildThreads(wants){
  const t=targetPart();
  const count=$("#th-count").value;
  const funnel=$("#th-funnel").value;
  const rules=[
    personaRule(t.auto),
    "- 各投稿は500字以内とすること",
    "- 1行目は必ずスクロールの指を止めるフックにすること（疑問形・意外な事実・数字のいずれかを使う）",
    "- エンゲージメントベイト（「いいねして」等の直接的な反応の要求）は使わないこと",
    "- ハッシュタグは使わないこと",
    "- 絵文字は1投稿につき2個まで",
    "- 誇大表現・効果の断定は避けること",
    "- 専門用語には短い言い換えを添えること"
  ].filter(r=>r).join("\n");
  return `あなたはThreadsの運用とSNSマーケティングのプロです。以下の「やりたいこと」をすべて満たすThreads投稿を${count}作成してください。

■ やりたいこと
${wants}

■ ターゲット
${t.desc}

■ 背景情報
- ファネル段階：${funnel}
- 投稿者は足・歩行・靴の専門知識を持つ発信者です

■ 制約条件
${rules}

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

function buildFeed(wants){
  const t=targetPart();
  const goal=$("#fd-goal").value;
  const url=$("#fd-url").value.trim();
  const rules=[
    personaRule(t.auto),
    "- 文体は「です・ます」調の専門的かつ親しみやすいトーン",
    "- キャプション本文は150〜250字以内",
    "- 冒頭1文はユーザーの興味を引くフックにすること",
    "- 伝えるベネフィット・特徴は3点以内に絞ること",
    "- ハッシュタグは末尾に5〜8個まとめて記載すること",
    "- 絵文字は使用しないこと",
    "- 誇大表現・断定的な効果保証の表現は避けること"
  ].filter(r=>r).join("\n");
  return `あなたはSNSマーケティングと日本語コピーライティングのプロです。以下の「やりたいこと」をすべて満たすInstagramフィード投稿のキャプションを作成してください。

■ やりたいこと
${wants}

■ ターゲット
${t.desc}

■ 背景情報
- 投稿の目的：${goal}${url?`\n- 参考URL：${url}（内容を確認して反映してください）`:""}

■ 制約条件
${rules}

【出力形式】
キャプション本文→空行→ハッシュタグの順で出力してください。説明や前置きは不要です。

【出力例】
[フックとなる冒頭文]
[ベネフィットを含む本文]
[行動を促す一文]

#ハッシュタグ1 #ハッシュタグ2 …`;
}

function buildStory(wants){
  const t=targetPart();
  const days=calcDays();
  const perday=$("#st-perday").value;
  const cta=$("#st-cta").value;
  const startD=$("#st-start").value.replace(/-/g,"/");
  const eventD=$("#st-event").value.replace(/-/g,"/");
  const period = days
    ? `${startD}（開始）〜 ${eventD}（開催日）の${days}日間`
    : "[開始日]〜[開催日]の[◯]日間";
  const rules=[
    personaRule(t.auto),
    "- 1枚あたりのテキストは50字以内（スマホで2秒で読める量）",
    "- 各日の1枚目は次をタップしたくなるフックにすること",
    "- 各枚に「画面に載せるテキスト」と「演出・素材の指示」を分けて書くこと",
    "- 日が進むにつれて「気づき→共感→価値提示→申込」と心理段階を進めること",
    "- 開催日が近づくほど緊急性・限定性を高めること（ただし煽りすぎないこと）",
    `- 最終日は必ず「${cta}」のアクションで締めること`,
    "- 絵文字は各枚2個まで",
    "- 誇大表現は避けること"
  ].filter(r=>r).join("\n");
  return `あなたはInstagramストーリーズの構成とセミナー集客のプロです。以下の「やりたいこと」をすべて満たすストーリーズの投稿スケジュールを作成してください。

■ やりたいこと
${wants}

■ ターゲット
${t.desc}

■ 背景情報
- 投稿期間：${period}
- 1日あたり${perday}投稿（期間合計${days?days*parseInt(perday)+"枚":"[合計枚数]"}）
- 最終ゴール：${cta}

■ 制約条件
${rules}

【出力形式】
日ごとに以下の形式で出力してください。
---
◯日目（[日付]）テーマ：[その日のテーマ]
1枚目
テキスト：[画面に載せる文字]
演出：[背景・スタンプ・素材の指示]
2枚目
…
---

【出力例】
---
1日目（${startD||"[日付]"}）テーマ：問題提起で興味を引く
1枚目
テキスト：その靴、あと1年で足を変形させるかも
演出：足元の写真背景＋テキストは画面中央に大きく
---`;
}

function buildNote(wants){
  const t=targetPart();
  const len=$("#nt-len").value;
  const type=$("#nt-type").value;
  const rules=[
    personaRule(t.auto),
    "- タイトル案を3つ提示すること（クリックしたくなるが釣りすぎないもの）",
    "- 導入は読者の悩みへの共感から始めること",
    "- 見出し（##）で構成を区切り、1見出しあたり400〜600字を目安にすること",
    "- 専門用語には短い説明を添えること",
    "- 誇大表現・効果の断定は避けること",
    "- まとめでは要点の整理と次の行動の提案を入れること",
    type.includes("有料")?"- 無料部分と有料部分の境界を明示し、無料部分の最後に「続きを読みたくなる引き」を作ること":""
  ].filter(r=>r).join("\n");
  return `あなたはNoteでの発信と読まれる記事構成のプロの編集者です。以下の「やりたいこと」をすべて満たすNote記事（${type}）を作成してください。

■ やりたいこと
${wants}

■ ターゲット
${t.desc}

■ 背景情報
- 記事の長さ：${len}
- 記事タイプ：${type}
- 筆者は足・歩行・靴の専門知識を持つ発信者です

■ 制約条件
${rules}

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

/* ===== 生成・コピー ===== */
$("#btn-gen").addEventListener("click",()=>{
  const wants=getWants();
  if(!wants){ alert("「やりたいこと」を箇条書きで入力してください"); return; }
  if(media==="story" && !calcDays() && ($("#st-start").value||$("#st-event").value)){
    alert("投稿開始日と開催日を確認してください（開催日が開始日より前になっています）"); return;
  }
  const text=BUILDERS[media](wants);
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
