<template>
    <div>
        <div style="flex: left;text-align: left;margin-top: 5px;margin-bottom: 5px; ">
            <!--实验名称搜索框-->
            <el-input v-model="name" placeholder="请输入学生名称" style="width: 150px;margin-left: 10px;"
                @keydown.enter.exact="selectByName">
                <template #prefix>
                    <el-icon class="el-input__icon">
                        <search />
                    </el-icon>
                </template>
            </el-input>
            <!--查询按钮-->
            <el-button type="primary" @click="selectByName">查询</el-button>
            <!--查询框清零-->
            <el-button type="info" @click="resetParam">重置</el-button>
            <!--新增-->
            <el-button type="danger" @click="add">添加学生</el-button>
        </div>
        <!--表格部分-->
        <el-scrollbar>
            <el-table :data="tableData" border="true" table-layout="fixed">
                <el-table-column prop="name" label="学生名" />
                <el-table-column prop="sex" label="性别" />
                <el-table-column prop="age" label="年龄" />
                <el-table-column prop="position" label="职位" />
                <el-table-column prop="operate" label="操作">
                    <template #default="scope">
                        <el-button size="small" type="seccess" @click="details(scope.row)">查看详情</el-button>
                        <el-popconfirm title="你确定要删除吗?" font-size="20px" confirm-button-text="确定" cancel-button-text="取消"
                            @confirm="del(scope.row.id)">
                            <template #reference>
                                <el-button size="small" type="danger">删除</el-button>
                            </template>
                        </el-popconfirm>
                    </template>
                </el-table-column>
            </el-table>
        </el-scrollbar>

        <!--分页-->
        <el-pagination v-model:current-page="pageNum" v-model:page-size="pageSize" :page-sizes="[2, 5, 10]"
            layout="total, sizes, prev, pager, next, jumper" :total="total" @size-change="handleSizeChange"
            @current-change="handleCurrentChange" />

        <!--添加对话框-->
        <el-dialog v-model="addDialogVisible" title="提示" width="35%" center>
            <el-form ref="studentFormRef" :model="studentForm" :rules="rules" label-width="120px" :size="formSize"
                status-icon>
                <el-form-item label="学生姓名" prop="name">
                    <el-input placeholder="请输入姓名" v-model="studentForm.name" />
                </el-form-item>

                <el-form-item label="学生性别" prop="sex">
                    <el-radio-group v-model="studentForm.sex">
                        <el-radio label="男"></el-radio>
                        <el-radio label="女"></el-radio>
                    </el-radio-group>
                </el-form-item>

                <el-form-item label="学生年龄" prop="age">
                    <el-input placeholder="请输入年龄" v-model="studentForm.age" />
                </el-form-item>

                <el-form-item label="学生职位" prop="position">
                    <el-input placeholder="请输入职位" v-model="studentForm.position" />
                </el-form-item>

                <el-form-item label="学生地址" prop="addr">
                    <el-input placeholder="请输入地址" v-model="studentForm.addr" />
                </el-form-item>

                <el-form-item label="电话号码" prop="phone">
                    <el-input placeholder="请输入电话号码" v-model="studentForm.phone" />
                </el-form-item>

                <el-form-item>
                    <el-button type="primary" @click="submitForm(studentFormRef)">提交</el-button>
                    <el-button @click="resetForm(studentFormRef)">重置</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>


        <!--详情对话框-->
        <el-dialog v-model="detailsDialogVisible" font-size="100px" title="学生详情" width="35%" center>
            <el-form :model="detailForm" label-width="120px" :size="formSize"
                status-icon>
                <el-form-item label="学生姓名">
                    <el-input disabled placeholder="请输入姓名" v-model="detailForm.name" />
                </el-form-item>

                <el-form-item label="学生性别">
                    <el-radio-group disabled v-model="detailForm.sex">
                        <el-radio label="男"></el-radio>
                        <el-radio label="女"></el-radio>
                    </el-radio-group>
                </el-form-item>

                <el-form-item label="学生年龄">
                    <el-input disabled placeholder="请输入年龄" v-model="detailForm.age" />
                </el-form-item>

                <el-form-item label="学生职位">
                    <el-input disabled placeholder="请输入职位" v-model="detailForm.position" />
                </el-form-item>

                <el-form-item label="学生地址">
                    <el-input disabled placeholder="请输入地址" v-model="detailForm.addr" />
                </el-form-item>

                <el-form-item label="电话号码">
                    <el-input disabled placeholder="请输入电话号码" v-model="detailForm.phone" />
                </el-form-item>

            </el-form>
        </el-dialog>
    </div>
</template>

<script setup lang="ts" name = "Main">
import { ElMessage } from 'element-plus'//消息框组件
import { ref, reactive } from 'vue'//动态组件
import type { FormInstance, FormRules } from 'element-plus'//表单组件
import { onBeforeMount } from 'vue'//生命周期组件
import { nextTick } from 'vue'//渲染周期

//分页的信息
const pageSize = ref(5)
const pageNum = ref(1)
const total = ref(0)

//用于重置和上传的属性
const name = ref('')

//对话框的开关
const addDialogVisible = ref(false)
const detailsDialogVisible = ref(false)

const formSize = ref('default')

//绑定验证信息
const studentFormRef = ref<FormInstance>()

//用户详细信息属性
const studentForm = reactive({
    id: null,
    name: '',
    sex: null,
    age: null,
    position: '',
    addr: '',
    phone: ''
})

const detailForm = reactive({
    id: null,
    name: null,
    sex: null,
    age: null,
    position: null,
    addr: null,
    phone: null
})

//验证规则
const rules = reactive<FormRules>({
    name: [
        { required: true, message: '请输入学生姓名', trigger: 'blur' },
        { min: 1, max: 20, message: '长度在1到20之间', trigger: 'blur' },
    ],
    sex: [
        { required: true, message: '请输入学生性别', trigger: 'blur' },
        { min: 1, max: 1, message: '长度为1', trigger: 'blur' },
    ],
    age: [
        { required: true, message: '请输入学生年龄', trigger: 'blur' },
        { min: 1, max: 2, message: '年龄在1到99之间', trigger: 'blur' },
    ],
    position: [
        { required: true, message: '请输入学生职位', trigger: 'blur' },
        { min: 1, max: 10, message: '长度在1到10之间', trigger: 'blur' },
    ],
    addr: [
        { required: true, message: '请输入学生住址', trigger: 'blur' },
        { min: 1, max: 10, message: '长度在1到10之间', trigger: 'blur' },
    ],
    phone: [
        { required: true, message: '请输入学生电话号码', trigger: 'blur' },
        { min: 11, max: 11, message: '长度为11', trigger: 'blur' },
    ]
})

//使用axios智能识别通信方法
const axios = require('axios').default;
axios.defaults.baseURL = 'http://localhost:8888/Student'

//重置按钮重置查询属性
function resetParam() {
    name.value = ''
}

//选择每一页的数据数
const handleSizeChange = (val: number) => {
    console.log(`${val} 条每页`)
    loadPost();
}

//跳转至指定页
const handleCurrentChange = (val: number) => {
    console.log(`当前页码: ${val}`);
    pageNum.value = val;
    loadPost();
}

//数据封装
const tableData = ref([])

//分页查询：模糊搜索实验名
function selectByName() {
    axios.post('/selectByName', {
        pageSize: pageSize.value,
        pageNum: pageNum.value,
        param:
        {
            name: name.value
        }
    }).then((res: { data: any; }) => res.data).then((res: { code: number; data: never[]; total: number; }) => {
        if (res.code == 200) {
            tableData.value = res.data
            total.value = res.total
            console.log(tableData.value)
            ElMessage.success({
                message: '数据获取成功！'
            })
        }
        else {
            ElMessage.error({
                message: '数据获取失败！',
            })
        }
    })
}
function details(row: any)
{    
    detailsDialogVisible.value = true
    nextTick(() => {
        detailForm.name = row.name
        detailForm.sex = row.sex
        detailForm.age = row.age
        detailForm.position = row.position
        detailForm.addr = row.addr
        detailForm.phone = row.phone
        console.log(detailForm)
    })
}

//分页搜索
function loadPost() {
    axios.post('/selectPage', {
        pageSize: pageSize.value,
        pageNum: pageNum.value
    }).then((res: { data: any; }) => res.data).then((res: { code: number; data: never[]; total: number; }) => {
        if (res.code == 200) {
            tableData.value = res.data
            total.value = res.total
            console.log(tableData.value)
            ElMessage.success({
                message: '数据获取成功！'
            })
        }
        else {
            ElMessage.error({
                message: '数据获取失败！',
            })
        }
    })
}

//单击新增按钮打开dialog
function add() {
    addDialogVisible.value = true
    nextTick(() => {
        resetForm(studentFormRef.value)
    })
}

//表单提交
const submitForm = async (formEl: FormInstance | undefined) => {
    if (!formEl) return
    await formEl.validate((valid, fields) => {
        if (valid) {
            doSave()
        }
        else {
            console.log('error submit!', fields)
        }
    })
}

//清空表单
const resetForm = (formEl: FormInstance | undefined) => {
    if (!formEl) return
    formEl.resetFields()
}

//添加
function doSave() {
    console.log('提交！')
    axios.post('/save', studentForm).then((res: { data: any; }) => res.data).then((res: { code: number; }) => {
        console.log(res)
        if (res.code == 200) {
            ElMessage({
                message: '添加成功.',
                type: 'success',
            })
            addDialogVisible.value = false
            loadPost()
        }
        else {
            ElMessage({
                message: '添加失败.',
                type: 'error',
            })
        }
        console.log(tableData.value)
    })
}

//删除
function del(Id: any) {
    console.log(Id)
    console.log('删除...')
    axios.get('/delete?id=' + Id).then((res: { data: any; }) => res.data).then((res: { code: number; }) => {
        console.log(res)
        if (res.code == 200) {
            ElMessage({
                message: '操作成功.',
                type: 'success',
            })
            loadPost()
        }
        else {
            ElMessage({
                message: '操作失败.',
                type: 'error',
            })
        }
        console.log(tableData.value)
    })
}

//生命周期：页面渲染
onBeforeMount(() => {
    loadPost()
})
</script>

<style scoped></style>