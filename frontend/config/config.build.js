// https://umijs.org/config/
import { defineConfig } from 'umi';
import defaultSettings from './defaultSettings';
import proxy from './proxy';
import routes from './routes';
const { REACT_APP_ENV } = process.env;
export default defineConfig({
  hash: true,
  antd: {},
  dva: {
    hmr: true,
  },
  history: {
    type: 'hash',
  },
  locale: {
    // default zh-CN
    default: 'zh-CN',
    antd: true,
    // default true, when it is true, will use `navigator.language` overwrite default
    baseNavigator: true,
  },
  dynamicImport: {
    loading: '@/components/PageLoading/index',
  },
  targets: {
    ie: 11,
  },
  // umi routes: https://umijs.org/docs/routing
  routes,
  // Theme for antd: https://ant.design/docs/react/customize-theme-cn
  theme: {
    'primary-color': defaultSettings.primaryColor,
  },
  title: false,
  ignoreMomentLocale: true,
  // 开启Mock
  // proxy: proxy[REACT_APP_ENV || 'dev'],
  // 关闭mock
  proxy: {
    '/api': {
      'target': 'http://192.168.1.22:8080/',
      'changeOrigin': true,
    },
  },
  manifest: {
    basePath: '/',
  },
  exportStatic: {},
  esbuild: {},
  base: '../static/',
  publicPath: '../static/',
  dynamicImport: false,
});
