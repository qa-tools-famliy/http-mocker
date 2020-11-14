export default [
  {
    path: '/user',
    component: '../layouts/UserLayout',
    routes: [
      {
        name: 'login',
        path: '/user/login',
        component: './user/login',
      },
    ],
  },
  {
    path: '/',
    component: '../layouts/SecurityLayout',
    routes: [
      {
        path: '/',
        component: '../layouts/BasicLayout',
        authority: ['admin', 'user'],
        routes: [
          {
            path: '/',
            redirect: '/welcome',
          },
          {
            path: '/welcome',
            name: 'welcome',
            icon: 'smile',
            component: './Welcome',        // component对应的是组件的核心页面
            routes: [
              {
                path: '/admin/sub-page',   // path指的是routes.js中的path信息
                name: 'sub-page',          // name仅仅是名称，无实际影响
                icon: 'smile',             // icon表示的是图标
              },
            ],
          },
          {
            path: '/test',
            name: 'Test',
            icon: 'smile',
            component: './NewPage',        // component对应的是组件的核心页面
          },
          {
            path: 'https://pro.ant.design/docs/getting-started-cn',
            name: '文档',
            icon: 'smile',
            target: '_blank'
          },
          {
            path: '/admin',
            name: 'admin',
            icon: 'crown',
            component: './Admin',
            authority: ['admin'],
            routes: [
              {
                path: '/admin/sub-page',
                name: 'sub-page',
                icon: 'smile',
                component: './Welcome',
                authority: ['admin'],
              },
            ],
          },
          {
            name: 'list.table-list',
            icon: 'table',
            path: '/list',
            component: './ListTableList',
          },
          {
            component: './404',
          },
        ],
      },
      {
        component: './404',
      },
    ],
  },
  {
    component: './404',
  },
];
