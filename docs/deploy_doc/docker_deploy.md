# Docker部署文档

和本地部署一样，Docker镜像部署也需要用户自己提前部署好依赖服务ETCD和MongoDB。

在本文中，我们将会讲解如何利用Docker镜像部署HTTP MOCKER服务。

## Docker镜像名称

```
wangzhe0912/http-mocker
```


## 启动命令

Step1：拉取镜像

```bash
docker pull wangzhe0912/http-mocker
```

Step2：启动Docker镜像

```bash
docker run -p 8080:8080 -d \
    -e MONGODB_URL_LIST="10.10.10.10"   \
    -e MONGODB_PORT="8017"   \
    -e ETCD_ADDRESS="10.10.10.10"   \
    -e ETCD_PORT="2379"   \
    -e EVENTS_RESERVED_HOURS="6"   \
    wangzhe0912/http-mocker
```

其中：

1. MONGODB_URL_LIST是MongoDB的HOST地址，副本集时多个地址之间用,分隔。
2. MONGODB_PORT是MongoDB端口地址
3. ETCD_ADDRESS是ETCD的HOST地址
4. ETCD_PORT是ETCD的端口
5. EVENTS_RESERVED_HOURS表示请求记录保存时长（单位为小时）
