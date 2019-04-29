import Login from './views/Login.vue'
import NotFound from './views/404.vue'
import Home from './views/Home.vue'
import My from './views/my.vue'
// import Main from './views/Main.vue'
// import Table from './views/other/Table.vue'
import have_subject from './views/subject/have_subject.vue'
import teacher_subject from './views/subject/teacher_subject.vue'
import User from './views/user/User.vue'
import goodWork from './views/goodWork/goodWork'
import workDetail from './views/goodWork/workDetail'

import auto_paper from './views/paper/auto_paper'
import manual_paper from './views/paper/manual_paper'

import questions from './views/questions/questions'

import paperManager from './views/paper/paperManager'

const routes = [
  {
    path: '/login',
    component: Login,
    name: '',
    hidden: true
  },
  {
    path: '/404',
    component: NotFound,
    name: '',
    hidden: true
  },
  {
    path: '/',
    component: Home,
    name: '个人信息',
    iconCls: 'el-icon-info',
    leaf: true, // 只有一个节点
    children: [
      { path: '/My', component: My, name: '个人信息', meta: { roles: ['1', '2', '3'] }}
    ]
  },
  {
    path: '/',
    component: Home,
    name: '用户管理',
    iconCls: 'fa fa-user-o',
    leaf: true, // 只有一个节点
    children: [
      { path: '/User', component: User, name: '用户管理', meta: { roles: ['1'] }}
    ]
  },
  {
    path: '/',
    component: Home,
    name: '优秀作品管理',
    iconCls: 'fa fa-heart-o',
    hidden: true,
    leaf: true,
    children: [
      { path: '/goodWork', component: goodWork, name: '优秀作品', meta: { roles: ['1', '2', '3'] }},
      { path: '/workDetail', component: workDetail, name: '作品详情', meta: { roles: ['1', '2', '3'] }}
    ]
  },

  {
    path: '/',
    component: Home,
    name: '试题管理',
    iconCls: 'fa fa-file-o', // 图标样式class
    leaf: true,
    children: [
      // { path: '/main', component: Main, name: '主页', hidden: true },
      // { path: '/table', component: Table, name: 'Table' },
      // { path: '/form', component: Form, name: 'Form' },
      // { path: '/user', component: user, name: '列表' }
      { path: '/questions', component: questions, name: '试题管理', meta: { roles: ['1', '2'] }}

    ]
  },
  {
    path: '/',
    component: Home,
    name: '科目管理',
    iconCls: 'fa fa-book',
    roles: ['1'],
    children: [
      { path: '/have_subject', component: have_subject, name: '科目库管理', meta: { roles: ['1'] }},
      { path: '/teacher_subject', component: teacher_subject, name: '科目关联管理', meta: { roles: ['1'] }}
    ]
  },
  {
    path: '/',
    component: Home,
    name: '出卷管理',
    iconCls: 'el-icon-edit',
    roles: ['1', '2'],
    children: [
      { path: '/manual_paper', component: manual_paper, name: '手动出卷', meta: { roles: ['1', '2'] }},
      { path: '/auto_paper', component: auto_paper, name: '自动组卷', meta: { roles: ['1', '2'] }},
      { path: '/paperManager', component: paperManager, name: '试卷管理', meta: { roles: ['1', '2'] }}
    ]
  },
  // {
  //     path: '/',
  //     component: Home,
  //     name: 'Charts',
  //     iconCls: 'fa fa-bar-chart',
  //     children: [
  //         { path: '/echarts', component: echarts, name: 'echarts' }
  //     ]
  // },
  {
    path: '*',
    hidden: true,
    redirect: { path: '/404' }
  }
]

export default routes
