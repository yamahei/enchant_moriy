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
