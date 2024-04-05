import { createRouter, createWebHashHistory } from 'vue-router';
import Layout from '@/views/layout/Layout.vue';

/*
路由说明：
    新增的路由可挂载到路由'/'的子路由下，也可直接新增路由项。
    带有子路由的路由项默认在侧边栏菜单呈现嵌套结构，支持多重路由嵌套。
    name：应该与路由对应的组件名称一致，否则KeepAlive无法正常工作
    meta{
        title:侧边栏菜单名
        icon：显示在侧边栏的图标（本项目使用阿里图标库的css图标）
        limit：权限控制，列表项为能访问到当前路由的角色，与当前角色权限不符的路由不会显示在侧边栏菜单
        fixCache：是否固定缓存该路由对应的组件，选择此项的路由同时会固定在tagViews不可删除
        cache：是否缓存该路由对应的组件，可在tagViews中清除
        isLink：表明该路由对应外链
        hideInMenu:决定当前路由是否在侧边栏菜单隐藏
    }
*/

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/login/Login.vue'),
    meta: { hideInMenu: true },
  },
  {
    path: '/',
    component: Layout,
    redirect: '/homepage',
    meta: { hideInMenu: true },
    children: [
      {
        path: 'homepage',
        name: 'HomePage',
        component: () => import('@/views/userpages/HomePage.vue'),
        meta: { title: '首页', icon: 'icon-shouye', limit: ['admin', 'teacher', 'student'], fixCache: true },
      },
      {
        path: 'account',
        name: 'UserInfo',
        component: () => import('@/views/userpages/UserInfo.vue'),
        meta: { title: '个人信息', icon: 'icon-user-circle', limit: ['admin', 'teacher', 'student'] },
      },
      {
        path: 'classroom',
        name: 'classroomMenu',
        redirect: '/classroom/classroom-query',
        meta: { title: '预约', icon: 'icon-jiaoshi', limit: ['student'] },
        children: [
          // {
          //   path: 'classroom-query',
          //   name: 'ClassRoom',
          //   component: () => import('@/views/userpages/ClassRoom.vue'),
          //   meta: { title: '教室查询', icon: '', limit: ['admin', 'teacher', 'student'], cache: true },
          // },
          {
            path: 'arrange-classroom',
            name: 'ArrangeClassroom',
            component: () => import('@/views/userpages/ArrangeClassroom.vue'),
            meta: { title: '预约练车', icon: '', limit: ['admin', 'teacher', 'student'] },
          },
        ],
      },
      {
        path: 'course-select',
        name: 'course-select',
        redirect: '/course-select/selected-course',
        meta: { title: '学员预约管理', icon: 'icon-kechengguanli', limit: ['teacher'] },
        children: [
          {
            path: 'selected-course',
            name: 'SelectedCourse',
            component: () => import('@/views/userpages/student/SelectedCourse.vue'),
            meta: { title: '已确认预约', icon: '', limit: ['teacher'] },
          },
          {
            path: 'select-course',
            name: 'SelectCourse',
            component: () => import('@/views/userpages/student/SelectCourse.vue'),
            meta: { title: '选择预约', icon: '', limit: ['student', 'teacher'] },
          },
        ],
      },
      {
        path: 'studentinfo',
        name: 'StudentInfo',
        component: () => import('@/views/userpages/teacher/StudentInfo.vue'),
        meta: { title: '学生信息管理', icon: 'icon-xuesheng', limit: ['admin'], cache: true },
      },
      {
        path: 'carinfo',
        name: 'CarInfo',
        component: () => import('@/views/userpages/teacher/CarInfo.vue'),
        meta: { title: '车辆信息管理', icon: 'icon-xuesheng', limit: ['admin'], cache: true },
      },
    ],
  },
  {
    path: '/404',
    component: () => import('@/views/error/404.vue'),
    meta: { hideInMenu: true },
  },
  {
    path: '/401',
    component: () => import('@/views/error/401.vue'),
    meta: { hideInMenu: true },
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/404',
    meta: { hideInMenu: true },
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
