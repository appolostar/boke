# 回声 ECHOES — 播客网站

纯静态站点，没有框架、没有构建步骤。三个文件就能跑：

```
index.html   结构
styles.css   样式（配色、字号、间距都在最上面的 :root 里）
app.js       站点信息 + 节目单 + 播放器逻辑
assets/      封面图 / 音频放这里
```

## 本地预览

直接双击 `index.html` 就能看。想要更接近线上效果，在这个目录开个终端：

```powershell
python -m http.server 8080
# 然后浏览器打开 http://localhost:8080
```

（`file://` 打开时，音频如果放的是本地相对路径会有跨域限制，用本地服务器最稳。）

## 改内容

### 换名字、标语
`app.js` 最上面：

```js
const SITE = {
  brand: "回声 ECHOES",
  title: "把<em>说不出口</em>的话，录下来。",   // 支持 HTML，<em> 里是金色斜体
  lede: "一档在深夜录的播客……",
};
```

### 加一期节目
`app.js` 里的 `EPISODES` 数组，**新版放最上面**：

```js
{
  n: 13,                        // 期号
  title: "标题",
  date: "2026-11-12",
  duration: "46:20",            // 只用于列表显示
  desc: "一句话简介，显示在「最新一期」那块。",
  audio: "assets/audio/ep13.mp3",  // 留空 = 显示「音频待上传」，点了不会报错
}
```

音频文件放 `assets/audio/`，用英文或数字命名，别带空格和中文（免得 URL 编码出问题）。
文件大的话考虑上传到对象存储 / 播客托管平台（小宇宙、Fireside、Buzzsprout 之类），
这里直接填它们的 mp3 外链也行。

### 换封面
现在的封面是 CSS 渐变 + 期号数字，不需要图片。
要换成真图的话，把 `.cover` 的 `background` 改成 `background-image:url(...)` 就行。

## 部署到 GitHub Pages

仓库建好后，在 `Settings → Pages` 里把 Source 选成 `Deploy from a branch`、
分支 `main`、目录 `/ (root)`。等一分钟，地址是：

```
https://<你的用户名>.github.io/<仓库名>/
```

如果站点要放在根域名下（比如 `https://podcast.example.com`），建一个 `CNAME` 文件，
里面只写一行域名，然后在域名商那边加 CNAME 解析指向 `<用户名>.github.io`。

> 注意：GitHub Pages 对单个文件 100MB、仓库 1GB 有软限制。音频多的话建议走外部托管。

## 已经留好的位置

- 订阅入口（Apple Podcasts / 小宇宙 / Spotify / 网易云 / RSS）：`index.html` 里的 `.subs`，
  现在是占位链接，填上真地址即可。
- 关于页的主播名、邮箱：`index.html` 的 `.facts`。
- 社交分享用的 `og:image`：现在指向 `assets/og.png`，放一张 1200×630 的图进去。
