# DiveMap

潛水地圖 PWA —— 單一 HTML 檔案的網頁應用，收錄全球各國潛點資料，並整合 AI 行程規劃、船宿路線、即時天氣。

**線上網址**：https://divemap8000.netlify.app/

---

## 專案架構

- 網站主體是一個檔案：`index.html`（HTML + CSS + JavaScript 全部寫在同一個檔案裡，沒有建置流程）
- 另外還有 PWA（漸進式網頁應用）所需的支援檔案，讓使用者可以在手機上「加入主畫面」、像 App 一樣全螢幕使用：
  - `manifest.json`：App 名稱、圖示、顯示模式設定
  - `sw.js`：Service Worker，提供離線快取（採用 network-first 策略，有網路時永遠抓最新版本，只有離線時才用快取，避免使用者被舊版本卡住）
  - `icons/` 資料夾：各尺寸的 App 圖示
- 地圖引擎使用 [Leaflet.js](https://leafletjs.com/)，底圖是 Esri 衛星影像圖磚
- 潛點資料庫直接寫死在 JS 裡（`COUNTRIES`、`ISLANDS`、`SITES`、`ROUTES` 幾個變數）
- 天氣資料即時呼叫 [Open-Meteo](https://open-meteo.com/) 免費 API

**檔案結構（上傳到 GitHub 時要維持這個資料夾結構）**：
```
divemap/
├── index.html
├── manifest.json
├── sw.js
└── icons/
    ├── icon-192.png
    ├── icon-512.png
    ├── icon-maskable-512.png
    ├── apple-touch-icon.png
    ├── favicon-32.png
    └── favicon-16.png
```

## 部署方式

- **GitHub repo**：https://github.com/diowu8000/divemap
- **Netlify** 已連接這個 repo，設定為自動部署：只要 repo 裡的 `index.html` 有更新，Netlify 會自動偵測並重新部署，通常 1-2 分鐘內上線

---

## 🔄 如何更新網站

每次拿到新版本的 `index.html`（例如請 Claude 修 bug 或新增潛點資料後），照以下步驟更新：

1. 打開 repo 頁面：https://github.com/diowu8000/divemap
2. 點進去現有的 `index.html` 檔案
3. 點右上角的 **鉛筆圖示（Edit this file）**
   - 或者用 **Add file → Upload files**，把新的 `index.html` 拖進去覆蓋
4. 檔名務必維持 **`index.html`**（大小寫、名稱都要一致），不要變成 `index (1).html` 這種，不然 Netlify 抓不到新內容
5. 下方 commit 訊息隨便填一句（例如 `update v69`），點綠色的 **Commit changes**
6. 等 1-2 分鐘，重新整理 https://divemap8000.netlify.app/ 確認新版本已生效（可以看網頁標題列的版本號確認，例如「DiveMap 基準版本 v69」）

就這樣，不需要任何指令、不需要安裝任何軟體。

**`manifest.json`、`sw.js`、`icons/` 這些 PWA 支援檔案通常不太會變動**，只有 `index.html` 會頻繁更新，所以平常更新只需要換 `index.html` 就好。除非之後我明確說「這次連圖示/manifest 也要更新」，才需要一併重新上傳那些檔案。

### 如果想確認部署狀態

Netlify 後台（[app.netlify.com](https://app.netlify.com/)，用一開始註冊時的 GitHub 帳號登入）可以看到每次部署的紀錄與狀態（成功/失敗/進行中）。

---

## 已知待辦

- 頂部統計文字「154 個已驗證潛點」是舊的寫死數字，實際資料庫已超過 480 筆，需要改成動態計算
- 目前資料庫尚未涵蓋：加拉巴哥群島、紅海
- 部分潛點座標信心度較低（僅依相對位置估算），詳見對話紀錄或 Notion SOP 頁面的座標驗證註記

## 未來規劃：App Store 上架

目前階段先做 PWA（低成本、免上架費、不用 Apple Developer 帳號），讓使用者可以「加入主畫面」像 App 一樣使用。

之後若要正式上架 App Store，因為現有架構是純前端網站，最務實的路徑是用 **Capacitor**（把現有網站包一層原生殼）而不是整個重寫成 Swift，可以延用這裡累積的所有程式碼與潛點資料庫。屆時需要：Apple Developer 帳號（$99/年）、Xcode、App Store 審核流程。
