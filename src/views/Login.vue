<template>
    <div class="loginBody">
        <div class="loginDiv">
            <div class="login-context">
                <div class="login-title">用户登录界面</div>
                <el-form ref="loginFormRef" :model="loginForm" status-icon :rules="rules" label-width="120px">

                    <el-form-item label="账号" prop="account">
                        <el-input v-model="loginForm.account" placeholder="请输入账号" />
                    </el-form-item>
                    <el-form-item label="密码" prop="password">
                        <el-input v-model="loginForm.password" type="password" placeholder="请输入密码"
                            @keydown.enter.exact="submitForm(loginFormRef)" show-password="false" />
                    </el-form-item>

                    <el-button type="primary" @click="submitForm(loginFormRef)">登录</el-button>
                    <el-button @click="resetForm(loginFormRef)">重置</el-button>
                </el-form>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup name="Login">
import { reactive, ref } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import { ElMessage } from 'element-plus'
import router from '@/router';

//使用axios智能识别通信方法
const axios = require('axios').default;
axios.defaults.baseURL = 'http://localhost:8888'

const loginFormRef = ref<FormInstance>()
const loginForm = reactive
    ({
        account: '',
        password: ''
    })

const rules = reactive<FormRules>({
    account: [
        { required: true, message: '请输入账号', trigger: 'blur' },
        { min: 1, max: 20, message: '长度在1到20之间', trigger: 'blur' },
    ],
    password: [
        { required: true, message: '请输入密码', trigger: 'blur' },
        { min: 1, max: 20, message: '长度在1到20之间', trigger: 'blur' },
    ],
})

const submitForm = (formEl: FormInstance | undefined) => {
    if (!formEl) return
    formEl.validate((valid) => {
        if (valid) {
            axios.post('/Teacher/login', {
                account: loginForm.account,
                password: loginForm.password
            }).then((res: { data: any; }) => res.data).then((res: { code: number; data: any; total: number; }) => {
                console.log(res)
                if (res.code == 200) {
                    //存储
                    sessionStorage.setItem('CurUser', JSON.stringify(res.data))
                    //
                    router.replace('/index')
                    ElMessage({
                        message: '登录成功.',
                        type: 'success',
                    })
                }
                else {
                    ElMessage({
                        message: '密码或账号错误！',
                        type: 'error',
                    })
                }
            })

            console.log('submit!')
        } else {
            console.log('error submit!')
            return false
        }
    })
}

const resetForm = (formEl: FormInstance | undefined) => {
    if (!formEl) return
    formEl.resetFields()
}

</script>
<style scoped>
.loginBody {
    position:absolute;
    width:100%;
    height: 100%;
    background-color: #5ce9ec;
}
.loginDiv {
    position: absolute;
    top: 50%;
    left: 50%;
    margin-top: -200px;
    margin-left: -250px;
    width: 450px;
    height: 330px;
    background: #fff;
    border-radius: 5%;
}
.login-title {
    margin: 20px 0px;
    text-align: center;
}

.login-context {
    width: 400px;
    height: 250px;
    position: absolute;
    top: 25px;
    left: 25px;
}
</style>