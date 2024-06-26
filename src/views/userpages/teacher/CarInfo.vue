<template>
  <div class="appmain">
    <div class="carInfo">
      <a-button class="editable-add-btn" style="margin-bottom: 8px" @click="handleAdd">添加新的汽车</a-button>
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
          <template v-if="['ownerPhone', 'ownerName'].includes(column.dataIndex)">
            <div>
              <a-input
                v-if="editableData[record.id]"
                v-model:value="editableData[record.id][column.dataIndex]"
                style="margin: -5px 0"
              />
              <template v-else>
                {{ text }}
              </template>
            </div>
          </template>
          <template v-else-if="column.dataIndex === 'operation'">
            <div class="editable-row-operations">
              <span v-if="editableData[record.id]">
                <a-typography-link @click="save(record.id)">Save</a-typography-link>
                <a-popconfirm title="Sure to cancel?" @confirm="cancel(record.id)">
                  <a>Cancel</a>
                </a-popconfirm>
              </span>
              <span v-else>
                <a @click="edit(record.id)">修改</a>
              </span>
            </div>
            <a-popconfirm v-if="dataSource.length" title="确认删除?" @confirm="onDelete(record.id)">
              <a>删除</a>
            </a-popconfirm>
          </template>
        </template>
      </a-table>
    </div>
    <a-modal v-model:open="showAddModal" title="添加新的汽车" @ok="confirmAdd">
      <a-form
        :model="newCarForm"
        name="basic"
        :label-col="{ span: 8 }"
        :wrapper-col="{ span: 16 }"
        autocomplete="off"
        @finish="onFinish"
        @finishFailed="onFinishFailed"
        centered="true"
      >
        <a-form-item
          label="汽车品牌"
          name="brand"
          :rules="[{ required: true, message: 'Please input your username!' }]"
        >
          <a-input v-model:value="newCarForm.brand" />
        </a-form-item>
        <a-form-item label="型号" name="model" :rules="[{ required: true, message: 'Please input your username!' }]">
          <a-input v-model:value="newCarForm.model" />
        </a-form-item>
        <a-form-item label="车牌号" name="plate" :rules="[{ required: true, message: 'Please input your username!' }]">
          <a-input v-model:value="newCarForm.plate" />
        </a-form-item>
        <a-form-item
          label="持有者手机号"
          name="ownerPhone"
          :rules="[{ required: true, message: 'Please input your username!' }]"
        >
          <a-input v-model:value="newCarForm.ownerPhone" />
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
import { getAllCar, addNewCar, editCarInfo, deleteCar } from '@/api/admin.js';
import Bus from '@/utils/bus';
import { SearchOutlined } from '@ant-design/icons-vue';

const searchInput = ref();
const columns = [
  {
    id: 'id',
    title: '车辆信息ID',
    dataIndex: 'id',
  },
  {
    id: 'brand',
    title: '品牌',
    dataIndex: 'brand',
  },
  {
    id: 'model',
    title: '型号',
    dataIndex: 'model',
  },
  {
    id: 'plate',
    title: '车牌号',
    dataIndex: 'plate',
    customFilterDropdown: true,
    onFilter: (value, record) => {
      return record.plate.toString().toLowerCase().includes(value.toLowerCase());
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
    id: 'ownerPhone',
    title: '拥有者手机号',
    dataIndex: 'ownerPhone',
    customFilterDropdown: true,
    onFilter: (value, record) => {
      return record.ownerPhone.toString().toLowerCase().includes(value.toLowerCase());
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
    id: 'ownerName',
    title: '持有者姓名',
    dataIndex: 'ownerName',
  },
  {
    id: 'operation',
    title: 'operation',
    dataIndex: 'operation',
  },
];
const dataSource = ref([]);
const editableData = reactive({});
const showAddModal = ref(false);
const newCarForm = reactive({
  brand: '',
  model: '',
  plate: '',
  ownerPhone: '',
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
  // TODO 测试是否可以修改成功
  const res = await editCarInfo({ id: key, ownerPhone: editableData[key].ownerPhone });
  if (res.code === 200) {
    Bus.$emit('popMes', { type: 'success', text: '修改车辆信息成功' }); // tip success err
  } else {
    Bus.$emit('popMes', { type: 'err', text: '修改车辆信息失败' }); // tip success err
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
  const res = await addNewCar(newCarForm);
  console.log(res);
  if (res.code == 200) {
    Bus.$emit('popMes', { type: 'success', text: '添加车辆成功' }); // tip success err
    await getData();
  } else {
    Bus.$emit('popMes', { type: 'err', text: '添加车辆失败' }); // tip success err
  }
  showAddModal.value = false;
}

async function getData() {
  const res = await getAllCar().then((res) => {
    dataSource.value = res.data;
  });
  console.log(res);
}

async function onDelete(id) {
  const res = await deleteCar({ id });
  if (res.code === 200) {
    Bus.$emit('popMes', { type: 'success', text: '删除车辆成功' }); // tip success err
    await getData();
  } else {
    Bus.$emit('popMes', { type: 'err', text: '删除车辆失败' }); // tip success err
  }
}

onMounted(() => {
  console.log('CarInfo mounted');
  getData();
});
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
