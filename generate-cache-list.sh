#!/bin/bash

# 出力ファイル名
OUTPUT_FILE="cache-list.js"

# ファイルの先頭に const files_to_cache = [ を書き込む
echo "const files_to_cache = [" > "$OUTPUT_FILE"

# git ls-files の結果を整形して追記
git ls-files | sed -e "s#^#    './#g" -e "s/$/',/g" >> "$OUTPUT_FILE"

# ファイルの末尾に ]; を書き込む
echo "];" >> "$OUTPUT_FILE"

echo "Cache list generated in $OUTPUT_FILE"