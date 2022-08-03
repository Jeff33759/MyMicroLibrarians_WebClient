# MyMicroLibrarians_WebClient
分散式館藏系統的測試用網頁客戶端

<br><br>
## 專題大綱

測試用的網頁客戶端，用來對分散式館藏後端系統進行簡易的DEMO，以及初步的End-to-end測試。

DEMO影片: https://www.youtube.com/watch?v=FfudSmjdIug
<br><br>
## 我做到了什麼

1. 使用Jquery-3.6的AJAX實作非同步、跨來源的請求與頁面渲染。

2. 將RefreshToken與AccessToken的標頭與公開內容以Base64解碼回可閱讀的資料，取代傳統以Session-Cookie紀錄狀態的做法。

3. 使用Bootstrap-5.1.1製作RWD頁面，解析度的寬度支援至最小300px。

4. 使用SweetAlert2的套件，讓Alert功能更加美觀。

5. 針對所有Api的測試，包括偽造AccessToken的測試。


<br><br>
## 環境

經測試，Chrome、FireFox、Edge均可正常運作。


<br><br>
## 事前建置與DEMO說明

注意gateway伺服端的Port預設為8080。

若有改，那前端的AJAX請求路徑也要跟著改(洽mine > js > myAJAX.js)，否則發送請求會跳「Connection failed.」的Alert提醒你連接超時(前端設定等待1秒)。


<br><br>
## 可以改進的地方

1. _測試不夠完善_

雖然說是E2E測試，但其實某些案例沒有測得非常完善，例如新增館藏的API，全部共有12個欄位(2個必填、10個選填)讓使用者填入欲新增的館藏資料，但本測試頁面為了快速開發(偷懶)，就只做了2個必填欄位與1個選填欄位供輸入測試。
