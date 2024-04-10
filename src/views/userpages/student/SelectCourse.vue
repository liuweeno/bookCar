<template>
  <div class="appmain">
    <div class="appcart courselist-wrap">
      <h2 class="title">可操作的预约申请</h2>
      <table class="apptable">
        <tr>
          <th>学生姓名</th>
          <th>学生手机号</th>
          <th>时期</th>
          <th>具体时间段</th>
          <th>审核状态</th>
          <th>操作</th>
        </tr>
        <tr v-show="data.studentOrderList.length == 0">
          <td class="nodata" colspan="6">No Data</td>
        </tr>
        <tr v-for="item in data.studentOrderList" :key="item.id">
          <td>{{ item.studentName }}</td>
          <td>{{ item.studentPhone }}</td>
          <td>{{ item.date }}</td>
          <td>{{ timeShow[item.time] }}</td>
          <td>{{ approveShow[item.approve] }}</td>
          <td v-if="item.approve === 0">
            <a-button type="primary" class="accept-btn" @click="confirmSelect(item.id, 1)">通过</a-button>
            <a-button type="primary" danger class="reject-btn" @click="confirmSelect(item.id, 2)">拒绝</a-button>
          </td>
          <td v-else>
            <a-button type="primary" class="accept-btn-no">通过</a-button>
            <a-button type="primary" danger class="reject-btn-no">拒绝</a-button>
          </td>
        </tr>
      </table>
    </div>

    <div class="appmask" v-show="data.maskShow">
      <div class="mesbox">
        <p class="title">进行{{ data.type === 1 ? '通过' : '拒绝' }}审批</p>
        <i class="comfirm-bt" @click="acceptOrder()">确认</i>
        <i class="cancel-bt" @click="data.maskShow = false">取消</i>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onBeforeMount, reactive } from 'vue';
import { reOptionCourse, reSelectOrCancelCourse } from '@/api/user.js';
import SelectBlock from '@/components/SelectBlock.vue';
import Bus from '@/utils/bus';
import { getStudentOrder, confirmApprove } from '@/api/coach.js';

const approveShow = ['等待审批', '审批通过', '拒绝预约'];
const timeShow = ['上午', '下午', '晚上'];
const data = reactive({
  studentOrderList: [
    {
      studentName: '张三',
      studentPhone: '12345678901',
      date: '2021-10-10',
      time: 1,
      approve: 0,
    },
  ],
  maskShow: false,
  choseId: '',
  type: 1,
});

//获取课程数据
async function updataData() {
  const result = await getStudentOrder();
  if (result.code && result.code === 200) {
    data.studentOrderList = result.data;
  } else console.log('err', result);
}

//确认选择
async function confirmSelect(id, type) {
  data.maskShow = true;
  data.choseId = id;
  data.type = type;
}

//选择课程
async function acceptOrder() {
  const request = {
    id: data.choseId,
    approval: data.type,
  };
  const res = await confirmApprove(request);
  if (res?.code && res.code === 200) {
    Bus.$emit('popMes', { type: 'success', text: '审批成功' });
    data.maskShow = false;
    data.choseId = '';
    updataData();
  } else {
    data.maskShow = false;
    data.choseId = '';
    Bus.$emit('popMes', { type: 'err', text: '审批失败' });
  }
}

// function rejectOrder() {
//   data.maskShow = false;
//   data.choseId = '';
// }

onBeforeMount(() => {
  updataData();
});
</script>

<style lang="less" scoped>
.courselist-wrap {
  .title {
    color: rgb(148, 148, 148);
    font-size: calc(@baseSize * 1.2);
    font-weight: bolder;
    width: 180px;
    margin: auto;
    margin-bottom: 16px;
  }
}

.icon-zengjia1 {
  display: inline-block;
  color: white;
  font-size: 20px;
  background-color: rgb(185, 185, 185);
  padding: 2px 12px;
  border-radius: 4px;
  cursor: pointer;
}
.bt-active {
  color: @theme-main-color1;
  background-color: white;
  outline: 1px solid @theme-main-color2;
  &:hover {
    background-color: @theme-main-color2;
    color: white;
  }
}

.apptable {
  tr:hover {
    background-color: rgb(241, 241, 241);
  }

  .accept-btn {
    background-color: @theme-main-color1 !important;
    margin-right: 8px;
  }

  .reject-btn {
    background-color: palevioletred !important;
  }

  .accept-btn-no {
    background-color: gainsboro !important;
    margin-right: 8px;
  }
  .reject-btn-no {
    background-color: gainsboro !important;
  }
}

.reject-btn {
  background-color: palevioletred !important;
}
</style>
