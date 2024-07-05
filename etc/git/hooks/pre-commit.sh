#!/bin/sh

# 禁止 master 分支上的 commit
branch=$(git rev-parse --symbolic --abbrev-ref HEAD)
if [ "master" == "$branch" ]; then
  echo "不能 commit 到 $branch 分支"
  exit 1
fi

# 允许以下分支上的 commit
# dev、dev-bty、dev-dgd、dev-ksbl 、
# hotfix/** 、 hotfix-bty/** 、 hotfix-dgd/** 、 hotfix-ksbl/** 、
# feature/** 、feature-bty/** 、feature-dgd/** 、feature-ksbl/** 、
if [ "dev" == "$branch" ] || [ "dev-bty" == "$branch" ] || [ "dev-dgd" == "$branch" ] || [ "dev-ksbl" == "$branch" ] || [ "hotfix/" == "${branch:0:7}" ] || [ "hotfix-dgd/" == "${branch:0:11}" ] || [ "hotfix-bty/" == "${branch:0:11}" ] || [ "hotfix-ksbl/" == "${branch:0:12}" ] || [ "feature/" == "${branch:0:8}" ] || [ "feature-dgd/" == "${branch:0:12}" ] || [ "feature-bty/" == "${branch:0:12}" ] || [ "feature-ksbl/" == "${branch:0:13}" ]; then
  # echo "允许 commit 到 $branch 分支"
  exit 0
else
  echo "不能 commit 到 $branch 分支,请遵循提交规则"
  exit 1
fi

if git rev-parse --verify HEAD >/dev/null 2>&1
then
	against=HEAD
else
	# Initial commit: diff against an empty tree object
	against=$(git hash-object -t tree /dev/null)
fi

# If you want to allow non-ASCII filenames set this variable to true.
allownonascii=$(git config --type=bool hooks.allownonascii)

# Redirect output to stderr.
exec 1>&2

# Cross platform projects tend to avoid non-ASCII filenames; prevent
# them from being added to the repository. We exploit the fact that the
# printable range starts at the space character and ends with tilde.
if [ "$allownonascii" != "true" ] &&
	# Note that the use of brackets around a tr range is ok here, (it's
	# even required, for portability to Solaris 10's /usr/bin/tr), since
	# the square bracket bytes happen to fall in the designated range.
	test $(git diff --cached --name-only --diff-filter=A -z $against |
	  LC_ALL=C tr -d '[ -~]\0' | wc -c) != 0
then
	cat <<\EOF
Error: Attempt to add a non-ASCII file name.

This can cause problems if you want to work with people on other platforms.

To be portable it is advisable to rename the file.

If you know what you are doing you can disable this check using:

  git config hooks.allownonascii true
EOF
	exit 1
fi

# If there are whitespace errors, print the offending file names and fail.
exec git diff-index --check --cached $against --
