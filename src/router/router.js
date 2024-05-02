import { createRouter, createWebHashHistory } from 'vue-router';
import Layout from '@/views/layout/Layout.vue';

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/login/Login.vue'),
    meta: { hideInMenu: true },
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('@/views/register/Register.vue'),
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
        meta: { title: '用户信息管理', icon: 'icon-xuesheng', limit: ['admin'], cache: true },
      },
      {
        path: 'carinfo',
        name: 'CarInfo',
        component: () => import('@/views/userpages/teacher/CarInfo.vue'),
        meta: { title: '车辆信息管理', icon: 'icon-xuesheng', limit: ['admin'], cache: true },
      },
      {
        path: 'notice',
        name: 'Notice',
        component: () => import('@/views/userpages/admin/Notice.vue'),
        meta: { title: '公告管理', icon: 'icon-xuesheng', limit: ['admin'], cache: true },
      },
      {
        path: 'order',
        name: 'Order',
        component: () => import('@/views/userpages/admin/Order.vue'),
        meta: { title: '预约管理', icon: 'icon-xuesheng', limit: ['admin'], cache: true },
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
