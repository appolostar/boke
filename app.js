/* =========================================================
   1. 站点信息 —— 改这里就能换名字、标语
   ========================================================= */
const SITE = {
  brand: "回声 ECHOES",
  title: '把<em>说不出口</em>的话，录下来。',
  lede: '一档在深夜录的播客。没有脚本，也不太剪辑——聊人，聊手艺，聊那些白天大家都装作没空说的事。戴上耳机，慢一点。',
};

/* =========================================================
   2. 节目单 —— 新版放最上面
   audio: 音频地址。相对路径写 "assets/audio/ep12.mp3"，
          也可以直接填外链。留空则显示「音频待上传」。
   ========================================================= */
const EPISODES = [
  {
    n: 12,
    title: "我们为什么害怕安静",
    date: "2026-11-05",
    duration: "48:12",
    desc: "把手机放在另一个房间的第一晚，我在沙发上坐了四十分钟。这期聊习惯性的人群依赖，以及重新学会一个人待着。",
    audio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
  },
  {
    n: 11,
    title: "手艺人不会消失，只是变贵了",
    date: "2026-10-29",
    duration: "52:40",
    desc: "见了一位做了三十年木工的师傅。他说现在年轻人不是不想学，是等不起。",
    audio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
  },
  { n: 10, title: "凌晨三点的便利店", date: "2026-10-22", duration: "39:05",
    desc: "一个夜班店员、一个刚下飞机的旅客，和一份关东煮。城市最诚实的地方往往在深夜。", audio: "" },
  { n: 9, title: "被夸「情绪稳定」是什么感觉", date: "2026-10-15", duration: "44:18",
    desc: "稳定有时候是能力，有时候只是不想麻烦别人。这期我们不太客气地聊了聊这件事。", audio: "" },
  { n: 8, title: "关于辞职，我准备了两年", date: "2026-10-08", duration: "56:33",
    desc: "不是冲动，也不是勇敢。把所有退路算完之后，还是决定走。", audio: "" },
  { n: 7, title: "我妈开始用表情包了", date: "2026-10-01", duration: "41:27",
    desc: "代沟在消失，还是我们只是学会了互相敷衍？这期聊和父母重新相处的笨拙。", audio: "" },
  { n: 6, title: "旅行不是逃跑", date: "2026-09-24", duration: "37:52",
    desc: "一个人去了趟西北，八天没发朋友圈。回来后想清楚了几件事。", audio: "" },
  { n: 5, title: "那些没被听懂的玩笑", date: "2026-09-17", duration: "45:10",
    desc: "幽默是防御机制，也是试探。我们复盘了几次尴尬的沉默。", audio: "" },
  { n: 4, title: "深夜厨房", date: "2026-09-10", duration: "33:44",
    desc: "一个人做饭给自己吃，是件很郑重的事。", audio: "" },
  { n: 3, title: "朋友是阶段性的吗", date: "2026-09-03", duration: "49:02",
    desc: "有些人不联系了，但没有矛盾。这期聊聊成年人的散场。", audio: "" },
  { n: 2, title: "怎么和失眠讲和", date: "2026-08-27", duration: "42:56",
    desc: "不数羊，不看表。把睡不着当成一天里多出来的一段时间。", audio: "" },
  { n: 1, title: "第一期：先随便聊聊", date: "2026-08-20", duration: "28:15",
    desc: "为什么要做这档节目，以及我们想在这里留下什么。", audio: "" },
];

/* =========================================================
   3. 下面一般不用动
   ========================================================= */
const $ = (s) => document.querySelector(s);
const audio = $("#audio");
const list = $("#epList");

const PLAY_ICON = '<svg class="i-play" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>';
const PAUSE_ICON = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M7 5h4v14H7zM13 5h4v14h-4z"/></svg>';

/* ---- 文案注入 ---- */
$("#brandName").textContent = SITE.brand;
$("#heroTitle").innerHTML = SITE.title;
$("#heroLede").textContent = SITE.lede;
$("#year").textContent = new Date().getFullYear();
document.title = SITE.brand + " · 一档说话的节目";

/* ---- 统计 ---- */
$("#statCount").textContent = EPISODES.length;
$("#epCount").textContent = EPISODES.length + " EPISODES";
const totalMin = EPISODES.reduce((a, e) => {
  const [m, s] = e.duration.split(":").map(Number);
  return a + m + s / 60;
}, 0);
$("#statHours").textContent = Math.floor(totalMin / 60) + " 小时 " + Math.round(totalMin % 60) + " 分";

/* ---- 最新一期 ---- */
const latest = EPISODES[0];
$("#stageTitle").textContent = latest.title;
$("#stageDesc").textContent = latest.desc;
$("#stageNum").textContent = latest.n;
$("#stageCover").style.setProperty("--h", hueOf(0));
$("#stageMeta").textContent = "EP." + pad(latest.n) + " · " + latest.date + " · " + latest.duration;
$("#pNum").textContent = latest.n;
$("#pCover").style.setProperty("--h", hueOf(0));
$("#pTitle").textContent = "选一期开始听";

function pad(n) { return String(n).padStart(2, "0"); }
function hueOf(i) { return (34 + i * 47) % 360; }

/* ---- 渲染列表 ---- */
EPISODES.forEach((ep, i) => {
  const row = document.createElement("div");
  row.className = "ep";
  row.dataset.i = i;
  row.style.setProperty("--h", hueOf(i));
  row.innerHTML = `
    <span class="ep-idx">${pad(ep.n)}</span>
    <div class="ep-main">
      <p class="ep-title">
        <span>${ep.title}</span>
        <span class="bars"><i></i><i></i><i></i><i></i></span>
      </p>
      <div class="ep-sub"><span>${ep.date}</span><i>·</i><span>${ep.duration}</span><i>·</i><span>${ep.audio ? "可直接收听" : "音频待上传"}</span></div>
    </div>
    <button class="ep-btn" aria-label="播放 ${ep.title}">${PLAY_ICON}</button>
  `;
  row.addEventListener("click", () => toggleIndex(i));
  list.appendChild(row);
});

const rows = [...list.querySelectorAll(".ep")];
let cur = -1;
let playing = false;

/* ---- 播放器 ---- */
function setTrack(i, autoplay) {
  const ep = EPISODES[i];
  cur = i;
  $("#pTitle").textContent = ep.title;
  $("#pSub").textContent = "EP." + pad(ep.n) + " · " + ep.date;
  $("#pNum").textContent = ep.n;
  $("#pCover").style.setProperty("--h", hueOf(i));
  rows.forEach((r, k) => r.classList.toggle("is-playing", k === i && playing));

  if (!ep.audio) {
    audio.removeAttribute("src");
    audio.load();
    $("#tDur").textContent = "00:00";
    $("#tCur").textContent = "00:00";
    setProgress(0);
    return;
  }
  audio.src = ep.audio;
  audio.load();
  if (autoplay) play();
  if ("mediaSession" in navigator) {
    navigator.mediaSession.metadata = new MediaMetadata({
      title: ep.title, artist: SITE.brand, album: "EP." + pad(ep.n),
    });
  }
}

function play() {
  if (cur < 0) { setTrack(0, true); return; }
  if (!EPISODES[cur].audio) {
    // 没上传音频：安静地提示一下，不弹窗
    $("#pSub").textContent = "这一期的音频还没放上来";
    return;
  }
  audio.play().then(() => {
    playing = true;
    paint();
  }).catch(() => { playing = false; paint(); });
}
function pause() { audio.pause(); playing = false; paint(); }

function toggleIndex(i) {
  if (i === cur && playing) { pause(); return; }
  if (i === cur && !playing) { play(); return; }
  playing = true;
  setTrack(i, true);
}

function paint() {
  $("#ppIcon").outerHTML = playing
    ? '<svg id="ppIcon" viewBox="0 0 24 24" fill="currentColor"><path d="M7 5h4v14H7zM13 5h4v14h-4z"/></svg>'
    : '<svg id="ppIcon" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>';
  rows.forEach((r, k) => {
    r.classList.toggle("is-playing", k === cur && playing);
    const btn = r.querySelector(".ep-btn");
    if (k === cur && playing) btn.innerHTML = PAUSE_ICON;
    else btn.innerHTML = PLAY_ICON;
  });
}

$("#playPause").addEventListener("click", () => (playing ? pause() : play()));
$("#heroPlay").addEventListener("click", () => {
  playing = true;
  setTrack(0, true);
  document.getElementById("episodes").scrollIntoView({ behavior: "smooth", block: "start" });
});
$("#stagePlay").addEventListener("click", () => toggleIndex(0));
$("#prev").addEventListener("click", () => setTrack(cur <= 0 ? EPISODES.length - 1 : cur - 1, true));
$("#next").addEventListener("click", () => setTrack(cur >= EPISODES.length - 1 ? 0 : cur + 1, true));

audio.addEventListener("play", () => { playing = true; paint(); });
audio.addEventListener("pause", () => { playing = false; paint(); });
audio.addEventListener("ended", () => {
  if (cur < EPISODES.length - 1) setTrack(cur + 1, true);
  else { playing = false; paint(); }
});
audio.addEventListener("timeupdate", () => {
  if (!audio.duration || !isFinite(audio.duration)) return;
  setProgress(audio.currentTime / audio.duration);
  $("#tCur").textContent = fmt(audio.currentTime);
  $("#tDur").textContent = fmt(audio.duration);
});
audio.addEventListener("loadedmetadata", () => {
  $("#tDur").textContent = fmt(audio.duration);
});
audio.addEventListener("error", () => {
  $("#pSub").textContent = "音频加载失败，检查一下地址";
});

function setProgress(ratio) {
  const seek = $("#seek");
  const v = Math.round(ratio * 1000);
  seek.value = v;
  seek.style.setProperty("--p", (ratio * 100) + "%");
}
$("#seek").addEventListener("input", (e) => {
  const ratio = e.target.value / 1000;
  e.target.style.setProperty("--p", ratio * 100 + "%");
  if (audio.duration && isFinite(audio.duration)) audio.currentTime = ratio * audio.duration;
});

const SPEEDS = [1, 1.25, 1.5, 1.75, 2, 0.75];
let si = 0;
$("#speed").addEventListener("click", () => {
  si = (si + 1) % SPEEDS.length;
  audio.playbackRate = SPEEDS[si];
  $("#speed").textContent = (SPEEDS[si] === 1 ? "1" : SPEEDS[si]) + "×";
});

$("#vol").addEventListener("input", (e) => {
  audio.volume = e.target.value / 100;
  e.target.style.setProperty("--p", e.target.value + "%");
});
$("#vol").style.setProperty("--p", "100%");

document.addEventListener("keydown", (e) => {
  if (e.target.matches("input")) return;
  if (e.code === "Space") { e.preventDefault(); playing ? pause() : play(); }
  if (e.code === "ArrowRight" && audio.duration) audio.currentTime = Math.min(audio.duration, audio.currentTime + 15);
  if (e.code === "ArrowLeft") audio.currentTime = Math.max(0, audio.currentTime - 15);
});

function fmt(t) {
  if (!isFinite(t)) return "00:00";
  const m = Math.floor(t / 60);
  const s = Math.floor(t % 60);
  return pad(m) + ":" + pad(s);
}

/* ---- 入场动画 ---- */
const io = new IntersectionObserver((es) => {
  es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
}, { threshold: 0.12 });
document.querySelectorAll(".rv").forEach((el) => io.observe(el));

/* ---- 占位链接：点了给个提示，不跳走 ---- */
document.querySelectorAll("[data-todo]").forEach((a) => {
  const original = a.textContent;
  a.addEventListener("click", (ev) => {
    ev.preventDefault();
    a.textContent = "链接待配置";
    setTimeout(() => (a.textContent = original), 1600);
  });
});
