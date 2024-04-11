<template>
  <div class="appmain">
    <div class="carInfo">
      <a-button class="editable-add-btn" style="margin-bottom: 8px" @click="handleAdd">添加新的用户</a-button>
      <span>Tips: 0为学员、1为教练、2为管理员</span>
      <a-table :columns="columns" :data-source="dataSource" bordered>
        <template #customFilterDropdown="{ setSelectedKeys, selectedKeys, confirm, clearFilters, column }">
          <div style="padding: 8px">
            <a-input
              ref="searchInput"
              :placeholder="`Search ${column.dataIndex}`"
              :value="selectedKeys[0]"
              style="width: 188px; margin-bottom: 8px; display: block"
              @change="(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])"
              @pressEnter="handleSearch(selectedKeys, confirm, column.dataIndex)"
            />
            <a-button
              type="primary"
              size="small"
              style="width: 90px; margin-right: 8px"
              @click="handleSearch(selectedKeys, confirm, column.dataIndex)"
            >
              <template #icon><SearchOutlined /></template>
              Search
            </a-button>
            <a-button size="small" style="width: 90px" @click="handleReset(clearFilters)"> Reset </a-button>
          </div>
        </template>
        <template #customFilterIcon="{ filtered }">
          <search-outlined :style="{ color: filtered ? '#108ee9' : undefined }" />
        </template>
        <template #bodyCell="{ column, text, record }">
          <template v-if="column.dataIndex === 'sex'">
            {{ text === 0 ? '男' : '女' }}
          </template>
          <template v-else-if="['idCard', 'role', 'coachPhone'].includes(column.dataIndex)">
            <div>
              <a-input
                v-if="editableData[record.id]"
                v-model:value="editableData[record.id][column.dataIndex]"
                style="margin: -5px 0"
              />
              <template v-else-if="column.dataIndex === 'role'">
                {{ text === 0 ? '学员' : text === 1 ? '教练' : '管理员' }}
              </template>

              <template v-else>
                {{ text }}
              </template>
            </div>
          </template>
          <template v-else-if="column.dataIndex === 'operation'">
            <div class="editable-row-operations">
              <span v-if="editableData[record.id]">
                <a-typography-link @click="save(record.id)">确定</a-typography-link>
                <a-popconfirm title="Sure to cancel?" @confirm="cancel(record.id)">
                  <a>取消</a>
                </a-popconfirm>
              </span>
              <span v-else>
                <a @click="edit(record.id)">修改</a>
              </span>
            </div>
            <a-popconfirm v-if="dataSource.length" title="确认删除?" @confirm="onDelete(record.phone)">
              <a>删除</a>
            </a-popconfirm>
          </template>
        </template>
      </a-table>
    </div>
    <a-modal v-model:open="showAddModal" title="添加新的用户" @ok="confirmAdd" :afterClose="reSetForm">
      <a-form
        :model="newUerForm"
        name="basic"
        :label-col="{ span: 8 }"
        :wrapper-col="{ span: 16 }"
        autocomplete="off"
        @finish="onFinish"
        @finishFailed="reSetForm"
        centered="true"
      >
        <a-form-item label="手机号" name="phone" :rules="[{ required: true, message: 'Please input your username!' }]">
          <a-input v-model:value="newUerForm.phone" />
        </a-form-item>
        <a-form-item label="密码" name="password" :rules="[{ required: true, message: 'Please input your username!' }]">
          <a-input v-model:value="newUerForm.password" />
        </a-form-item>
        <a-form-item label="性别" name="sex" :rules="[{ required: true, message: 'Please input your username!' }]">
          <a-radio-group v-model:value="newUerForm.sex" name="radioGroup">
            <a-radio value="0">男</a-radio>
            <a-radio value="1">女</a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item label="身份证" name="idCard" :rules="[{ required: true, message: 'Please input your username!' }]">
          <a-input v-model:value="newUerForm.idCard" />
        </a-form-item>
        <a-form-item label="实名" name="realName" :rules="[{ required: true, message: 'Please input your username!' }]">
          <a-input v-model:value="newUerForm.realName" />
        </a-form-item>
        <a-form-item label="角色" name="role" :rules="[{ required: true, message: 'Please input your username!' }]">
          <a-radio-group v-model:value="newUerForm.role" name="radioGroup">
            <a-radio value="0">学员</a-radio>
            <a-radio value="1">教练</a-radio>
            <a-radio value="2">管理员</a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item :wrapper-col="{ offset: 8, span: 16 }">
          <a-button type="primary" html-type="submit">Submit</a-button>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';
import { cloneDeep } from 'lodash-es';
import { onMounted } from 'vue';
import { addNewUser, editUserInfo, getAllUser, deleteUser } from '@/api/admin.js';
import Bus from '@/utils/bus';
import { SearchOutlined } from '@ant-design/icons-vue';

const showRole = ['学员', '教练', '管理员'];
const showSex = ['男', '女'];
const searchInput = ref();
const columns = [
  {
    id: 'id',
    title: '用户ID',
    dataIndex: 'id',
  },
  {
    id: 'phone',
    title: '手机号',
    dataIndex: 'phone',
    customFilterDropdown: true,
    onFilter: (value, record) => {
      return record.phone.toString().toLowerCase().includes(value.toLowerCase());
    },
    onFilterDropdownOpenChange: (visible) => {
      console.log(3, visible);
      if (visible) {
        setTimeout(() => {
          searchInput.value.focus();
        }, 100);
      }
    },
  },
  {
    id: 'role',
    title: '身份',
    dataIndex: 'role',
  },
  {
    id: 'sex',
    title: '性别',
    dataIndex: 'sex',
  },
  {
    id: 'idCard',
    title: '身份证',
    dataIndex: 'idCard',
    customFilterDropdown: true,
    onFilter: (value, record) => {
      return record.idCard.toString().toLowerCase().includes(value.toLowerCase());
    },
    onFilterDropdownOpenChange: (visible) => {
      console.log(3, visible);
      if (visible) {
        setTimeout(() => {
          searchInput.value.focus();
        }, 100);
      }
    },
  },
  {
    id: 'realName',
    title: '实名',
    dataIndex: 'realName',
  },
  {
    id: 'coachName',
    title: '教练名字',
    dataIndex: 'coachName',
  },
  {
    id: 'coachPhone',
    title: '教练电话',
    dataIndex: 'coachPhone',
  },
  {
    id: 'operation',
    title: '操作',
    dataIndex: 'operation',
  },
];
const dataSource = ref([]);
const editableData = reactive({});
const showAddModal = ref(false);
const newUerForm = reactive({
  phone: '',
  password: '',
  sex: '',
  idCard: '',
  realName: '',
  role: '',
});
const state = reactive({
  searchText: '',
  searchedColumn: '',
});

const edit = (key) => {
  editableData[key] = cloneDeep(dataSource.value.filter((item) => key === item.id)[0]);
};
const save = async (key) => {
  console.log('当前的key', key);
  Object.assign(dataSource.value.filter((item) => key === item.id)[0], editableData[key]);
  const { coachName, ...obj } = editableData[key];
  const res = await editUserInfo(obj);
  if (res.code === 200) {
    Bus.$emit('popMes', { type: 'success', text: '修改学生信息成功' }); // tip success err
  } else {
    Bus.$emit('popMes', { type: 'err', text: '修改学生信息失败' }); // tip success err
  }
  delete editableData[key];
};
const cancel = (key) => {
  delete editableData[key];
};
const handleAdd = () => {
  showAddModal.value = true;
};

function handleSearch(selectedKeys, confirm, dataIndex) {
  confirm();
  state.searchText = selectedKeys[0];
  state.searchedColumn = dataIndex;
}

const handleReset = (clearFilters) => {
  clearFilters({ confirm: true });
  state.searchText = '';
};

const confirmAdd = () => {
  showAddModal.value = false;
};

async function onFinish() {
  const res = await addNewUser(newUerForm);
  console.log(res);
  if (res.code == 200) {
    Bus.$emit('popMes', { type: 'success', text: '添加用户成功' }); // tip success err
    await getData();
    reSetForm();
  } else {
    Bus.$emit('popMes', { type: 'err', text: '添加用户失败' }); // tip success err
    reSetForm();
  }
}

async function getData() {
  const res = await getAllUser({});
  if (res.code !== 200) {
    Bus.$emit('popMes', { type: 'err', text: '获取用户信息失败' }); // tip success err
    return;
  }
  const newArray = res.data.map((item) => {
    const { coachId, deleteTime, hashPw, ...obj } = item;
    return obj;
  });
  dataSource.value = newArray;
}

async function onDelete(phone) {
  const res = await deleteUser({ phone });
  if (res.code === 200) {
    Bus.$emit('popMes', { type: 'success', text: '删除用户成功' }); // tip success err
    await getData();
  } else {
    Bus.$emit('popMes', { type: 'err', text: '删除用户失败' }); // tip success err
  }
}

onMounted(() => {
  getData();
});

function reSetForm() {
  console.log('重置表单');
  // Reset newUserForm
  showAddModal.value = false;
  newUerForm.phone = '';
  newUerForm.password = '';
  newUerForm.sex = '';
  newUerForm.idCard = '';
  newUerForm.realName = '';
  newUerForm.role = '';
}
</script>

<style lang="less" scoped>
.carInfo {
  width: 100%;
  height: 100%;
  padding: 16px;
}

.editable-cell {
  position: relative;

  .editable-cell-input-wrapper,
  .editable-cell-text-wrapper {
    padding-right: 24px;
  }

  .editable-cell-text-wrapper {
    padding: 5px 24px 5px 5px;
  }

  .editable-cell-icon,
  .editable-cell-icon-check {
    position: absolute;
    right: 0;
    width: 20px;
    cursor: pointer;
  }

  .editable-cell-icon {
    margin-top: 4px;
    display: none;
  }

  .editable-cell-icon-check {
    line-height: 28px;
  }

  .editable-cell-icon:hover,
  .editable-cell-icon-check:hover {
    color: #108ee9;
  }

  .editable-add-btn {
    margin-bottom: 8px;
  }
}

.editable-cell:hover .editable-cell-icon {
  display: inline-block;
}

.editable-row-operations a {
  margin-right: 8px;
}
</style>
