/* =========================================================
   你要改的内容，全在 content.js 里。
   这个文件是播放器和页面逻辑，一般不用动。
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
  const [m, s] = String(e.duration).split(":").map(Number);
  return a + (m || 0) + (s || 0) / 60;
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
  const sub = [ep.date, ep.duration, ep.audio ? "可直接收听" : "音频待上传"]
    .filter(Boolean)
    .map((t) => `<span>${t}</span>`)
    .join('<i>·</i>');
  row.innerHTML = `
    <span class="ep-idx">${pad(ep.n)}</span>
    <div class="ep-main">
      <p class="ep-title">
        <span>${ep.title}</span>
        <span class="bars"><i></i><i></i><i></i><i></i></span>
      </p>
      <div class="ep-sub">${sub}</div>
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
  if ("mediaSession" in navigator && window.MediaMetadata) {
    navigator.mediaSession.metadata = new MediaMetadata({
      title: ep.title, artist: SITE.brand, album: "EP." + pad(ep.n),
    });
  }
}

function play() {
  if (cur < 0) { playing = true; setTrack(0, true); return; }
  if (!EPISODES[cur].audio) {
    $("#pSub").textContent = "这一期的音频还没放上来";
    return;
  }
  audio.play().then(() => { playing = true; paint(); }).catch(() => { playing = false; paint(); });
}
function pause() { audio.pause(); playing = false; paint(); }

function toggleIndex(i) {
  if (i === cur && playing) { pause(); return; }
  if (i === cur && !playing) { play(); return; }
  playing = true;
  setTrack(i, true);
}

function paint() {
  const icon = $("#ppIcon");
  if (icon) {
    icon.outerHTML = playing
      ? '<svg id="ppIcon" viewBox="0 0 24 24" fill="currentColor"><path d="M7 5h4v14H7zM13 5h4v14h-4z"/></svg>'
      : '<svg id="ppIcon" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>';
  }
  rows.forEach((r, k) => {
    r.classList.toggle("is-playing", k === cur && playing);
    r.querySelector(".ep-btn").innerHTML = (k === cur && playing) ? PAUSE_ICON : PLAY_ICON;
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
audio.addEventListener("loadedmetadata", () => { $("#tDur").textContent = fmt(audio.duration); });
audio.addEventListener("error", () => { $("#pSub").textContent = "音频加载失败，检查一下地址"; });

function setProgress(ratio) {
  const seek = $("#seek");
  seek.value = Math.round(ratio * 1000);
  seek.style.setProperty("--p", ratio * 100 + "%");
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
  return pad(Math.floor(t / 60)) + ":" + pad(Math.floor(t % 60));
}

/* ---- 入场动画 ---- */
const io = new IntersectionObserver((es) => {
  es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
}, { threshold: 0.12 });
document.querySelectorAll(".rv").forEach((el) => io.observe(el));

/* ---- 占位订阅链接：点了给个提示，不跳走 ---- */
document.querySelectorAll("[data-todo]").forEach((a) => {
  const original = a.textContent;
  a.addEventListener("click", (ev) => {
    ev.preventDefault();
    a.textContent = "链接待配置";
    setTimeout(() => (a.textContent = original), 1600);
  });
});
