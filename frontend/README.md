# Ant Design Pro

该项目是基于Ant Design Pro 4.0 + Ant Design 3.0组成的前端框架，后续一段时间内相关的前端开发均会基于该框架。
使用方式：直接完成拷贝，然后基于拷贝的项目进行开发即可。

目录和核心文件说明：

1. config/config.js文件：全局配置文件。
2. config/routes.js文件：全局路由配置。
3. src/pages目录：路由页面，可以每个路由对应的可以是目录，也可以是文件。
4. src/models目录：数据Store中心，调用service中的API接口，提供数据给pages。
5. src/services目录：发送请求。
6. src/components目录：公共组件提取。

开发规则：

1. models与services文件一一对应。
2. pages下全部为目录，每个目录下包含一系列文件，页面引用的非公共组件的页面全部放在该目录下。每个目录对应一个子页面。
3. 每个一级目录对应一个model + service。

## Environment Prepare

Install `node_modules`:

```bash
npm install
```

## Provided Scripts

Ant Design Pro provides some useful script to help you quick start and build with web project, code style check and test.

Scripts provided in `package.json`. It's safe to modify or add additional script:

### 启动项目

```bash
./start.sh
```

### 构建项目

```bash
./build.sh
```
