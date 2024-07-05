#!/bin/sh

commit_msg=`cat $1`

#commit_msg_reg="^(merge |Merge |update: |new: |fix: |docs: |refactor: |update:|new:|fix:|docs:|refactor:)(\(.+\))?: .{1,100}"
commit_msg_reg="^(merge |Merge |update: |new: |fix: |docs: |refactor: |update:|new:|fix:|docs:|refactor:)"

if [[ ! $commit_msg =~ $commit_msg_reg ]]
then
    echo "\n不合法的 commit 消息提交格式，请使用正确的格式！\
    \n格式：merge |Merge |update: |new: |fix: |docs: |refactor: |update:|new:|fix:|docs:|refactor:     \n详情请查看 "

    # 异常退出
    exit 1
fi
test "" = "$(grep '^Signed-off-by: ' "$1" |
         sort | uniq -c | sed -e '/^[   ]*1[    ]/d')" || {
        echo >&2 Duplicate Signed-off-by lines.
        exit 1
}



