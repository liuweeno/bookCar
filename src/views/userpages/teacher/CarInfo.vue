<template>
  <div class="carInfo">
    <a-button class="editable-add-btn" style="margin-bottom: 8px" @click="handleAdd">添加新的汽车</a-button>
    <a-table bordered :data-source="dataSource" :columns="columns">
      <template #bodyCell="{ column, text, record }">
        <template v-if="column.dataIndex === 'name'">
          <div class="editable-cell">
            <div v-if="editableData[record.key]" class="editable-cell-input-wrapper">
              <a-input v-model:value="editableData[record.key].name" @pressEnter="save(record.key)" />
              <check-outlined class="editable-cell-icon-check" @click="save(record.key)" />
            </div>
            <div v-else class="editable-cell-text-wrapper">
              {{ text || ' ' }}
              <edit-outlined class="editable-cell-icon" @click="edit(record.key)" />
            </div>
          </div>
        </template>
        <template v-else-if="column.dataIndex === 'operation'">
          <a-popconfirm v-if="dataSource.length" title="Sure to delete?" @confirm="onDelete(record.key)">
            <a>Delete</a>
          </a-popconfirm>
          <!--          TODO 将edit导入到该页面中-->
          <div class="editable-row-operations">
            <span v-if="editableData[record.key]">
              <a-typography-link @click="save(record.key)">Save</a-typography-link>
              <a-popconfirm title="Sure to cancel?" @confirm="cancel(record.key)">
                <a>Cancel</a>
              </a-popconfirm>
            </span>
            <span v-else>
              <a @click="edit(record.key)">Edit</a>
            </span>
          </div>
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
      <a-form-item label="汽车品牌" name="brand" :rules="[{ required: true, message: 'Please input your username!' }]">
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
</template>

<script setup>
import { reactive, ref } from 'vue';
import { cloneDeep } from 'lodash-es';
const columns = [
  {
    title: 'name',
    dataIndex: 'name',
    width: '30%',
  },
  {
    title: 'age',
    dataIndex: 'age',
  },
  {
    title: 'address',
    dataIndex: 'address',
  },
  {
    title: 'operation',
    dataIndex: 'operation',
  },
];
const dataSource = ref([
  {
    key: '0',
    name: 'Edward King 0',
    age: 32,
    address: 'London, Park Lane no. 0',
  },
  {
    key: '1',
    name: 'Edward King 1',
    age: 32,
    address: 'London, Park Lane no. 1',
  },
]);
const editableData = reactive({});
const showAddModal = ref(false);
const newCarForm = reactive({
  brand: '',
  model: '',
  plate: '',
  ownerPhone: '',
});
const edit = (key) => {
  editableData[key] = cloneDeep(dataSource.value.filter((item) => key === item.key)[0]);
};
const save = (key) => {
  Object.assign(dataSource.value.filter((item) => key === item.key)[0], editableData[key]);
  delete editableData[key];
};
const onDelete = (key) => {
  dataSource.value = dataSource.value.filter((item) => item.key !== key);
};
const handleAdd = () => {
  showAddModal.value = true;
};

const confirmAdd = () => {
  showAddModal.value = false;
};
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
