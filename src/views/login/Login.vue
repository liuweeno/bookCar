<template>
  <div class="login-wrapper">
    <div class="login-cart">
      <p class="login-text">普宁市XX驾校练车预约系统</p>

      <!-- 输入 -->
      <div class="input-wrapper">
        <i class="iconfont icon-user-filling icon"></i>
        <input placeholder="请输入手机号" v-model="logindata.phone" />
      </div>
      <div class="input-wrapper">
        <i class="iconfont icon-lock icon"></i>
        <input type="password" placeholder="请输入密码" v-model="logindata.password" ref="passwordInput" />
        <i class="iconfont icon-hide icon" @click="changPasswordShow" ref="iconHide"></i>
      </div>

      <button class="loginbt" @click="loginHandle">登 录</button>
      <div><span class="register" @click="goRegister">注册</span></div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/store';
import { login } from '@/api/user.js';
import { setToken } from '@/utils/token.js';
import { reLogin } from '@/api/common';

const router = useRouter();
const userStore = useUserStore();

const passwordInput = ref();
const iconHide = ref();

const logindata = reactive({
  phone: '17748690266',
  password: '123456',
});

//改变密码显示状态
function changPasswordShow() {
  passwordInput.value.type = passwordInput.value.type === 'password' ? 'text' : 'password';
  iconHide.value.className =
    iconHide.value.className.indexOf('icon-hide') > -1 ? 'iconfont icon-browse icon' : 'iconfont icon-hide icon';
}

//处理登录请求
async function loginHandle() {
  const res = await login(logindata);
  if (res?.code !== 200) {
    return;
  }
  userStore.updataToken(res.data);
  let result2 = await userStore.updataUserInfo();
  if (result2) router.push('/');
}

const goRegister = () => {
  router.push('/register');
};
</script>

<style lang="less" scoped>
.login-wrapper {
  background-image: url('@/assets/imgs/login_back.jpg');
  background-position: center;
  background-size: cover;
  width: 100%;
  height: 100vh;
  position: relative;

  .login-cart {
    background-color: rgba(100, 100, 100, 0.25);
    backdrop-filter: blur(8px);
    width: 500px;
    height: 400px;
    box-shadow: 2px 2px 16px 2px rgba(39, 39, 39, 0.5);
    border-radius: 18px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    text-align: center;

    .login-text {
      margin-top: 18px;
      line-height: 60px;
      text-align: center;
      color: rgb(255, 255, 255);
      font-size: 32px;
    }

    .input-wrapper {
      box-sizing: border-box;
      margin: 22px auto;
      background-color: rgba(255, 255, 255, 0.1);
      width: 400px;
      height: 50px;
      outline: 0.5px solid rgba(235, 235, 235, 0.3);
      border-radius: 5px;
      padding: 4px 12px;
      transition: 0.5s;
      text-align: left;
      display: flex;
      align-items: center;

      .icon {
        font-size: 24px;
        color: rgba(224, 224, 224, 0.5);
      }

      .icon-hide,
      .icon-browse {
        cursor: pointer;
      }

      input {
        display: inline-block;
        background-color: transparent;
        width: 100%;
        height: 100%;
        border: 0;
        color: white;
        font-size: 16px;
        padding: 4px 14px;

        &:focus-visible {
          outline: 0;
        }
      }

      &:focus-within {
        outline: 0.5px solid rgb(142, 190, 138);
      }
    }

    .role-wrap {
      width: 400px;
      height: 30px;
      line-height: 30px;
      margin: -10px auto;
      text-align: left;

      input[type='radio'] {
        display: none;
      }
      input[type='radio']:checked + label::after {
        position: absolute;
        content: '✔';
        font-size: 8px;
        left: -6px;
        color: rgb(142, 190, 138);
      }
      label {
        position: relative;
        color: white;
        font-size: 14px;
        margin-left: 8px;
        margin-right: 16px;
        &:before {
          display: inline-block;
          position: relative;
          left: -8px;
          top: 2px;
          width: 14px;
          height: 14px;
          border: 1px solid rgba(207, 236, 204, 0.5);
          border-radius: 4px;
          content: '';
          cursor: pointer;
          box-sizing: border-box;
        }
      }
    }

    .loginbt {
      background-color: rgba(116, 185, 110, 0.9);
      border: 0;
      color: white;
      margin: 25px 10px;
      width: 400px;
      height: 50px;
      border-radius: 5px;
      font-size: 18px;
      padding: 4px 16px;
      cursor: pointer;

      &:hover {
        background-color: rgb(142, 190, 138);
      }
    }

    .register {
      color: white;
      font-size: 14px;
      cursor: pointer;
      &:hover {
        color: rgb(142, 190, 138);
      }
    }
  }
}
</style>
