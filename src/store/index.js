import { defineStore } from 'pinia';
import { getToken, setToken } from '@/utils/token';
import { useRouter } from 'vue-router';
import { reUserInfo } from '@/api/common.js';

//存储用户的身份信息与拥有权限的路由
export const useUserStore = defineStore('user', {
  state: () => {
    return {
      token: getToken(),
      role: 'visitor',
      userName: 'visitor',
      phone: null,
      isLogin: false,
      userRoutes: [],
    };
  },
  actions: {
    async updataUserInfo() {
      const role = {
        0: 'student',
        1: 'teacher',
        2: 'admin',
      };
      let info = await reUserInfo();
      if (info.code == 200) {
        if (info.data.role == 0) {
          this.coachPhone = info.data.coachPhone;
          this.coachNmae = info.data.coachNmae;
        }
        this.role = role[info.data.role];
        this.userName = info.data.realName;
        this.phone = info.data.phone;
        this.idCard = info.data.idCard;
        this.sex = info.data.sex;
        this.realName = info.data.realName;
        this.isLogin = true;
        return true;
      } else return false;
    },

    resetUserInfo() {
      this.role = 'visitor';
      this.userName = 'visitor';
      this.phone = null;
      this.isLogin = false;
    },

    updataToken(token) {
      setToken(token);
      this.token = token;
    },

    getUserRoutes() {
      const router = useRouter();
      const routes = router.getRoutes();
      let showMenu = [];
      routes.forEach((item) => {
        if (!item.meta.hideInMenu && item.path.match(/\//g).length == 1)
          if (!item.meta.limit || item.meta.limit.indexOf(this.role) != -1) showMenu.push(item);
      });
      this.userRoutes = showMenu;
    },
  },
});

//项目设置
export const useSetStore = defineStore('set', {
  state: () => {
    return {
      siderbarThumbnail: false,
      setShow: false,
      siderLogoShow: true,
      tagViewsShow: true,
      fixNavbar: true,
    };
  },
});
