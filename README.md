# 将棋AI (shogi-frontend)

## 概要

本プロジェクトは，[shogi_ai](https://github.com/sogawa10/shogi_ai)プロジェクトで実装したAPIおよびAI機能を用いて，将棋AI対局Webサイトを自前実装することを目的とした学習用プロジェクトです．

本プロジェクトでは，**ユーザーのログイン機能**，**サードパーティーの将棋AI登録機能**，そして**user対AIの対局機能**や**AI対AIの対局機能**を段階的に実装します．

## プロジェクト内のディレクトリ構成

1. node_modulesフォルダ\
   → npmでインストールされたライブラリが格納されるディレクトリ．`npm install`を実行すると自動的に生成される．容量が大きいため，通常はGitで管理しない．
2. publicフォルダ\
   → **静的ファイル**（画像や音楽，フォント等）を置いておく．ここに置かれたファイルは，ビルド時にそのまま公開ディレクトリにコピーされる．
3. srcフォルダ\
  → Reactのソースコードを配置するディレクトリ．
   - assetsフォルダ\
     → CSSなどの外部ファイルを配置する．
   - main.tsx\
     → **Reactアプリケーションのエントリーポイント**である．index.html内の`<div id="root"></div>`にReactアプリをマウントする処理が記述される．このファイルからトップレベルコンポーネントであるApp.tsxが読み込まれる．
4. .gitignore\
   → GitHubにアップロードしたくないファイルを記述する．
5. eslint.config.js\
   → コードの書き方のルールや，フォーマットを指定する設定ファイル．
6. index.html\
   → **Webページの基本構造を定義する**HTMLファイル．`<div id="root"></div>`の部分にReactアプリケーションが挿入される．また，ページタイトルなどもこのファイルで設定できる．
7. package-lock.json\
   → ライブラリの依存関係を厳密に管理するためのファイル．特に触る必要はない．
8. package.json\
   → **どのライブラリをどのバージョンで使うのか**と，**どんなコマンドを使えるのか**が書いてある．`npm install`を実行すると，記述されているライブラリがダウンロードされる．
9. tsconfig.app.json\
   → ブラウザ環境用のTypeScript設定ファイル．
10. tsconfig.json\
   → 共通のTypeScript設定ファイル．
11. tsconfig.node.json\
   → Node.js環境用のTypeScript設定ファイル．
12. vite.config.ts\
   → Viteの設定ファイル．新規でプラグインを追加する等しない限り，特に触る必要はない．

## 使い方

### 簡易Webサーバーを起動する際は，以下のコマンドを入力してください．
`npm run dev`

## システムの全体像

![Image](https://github.com/user-attachments/assets/6f1ec107-2347-49db-ae23-745df532a6e7)

## ライセンス

このプロジェクトは，MITライセンスの下でライセンスされています．