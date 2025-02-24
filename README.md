# Nuxt 網站架設 (IIS)

### 安裝

[Nodejs](https://nodejs.org/en)
[iisnode for iis 7/8 (x64)](https://github.com/azure/iisnode/wiki/iisnode-releases)
[URL Rewrite Chinese Traditional: x86 installer / x64 installer](https://iis-umbraco.azurewebsites.net/downloads/microsoft/url-rewrite)

![image](https://hackmd.io/_uploads/BkUyaZNYkl.png)

### 參考 Nuxt 佈署說明

https://hackmd.io/@chinggo/H1If4zO7h

下載測試用的檔案
https://github.com/chinggo/iisnode-Nuxt3SSR

### Nuxt3 設定

安裝套件

```
npm i
```

![image](https://hackmd.io/_uploads/ryNgevmtyx.png)

運行程式碼，開啟網頁，可正常運行

```
npm run dev
```

![image](https://hackmd.io/_uploads/Sk9CewXF1x.png)

![image](https://hackmd.io/_uploads/HkDZ-PXFJg.png)

打包專案建構生產環境需要的程式包

```
npm run build
```

或

```
npm run build --preset=iis_node
```

![image](https://hackmd.io/_uploads/BJgkGewFyg.png)

執行以下指令，預覽 Nuxt 網站，網頁顯示正常

```
node .output/server/index.mjs
```

![image](https://hackmd.io/_uploads/B1TjWDmtJe.png)

![image](https://hackmd.io/_uploads/B1ApbDmKye.png)

### web.config

新增 web.config 檔案在 .output/server/web.config

```
<?xml version="1.0" encoding="utf-8"?>
<configuration>
  <system.webServer>
    <rewrite>
      <rules>
        <rule name="Reverse Proxy to Nuxt" stopProcessing="true">
          <match url="(.*)" />
          <conditions>
            <add input="{REQUEST_FILENAME}" matchType="IsFile" negate="true" />
            <add input="{REQUEST_FILENAME}" matchType="IsDirectory" negate="true" />
          </conditions>
          <action type="Rewrite" url="http://localhost:3000/{R:1}" />
        </rule>
      </rules>
    </rewrite>
  </system.webServer>
</configuration>

```

![image](https://hackmd.io/_uploads/rkTWGxDtJl.png)

### nuxt.config.js

新增 nuxt.config.js 設定

```
export default defineNuxtConfig({
  app: {
    baseURL: '/',
  },
  server: {
    host: '0.0.0.0', // 允許外部連線 (IIS)
    port: process.env.PORT || 3000, // IIS 轉發請求到這個 Port
  },
  nitro: {
    preset: 'node-server', // 使用 Node.js 伺服器
  },
})
```

開啟本地伺服器

```
node .output/server/index.mjs
```

![image](https://hackmd.io/_uploads/BymBGxDt1l.png)

### IIS 設定

#### 應用程式集區

![image](https://hackmd.io/_uploads/Sy2oMvmKkl.png)

新增應用程式集區
![image](https://hackmd.io/_uploads/H1_U7wQY1x.png)

![image](https://hackmd.io/_uploads/rkDO7PXYye.png)

#### 站台

新增站台
![image](https://hackmd.io/_uploads/rJFwVvmFJg.png)

![image](https://hackmd.io/_uploads/SJ19Evmt1e.png)

![image](https://hackmd.io/_uploads/ByuCzewtJe.png)

#### 新增一個 mime 類型，添加 .mjs 為 application/javascript

![image](https://hackmd.io/_uploads/HkGjQlwF1e.png)

![image](https://hackmd.io/_uploads/rJcwnbNFJl.png)

出現設定跟權限問題
![image](https://hackmd.io/_uploads/HJzfyM4YJg.png)

解決權限問題
server 資料夾右鍵 => 安全性
![image](https://hackmd.io/_uploads/SkVMUw7F1e.png)

點擊編輯按鈕 => 點擊新增按鈕
![image](https://hackmd.io/_uploads/BJUUUwQKyl.png)

輸入 IIS_IUSRS 物件名稱 => 點擊確定按鈕
![image](https://hackmd.io/_uploads/r1zyDvQKke.png)

選取 IIS_IUSRS，並勾選「讀取與執行」權限 => 點擊確定按鈕
![image](https://hackmd.io/_uploads/B1IHPw7tkx.png)

重新開啟本地端伺服器
```
node .output/server/index.mjs
```

使用遠端瀏覽器進行瀏覽，可正常顯示
![image](https://hackmd.io/_uploads/H18q4xvYJx.png)

#### [前後端分離] 後端 api 的 http://127.0.0.1:port/api/path 網址更換
後端 api 的 127.0.0.1 網址改成伺服器 IP 或是設定的網址
重新打包專案建構生產環境需要的程式包
```
npm run build
```
重新開啟本地端伺服器
```
node .output/server/index.mjs
```
遠端可正常操作網站功能

#### 使用 PM2 可以自動重啟崩潰的應用程式，並支援開機自動啟動。
nuxt-app: package.json name 名稱
```
pm2 start .output/server/index.mjs --name nuxt-app
```
