# http-mocker

该项目是一个通用的HTTP Mock服务，支持任意URL请求、自定义接口响应、自定义延迟响应、自定义异常注入、请求记录持久化与条件查询。

该服务有着大量的应用场景：

1. 项目测试中的模块级别测试中用于去除依赖组件的影响。
2. 项目测试中针对HTTP回调等场景的场景的验证。
3. 前后端分离开发项目中的前端开发通过Mock接口去除对后端服务的依赖。
4. 另外，该项目中的HTTP Mock服务还支持了自定义延迟响应、自定义异常注入等功能，在模块测试、回调测试等场景中，还可以通过注入Mock服务异常来验证在周边模块异常后，我们自身服务的异常处理能力。

## 项目依赖：

对于http-mocker服务来言，存在两个依赖服务，分别是：

1. ETCD：用于记录自定义的Mock规则，该依赖必备，否则无法启动。[ETCD安装](https://qa.missshi.com/databases/etcd/install.html)
2. MongoDB：用于支持请求记录持久化与条件查询，如果没有请求记录查询诉求，可以禁用该功能，此时，MongoDB依赖可以忽略。如果需要请求记录持久化与条件查询，那么MongoDB依赖必备。[mongodb安装](https://qa.missshi.com/databases/mongo/install.html）

## 服务部署

我们的服务支持如下几种部署方式：

1. 本地部署。
2. Docker部署。
3. K8s部署。

## 使用指南

### QuickStart

### Web使用介绍

### HTTP REST接口介绍

## 常见问题



