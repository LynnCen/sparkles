# Node 14 基础镜像
FROM node:14

LABEL maintainer="fuhanfeng@linhuiba.com"

# 安装 NPM 7
RUN npm install npm@7

# 替换成阿里云源
RUN sed -i -E 's/(deb|security).debian.org/mirrors.aliyun.com/g' /etc/apt/sources.list

# 安装 rsync
RUN apt-get update -y && apt-get install rsync -y
