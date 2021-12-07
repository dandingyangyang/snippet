<!--
 * @Descripttion: 
 * @Author: yangxia
 * @Date: 2021-12-06 17:44:02
-->
# git命令

## git log

|  命令   | 含义  |
|  ----  | ----  |
| git log a   | 查看a分支的commit记录 |
| git log -p a   | 查看a分支每个commit的改动情况，比git log a具体 |
| git log --before="2021-8-1" --author="阳霞"  | 筛选日期和人员|
| git log --grep=wordppppppp  | 通过commit信息筛选|
| git log a.js | 查看a.js文件每次commit的改动 |
| git reflog | 记录本地的所有操作，但不会提交到远程。这个可以用来查看本地的一些操作 |


## git show

```shell
# 查看某个文件在某次commit中修改的内容
git show 794e288403bfae --/Users/yangxia/project/z.txt
```

## git diff

|  命令   | 含义  |
|  ----  | ----  |
| git diff   | 对比工作去与暂存区区别 |
| git diff --staged 或者 git diff --cached | 对比暂存区与本地仓库的区别 |
| git diff a b | b分支相对于a分支的详细改变
| git diff a b --stat | 显示出a b分支所有有差异的文件列表
| git diff a b 具体文件路径 | 显示指定a b分支上文件的详细差异


## git pull

```
git pull = git fetch + git merge
git pull -r = git fetch + git rebase
```

## git push

(1)删除远程分支用git push

```
git push origin --delete feature

git push -u origin feature

删除本地分支用 git branch -d feature
```

(2)将本地的a分支推送到远程仓库的b分支

```shell
git push origin a:b
```

## git merge

``` shell
git merge --abort 取消合并，回到合并前的状态
```

## git branch

(1)删除分支

``` shell
git branch -d feature 删除本地分支

git branch -D feature 强行删除本地分支

删除远程分支用git push

git push origin --delete feature

git push -u origin feature
```

(2) 通过commit号创建分支

```shell
git branch branch_a  3eac14d05bc
```

(3) 设置本地分支和远程分支的关联

```shell
git branch --set-upstream a origin/a
# 或者
git branch --set-upstream-to=origin/a  a
# 查看本地分支和远程分支的关联
git branch -v
```

## git checkout

```shell
#  将a.txt还原成未修改之前的样子
git checkout -- a.txt
git checkout HEAD~2
```

## git reset

```shell
# 将当前提交指向上一次提交，只是本地仓区指针移动，不覆盖工作区和暂存区。
git reset --softed Head~
# 将当前提交指向上一次提交，并覆盖暂存区的内容
git reset --mixed Head~ 或者git reset Head~
# 将当前提交指向上一次提交，并覆盖暂存区和工作区的内容
git reset --hard Head~
```

## git revert

```shell
# 撤销31432423421这个commit，不是撤销到31432423421这个commit。
# 所以如果要回退2个commit，那么要执行两次revert操作
git  revert 31432423421 
```

和git reset 的区别：git reset 不会有提交记录，git revert会有提交记录

## git cherry-pick

```shell
# 把1313414414 这个commit提交的内容合并到当前分支
git cherry-pick 1313414414 
```

## git stash

```shell
git add .
git stash save "信息"
git stash pop
git stash apply
# 查看第0个stash的内容是什么. -p 才能显示每个文件具体内容。不添加-p则只显示修改了哪些文件
git stash show -p stash@{0}
```

## git commit --amend

修改commit信息的方法
```shell
git commit --amend
# 修改倒数第三个commit信息
git rebase -i HEAD~3
```

## git remote

```shell
# 查看远程仓库
git remote -v
# 设置远程仓库方式一
git remote set-url origin [url] 
# 设置远程仓库方式二（先删除再设置）
git remote rm origin
git remote add origin [url]
# 设置远程仓库方式二（直接修改配置项）
# /etc/gitconfig文件包含了适用于系统所有用户和所有库的值
# 某用户下的全局的Git配置文件在～/.gitconfig
# 项目的git配置文件在.git/config
```

## 修改用户和邮箱

```shell
git config --global user.name "John Doe"
git config --global user.email johndoe@example.com
```
