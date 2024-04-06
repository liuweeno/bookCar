<template>
  <div class="register">
    <h1>注册</h1>
    <div class="registerForm">
      <a-form
        ref="formRef"
        name="custom-validation"
        :model="registerForm"
        :rules="rules"
        v-bind="layout"
        @finish="handleFinish"
        @validate="handleValidate"
        @finishFailed="handleFinishFailed"
      >
        <a-form-item has-feedback label="Phone" name="phone">
          <a-input v-model:value="registerForm.phone" autocomplete="off" />
        </a-form-item>
        <a-form-item has-feedback label="Password" name="password">
          <a-input v-model:value="registerForm.password" type="password" autocomplete="off" />
        </a-form-item>
        <!--        <a-form-item has-feedback label="Confirm" name="checkPass">-->
        <!--          <a-input v-model:value="registerForm.checkPass" type="password" autocomplete="off" />-->
        <!--        </a-form-item>-->
        <a-form-item has-feedback label="Sex" name="sex">
          <a-input v-model:value="registerForm.sex" autocomplete="off" />
        </a-form-item>
        <a-form-item has-feedback label="ID Card" name="idCard">
          <a-input v-model:value="registerForm.idCard" autocomplete="off" />
        </a-form-item>
        <a-form-item has-feedback label="Real Name" name="realName">
          <a-input v-model:value="registerForm.realName" autocomplete="off" />
        </a-form-item>
        <a-form-item :wrapper-col="{ span: 14, offset: 4 }">
          <a-button type="primary" html-type="submit">确认注册</a-button>
          <a-button style="margin-left: 10px" @click="resetForm">Reset</a-button>
        </a-form-item>
      </a-form>
    </div>
  </div>
</template>

<script setup>
import { register } from '@/api/register';
import { reactive, ref } from 'vue';
const formRef = ref();
const registerForm = reactive({
  phone: '',
  password: '',
  sex: '',
  idCard: '',
  realName: '',
});
const checkAge = async (_rule, value) => {
  if (!value) {
    return Promise.reject('Please input the age');
  }
  if (!Number.isInteger(value)) {
    return Promise.reject('Please input digits');
  } else {
    if (value < 18) {
      return Promise.reject('Age must be greater than 18');
    } else {
      return Promise.resolve();
    }
  }
};
const validatePass = async (_rule, value) => {
  if (value === '') {
    return Promise.reject('Please input the password');
  } else {
    if (registerForm.checkPass !== '') {
      formRef.value.validateFields('checkPass');
    }
    return Promise.resolve();
  }
};
const validatePass2 = async (_rule, value) => {
  if (value === '') {
    return Promise.reject('Please input the password again');
  } else if (value !== registerForm.pass) {
    return Promise.reject("Two inputs don't match!");
  } else {
    return Promise.resolve();
  }
};
const rules = {
  pass: [
    {
      required: true,
      validator: validatePass,
      trigger: 'change',
    },
  ],
  checkPass: [
    {
      validator: validatePass2,
      trigger: 'change',
    },
  ],
  age: [
    {
      validator: checkAge,
      trigger: 'change',
    },
  ],
};
const layout = {
  labelCol: {
    span: 4,
  },
  wrapperCol: {
    span: 14,
  },
};
const handleFinish = async (values) => {
  const { phone, password, sex, idCard, realName } = values;
  const res = await register({ phone, password, sex, idCard, realName });
  if (res.code === 200) {
    alert('注册成功');
  } else {
    alert('注册失败');
  }
};
const handleFinishFailed = (errors) => {
  console.log(errors);
};
const resetForm = () => {
  formRef.value.resetFields();
};
const handleValidate = (...args) => {
  console.log(args);
};
</script>

<style lang="less" scoped>
.register {
  .flex-mode(column);
  width: 100%;
  height: 100%;

  .registerForm {
    width: 60%;
    height: 80%;
  }
}
</style>
