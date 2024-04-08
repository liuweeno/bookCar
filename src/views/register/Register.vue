<template>
  <div class="register">
    <div class="registerForm">
      <h1>学员注册</h1>
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
        <a-form-item has-feedback label="手机号" name="phone">
          <a-input v-model:value="registerForm.phone" autocomplete="off" />
        </a-form-item>
        <a-form-item has-feedback label="密码" name="password">
          <a-input v-model:value="registerForm.password" type="password" autocomplete="off" />
        </a-form-item>
        <!--        <a-form-item has-feedback label="Confirm" name="checkPass">-->
        <!--          <a-input v-model:value="registerForm.checkPass" type="password" autocomplete="off" />-->
        <!--        </a-form-item>-->
        <a-form-item has-feedback label="性别" name="sex">
          <a-radio-group v-model:value="registerForm.sex" name="radioGroup">
            <a-radio value="0">男</a-radio>
            <a-radio value="1">女</a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item has-feedback label="身份证" name="idCard">
          <a-input v-model:value="registerForm.idCard" autocomplete="off" />
        </a-form-item>
        <a-form-item has-feedback label="实名" name="realName">
          <a-input v-model:value="registerForm.realName" autocomplete="off" />
        </a-form-item>
        <a-form-item :wrapper-col="{ span: 14, offset: 4 }">
          <a-button type="primary" html-type="submit">确认注册</a-button>
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
    router.push('/login');
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
  background-image: url('@/assets/imgs/login_back.jpg');
  background-position: center;
  background-size: cover;
  .flex-mode;
  width: 100%;
  height: 100vh;

  .registerForm {
    border-radius: 10px;
    color: white;
    background-color: rgba(100, 100, 100, 0.25);
    backdrop-filter: blur(8px);
    width: 60%;

    > h1 {
      color: white;
      text-align: center;
      margin-bottom: 24px;
    }
  }
}
</style>
