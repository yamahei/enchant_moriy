#!/bin/bash

# キャッシュしないファイル名のリストファイル（人力で作って配置する）
# ATTENTION: ${TEMP_FILE}と同じパス構造じゃないと比較できない
# ATTENTION: 改行コードはLFで統一すること
IGNORE_FILE="dont-cache-list.txt"

# 一時ファイル
TEMP_FILE="/tmp/file-in-repository-list.txt"
git ls-files > "$TEMP_FILE"
DIFF_FILE="/tmp/file-to-cache-list.txt"
comm -3 <(cat "$TEMP_FILE" | sort) <(cat "$IGNORE_FILE" | sort) > "$DIFF_FILE"
# 出力ファイル名
OUTPUT_FILE="cache-list.js"

# ファイルの先頭に const files_to_cache = [ を書き込む
echo "const files_to_cache = [" > "$OUTPUT_FILE"

# git ls-files の結果を整形して追記
echo ${DIFF_FILE} | sed -e "s#^#    './#g" -e "s/$/',/g" >> "$OUTPUT_FILE"

# ファイルの末尾に ]; を書き込む
echo "];" >> "$OUTPUT_FILE"

echo "Cache list generated in $OUTPUT_FILE"