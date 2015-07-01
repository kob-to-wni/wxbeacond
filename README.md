# wxbeacond

WxBeaconのデータをWebSocket経由でブラウザに送ることで、ブラウザ経由でWxBeaconのデータを閲覧できるようにする、WxBeacon Daemonです。
簡易HTTPサーバーを実装しているので、wxbeacond.jsと同じ場所に置いたファイルは、ブラウザーから読み取ることができます。

## 動作に必要なモジュール

* node.js (or io.js)
* bleacon NPM module
* moment NPM module
* socket.io NPM module

## 最低動作環境

* bleaconモジュールが対応しているOS（Mac OS X / Linux）
* WebSocketに対応したブラウザ

## 起動方法

```Shell
node wxbeacond.js
```

でサーバーを起動したあとに、ブラウザで、http://localhost:8888/ にアクセス。

## ライセンス

MIT
