<template>
  <div class="appmain">
    <div class="info-wrap">
      <div class="control">
        <div class="appblock top">
          <span class="icon-wrap phone">
            <i class="iconfont icon-shouji"></i>
          </span>
          <span class="bind-text">
            <h3>更改绑定手机</h3>
            <p>{{ userStore.phone }}</p>
          </span>
          <button class="change-bt phone" @click="openChangePhone = true">更改绑定手机</button>
        </div>
        <div class="appblock top" v-if="userStore.role === 'student'">
          <span class="icon-wrap coachPhone">
            <ContactsOutlined />
          </span>
          <span class="bind-text">
            <h3>更改教练手机号</h3>
            <p>{{ userStore.coachPhone === null ? '未绑定' : userStore.coachPhone }}</p>
          </span>
          <button class="change-bt coachPhone" @click="openChangeCoachPhone = true">更改教练手机号</button>
        </div>
      </div>

      <div class="appcart intro-cart">
        <div class="avatar-name">
          <div class="portrait-wrap">
            <img src="@/assets/imgs/head_portrait.jpg" />
          </div>
          <h2 class="username">{{ userStore.userName }}</h2>
        </div>
        <div class="detail-area">
          <p>
            <i class="iconfont icon-yonghu"></i> <span>{{ userStore.userName }}</span>
          </p>
          <p>
            <i class="iconfont icon-nan"></i> <span>{{ sex == 0 ? '男' : '女' }}</span>
          </p>
          <p>
            <PhoneOutlined /> <span>手机号：{{ userStore.phone }}</span>
          </p>
          <p>
            <i class="iconfont icon-icon-taikong8"> </i><span>身份证：{{ userStore.idCard }}</span>
          </p>
        </div>
      </div>
    </div>
    <a-modal v-model:open="openChangePhone" cancelText="取消" title="修改绑定手机号" @ok="handleOk('user')">
      <a-input v-model:value="newPhone" placeholder="输入修改后的手机号" />
    </a-modal>
    <a-modal v-model:open="openChangeCoachPhone" cancelText="取消" title="修改教练手机号" @ok="handleOk('coach')">
      <a-input v-model:value="newCoachPhone" placeholder="输入修改后的手机号" />
    </a-modal>
  </div>
</template>

<script setup>
import { useUserStore } from '@/store';
import { reactive, onBeforeMount, ref } from 'vue';
import { reLogHistory } from '@/api/common.js';
import { useRouter } from 'vue-router';
import { ContactsOutlined } from '@ant-design/icons-vue';
import { bindCoach } from '@/api/student.js';
import Bus from '@/utils/bus';
import { PhoneOutlined } from '@ant-design/icons-vue';

const userStore = useUserStore();
const router = useRouter();
const data = reactive({
  historyList: null,
});
const openChangePhone = ref(false);
const openChangeCoachPhone = ref(false);
const newPhone = ref('');
const newCoachPhone = ref('');

async function handleOk(value) {
  if (value === 'user') {
    console.log('修改用户手机号');
  } else {
    console.log('修改教练手机号');
    const res = await bindCoach({
      coachPhone: newCoachPhone.value,
    });
    if (res && res.code === 200) {
      userStore.coachPhone = newCoachPhone.value;
      openChangeCoachPhone.value = false;
      newCoachPhone.value = '';
      Bus.$emit('popMes', { type: 'success', text: '修改教练手机号成功' }); // tip success err
    } else {
      openChangeCoachPhone.value = false;
      newCoachPhone.value = '';
      Bus.$emit('popMes', { type: 'err', text: '修改教练手机号失败' }); // tip success err
    }
  }
  openChangePhone.value = false;
}
</script>

<style lang="less" scoped>
.info-wrap {
  width: 60%;
  .flex-mode(column, flex-start, flex-start);

  .control {
    width: 100%;
    .flex-mode(row,flex-start,flex-start);

    .top {
      flex: 1;
      height: 80px;
      position: relative;
      padding: 12px 8px;

      .icon-wrap {
        display: inline-block;
        width: 40px;
        height: 40px;
        line-height: 40px;
        border-radius: 50%;
        background-color: grey;
        text-align: center;
        color: white;
        box-shadow: 0px 0px 5px 5px rgba(212, 162, 162, 0.2);

        i {
          font-size: 22px;
        }
      }
      .phone {
        background-color: rgb(197, 148, 202);
        box-shadow: 0px 0px 5px 5px rgba(182, 151, 201, 0.3);
      }
      .email {
        background-color: rgb(109, 166, 219);
        box-shadow: 0px 0px 5px 5px rgba(109, 166, 219, 0.3);
      }
      .weixin {
        background-color: rgb(128, 207, 181);
        box-shadow: 0px 0px 5px 5px rgba(133, 218, 190, 0.3);
      }
      .qq {
        background-color: rgb(241, 176, 122);
        box-shadow: 0px 0px 5px 5px rgba(241, 176, 122, 0.3);
      }

      .bind-text {
        display: inline-block;
        margin-left: 16px;
        height: 40px;
        vertical-align: bottom;

        h3 {
          margin-top: 2px;
          font-weight: bolder;
        }
        p {
          margin-top: 3px;
          color: rgb(180, 180, 180);
        }
      }

      .change-bt {
        position: absolute;
        bottom: 8%;
        right: 5%;
        font-size: calc(@baseSize * 0.9);
        color: white;
        padding: 6px 12px;
        border: 0;
        border-radius: 5px;
        box-shadow: 0px 0px 0px 0px;
        cursor: pointer;
      }
    }
  }

  .intro-cart {
    width: 100%;
    .flex-mode(row, flex-start, flex-start);
    gap: 16px;
    .avatar-name {
      .username {
        margin-top: 8px;
        text-align: center;
      }
    }
  }
}

.coachPhone {
  background-color: #108ee9 !important;
}
</style>
