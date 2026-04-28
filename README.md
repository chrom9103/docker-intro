# Digitart Docker-intro

Docker講習会では、モダンなアプリケーション開発において不可欠なコンテナ技術であるDockerを通して、環境構築の重要性と効率性を学びます。

## 目次

- はじめに
  - [Dockerが必要な理由](#01-dockerが必要な理由)
  - [事前準備](#02-事前準備)
- Docker基礎講習
  - [なぜDockerが必要なのか](#10-なぜdockerが必要なのか)
    - [Docker なし環境の実演](#101-docker-なし環境の実演)
    - [環境統一の問題](#102-環境統一の問題)
  - [Docker の基礎知識](#11-docker-の基礎知識)
    - [Docker とは](#111-docker-とは)
    - [Dockerfile とは](#112-dockerfile-とは)
    - [docker-compose とは](#113-docker-compose-とは)
    - [基本的なコマンド](#114-基本的なコマンド)
- Docker実践講習
  - [サンプルアプリケーション](#20-サンプルアプリケーション)
    - [概要](#201-概要)
    - [ディレクトリ構成](#202-ディレクトリ構成)
  - [Docker でアプリを動かす](#21-docker-でアプリを動かす)
    - [Dockerfile の説明](#211-dockerfile-の説明)
    - [docker-compose.yml の説明](#212-docker-composeyml-の説明)
    - [実行してみよう](#213-実行してみよう)
  - [アプリを操作してみる](#22-アプリを操作してみる)
    - [フロントエンドで TODO 作成](#221-フロントエンドで-todo-作成)
    - [バックエンドの動作確認](#222-バックエンドの動作確認)
- まとめ
  - [今日学んだこと](#30-今日学んだこと)
  - [次のステップ](#31-次のステップ)

---

## 0. はじめに

### 0.1. Dockerが必要な理由

> Docker（ドッカー）は、コンテナ仮想化を用いてアプリケーションを開発・配置・実行するためのオープンプラットフォームである。
> ー Wikipedia「Docker」より(2026年4月28日閲覧)

「コンテナ仮想化」とは...  
- アプリケーションが稼働するために必要なものは色々ある  
- 各種ライブラリ、設定ファイル、アプリケーションコード等々  
- その必要なもの色々をまとめて「イメージ」というカタマリの中に入れておく  
その「イメージ」から起動した「コンテナ」さえあれば、アプリケーションを動かすことができる状態を作る  

**「自分の環境では動くのに、相手の環境では動かない」** という経験はありませんか？？
web開発では依存するライブラリのバージョン、設定、ゲーム開発ではUnityのバージョンなど...
これらの問題の主な原因は、**開発環境の違い**です。  

Docker を使うことで、**どの環境でも同じように動くアプリケーション**を作ることができます。  
Dockerさえあれば...  
うれしくないですか?!?!  

---

### 0.2. 事前準備

Dockerを自分のPCに導入してください！！  

#### 0.2.1. Docker Desktop のインストール

<details><summary>Windows ユーザー向け</summary>

1. [Docker Desktop for Windows](https://www.docker.com/products/docker-desktop) からダウンロードします。
2. ダウンロードした `.exe` ファイルを実行し、指示に従ってインストールします。
3. インストール完了後、PowerShell を再起動し、以下のコマンドで確認します：
   ```bash
   docker --version
   ```
   バージョン情報が表示されれば成功です。

</details>

<details><summary>Mac ユーザー向け</summary>

// WRITE ME!!

</details>

> [!IMPORTANT]
> インストール時に問題が起きた場合は、気軽に質問してください！

#### 0.2.2. 講習用フォルダの作成

演習用のファイルを収納するフォルダを作成しましょう。

```bash
cd ~
mkdir -p develops/docker-intro
cd develops/docker-intro
```

このフォルダが今回の作業ディレクトリになります。

---

## 1. なぜDockerが必要なのか

### 1.0. Docker なし環境の実演

それでは、Docker **を使わずに** React + PostgreSQL の開発環境を構築する場合、どのような手順が必要か見てみましょう。

講師が実際に Ubuntu マシンで環境構築を行い、その手間の多さを体感してもらいます。

#### 1.0.1. Linux (Ubuntu) 環境構築実演

**講師の実演内容：**

```bash
# 1. システムの更新
sudo apt-get update
sudo apt-get upgrade

# 2. Node.js と npm のインストール
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# 3. React プロジェクトの作成
npm create vite@latest todo-app -- --template react
cd todo-app
npm install

# 4. バックエンド (Express) の初期設定
npm install express cors pg dotenv

# 5. PostgreSQL のインストール
sudo apt-get install -y postgresql postgresql-contrib

# 6. PostgreSQL サービスの起動と初期化
sudo service postgresql start
sudo -u postgres createdb todo_db

# 7. スキーマ作成
# todo_db に接続して、テーブルを作成
# ...複数ステップが必要

# 8. CORS設定、ポート設定、DB接続文字列設定 など...複数の設定ファイル編集

# 9. フロントエンド、バックエンド、DB を別々に起動
# ターミナルを複数個開いて、それぞれで起動...
```

**この時点で既に 20 分以上経過しています！**

### 1.0.2. 環境統一の問題

もし受講生が同じ手順で家に帰ってやってみると：

| 項目 | 結果 |
|------|------|
| **Windows ユーザー** | PowerShell での手順が異なる、npm パッケージのインストール失敗、PostgreSQL の設定が違う |
| **Mac ユーザー** | Homebrew での手順が異なる、M1/M2 Mac での互換性問題 |
| **Node.js のバージョン** | システムに既にインストール済みのバージョンが干渉 |
| **PostgreSQL** | バージョン、パスの設定、ポート競合 |

このように、**OS ごと**、**マシンごと** に異なる問題が発生します。

> [!TIP]
> Docker を使えば、**上記の全ての環境構築をスキップ**して、1コマンドで全員が同じ環境を手に入れることができます！

---

## 1.1. Docker の基礎知識

では、Docker がどのような仕組みで環境統一を実現しているのか、ざっくり理解しましょう。

### 1.1.1. Docker とは

Docker は、**アプリケーションとその実行環境をまとめて、ディスク上に固めてしまう技術**です。

```
従来の方法：
┌─────────────────────────────────────┐
│  Mac          │ Windows    │ Linux  │
├─────────────────────────────────────┤
│アプリ         │アプリ      │アプリ  │
├─────────────────────────────────────┤
│Node 18.x      │Node 20.x   │Node 18.x + 古い npm |
├─────────────────────────────────────┤
│PostgreSQL pg  │PostgreSQL psql │...
└─────────────────────────────────────┘
     ↓ 「これ動きません」

Docker を使った方法：
┌─────────────────────────────────────┐
│    コンテナ（Docker Image）        │
├─────────────────────────────────────┤
│  アプリケーション                  │
│  + Node.js 18.x                    │
│  + npm v9                          │
│  + PostgreSQL 15                   │
│  + その他全ての依存ファイル        │
└─────────────────────────────────────┘
    ↓ 全員で実行
┌─────────────────────────────────────┐
│  Mac  │ Windows  │ Linux  │ ...     │
│ 同じ結果が得られる！               │
└─────────────────────────────────────┘
```

> [!NOTE]
> Docker の正確な内部構造は複雑ですが、ひとまず「環境ごと固める技術」という理解で十分です。

### 1.1.2. Dockerfile とは

**Dockerfile** は、「どのような環境のコンテナを作るのか」を定義するファイルです。

```dockerfile
# ベースとなる Node.js イメージを使用
FROM node:18

# コンテナ内の作業ディレクトリを指定
WORKDIR /app

# ホスト側のファイルをコンテナにコピー
COPY package*.json ./

# npm で依存ライブラリをインストール
RUN npm install

# アプリケーション本体をコピー
COPY . .

# ポート 3000 を外からアクセス可能にする
EXPOSE 3000

# コンテナ起動時に実行するコマンド
CMD ["npm", "run", "dev"]
```

> [!TIP]
> Dockerfile は、**料理のレシピ** のようなものです。「この材料を入れて、この順番で調理する」という指示書が Dockerfile です。

### 1.1.3. docker-compose とは

一般的なアプリケーションは複数のサービスが連携しています：
- フロントエンド（React）
- バックエンド（Express）
- データベース（PostgreSQL）

それぞれに Dockerfile を作って個別に起動するのは面倒ですよね。

**docker-compose** は、複数のコンテナを一度に管理するツールです。

```yaml
version: '3.8'

services:
  # フロントエンド
  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
    depends_on:
      - backend

  # バックエンド
  backend:
    build: ./backend
    ports:
      - "5000:5000"
    depends_on:
      - db

  # データベース
  db:
    image: postgres:15
    environment:
      POSTGRES_PASSWORD: password
      POSTGRES_DB: todo_db
    volumes:
      - db_data:/var/lib/postgresql/data

volumes:
  db_data:
```

このファイルがあれば、以下の 1 コマンドで全ての環境が整って起動します：

```bash
docker compose up --build
```

### 1.1.4. 基本的なコマンド

この講習では、実質 1 つのコマンドだけ覚えればOKです：

```bash
docker compose up --build
```

| コマンド | 説明 |
|---------|------|
| `docker compose up --build` | `docker-compose.yml` で定義された全てのコンテナをビルドして起動 |

> [!NOTE]
> `--build` フラグは「ファイルに変更があったら、イメージを最新の状態で再ビルドする」という意味です。

その他の基本的なコマンド（参考）：
- `docker compose down` - コンテナを停止・削除
- `docker ps` - 実行中のコンテナ一覧表示
- `docker logs <container_name>` - コンテナのログ表示

---

## 2. Docker実践講習

### 2.0. サンプルアプリケーション

#### 2.0.1. 概要

**TODO リスト Web アプリ**

このアプリケーションは以下の構成です：

- **フロントエンド**: React + Vite（ユーザーインターフェース）
- **バックエンド**: Express.js（API サーバー）
- **データベース**: PostgreSQL（TODO データ保存）

ユーザーはフロントエンドで TODO を入力→バックエンド API を通じて→PostgreSQL に保存、という流れです。

#### 2.0.2. ディレクトリ構成

```
docker-intro/
├── README.md                    ← このファイル
├── docker-compose.yml           ← 全サービスの定義
├── frontend/
│   ├── Dockerfile              ← React ビルド設定
│   ├── package.json
│   ├── src/
│   │   ├── App.jsx
│   │   ├── App.css
│   │   └── main.jsx
│   └── index.html
├── backend/
│   ├── Dockerfile              ← Express ビルド設定
│   ├── package.json
│   ├── server.js               ← メインサーバーコード
│   └── .env
└── database/
    └── init.sql                ← PostgreSQL 初期設定スクリプト
```

---

### 2.1. Docker でアプリを動かす

#### 2.1.1. Dockerfile の説明

**フロントエンド (frontend/Dockerfile)**

```dockerfile
# ビルドステージ
FROM node:18 AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# 本番ステージ
FROM node:18
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY package*.json ./
RUN npm install --production

EXPOSE 3000
CMD ["npm", "run", "preview"]
```

**バックエンド (backend/Dockerfile)**

```dockerfile
FROM node:18
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

EXPOSE 5000
CMD ["node", "server.js"]
```

#### 2.1.2. docker-compose.yml の説明

```yaml
version: '3.8'

services:
  # React フロントエンド
  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
    environment:
      - VITE_API_URL=http://localhost:5000
    depends_on:
      - backend
    networks:
      - app-network

  # Express バックエンド
  backend:
    build: ./backend
    ports:
      - "5000:5000"
    environment:
      - DATABASE_URL=postgresql://user:password@db:5432/todo_db
    depends_on:
      - db
    networks:
      - app-network

  # PostgreSQL データベース
  db:
    image: postgres:15
    ports:
      - "5432:5432"
    environment:
      POSTGRES_USER: user
      POSTGRES_PASSWORD: password
      POSTGRES_DB: todo_db
    volumes:
      - db_data:/var/lib/postgresql/data
      - ./database/init.sql:/docker-entrypoint-initdb.d/init.sql
    networks:
      - app-network

volumes:
  db_data:

networks:
  app-network:
```

> [!TIP]
> - `depends_on`: サービス間の起動順序を指定（db → backend → frontend の順番になる）
> - `environment`: 環境変数を設定（データベース接続情報など）
> - `volumes`: データベースのファイルをホスト側に永続化（コンテナ削除してもデータが残る）

#### 2.1.3. 実行してみよう

それでは、実際に Docker でアプリケーションを起動してみます。

```bash
# docker-intro ディレクトリに移動
cd ~/develops/docker-intro

# 全ての環境をビルドして起動
docker compose up --build
```

初回は Docker イメージをダウンロード・ビルドするため、数分かかります。

ログにエラーがなく、以下のようなメッセージが表示されれば成功です：

```
backend    | Server is listening on port 5000
frontend   | VITE v5.0.0 ready in 500 ms
db         | database system is ready to accept connections
```

> [!NOTE]
> 各コンテナのログが出力されます。何か問題があれば、ここでエラーメッセージが表示されます。

---

### 2.2. アプリを操作してみる

#### 2.2.1. フロントエンドで TODO 作成

ブラウザで http://localhost:3000 にアクセスしてください。

React アプリケーションが表示されます。

TODO リストアプリで以下の操作をしてみましょう：
- テキストボックスに TODO を入力
- 「追加」ボタンをクリック
- TODO がリストに表示される
- 「完了」をクリックすると、TODO に線が引かれる
- 「削除」をクリックすると、TODO が削除される

> [!TIP]
> フロントエンドで行った操作は、バックエンド API を通じてデータベースに保存されています。
> ページをリロードしても、データが残っていることが確認できます。

#### 2.2.2. バックエンドの動作確認

バックエンド API の動作確認も可能です。

別のターミナルウィンドウを開いて、以下のコマンドを実行してください：

```bash
# TODO 一覧を取得
curl http://localhost:5000/api/todos

# 新規 TODO を作成
curl -X POST http://localhost:5000/api/todos \
  -H "Content-Type: application/json" \
  -d '{"title": "新しい TODO"}'
```

結果が JSON 形式で返ってくれば、API が正常に動作しています。

---

## 3. まとめ

### 3.0. 今日学んだこと

**Docker を使うことで、以下のことが実現できました：**

1. ✅ **1 コマンドで全員が同じ環境を構築**
   - OS の違い（Windows, Mac, Linux）に関係なく、全く同じ結果が得られた

2. ✅ **複雑な環境設定をスキップ**
   - Node.js, PostgreSQL, npm パッケージの個別インストールが不要

3. ✅ **複数サービスの連携が簡単**
   - フロントエンド、バックエンド、データベースが自動で連携

4. ✅ **再現性が高い**
   - 同じ Dockerfile / docker-compose.yml があれば、いつでも同じ環境を再現可能

### 3.1. 次のステップ

Docker の学習を続ける場合、以下のトピックを学ぶと良いでしょう：

- **Docker レジストリ**: Docker Hub へのイメージ公開
- **本番環境への展開**: AWS, Google Cloud, Azure などでの運用
- **ネットワーク設定**: より複雑なマイクロサービス構成
- **パフォーマンス最適化**: イメージサイズの削減、レイヤーキャッシングの活用

---

> [!IMPORTANT]
> Docker は、モダンな開発になくてはならないツールです。  
> 今日学んだ概念をベースに、実践を重ねることで、さらに理解が深まります。  
> 質問や不明な点があれば、気軽に相談してください！

---

**講習会の開催お疲れ様でした！**
