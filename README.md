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

ファイルを追加・削除した場合は、以下のコマンドを実行してキャッシュリストを更新してください。

```sh
./generate-cache-list.sh
```

これにより、`cache-list.js`が生成され、Service Workerが新しいファイルリストを読み込むようになります。
