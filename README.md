Moriy - the deep fact
=====================

https://yamahei.github.io/enchant_moriy/

起動方法（ローカル）
--------

アセット読み込みの都合があり、Webサーバを起動します

```sh
cd ..
ruby -rsinatra -e 'set :bind, "0.0.0.0"; set :public_folder, "./", get("/"){"Hello world"}'
```

PWAのキャッシュ更新手順
--------------------

このゲームはPWAに対応しており、オフラインで動作します。オフラインで動作させるためには、Service Workerがキャッシュするファイルリストを最新に保つ必要があります。
ファイルを追加・削除した場合は、以下のコマンドを実行してキャッシュリスト（`cache-list.js`）を更新してください。

```sh
./generate-cache-list.sh
```

また、`pwabuilder-sw.js`のバージョンを更新して、pwaキャッシュの更新をブラウザが検出できるようにします。
```js
const CACHE_STORAGE_NAME = 'enchant_moriy_v1';//カウントアップする
```

ブランチ
---------

[リモートブランチに存在しないのブランチをすべて削除する](https://e-penguiner.com/remove-local-branches-not-on-remote/)

```sh
git fetch -p && git branch -vv | grep ': gone]' | awk '{print $1}' | xargs git branch -D
```