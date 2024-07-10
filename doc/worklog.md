# Worklog

## Create project

```sh
$ npm create tauri-app@latest -- --beta
Need to install the following packages:
create-tauri-app@4.0.2
Ok to proceed? (y) 


> npx
> create-tauri-app --beta

✔ Project name · OASIZ_TimeLogger2
✔ Package name · oasiz_timelogger2
✔ Choose which language to use for your frontend · TypeScript / JavaScript - (pnpm, yarn, npm, bun)
✔ Choose your package manager · npm
✔ Choose your UI template · React - (https://react.dev/)
✔ Choose your UI flavor · TypeScript
✔ Would you like to setup the project for mobile as well? · yes

Template created! To get started run:
  cd OASIZ_TimeLogger2
  npm install
  npm run tauri android init

For Desktop development, run:
  npm run tauri dev

For Android development, run:
  npm run tauri android dev

npm notice
npm notice New minor version of npm available! 10.7.0 -> 10.8.1
npm notice Changelog: https://github.com/npm/cli/releases/tag/v10.8.1
npm notice To update run: npm install -g npm@10.8.1
npm notice

$ mv OASIZ_TimeLogger2/* ./
$ mv OASIZ_TimeLogger2/.* ./
$ rmdir OASIZ_TimeLogger2/
```

## run

```sh
npm i
npm run tauri dev
```


## Storybook 導入

`package.json` を以下の通り編集

```diff
diff --git a/package.json b/package.json
index e9b741d..6aa0f55 100644
--- a/package.json
+++ b/package.json
@@ -7,21 +7,41 @@
     "dev": "vite",
     "build": "tsc && vite build",
     "preview": "vite preview",
-    "tauri": "tauri"
+    "tauri": "tauri",
+    "storybook": "storybook dev -p 6006",
+    "build-storybook": "storybook build",
+    "init-msw": "msw init public/"
   },
   "dependencies": {
-    "react": "^18.2.0",
-    "react-dom": "^18.2.0",
     "@tauri-apps/api": ">=2.0.0-beta.0",
-    "@tauri-apps/plugin-shell": ">=2.0.0-beta.0"
+    "@tauri-apps/plugin-shell": ">=2.0.0-beta.0",
+    "react": "^18.2.0",
+    "react-dom": "^18.2.0"
   },
   "devDependencies": {
+    "@chromatic-com/storybook": "^1.6.1",
+    "@storybook/addon-essentials": "^8.1.11",
+    "@storybook/addon-interactions": "^8.1.11",
+    "@storybook/addon-links": "^8.1.11",
+    "@storybook/addon-mdx-gfm": "^8.1.11",
+    "@storybook/blocks": "^8.1.11",
+    "@storybook/react": "^8.1.11",
+    "@storybook/react-vite": "^8.1.11",
+    "@storybook/test": "^8.1.11",
+    "@tauri-apps/cli": ">=2.0.0-beta.0",
     "@types/react": "^18.2.15",
     "@types/react-dom": "^18.2.7",
     "@vitejs/plugin-react": "^4.2.1",
+    "eslint": "^8.57.0",
+    "eslint-plugin-react": "^7.34.1",
+    "eslint-plugin-react-hooks": "^4.6.0",
+    "eslint-plugin-react-refresh": "^0.4.6",
+    "internal-ip": "^7.0.0",
+    "msw": "^2.3.0",
+    "msw-storybook-addon": "^2.0.2",
+    "prop-types": "^15.8.1",
+    "storybook": "^8.1.11",
     "typescript": "^5.2.2",
-    "vite": "^5.3.1",
-    "@tauri-apps/cli": ">=2.0.0-beta.0",
-    "internal-ip": "^7.0.0"
+    "vite": "^5.3.1"
   }
 }
```

## Stroybook 実行

```sh
npm run storybook
```

その後、ホストで `http://localhost:6006` へアクセス。


## タブ UI 実現のためのパッケージインストール

```sh
npm install @mui/material @emotion/react @emotion/styled
```

## バックエンドの準備

```sh
cargo add diesel --features sqlite,chrono
cargo add dotenv
cargo install diesel_cli --no-default-features --features sqlite-bundled
cargo add chrono --features serde
```


## 初版の DB 定義作成

```sh
mkdir assets
diesel setup --database-url=asset/worklog.db
mkdir migrations
diesel migration generate v0.0.1
cat << EOF > migrations/2024-07-10-075640_v0.0.1/up.sql
create table work_log (
  work_no integer primary key autoincrement,
  work_name text not null,
  start_date text not null,
  end_date text
);
EOF
cat << EOF > migrations/2024-07-10-075640_v0.0.1/down.sql
drop table work_log;
EOF
diesel migration run --database-url=assets/worklog.db
```


## スクロールのためにフロントエンドにライブラリを追加

```sh
npm i react-scroll
npm i -D @types/react-scroll
```

