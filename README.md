# FilmParameterRecord
# 底片拍攝參數紀錄網站說明文件

本文件旨在提供「底片拍攝參數紀錄」網站之程式碼結構、樣式設計、互動邏輯及漸進式網頁應用程式（PWA）實作方式之詳盡闡述。其目的在於提供一份全面且易於理解之指南，協助使用者深入探究本網站之各項組成要素及其運作原理。

## 1. 網站概述

「底片拍攝參數紀錄」網站係一款專為底片攝影愛好者所設計之輕量化工具。其核心目標在於提供一個**簡潔、直觀且高效**之使用者介面，俾利使用者於拍攝現場或後製階段，得以迅速且精確地記錄每次拍攝所涉之關鍵參數，諸如快門速度、光圈設定、搭配之鏡頭型號以及所用底片種類等。

本應用程式之設計理念係著重於**簡化傳統紀錄流程**，以規避紙本紀錄可能引致之繁瑣與遺失風險。透過數位化紀錄機制，使用者得以便捷地建立個人化之拍攝數據庫。此舉不僅有助於**回顧與分析每次拍攝之成功與失敗經驗**，更能成為未來創作之珍貴參考依據。舉例而言，藉由對不同參數組合下影像表現之深入分析，攝影師可更透徹地理解光線、景深與底片特性之間之複雜關係，進而**精進其拍攝技藝**並開拓嶄新之創作視野。此一數據驅動之學習模式，對於提升攝影師之專業能力具有顯著助益。

### 1.1 網站運作原理與實作方法

本網站之核心運作原理，乃基於現代網頁技術之整合應用，旨在實現數據之高效採集與管理，並提供優化之使用者體驗。其主要原理與實作方法闡述如下：

**1.1.1 前端介面與使用者互動原理 (HTML/CSS/JavaScript)**

*   **結構化數據輸入：** 網站前端採用 HTML5 語義化標籤建構表單，確保數據輸入欄位之清晰與邏輯性。快門與光圈參數透過 `<select>` 下拉選單提供預設選項，此舉不僅簡化使用者輸入，亦能有效避免數據格式錯誤。鏡頭與底片選項則以自定義樣式之單選按鈕呈現，提升視覺吸引力與操作直觀性。

*   **動態視覺回饋：** 透過 CSS3 偽元素 (`::before`) 與 JavaScript 類別操作 (`classList.add/remove`)，單選按鈕在選中時會動態顯示綠色指示條，提供即時且清晰之視覺回饋。此設計優於傳統瀏覽器預設樣式，增強了使用者介面之現代感與互動性。

*   **響應式佈局：** 網站採用媒體查詢 (Media Queries) 實現響應式設計。此原理允許 CSS 樣式根據使用者裝置之螢幕尺寸與解析度進行調整，確保無論在行動電話、平板電腦或桌上型電腦上，介面皆能自動適應並提供最佳之視覺呈現與操作體驗。此舉極大提升了網站之跨平台兼容性與可用性。

*   **表單提交機制：** 網站採用 JavaScript 的 `fetch` API 進行非同步表單提交。此原理避免了傳統表單提交導致的頁面重新載入，從而提供了更流暢、無中斷的使用者體驗。提交按鈕在數據發送過程中會被禁用並改變樣式，提供明確的處理中狀態指示，防止重複提交。

**1.1.2 數據儲存原理與實作方法 (Google Forms API)**

*   **無伺服器數據採集：** 本網站之數據儲存機制，巧妙地利用 Google 表單作為輕量級後端。此做法之核心原理在於將前端表單數據直接發送至預先設定之 Google 表單，而非依賴獨立之伺服器端應用程式。此舉顯著降低了系統部署與維護之複雜度及成本。

*   **`entry.id` 對應：** Google 表單中每個問題皆有其唯一之 `entry.id`。在實作上，JavaScript 會將前端表單各欄位（快門、光圈、鏡頭、底片）之數據，精確地對應至 Google 表單中相應問題之 `entry.id`。例如，快門數據將被附加至 `formData.append('entry.854732717', shutter)`，確保數據能正確地被 Google 表單接收與分類。

*   **跨域提交策略 (`mode: 'no-cors'`)：** 由於網站與 Google 表單位於不同網域，直接提交將觸發瀏覽器之跨域安全策略 (CORS)。為解決此問題，`fetch` 請求採用 `mode: 'no-cors'` 模式。此模式允許瀏覽器發送跨域請求，但基於安全考量，JavaScript 無法讀取服務器之響應內容或狀態碼。因此，本實作假設只要網路請求本身未發生錯誤，數據即已成功提交。此策略在無需複雜 CORS 配置或代理服務器之情況下，實現了數據之非同步提交。

**1.1.3 漸進式網頁應用程式 (PWA) 原理與實作方法**

*   **Service Worker 快取機制：** PWA 之離線可用性核心原理在於 Service Worker。`sw.js` 檔案作為一個在瀏覽器背景中運行之腳本，能夠攔截所有網路請求。其於 `install` 事件中預先快取網站之核心資源（HTML、CSS、圖標等），確保這些資源在網路不可用時仍能被訪問。此為實現離線體驗之基礎。

*   **快取更新與清理：** 透過 `CACHE_NAME` 版本控制與 `activate` 事件中之快取清理邏輯，Service Worker 能夠有效管理快取版本。當網站更新時，更新 `CACHE_NAME` 將觸發 Service Worker 刪除舊有快取並安裝新版本，確保使用者總是載入最新之網站內容，避免舊版本資源之殘留。

*   **離線優先策略：** `fetch` 事件監聽器實踐了「快取優先」策略。當使用者發出請求時，Service Worker 會首先嘗試從快取中獲取資源。若快取中存在，則立即返回；若無，則從網路獲取並將其快取以供未來使用。此策略確保了快速的載入速度和可靠的離線訪問。

*   **應用程式清單 (`manifest.json`)：** `manifest.json` 檔案提供了 PWA 的元數據，如應用程式名稱、簡短名稱、圖標、起始 URL 和顯示模式 (`standalone`)。瀏覽器解析此文件後，將提供「添加到主螢幕」的安裝提示，使網站具備原生應用程式的外觀和行為，例如移除瀏覽器地址欄，提供更沉浸式的體驗。

### 1.2 PWA 的其他優勢

*   **可安裝性：** 使用者可將本網站「安裝」至其裝置之主螢幕，使其呈現與操作體驗皆與原生應用程式無異，進而提供更為迅速之啟動體驗。此功能透過 Web App Manifest 檔案實現，使瀏覽器能提供「添加到主螢幕」或類似的安裝提示，提升使用者黏著度。

*   **離線可用性：** 透過 Service Worker 之快取機制，本網站之核心功能與內容可在無網路連線之情況下持續運作。此特性對於在戶外或網路連線不穩定之環境下進行拍攝紀錄之情境，尤顯其重要性。Service Worker 能夠預先快取關鍵資源，確保即使在離線狀態下，使用者仍能訪問網站並進行操作，極大提升了應用程式的可靠性。

*   **背景同步：** 儘管目前版本主要側重於即時數據提交，PWA 之架構已為未來實現背景數據同步奠定堅實基礎。此功能潛在應用包括在網路連線恢復後，自動提交離線狀態下所紀錄之數據，確保數據之完整性與即時性，無需使用者手動介入。

*   **響應式設計：** 本網站之使用者介面設計已充分考量不同螢幕尺寸與裝置類型（如行動電話、平板電腦、桌上型電腦）之適配性。此一設計策略確保了在任何裝置上均能提供最佳之視覺呈現與操作體驗，實現跨平台之無縫接軌。

數據之提交係透過背景非同步請求至 **Google 表單**完成。此方案提供了一種無需獨立後端伺服器即可儲存數據之便捷解決方案，顯著降低了應用程式之部署與維護複雜度。此種無伺服器架構不僅節省了資源，亦提升了系統之可擴展性與穩定性。

## 2. HTML 結構 (`index.html`)

`index.html` 檔案構成整個網站之基礎骨架，其職責在於定義網頁之內容結構、引入外部資源（例如樣式表與 JavaScript 檔案），並囊括 PWA 相關之元數據。此檔案之組織與內容對於網頁之可訪問性、效能及搜尋引擎優化均具有決定性影響。

<details>
<summary>點擊展開/收合 index.html 程式碼</summary>

```html
<!DOCTYPE html>
<html lang="zh-Hant">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>底片拍攝參數紀錄</title>
    <link rel="icon" type="image/png" href="image/myicon.png"> <link rel="manifest" href="manifest.json">
    <meta name="theme-color" content="#2a2a2a">
    <link rel="apple-touch-icon" href="image/myicon.png">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">

    <style>
        /* ... CSS 樣式定義 ... */
    </style>
</head>
<body>
    <div class="main-record-card">
        <h1 class="card-title">底片拍攝參數紀錄</h1>
        <form id="filmDataForm">
            <div class="form-group">
                <label for="shutter">快門：</label>
                <select id="shutter" name="shutter" required>
                    <option value="1/4000s">1/4000s</option>
                    <option value="1/2000s">1/2000s</option>
                    <option value="1/1500s">1/1500s</option>
                    <option value="1/1000s">1/1000s</option>
                    <option value="1/750s">1/750s</option>
                    <option value="1/500s">1/500s</option>
                    <option value="1/350s">1/350s</option>
                    <option value="1/250s">1/250s</option>
                    <option value="1/180s">1/180s</option>
                    <option value="1/125s">1/125s</option>
                    <option value="1/90s">1/90s</option>
                    <option value="1/60s" selected>1/60s</option> <option value="1/45s">1/45s</option>
                    <option value="1/30s">1/30s</option>
                    <option value="1/20s">1/20s</option>
                    <option value="1/15s">1/15s</option>
                    <option value="1/10s">1/10s</option>
                    <option value="1/8s">1/8s</option>
                    <option value="1/6s">1/6s</option>
                    <option value="1/4s">1/4s</option>
                    <option value="1/3s">1/3s</option>
                    <option value="1/2s">1/2s</option>
                    <option value="0.7s">0.7s</option>
                    <option value="1s">1s</option>
                    <option value="1.5s">1.5s</option>
                    <option value="2s">2s</option>
                    <option value="3s">3s</option>
                    <option value="4s">4s</option>
                    <option value="6s">6s</option>
                    <option value="8s">8s</option>
                    <option value="10s">10s</option>
                    <option value="15s">15s</option>
                    <option value="20s">20s</option>
                    <option value="30s">30s</option>
                    <option value="B快門(bulb)">B快門(bulb)</option>
                </select>
            </div>
            <div class="form-group">
                <label for="aperture">光圈：</label>
                <select id="aperture" name="aperture" required>
                    <option value="f/1.8">f/1.8</option>
                    <option value="f/2.0">f/2.0</option>
                    <option value="f/2.5">f/2.5</option>
                    <option value="f/2.8" selected>f/2.8</option> <option value="f/3.5">f/3.5</option>
                    <option value="f/4.0">f/4.0</option>
                    <option value="f/5.6">f/5.6</option>
                    <option value="f/6.7">f/6.7</option>
                    <option value="f/8.0">f/8.0</option>
                    <option value="f/9.5">f/9.5</option>
                    <option value="f/11">f/11</option>
                    <option value="f/13">f/13</option>
                    <option value="f/16">f/16</option>
                    <option value="f/19">f/19</option>
                    <option value="f/22">f/22</option>
                </select>
            </div>
            <div class="form-group">
                <label>鏡頭：</label>
                <div class="radio-group" id="lensRadioGroup">
                    <div class="radio-option">
                        <input type="radio" id="lens1" name="lens" value="Canon EF 50mm f/1.8 STM" required checked>
                        <label for="lens1">Canon EF 50mm f/1.8 STM</label>
                    </div>
                    <div class="radio-option">
                        <input type="radio" id="lens2" name="lens" value="Nikon AF-S 35mm f/1.8G ED">
                        <label for="lens2">Nikon AF-S 35mm f/1.8G ED</label>
                    </div>
                </div>
            </div>
            <div class="form-group">
                <label>底片：</label>
                <div class="radio-group" id="filmRadioGroup">
                    <div class="radio-option">
                        <input type="radio" id="film1" name="film" value="Kodak Proimage 100" required checked>
                        <label for="film1">Kodak Proimage 100</label>
                    </div>
                    <div class="radio-option">
                        <input type="radio" id="film2" name="film" value="FUJIFILM Speed Film 400">
                        <label for="film2">FUJIFILM Speed Film 400</label>
                    </div>
                </div>
            </div>
        </form>
        <button type="submit" form="filmDataForm" class="submit-button" id="submitButton">提交紀錄</button>
        <div id="submissionMessage" class="submission-message"></div>
    </div>

    <footer>
        <p>Created with Google Forms & AI</p>
        <p>&copy; 2025 底片拍攝參數紀錄</p>
        <p>v5.8.1 </p>
    </footer>

    <script>
        // ... JavaScript 程式碼 ...
    </script>
</body>
</html>
```

</details>

**關鍵點之深入闡釋：**

*   **`<!DOCTYPE html>` 與 `<html lang="zh-Hant">`：** 此聲明明確指出文件符合 HTML5 標準，並指定內容語言為繁體中文，此舉不僅有助於瀏覽器之正確渲染，亦對搜尋引擎優化（SEO）產生積極影響，確保內容之可發現性與可訪問性。

*   **`<head>` 區塊：** 此區塊包含網頁之元數據及外部資源之引用，其內容雖不直接呈現於網頁介面，然對網頁之行為模式、效能表現及視覺呈現具有關鍵性作用。

    *   **`<meta charset="UTF-8" />`：** 此元標籤設定字符編碼為 UTF-8，此為全球通用之字符編碼標準，確保網頁能正確顯示多種語言文字，有效避免字符亂碼問題，提升內容之普適性。

    *   **`<meta name="viewport" content="width=device-width, initial-scale=1.0">`：** 此為響應式網頁設計之核心元素。其指示瀏覽器將視口寬度設定為設備之實際寬度，並將初始縮放比例設定為 1.0。此配置確保網頁內容在不同尺寸之設備上均能實現適應性縮放與優化顯示，從而提供一致且優良之使用者體驗。

    *   **`<title>底片拍攝參數紀錄</title>`：** 此標籤定義網頁於瀏覽器標籤頁、書籤或搜尋結果中顯示之標題，提供清晰之內容識別與導航指引。

    *   **`<link rel="icon" type="image/png" href="image/myicon.png">`：** 此連結設定網站之 Favicon（收藏夾圖標），此圖標將顯示於瀏覽器標籤頁、書籤列或桌面快捷方式中。`type="image/png"` 屬性明確指定圖標之 MIME 類型，確保瀏覽器正確解析。

    *   **PWA 相關 `meta` 標籤：** 這些標籤乃實現 PWA 功能之關鍵配置，對於提升網頁應用程式之原生體驗至關重要。

        *   **`<link rel="manifest" href="manifest.json">`：** 此為 PWA 架構之核心連結，指向 `manifest.json` 檔案。該檔案內含應用程式之關鍵元數據，諸如名稱、圖標、顯示模式等，為瀏覽器提供應用程式安裝與顯示之必要資訊。

        *   **`<meta name="theme-color" content="#2a2a2a">`：** 此元標籤建議瀏覽器於應用程式之使用者介面元素（例如地址欄或狀態列）採用指定之顏色。此舉通常與網站之主體色調保持一致，旨在提供更具沉浸感之視覺體驗，強化品牌識別度。

        *   **`<link rel="apple-touch-icon" href="image/myicon.png">`：** 此連結專為 iOS 設備設計，當使用者將網站添加至主螢幕時，此圖標將作為應用程式之圖標使用。其優化了 iOS 平台上的應用程式外觀。

        *   **`<meta name="apple-mobile-web-app-capable" content="yes">`：** 此元標籤指示 iOS 設備將網站視為一個獨立之應用程式，進而移除瀏覽器之標準使用者介面元素，提供近似全螢幕之原生應用程式體驗。

        *   **`<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">`：** 此設定調整 iOS 狀態列之樣式，使其呈現透明效果並與應用程式內容無縫融合，進一步提升視覺統一性與沉浸感。

*   **`<body>` 區塊：** 此區塊包含網頁所有可視之內容，為使用者直接互動之介面。

    *   **`<div class="main-record-card">`：** 此元素作為表單內容之主要容器，其應用卡片式設計，使內容在視覺上更為聚焦，提升使用者之注意力集中度。

    *   **`<h1 class="card-title">`：** 網站之主要標題，提供清晰之內容識別與主題闡明。

    *   **`<form id="filmDataForm">`：** 此表單元素包裹所有輸入控制項。`id="filmDataForm"` 屬性賦予 JavaScript 便捷操作表單之能力，包括數據提交與狀態重置。

    *   **`div class="form-group"`：** 此元素用於組織各個表單輸入欄位（包含標籤與輸入/選擇元素），此種結構化佈局有助於樣式之應用與間距之控制，提升表單之可讀性與美觀性。

    *   **`<label for="...">`：** 各表單元素之標籤。`for` 屬性與對應輸入元素之 `id` 建立關聯，此機制使得點擊標籤時，相關輸入框將自動獲得焦點，顯著提升使用者之操作便捷性與可訪問性。

    *   **`<select>` 元素：** 用於創建下拉選單，提供預定義選項供使用者選擇。

        *   `id` 與 `name` 屬性：此二屬性對於在 JavaScript 中獲取選定值以及在表單提交時識別數據具有關鍵作用。

        *   `required` 屬性：此屬性指示該欄位為必填項，確保數據輸入之完整性。

        *   **`<option value="..." selected>`：** 此標籤定義下拉選單中之各個選項。`value` 屬性為提交至後端之實際數據值，而 `selected` 屬性則明確設定該選項為預設選中項，優化使用者之初始體驗。

    *   **`div class="radio-group"`：** 此元素用於邏輯性地包裹一組相關之單選按鈕，確保其功能之互斥性。

    *   **`div class="radio-option"`：** 此元素用於自定義各單選選項之視覺外觀，包括邊框與背景，以提供更具吸引力之使用者介面。

    *   **`<input type="radio" ... checked>`：** 此為實際之單選按鈕控制項。`id` 屬性與 `label` 之 `for` 屬性建立關聯，而 `name` 屬性則確保在同一組單選按鈕中僅能選中一個選項。`checked` 屬性用於設定預設選中之選項。

    *   **`<button type="submit" form="filmDataForm" class="submit-button" id="submitButton">`：** 此按鈕用於觸發表單提交操作。`type="submit"` 屬性啟動表單提交機制，`form="filmDataForm"` 屬性將此按鈕與指定 ID 之表單關聯，而 `id="submitButton"` 則賦予 JavaScript 便捷操作此按鈕之能力。

    *   **`<div id="submissionMessage" class="submission-message">`：** 此元素專用於動態顯示表單提交後之成功或失敗訊息，為使用者提供即時之操作回饋。

*   **`<footer>` 區塊：** 此區塊包含網站之頁尾資訊，例如版權聲明與版本號，提供網站之基本歸屬與狀態資訊。

## 3. CSS 樣式 (`<style>` 標籤內)

CSS 樣式定義了網站之視覺呈現，涵蓋從全域設定至各個元件之細節。所有樣式均內嵌於 `index.html` 之 `<style>` 標籤中，此配置有助於簡化檔案管理與部署流程。

<details>
<summary>點擊展開/收合 CSS 樣式程式碼</summary>

```css
/* --- 1. 全域 & 基礎樣式 (Global & Base Styles) --- */
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box; /* 確保所有元素的內邊距和邊框都包含在寬高計算內 */
}
html {
    height: 100%; /* 確保 html 元素佔滿整個視口高度 */
}
body {
    background-color: #2a2a2a; /* 深灰色背景 */
    color: #FFFFFF; /* 白色文字 */
    font-family: sans-serif, "微軟正黑體"; /* 字體設定 */
    min-height: 100vh; /* 確保 body 至少佔滿整個視口高度 */
    display: flex;
    flex-direction: column; /* 垂直排列子元素 */
    justify-content: center; /* 垂直居中內容 */
    align-items: center; /* 水平居中內容 */
    padding: 20px; /* 頁面內邊距 */
}

/* --- 2. 主要卡片容器樣式 (Main Card Container Styles) --- */
.main-record-card {
    background-color: #3C3C3C; /* 卡片背景色 */
    border-radius: 20px; /* 圓角邊框 */
    padding: 30px; /* 卡片內邊距 */
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.6); /* 陰影效果，提升立體感 */
    max-width: 500px; /* 最大寬度 */
    width: 100%; /* 響應式寬度 */
    margin: auto; /* 水平居中 */
}
.card-title {
    text-align: center;
    font-size: 28px;
    margin-bottom: 30px;
    padding-bottom: 15px;
    border-bottom: 1px solid #555; /* 底部邊框作為分隔線 */
}

/* --- 3. 表單內容通用樣式 (Form Content Styles) --- */
.form-group {
    margin-bottom: 20px; /* 表單組之間的間距 */
}
.form-group label {
    display: block; /* 讓標籤獨佔一行 */
    margin-bottom: 8px; /* 標籤與輸入框的間距 */
    font-size: 18px;
    color: #E0E0E0;
    font-weight: bold;
}
.form-group select {
    width: 100%;
    padding: 12px;
    border: 1px solid #555;
    background-color: #2a2a2a;
    color: #fff;
    border-radius: 8px;
    font-size: 16px;
    transition: border-color 0.3s ease, box-shadow 0.3s ease;
    -webkit-appearance: none; /* 移除瀏覽器預設樣式 */
    -moz-appearance: none;
    appearance: none;
    /* 關鍵調整：將 SVG 箭頭方向反轉，使其向下 */
    background-image: url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23ffffff%22%20d%3D%22M287%2C197.9L159.2%2C69.2c-4.4-4.2-11.5-4.2-15.9%2C0L5.4%2C197.9c-4.4%2C4.2-4.4%2C11.5%2C0%2C15.7l15.8%2C15.7c4.4%2C4.2%2C11.5%2C4.2%2C15.9%2C0l106.9-102.8l106.9%2C102.8c4.4%2C4.2%2C11.5%2C4.2%2C15.9%2C0l15.8-15.7C291.4%2C209.4%2C291.4%2C202.1%2C287%2C197.9z%22%2F%3E%3C%2Fsvg%3E');
    background-repeat: no-repeat; /* 不重複背景圖片 */
    background-position: right 12px top 50%; /* 圖片位置 */
    background-size: 12px auto; /* 圖片大小 */
}
.form-group select:focus {
    outline: none; /* 移除聚焦時的預設外框 */
    border-color: #515BD4; /* 聚焦時的邊框顏色 */
    box-shadow: 0 0 0 3px rgba(81, 91, 212, 0.5); /* 聚焦時的陰影 */
}

/* 自定義單選按鈕樣式 */
.radio-option {
    position: relative; /* 相對定位，用於偽元素定位 */
    background-color: #2a2a2a;
    border: 1px solid #555; /* 預設邊框顏色 (不變色) */
    border-radius: 8px;
    margin-bottom: 10px;
    cursor: pointer;
    transition: background-color 0.3s ease, border-color 0.3s ease; /* 平滑過渡效果 */
    overflow: hidden; /* 確保綠色條不會溢出容器 */
    padding: 12px; /* 為選項內容提供基礎內邊距 */
}
/* 隱藏實際的單選按鈕 */
.radio-option input[type="radio"] {
    display: none;
}
/* 單選選項選中時的綠色左側條 (偽元素) */
.radio-option.selected::before {
    content: ''; /* 偽元素必須有 content 屬性 */
    position: absolute; /* 絕對定位，相對於 .radio-option */
    top: 50%; /* 頂部定位在父元素高度的 50% */
    transform: translateY(-50%); /* 向上移動自身高度的 50%，實現垂直居中 */
    left: 12px; /* 距離左邊框 12px 的間距，與 .radio-option 的 padding-left 相等 */
    width: 8px; /* 綠色條的寬度 */
    height: 24px; /* 固定高度，使其不會佔滿整個選項高度 */
    background-color: #00C300; /* 綠色背景 */
    border-radius: 2px; /* 輕微圓角，使邊角更柔和 */
    transition: all 0.3s ease; /* 所有屬性的平滑過渡 */
}
/* 修改單選按鈕標籤的樣式，為綠色條留出空間 */
.radio-option label {
    display: block; /* 讓標籤佔據整個選項區域，方便點擊 */
    cursor: pointer;
    color: #fff;
    font-size: 16px;
    position: relative; /* 相對定位，確保文字在偽元素之上 */
    z-index: 1; /* 確保文字在偽元素之上 */
    margin-bottom: 0; /* 移除預設的底部外邊距 */
    /* 計算左側內邊距：12px (radio-option 的左內邊距) + 8px (綠色條寬度) + 10px (綠色條與文字間距) = 30px */
    padding: 0 0 0 30px; /* 僅調整左側內邊距，其他方向由 .radio-option 的 padding 控制 */
}

/* 提交按鈕樣式 */
.submit-button {
    width: 100%;
    padding: 15px;
    border: none;
    border-radius: 8px;
    background-color: #4F4F4F; /* 預設背景色 */
    color: #fff;
    font-size: 18px;
    cursor: pointer;
    transition: background-color 0.3s ease, transform 0.2s ease; /* 懸停和點擊的過渡效果 */
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.5); /* 陰影 */
    margin-top: 20px;
}
/* 提交按鈕懸停時的樣式。 */
.submit-button:hover {
    background-color: #00C300; /* 懸停時變為綠色 */
    transform: translateY(-2px); /* 輕微上移效果 */
}
/* 提交按鈕禁用時的樣式 */
.submit-button:disabled {
    background-color: #333333; /* 變深色 */
    cursor: not-allowed; /* 游標變為禁止符號 */
    transform: translateY(0); /* 移除懸停效果 */
    box-shadow: none; /* 移除陰影 */
}

/* 提交訊息的樣式 */
.submission-message {
    text-align: center;
    margin-top: 15px;
    padding: 10px;
    border-radius: 8px;
    font-size: 16px;
    font-weight: bold;
    opacity: 0; /* 預設隱藏 */
    transition: opacity 0.5s ease; /* 顯示/隱藏的過渡效果 */
}
.submission-message.success {
    background-color: #4CAF50; /* 綠色背景 */
    color: #fff;
}
.submission-message.error {
    background-color: #f44336; /* 紅色背景 */
    color: #fff;
}
.submission-message.show {
    opacity: 1; /* 顯示訊息 */
}

/* --- 4. 頁尾樣式 (Footer Styles) --- */
footer {
    text-align: center;
    font-family: "Source Code Pro", monospace; /* 等寬字體 */
    font-size: 12px;
    color: #BBBBBB;
    flex-shrink: 0; /* 防止頁尾被壓縮 */
    padding: 20px;
    margin-top: 20px;
}

/* --- 5. 媒體查詢：響應式設計 (Media Queries: Responsive Design) --- */
@media (max-width: 600px) {
    body {
        padding: 10px; /* 小螢幕時減少頁面內邊距 */
    }
    .main-record-card {
        padding: 20px; /* 小螢幕時減少卡片內邊距 */
    }
    .card-title {
        font-size: 24px; /* 小螢幕時調整標題字體大小 */
        margin-bottom: 20px;
    }
    .form-group label {
        font-size: 16px; /* 小螢幕時調整標籤字體大小 */
    }
    .form-group select,
    .radio-option label,
    .submit-button {
        padding: 10px; /* 小螢幕時調整表單元素內邊距 */
        font-size: 15px; /* 小螢幕時調整字體大小 */
    }
}
```

</details>

**關鍵點之深入闡釋：**

*   **全域與基礎樣式：**

    *   `* { box-sizing: border-box; }`：此為 CSS 盒模型之關鍵設定，其將所有元素之 `width` 與 `height` 屬性定義為包含 `padding` 及 `border` 之值。此一標準化模型簡化了佈局計算之複雜性，並有效規避了常見之盒模型相關佈局問題，確保了跨瀏覽器之渲染一致性。

    *   `html { height: 100%; }` 及 `body { min-height: 100vh; display: flex; ... }`：此組規則旨在確保 `body` 元素至少佔據整個視口之高度，並使其內部內容能夠在垂直與水平方向上實現居中對齊。即使內容不足以填滿整個頁面，亦能維持良好之視覺佈局。`flex-direction: column` 促使子元素垂直堆疊，而 `justify-content: center` 與 `align-items: center` 則分別在主軸（垂直）與交叉軸（水平）上實現內容之居中對齊，從而提供穩定且美觀之頁面呈現。

*   **下拉選單箭頭：**

    *   `background-image: url('data:image/svg+xml;charset=US-ASCII,...')`：此技術巧妙地將 SVG 圖像直接嵌入 CSS 規則中，無需額外之 HTTP 請求載入獨立圖像檔案，從而有效提升頁面載入速度。`data:image/svg+xml` 聲明了數據之 MIME 類型。`path` 屬性內之複雜字符串精確定義了箭頭之幾何形狀，透過對此 `path` 數據之調整，可實現箭頭方向之精確控制。

    *   `-webkit-appearance: none; -moz-appearance: none; appearance: none;`：此等屬性旨在移除瀏覽器對 `<select>` 元素之預設樣式渲染，賦予開發者完全自定義箭頭及整體視覺樣式之能力，進而確保跨瀏覽器之視覺一致性與品牌統一性。

*   **自定義單選按鈕：**

    *   `position: relative;` 於 `.radio-option` 上之設定，係為其內部偽元素 `::before` 能夠利用 `position: absolute;` 實現精確定位提供必要之上下文。

    *   `overflow: hidden;`：此屬性確保任何超出 `.radio-option` 邊界之內容（例如偽元素）將被裁剪，從而維持視覺之整潔與邊界之明確。

    *   `top: 50%; transform: translateY(-50%);`：此為 CSS 中常用之一對技巧，旨在將元素在垂直方向上實現精確居中。`top: 50%` 將元素之頂部邊緣定位至父元素之垂直中點，而 `transform: translateY(-50%)` 則將元素向上平移其自身高度之一半，最終實現完美之垂直居中對齊。

    *   `left: 12px;`：此屬性將綠色指示器從 `.radio-option` 之左邊緣向右移動 12 像素，此間距與 `.radio-option` 之 `padding-left` 值相匹配，從而創造了指示器與選項邊框之間之視覺分隔。

    *   `height: 24px;`：設定固定高度，確保指示器呈現為一個獨立之短長方形，而非佔據整個選項之垂直空間。

    *   `border-radius: 2px;`：為指示器添加輕微之圓角，使其外觀更為柔和與現代。

    *   `padding: 0 0 0 30px;` 應用於 `.radio-option label`：此左側內邊距之數值經過精確計算，其包含了 `.radio-option` 之左側內邊距（12px）、綠色指示器之寬度（8px）以及指示器與文字之間所需之額外間距（約 10px），總計 30px。此配置確保了文字與指示器之間具有足夠之視覺分隔，提升可讀性。

*   **提交按鈕禁用樣式：**

    *   `.submit-button:disabled`：當按鈕之 `disabled` 屬性為 `true` 時，此等樣式將被激活。其將背景色調深，游標變更為「禁止」符號，並移除任何懸停效果及陰影。此視覺回饋明確告知使用者按鈕當前處於不可用狀態，有效引導使用者行為。

## 4. JavaScript 功能 (`<script>` 標籤內)

JavaScript 程式碼負責處理網頁之動態行為、使用者互動以及與後端服務（Google 表單）之數據交換。其功能之實現對於提升使用者體驗及確保數據流暢性至關重要。

<details>
<summary>點擊展開/收合 JavaScript 程式碼</summary>

```javascript
// 處理單選按鈕選中狀態的視覺效果
document.querySelectorAll('.radio-group input[type="radio"]').forEach(radio => {
    radio.addEventListener('change', function() {
        // 遍歷同一組的所有單選選項，移除 'selected' 類別
        this.closest('.radio-group').querySelectorAll('.radio-option').forEach(option => {
            option.classList.remove('selected');
        });
        // 如果當前單選按鈕被選中，則為其父級 '.radio-option' 添加 'selected' 類別
        if (this.checked) {
            this.closest('.radio-option').classList.add('selected');
        }
    });
});

// 初始化單選按鈕的選中樣式 (解決提交後全選問題)
function initializeRadioSelection() {
    // 遍歷所有單選按鈕
    document.querySelectorAll('.radio-group input[type="radio"]').forEach(radio => {
        const optionElement = radio.closest('.radio-option'); // 獲取單選按鈕的父級選項元素
        if (radio.checked) {
            optionElement.classList.add('selected'); // 如果被選中，添加 'selected' 類別
        } else {
            optionElement.classList.remove('selected'); // 否則，移除 'selected' 類別
        }
    });
}

document.addEventListener('DOMContentLoaded', initializeRadioSelection); // 頁面首次載入時執行初始化


// 註冊 Service Worker
if ('serviceWorker' in navigator) { // 檢查瀏覽器是否支援 Service Worker API
    window.addEventListener('load', () => { // 確保頁面完全載入後再註冊
        try {
            navigator.serviceWorker.register('sw.js') // 嘗試註冊位於根目錄的 sw.js
                .then(registration => {
                    console.log('Service Worker 註冊成功:', registration); // 註冊成功訊息
                })
                .catch(error => {
                    console.error('Service Worker 註冊失敗:', error); // 註冊失敗訊息
                    // 在此處可以添加更友善的使用者提示，例如一個彈出視窗
                    // displayMessage('無法註冊離線功能。請確保網站透過 HTTPS 或 localhost 運行。', 'error');
                });
        } catch (e) {
            console.error('嘗試註冊 Service Worker 時發生錯誤:', e); // 捕獲同步錯誤
            // displayMessage('您的瀏覽器環境不支援 Service Worker 的註冊。請確保網站透過 HTTPS 或 localhost 運行。', 'error');
        }
    });
} else {
    console.warn('您的瀏覽器不支援 Service Worker。'); // 瀏覽器不支援 Service Worker 的警告
    // displayMessage('您的瀏覽器不支援離線功能。', 'error');
}

// 顯示提交訊息的函數
function displayMessage(message, type) {
    const messageDiv = document.getElementById('submissionMessage'); // 獲取訊息顯示元素
    messageDiv.textContent = message; // 設定訊息內容
    messageDiv.className = `submission-message show ${type}`; // 添加顯示和類型類別
    setTimeout(() => {
        messageDiv.classList.remove('show'); // 2秒後移除 'show' 類別，使其隱藏
    }, 2000); // 訊息顯示 2 秒
}

// 表單提交邏輯
document.getElementById('filmDataForm').addEventListener('submit', function(event) {
    event.preventDefault(); // 阻止表單的預設提交行為（防止頁面重新載入）

    const submitButton = document.getElementById('submitButton'); // 獲取提交按鈕元素

    // 禁用按鈕並改變其視覺樣式，提供即時回饋
    submitButton.disabled = true; // 禁用按鈕，使其無法點擊
    submitButton.style.backgroundColor = '#333333'; // 改變背景色為深灰色
    submitButton.style.cursor = 'not-allowed'; // 改變游標為禁止符號
    submitButton.style.boxShadow = 'none'; // 移除任何陰影效果
    submitButton.style.transform = 'translateY(0)'; // 移除懸停時的位移效果

    // 獲取表單中各個輸入欄位的值
    const shutter = document.getElementById('shutter').value;
    const aperture = document.getElementById('aperture').value;
    
    // 對於單選按鈕，需要找到被選中的那個，並獲取其值
    const selectedLens = document.querySelector('input[name="lens"]:checked');
    const lens = selectedLens ? selectedLens.value : ''; // 如果沒有選中，則為空字符串
    
    const selectedFilm = document.querySelector('input[name="film"]:checked');
    const film = selectedFilm ? selectedFilm.value : ''; // 如果沒有選中，則為空字符串

    // Google 表單的基礎 URL 和您表單的唯一 ID
    const formId = '1FAIpQLSeTmN-IaOqOkLuamWkqSUuwN7UOFn_P1Hjhwn9PKExbalVoeA'; // 請替換為您自己的 Google 表單 ID
    const baseUrl = `https://docs.google.com/forms/d/e/${formId}/formResponse`;

    // 創建 FormData 物件，用於封裝表單數據以便發送 POST 請求
    const formData = new FormData();
    // 將每個表單欄位的值添加到 FormData 中，使用 Google 表單的 entry.id 作為鍵
    formData.append('entry.854732717', shutter); // 快門的 entry.id
    formData.append('entry.1780086541', aperture); // 光圈的 entry.id
    formData.append('entry.1723423751', lens); // 鏡頭的 entry.id
    formData.append('entry.1607544964', film); // 底片的 entry.id
    formData.append('submit', 'Submit'); // Google Forms 需要這個參數來識別提交

    // 使用 Fetch API 發送非同步 POST 請求到 Google 表單
    fetch(baseUrl, {
        method: 'POST', // 指定請求方法為 POST
        body: formData, // 請求體為 FormData 物件
        mode: 'no-cors' // 關鍵：設定為 'no-cors' 模式，允許跨域提交。
                        // 在此模式下，瀏覽器會發送請求，但由於安全限制，JavaScript 無法讀取響應內容或狀態碼。
                        // 因此，我們在此處假設只要請求沒有網路錯誤，提交就是成功的。
    })
    .then(response => {
        // 由於 'no-cors' 模式的限制，這裡的 response 物件會是 opaque（不透明的），
        // 無法直接檢查 response.ok 或 response.status。
        // 因此，我們在此處假設提交成功。
        displayMessage('資料已成功提交！', 'success'); // 顯示成功訊息
        this.reset(); // 清空表單所有輸入欄位，恢復到初始狀態
        initializeRadioSelection(); // 重新應用單選按鈕的預設選中樣式，解決「全選」問題
    })
    .catch(error => {
        // 捕獲網路錯誤或其他 fetch 請求層面的錯誤
        console.error('提交表單時發生錯誤:', error);
        displayMessage('提交失敗，請檢查網路或稍後再試。', 'error'); // 顯示失敗訊息
    })
    .finally(() => {
        // 無論提交成功或失敗，都會在 15 秒後執行此區塊的程式碼
        setTimeout(() => {
            submitButton.disabled = false; // 重新啟用按鈕
            submitButton.style.backgroundColor = ''; // 恢復按鈕的原始背景色 (由 CSS 處理)
            submitButton.style.cursor = ''; // 恢復原始游標樣式
            submitButton.style.boxShadow = ''; // 恢復原始陰影效果
            submitButton.style.transform = ''; // 恢復原始懸停位移效果
        }, 15000); // 延遲 15 秒 (15000 毫秒)
    });
});
```
</details>

**關鍵點之深入闡釋：**

*   **單選按鈕視覺邏輯 (`addEventListener('change')`)：**

    *   `document.querySelectorAll('.radio-group input[type="radio"]')`：此方法用於選取文件物件模型（DOM）中所有符合指定選擇器（即所有位於 `.radio-group` 類別元素內之 `input` 類型為 `radio` 的元素）之元素。

    *   `forEach(radio => { ... })`：此迭代方法對每個被選取之單選按鈕元素執行一次指定之回調函數，確保每個按鈕皆能獨立處理其事件。

    *   `radio.addEventListener('change', function() { ... })`：為每個單選按鈕添加 `change` 事件監聽器。當單選按鈕之選中狀態發生變更時（例如，使用者點擊了不同之選項），此回調函數將被觸發執行。

    *   `this.closest('.radio-group').querySelectorAll('.radio-option').forEach(option => { option.classList.remove('selected'); });`：此為實現單選邏輯之核心步驟。`this.closest('.radio-group')` 方法向上遍歷 DOM 樹，尋找最接近之 `.radio-group` 祖先元素，從而精確定位當前被點擊單選按鈕所屬之邏輯組。隨後，它會遍歷該組內所有 `.radio-option` 元素，並移除其 `selected` 類別。此舉確保在同一組單選按鈕中，僅有一個選項能夠在視覺上被標記為選中狀態，維持了介面之清晰性與功能之正確性。

    *   `if (this.checked) { this.closest('.radio-option').classList.add('selected'); }`：此條件判斷語句檢查當前被點擊之單選按鈕是否處於 `checked` 狀態（即已選中）。若為真，則為其直接父級之 `.radio-option` 元素添加 `selected` 類別，從而激活 CSS 中預先定義之選中樣式（例如，顯示綠色指示器），提供直觀之視覺回饋。

*   **初始化單選按鈕選中樣式 (`initializeRadioSelection()`)：**

    *   此函數之設計旨在確保單選按鈕之視覺狀態在兩種特定情境下保持正確：

        1.  **頁面首次載入時 (`DOMContentLoaded`)：** 於文件物件模型（DOM）完全載入並解析完成後，此函數將被執行。其目的在於確保 HTML 標記中預先設定有 `checked` 屬性之預設選項，能夠在頁面初始顯示時即正確呈現其綠色指示器之視覺樣式。

        2.  **表單 `reset()` 操作後：** 當使用者執行表單重置操作時，所有單選按鈕將恢復至其在 HTML 中定義之原始 `checked` 狀態。在某些非標準或錯誤配置之情況下，若多個單選按鈕被錯誤地賦予 `checked` 屬性，`reset()` 操作可能導致它們同時呈現為「選中」狀態。為此，`initializeRadioSelection()` 函數將重新掃描所有單選按鈕，並根據其真實之 `checked` 狀態，精確地添加或移除 `selected` 類別。此機制有效解決了提交表單後單選按鈕可能出現之「全選」視覺問題，確保僅有唯一之預設選項被正確地視覺標記。

*   **Service Worker 註冊：**

    *   `if ('serviceWorker' in navigator)`：此條件判斷為檢測當前瀏覽器環境是否支援 Service Worker API 之標準方法。此項檢查對於確保腳本之相容性至關重要。

    *   `window.addEventListener('load', ...)`：此事件監聽器確保 Service Worker 之註冊過程僅在整個頁面及其所有相關資源（包括圖像、樣式表、腳本等）完全載入完成後方才啟動。此策略有助於規避頁面載入過程中可能發生之競爭條件，確保註冊流程之穩定性。

    *   `navigator.serviceWorker.register('sw.js')`：此方法嘗試將位於網站根目錄下之 `sw.js` 檔案註冊為 Service Worker。此過程為 PWA 功能啟用之核心步驟。

    *   `.then(registration => { ... })`：若 Service Worker 註冊成功，此 Promise 回調函數將被執行。`registration` 物件包含 Service Worker 實例之相關資訊，例如其作用域（scope）與狀態。

    *   `.catch(error => { ... })`：若 Service Worker 註冊過程中發生錯誤（例如，檔案路徑不正確、網站未透過 HTTPS 提供服務，或瀏覽器版本不支援），此 Promise 回調函數將捕獲錯誤並將其詳細資訊輸出至開發者控制台。

    *   `try...catch` 區塊：此結構用於捕獲 `navigator.serviceWorker.register()` 方法在執行時可能拋出之同步錯誤，例如當 `sw.js` 檔案之 URL 協議不被瀏覽器支援時，確保錯誤處理之全面性。

*   **`displayMessage()` 函數：**

    *   此函數係一通用之輔助工具，專用於向使用者顯示簡短之通知訊息。

    *   其接受 `message` 內容及 `type` 參數（例如 `'success'` 或 `'error'`），並根據 `type` 參數應用不同之 CSS 樣式，以區分訊息之性質。此外，該訊息將在顯示 2 秒後自動隱藏，提供非侵入式之使用者回饋。

*   **表單提交邏輯 (`addEventListener('submit')`)：**

    *   `event.preventDefault()`：在表單提交事件觸發時，此行程式碼之執行具備**關鍵重要性**。其目的在於阻止瀏覽器執行表單之預設行為，即將數據提交至 `action` 屬性所指定之 URL 並導致頁面重新載入。透過阻止此預設行為，開發者得以完全掌控表單之提交流程，例如實現非同步數據提交（AJAX）。

    *   **按鈕禁用與樣式變化：** 於 `fetch` 請求發送之前，提交按鈕將被立即禁用並其視覺樣式將隨之調整。此舉旨在提供即時之使用者回饋，明確告知使用者請求正在處理中，並有效防止因重複點擊而導致之重複數據提交。

    *   `FormData`：此為 JavaScript 內建之物件，其主要功能在於便捷地構造表單數據。`FormData` 物件自動處理數據之編碼，使其特別適用於使用 `fetch` API 發送 `POST` 請求之情境。`formData.append(key, value)` 方法用於將表單欄位及其對應值添加至 `FormData` 物件中。

    *   `fetch(baseUrl, { method: 'POST', body: formData, mode: 'no-cors' })`：

        *   `fetch()` API：此為現代瀏覽器中用於發送網路請求之標準化介面，提供強大且靈活之數據交換能力。

        *   `method: 'POST'`：此屬性明確指定 HTTP 請求方法為 POST，此乃因本應用程式正向 Google 表單提交數據。

        *   `body: formData`：將先前構造之 `FormData` 物件作為請求體發送，其內含所有待提交之表單數據。

        *   `mode: 'no-cors'`：此為**關鍵配置**。由於數據將提交至不同網域（Google Forms），此操作將觸發跨域請求。為規避瀏覽器之 CORS (跨域資源共享) 策略所導致之請求阻斷，特將 `mode` 設定為 `'no-cors'`。在此模式下，瀏覽器將發送請求，然基於安全考量，JavaScript 將無法讀取響應之內容、狀態碼或標頭。因此，在此情境下，我們僅能**假設**只要 `fetch` 請求本身未遭遇網路層面之錯誤（例如，網路連線中斷），數據即已成功發送至 Google 表單。

    *   `.then(response => { ... })`：當 `fetch` 請求成功完成（意即無網路層面之錯誤，與伺服器響應內容無關）時，此 Promise 回調函數將被執行。在此階段，基於上述 `no-cors` 模式之限制，我們假設數據提交成功，並隨即顯示成功訊息，繼而重置表單並重新初始化單選按鈕之視覺樣式。

    *   `.catch(error => { ... })`：若 `fetch` 請求於網路層面遭遇錯誤（例如，網路連線中斷、DNS 解析失敗），此回調函數將捕獲該錯誤並顯示失敗訊息，同時將錯誤詳情輸出至控制台以供調試。

    *   `.finally(() => { ... })`：此回調函數無論 `fetch` 請求成功或失敗，均將被執行。其主要用途在於確保請求完成後之清理與狀態恢復。透過 `setTimeout` 函數，按鈕將在 15 秒後重新啟用並恢復其原始視覺樣式，確保按鈕在指定時間間隔後可再次使用。

## 5. PWA 相關檔案

為賦予網站漸進式網頁應用程式（PWA）之功能，需額外配置兩個核心檔案：`manifest.json` 與 `sw.js`。此二檔案必須與 `index.html` 檔案位於**相同之目錄層級**，且圖像檔案 `image/myicon.png` 亦須置於正確之相對路徑下，以確保 PWA 功能之正常運作。

### 5.1 `manifest.json`

`manifest.json` 檔案係一個遵循 JSON 格式之文本文件，其核心功能在於提供 PWA 之元數據。此文件詳盡描述了應用程式於使用者裝置上之顯示方式與行為模式，並作為瀏覽器判斷網站是否符合 PWA 標準以及如何將其添加至主螢幕之主要依據。

<details>
<summary>點擊展開/收合 manifest.json 程式碼</summary>

```json
{
  "name": "底片拍攝參數紀錄",
  "short_name": "底片紀錄",
  "description": "快速紀錄底片拍攝參數的應用程式",
  "start_url": "./",
  "display": "standalone",
  "background_color": "#2a2a2a",
  "theme_color": "#2a2a2a",
  "icons": [
    {
      "src": "image/myicon.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "image/myicon.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```
</details>

**關鍵字段之深入闡釋：**

*   `"name"`：此字段定義應用程式之**完整名稱**。該名稱將於使用者檢視應用程式列表或接收安裝提示時顯示，例如在 Android 應用程式抽屜或 Windows 開始菜單中，提供清晰之應用程式識別。

*   `"short_name"`：此字段指定應用程式之**簡短名稱**。當顯示空間受限時（例如在主螢幕圖標下方），將顯示此簡短名稱。為確保視覺效果最佳，建議其長度通常不超過 12 個字符。

*   `"description"`：此字段提供應用程式之簡要描述。該描述可能於應用程式商店或安裝提示中顯示，旨在協助使用者迅速理解應用程式之核心功能與價值。

*   `"start_url"`：此字段明確定義當使用者從主螢幕啟動 PWA 時，應用程式應載入之起始 URL。`"./"` 表示應用程式將從 `manifest.json` 檔案所在目錄之根 URL 啟動。此配置確保了應用程式之入口點清晰且一致，提升了啟動體驗之可靠性。

*   `"display"`：此字段設定應用程式之**顯示模式**，此模式將直接影響應用程式啟動後瀏覽器使用者介面之呈現方式。

    *   `"standalone"` (獨立模式)：此為 PWA 最為常見之顯示模式。在此模式下，應用程式將以獨立之視窗運行，其外觀與操作體驗均與原生應用程式無異，不顯示瀏覽器之地址欄、工具欄或其他標準使用者介面元素。此模式旨在提供最為沉浸式之使用者體驗。

    *   其他顯示模式包括 `"fullscreen"` (全螢幕模式，不顯示任何瀏覽器使用者介面)、`"minimal-ui"` (最小化使用者介面模式，僅顯示地址欄及部分基本控制項) 與 `"browser"` (瀏覽器模式，與普通網頁之顯示方式相同)。

*   `"background_color"`：此字段定義應用程式於載入過程中，用於填充未顯示區域之背景顏色。此配置在應用程式啟動時，尤其是在 Service Worker 及其他必要資源載入完成之前，可提供平滑之視覺過渡，有效避免出現空白頁面，提升使用者之感知效能。

*   `"theme_color"`：此字段建議瀏覽器於應用程式之使用者介面元素（例如地址欄、狀態列）採用此顏色。此舉有助於將 PWA 與瀏覽器本身之視覺風格融合，從而提供更為統一之品牌體驗。通常，此顏色會選擇與網站主要顏色或 `background_color` 相匹配之色調。

*   `"icons"`：此字段係一**陣列**，其中包含不同尺寸與格式之應用程式圖標。瀏覽器將根據使用者裝置之特性與上下文（例如，主螢幕、應用程式切換器、啟動畫面）自動選擇最為適宜之圖標進行顯示。

    *   `"src"`：圖標檔案之相對路徑。在此配置中，所有圖標均指向 `image/myicon.png`。

    *   `"sizes"`：圖標之尺寸（寬度與高度），例如 `"192x192"`。提供多種尺寸之圖標有助於確保圖標在不同解析度之裝置上均能清晰顯示，避免模糊或失真。

    *   `"type"`：圖標檔案之 MIME 類型，例如 `"image/png"`。此屬性協助瀏覽器正確識別並處理圖標檔案。

### 5.2 `sw.js` (Service Worker)

`sw.js` 檔案承載了 Service Worker 之核心邏輯。Service Worker 係一個在瀏覽器背景中獨立運行之 JavaScript 檔案，其運作獨立於網頁之主執行緒。它扮演著網頁與網路之間**可程式化代理**之角色，具備攔截網路請求、快取資源、實現離線功能，乃至處理推播通知等高級功能。

<details>
<summary>點擊展開/收合 sw.js (Service Worker) 程式碼</summary>

```javascript
const CACHE_NAME = 'film-record-cache-v1'; // 快取名稱，用於版本控制。每次更新快取內容時應更改此名稱。
const urlsToCache = [
  './',             // 根目錄，這確保了 index.html 和其他根級資源被快取。
  'index.html',     // 主 HTML 檔案，即使 start_url 是 './' 也建議明確列出。
  'style.css',      // 樣式檔案。如果 CSS 內嵌在 HTML 中，則無需單獨列出。
  'image/myicon.png' // PWA 圖標，確保其在離線時可用。
];

// 安裝服務工作者並快取所有必要的資產
self.addEventListener('install', event => {
  console.log('[Service Worker] 安裝中...');
  event.waitUntil( // 確保 Service Worker 在快取完成前不會進入活躍狀態
    caches.open(CACHE_NAME) // 打開一個名為 CACHE_NAME 的快取
      .then(cache => {
        console.log('[Service Worker] 快取已打開，正在添加資源...');
        return cache.addAll(urlsToCache); // 將 urlsToCache 陣列中所有指定的 URL 資源添加到快取
      })
      .then(() => {
        console.log('[Service Worker] 所有必要資源已成功快取。');
        self.skipWaiting(); // 強制 Service Worker 立即激活，跳過等待舊 Service Worker 終止的階段
      })
      .catch(error => {
        console.error('[Service Worker] 快取失敗:', error);
      })
  );
});

// 啟用服務工作者並清理舊的快取
self.addEventListener('activate', event => {
  console.log('[Service Worker] 啟用中...');
  event.waitUntil( // 確保 Service Worker 在清理完成前不會進入活躍狀態
    caches.keys().then(cacheNames => { // 獲取所有現有的快取名稱
      return Promise.all( // 等待所有快取刪除操作完成
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) { // 如果快取名稱與當前版本（CACHE_NAME）不同
            console.log('[Service Worker] 正在刪除舊快取:', cacheName);
            return caches.delete(cacheName); // 刪除舊的快取，實現版本更新
          }
        })
      );
    })
    .then(() => {
        console.log('[Service Worker] 舊快取清理完成。');
        return self.clients.claim(); // 允許 Service Worker 立即控制所有打開的客戶端（網頁）
    })
    .catch(error => {
        console.error('[Service Worker] 啟用或清理快取失敗:', error);
    })
  );
});

// 攔截網路請求並提供快取內容 (快取優先策略)
self.addEventListener('fetch', event => {
  // 對於 Google Forms 的提交請求，我們不進行快取攔截，直接讓其通過網路
  // 這是因為 Google Forms 的提交是跨域的，且我們使用 'no-cors' 模式，
  // 攔截它會導致不必要的複雜性且無法從快取中提供有效響應。
  if (event.request.url.includes('docs.google.com/forms/d/e/') && event.request.method === 'POST') {
    return; // 直接讓請求通過網路
  }

  event.respondWith( // 攔截請求並提供自定義響應
    caches.match(event.request) // 嘗試從快取中匹配請求的資源
      .then(response => {
        // 如果快取中有響應，則直接返回快取響應 (實現離線功能)
        if (response) {
          console.log('[Service Worker] 從快取獲取:', event.request.url);
          return response;
        }
        
        // 如果快取中沒有，則從網路發出請求
        console.log('[Service Worker] 從網路獲取:', event.request.url);
        return fetch(event.request).then( // 發送網路請求
          response => {
            // 檢查網路響應是否有效 (狀態碼 200，基本類型)
            // 'basic' 類型表示同源請求，'opaque' 類型表示 'no-cors' 請求
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response; // 無效響應直接返回
            }

            // 克隆響應，因為響應流只能被消費一次（一份用於瀏覽器，一份用於快取）
            const responseToCache = response.clone();

            caches.open(CACHE_NAME) // 再次打開快取
              .then(cache => {
                cache.put(event.request, responseToCache); // 將網路響應添加到快取，以便下次離線使用
                console.log('[Service Worker] 快取新資源:', event.request.url);
              });

            return response; // 返回網路響應給瀏覽器
          }
        ).catch(error => {
            // 捕獲網路請求失敗（例如離線）時的錯誤
            console.error('[Service Worker] 網路請求失敗:', event.request.url, error);
            // 在此處可以提供一個離線頁面作為備用響應
            // return caches.match('/offline.html');
        });
      })
  );
});
```
</details>

**Service Worker 事件之深入闡釋：**

*   **`CACHE_NAME` 與 `urlsToCache`：**

    *   `CACHE_NAME`：此常數定義了快取之版本名稱，其設計旨在實現快取之版本控制。每當網站之離線資源（例如 `index.html` 或 `style.css`）進行更新時，建議修改 `CACHE_NAME` 之值（例如從 `v1` 遞增至 `v2`）。此機制確保當 Service Worker 啟用時，其能識別快取名稱之變更，並自動執行舊版本快取之清理，從而保證使用者始終能獲取最新版本之網站資源。

    *   `urlsToCache`：此陣列列舉了 Service Worker 於安裝階段應預先快取之所有核心資源。這些資源將於使用者首次訪問網站時被下載並儲存於瀏覽器之快取中，即使在離線狀態下亦能即時提供，大幅提升了離線體驗之流暢性。

*   **`install` 事件：**

    *   此事件於瀏覽器檢測到新 Service Worker 檔案時觸發。

    *   `event.waitUntil()`：此方法接收一個 Promise，並阻止 Service Worker 進入「活躍」狀態，直至該 Promise 成功解決。此機制確保 Service Worker 於所有核心資源被快取完成前，不會開始處理 `fetch` 事件，從而保證資源快取之完整性。

    *   `caches.open(CACHE_NAME)`：此方法用於打開或創建一個名為 `CACHE_NAME` 之快取儲存空間。

    *   `cache.addAll(urlsToCache)`：此方法將 `urlsToCache` 陣列中列出之所有資源下載並添加至已打開之快取中。若其中任何一個資源下載失敗，則整個 `addAll` 操作將告失敗，Service Worker 亦將無法成功安裝。

    *   `self.skipWaiting()`：於 `install` 事件中調用此方法，可強制新 Service Worker 立即激活，跳過等待舊 Service Worker 終止之階段。此功能對於開發與測試環境尤為實用，可加速變更之生效。

*   **`activate` 事件：**

    *   此事件於 Service Worker 成功安裝並準備好控制頁面時觸發。

    *   此事件通常用於**清理舊版本之快取**。當網站更新且 `CACHE_NAME` 發生變更時，舊有快取仍可能存在。`activate` 事件將遍歷所有現存之快取，並刪除那些與當前 `CACHE_NAME` 不匹配之快取，從而確保瀏覽器僅保留最新版本之網站資源，實現版本之平滑升級。

    *   `caches.keys()`：此方法用於獲取瀏覽器中所有快取儲存空間之名稱列表。

    *   `self.clients.claim()`：於 `activate` 事件中調用此方法，可使新激活之 Service Worker 立即控制所有已打開之客戶端（即您的網頁）。若不調用此方法，則網頁可能需重新載入方能受新 Service Worker 之控制。

*   **`fetch` 事件：**

    *   此事件乃 Service Worker 最核心之功能。每當瀏覽器發出網路請求時（無論是載入 HTML、CSS、JavaScript、圖像檔案，抑或是發送 API 請求），均將觸發 `fetch` 事件。

    *   `event.respondWith()`：此方法接收一個 Promise，並允許 Service Worker 攔截網路請求並提供自定義響應，從而實現對網路資源之精細控制。

    *   **Google Forms 提交之特殊處理：**

        *   `if (event.request.url.includes('docs.google.com/forms/d/e/') && event.request.method === 'POST') { return; }`：此為一項重要之優化策略。鑑於 Google Forms 之提交請求係跨域操作，且於 `index.html` 中已設定 `mode: 'no-cors'`，此類請求之響應為「不透明」（opaque）類型，Service Worker 無法對其進行快取或檢查其內容。因此，為避免不必要之複雜性與潛在問題，此處選擇直接放行此類請求，使其透過網路正常傳輸。

    *   **快取優先策略：**

        *   `caches.match(event.request)`：首先嘗試於 Service Worker 之快取中查找與當前請求匹配之資源。若成功匹配，則直接返回快取中之響應，此舉實現了離線功能並顯著提升了資源載入速度。

        *   `fetch(event.request)`：若快取中未找到匹配之響應，則從網路發出實際之請求，以獲取所需資源。

        *   `response.clone()`：鑑於 `fetch` API 返回之響應流僅能被消費一次，若欲將響應同時提供予瀏覽器及快取，則必須對其進行克隆操作，以生成一份獨立之副本。

        *   `cache.put(event.request, responseToCache)`：此方法將從網路獲取到之響應添加至快取中，以便下次相同請求可直接從快取中獲取，進一步優化性能。

        *   `.catch(error => { ... })`：此回調函數用於捕獲網路請求失敗時之錯誤，例如使用者處於離線狀態。在此情境下，可選擇提供一個預設之離線頁面作為備用響應，以提升使用者之離線體驗。

## 6. 部署與測試注意事項

將網站轉換為漸進式網頁應用程式（PWA）不僅涉及程式碼層面之調整，更涵蓋正確之部署環境配置與嚴謹之測試流程。

*   **HTTPS 為強制要求：**

    *   **重要性：** Service Worker 及諸多 PWA 功能（例如安裝提示、地理定位、推播通知等）之正常運作，皆嚴格要求於**安全上下文**中執行。此意味著網站必須透過 HTTPS (Hypertext Transfer Protocol Secure) 協議提供服務。此乃瀏覽器為保障使用者數據安全與隱私所設定之基礎安全要求，不符合此要求將導致 PWA 功能無法啟用。

    *   **本地開發環境：** 於本地開發環境中，`localhost` 通常會被瀏覽器自動識別為安全上下文，因此開發者無需額外配置 HTTPS 憑證即可進行測試。此舉簡化了本地開發之複雜性。

    *   **線上部署環境：** 當網站部署至實際之伺服器時，必須為相關域名配置 SSL/TLS 憑證，以確保網站透過 HTTPS 協議載入。諸多主機服務提供商（例如 Netlify、Vercel、Firebase Hosting、GitHub Pages 等）均提供免費之 HTTPS 憑證（例如透過 Let's Encrypt）及簡便之配置流程，以協助網站符合此安全要求。

*   **清除瀏覽器快取與網站資料：**

    *   **原因：** 瀏覽器會對 Service Worker 及 `manifest.json` 檔案進行積極快取。於 PWA 之開發與更新過程中，即使程式碼已進行修改，瀏覽器仍可能沿用舊版本之快取，導致所作變更無法立即生效。

    *   **操作步驟：**

        1.  **開啟開發者工具：** 於 Chrome 瀏覽器中，可透過按下 `F12` 鍵或右鍵點擊頁面並選擇「檢查」來開啟開發者工具面板。

        2.  **導航至 Application (應用程式) 面板：** 於開發者工具之頂部或側面菜單中，選取「Application」選項卡。

        3.  **Service Workers (服務工作者) 管理：**

            *   於左側選單中選擇「Service Workers」。

            *   勾選「Bypass for network (繞過網路)」選項：此設定將指示瀏覽器於開發階段始終從網路獲取資源，而非從 Service Worker 之快取中提取，有助於即時反映程式碼變更。

            *   點擊「Unregister (取消註冊)」按鈕：此操作將強制取消註冊當前活躍之 Service Worker，確保下次頁面載入時將重新安裝最新版本之 Service Worker。

        4.  **Manifest (清單) 檢查：**

            *   於左側選單中選擇「Manifest」。

            *   檢查 `manifest.json` 檔案是否已正確載入，並核對其中顯示之資訊是否與預期相符。此步驟對於確認 PWA 元數據之正確性至關重要。

        5.  **Storage (儲存空間) 清理：**

            *   於左側選單中選擇「Storage」。

            *   點擊「Clear site data (清除網站資料)」按鈕：此操作將清除與當前網站相關之所有快取數據、IndexedDB 數據、Local Storage 數據等，確保測試環境之潔淨。

        6.  **強制重新整理：** 完成上述步驟後，關閉開發者工具，並於瀏覽器中按下 `Ctrl + Shift + R` (適用於 Windows/Linux 系統) 或 `Cmd + Shift + R` (適用於 macOS 系統) 執行硬性重新整理（Hard Reload）。此操作將強制瀏覽器從伺服器重新下載所有資源，確保載入最新版本之網站。

*   **圖標路徑與尺寸規範：**

    *   **路徑檢查：** 再次確認 `manifest.json` 檔案中 `icons` 陣列內 `src` 屬性所指定之圖標路徑係正確無誤，例如 `image/myicon.png`。務必確保 `image` 資料夾及 `myicon.png` 檔案確實存在於網站之正確相對路徑下。

    *   **檔案存在性驗證：** 嘗試直接於瀏覽器之地址欄中輸入網站網址並附加圖標路徑（例如 `https://您的網站網址/image/myicon.png`），以驗證圖像檔案是否能正常顯示。若無法顯示，則表示圖像檔案可能缺失或其路徑配置有誤。

    *   **尺寸與格式符合性：** 儘管 `manifest.json` 中已定義 `192x192` 及 `512x512` 等尺寸規範，然特定裝置或操作系統可能對 PWA 圖標之最小/最大尺寸或長寬比設有額外要求。務請確保 `myicon.png` 檔案為有效之 PNG 圖像格式，且其尺寸至少為 `512x512` 像素，以支援高解析度顯示並確保在不同設備上之視覺品質。
