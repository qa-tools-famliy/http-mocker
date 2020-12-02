# 本地部署文档

## 依赖描述

除了[readme.md](../../README.md)文档中提及的ETCD和MongoDB依赖而言，HTTP MOCKER本身的部署还依赖于Python3等环境。

本文主要讲解如何在本地（物理机、虚拟机等）搭建一个HTTP MOCKER的服务。

PS: 搭建HTTP MOCKER之前，需要保证ETCD和MongoDB搭建完成。

## Step By Step安装

准备工作：安装Python3环境。

Step1：clone http-mocker代码库

```bash
git clone https://github.com/qa-tools-famliy/http-mocker.git
```

Step2：安装第三方依赖库

```bash
cd ./http-mocker/backend/
pip3 install -r requirements.txt
```

Step3：设置配置信息环境变量

```bash
export HTTP_PORT=8080                # WEB页面端口配置
export MONGODB_URL_LIST=127.0.0.1    # MONGODB数据库地址
export MONGODB_PORT=8017             # MONGODB端口
export ETCD_ADDRESS=127.0.0.1        # ETCD地址
export ETCD_PORT=2379                # ETCD端口
export EVENTS_RESERVED_HOURS=6       # 请求记录保存时长（单位为小时）
```


Step4：启动HTTP MOCKER服务

```bash
python3 ./flask_server.py
```

PS: 如果希望后台启动，可以执行如下命令：

```bash
nohup python3 ./flask_server.py &
```
