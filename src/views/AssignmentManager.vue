<template>
    <div>
        <div style="flex: left;text-align: left;margin-top: 5px;margin-bottom: 5px; ">
            <!--实验名称搜索框-->
            <el-input v-model="title" placeholder="请输入实验名称" style="width: 150px;margin-left: 10px;"
                @keydown.enter.exact="selectByClassification">
                <template #prefix>
                    <el-icon class="el-input__icon">
                        <search />
                    </el-icon>
                </template>
            </el-input>
            <!--选择式种类搜索框-->
            <el-select v-model="classification" placeholder="类型" style="margin-left: 10px;margin-right: 10px;">
                <el-option v-for="item in classificationArray" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
            <!--查询按钮-->
            <el-button type="primary" @click="selectByClassification">查询</el-button>
            <!--查询框清零-->
            <el-button type="info" @click="resetParam">重置</el-button>
            <!--新增-->
            <el-button type="danger" @click="add">发布</el-button>
        </div>
        <!--表格部分-->
        <el-scrollbar>
            <el-table :data="tableData" border="true">
                <el-table-column prop="title" label="实验名称" width="140" align="center"/>
                <el-table-column prop="requirement" label="实验要求" width="400">
                    <template #default="scope">
                        <p v-html='scope.row.requirement'></p>
                    </template>
                </el-table-column>
                <el-table-column prop="explanation" label="实验详解" width="400" >
                    <template #default="scope">
                        <p v-html='scope.row.explanation'></p>
                    </template>
                </el-table-column>
                <el-table-column prop="classification" label="实验种类" width="120" align="center"/>
                <el-table-column prop="operate" label="相关操作" align="center">
                    <template #default="scope">
                        <el-button size="small" type="seccess" @click="update(scope.row)">编辑</el-button>
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

        <!--对话框-->
        <el-dialog v-model="assignmentDialogVisible" title="提示" width="60%" center>
            <el-form ref="assignmentFormRef" :model="assignmentForm" :rules="rules" label-width="120px" :size="formSize"
                status-icon>
                <el-form-item label="实验名称" prop="title">
                    <el-input placeholder="请输入实验名" v-model="assignmentForm.title" />
                </el-form-item>
                <el-form-item label="实验要求" prop="requirement">
                    <el-input placeholder="请输入实验要求(回车请用符号“<br>”代替)" 
                        v-model="assignmentForm.requirement" 
                        type="textarea" 
                        :autosize="{ minRows: 10, maxRows: 20 }" 
                        show-word-limit 
                        maxlength="2000"/>
                </el-form-item>
                <el-form-item label="实验详解" prop="explanation">
                    <el-input placeholder="请输入实验详解(回车请用符号“<br>”代替)" 
                        v-model="assignmentForm.explanation" 
                        type="textarea" 
                        :autosize="{ minRows: 10, maxRows: 20 }" 
                        show-word-limit 
                        maxlength="2000"/>
                </el-form-item>
                <el-form-item label="种类" prop="classification">
                    <el-radio-group v-model="assignmentForm.classification">
                        <el-radio label="C"></el-radio>
                        <el-radio label="C++"></el-radio>
                        <el-radio label="Java"></el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="submitForm(assignmentFormRef)">提交</el-button>
                    <el-button @click="assignmentDialogVisible=false">取消</el-button>
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
const title = ref('')
const classification = ref('')

//对话框的开关
const assignmentDialogVisible = ref(false)

//状态按钮信息
const classificationArray = ref
    (
        [
            {
                value: 'C',
                label: 'C',
            },
            {
                value: 'C++',
                label: 'C++',
            },
            {
                value: 'Java',
                label: 'Java',
            },
        ]
    )

const formSize = ref('default')

//绑定验证信息
const assignmentFormRef = ref<FormInstance>()

//用户详细信息属性
const assignmentForm = reactive({
    id: '',
    title: '',
    requirement: '',
    explanation: '',
    classification: ''
})

//验证规则
const rules = reactive<FormRules>({
    title: [
        { required: true, message: '请输入实验名称', trigger: 'blur' },
        { min: 1, max: 20, message: '长度在1到20之间', trigger: 'blur' },
    ],
    requirement: [
        { required: true, message: '请输入实验要求', trigger: 'blur' },
        { min: 1, max: 600, message: '长度在1到2000之间', trigger: 'blur' },
    ],
    explanation: [
        { required: true, message: '请输入实验要求', trigger: 'blur' },
        { min: 1, max: 600, message: '长度在1到2000之间', trigger: 'blur' },
    ],
    classification: [
        { required: true, message: '请输入实验类别', trigger: 'blur' },
        { min: 1, max: 10, message: '长度在1到10之间', trigger: 'blur' },
    ]
})

//使用axios智能识别通信方法
const axios = require('axios').default;
axios.defaults.baseURL = 'http://localhost:8888'

//重置按钮重置查询属性
function resetParam() {
    title.value = ''
    classification.value = ''
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
function selectByTitle() {
    axios.post('/Assignment/selectByTitle', {
        pageSize: pageSize.value,
        pageNum: pageNum.value,
        param:
        {
            title: title.value
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

//分页查询:通过类别精准查询
function selectByClassification() {
    axios.post('/Assignment/selectByClassification', {
        pageSize: pageSize.value,
        pageNum: pageNum.value,
        param:
        {
            title: title.value,
            classification: classification.value.toString()
        }
    }).then((res: any) => res.data).then((res: any) => {
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

//分页搜索
function loadPost() {
    axios.post('/Assignment/selectList', {
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
    assignmentDialogVisible.value = true
    nextTick(() => {
        resetForm(assignmentFormRef.value)
    })
}

//表单提交
const submitForm = async (formEl: FormInstance | undefined) => {
    if (!formEl) return
    await formEl.validate((valid, fields) => {
        if (valid) {
            if (assignmentForm.id) {
                doMod()
            }
            else {
                doSave()
            }
        } else {
            console.log('error submit!', fields)
        }
    })
}

//清空表单
const resetForm = (formEl: FormInstance | undefined) => {
    if (!formEl) return
    formEl.resetFields()
}

//修改前先读取表单
function update(row: any) {
    assignmentDialogVisible.value = true
    nextTick(() => {
        assignmentForm.id = row.id
        assignmentForm.classification = row.classification + ''
        assignmentForm.requirement = row.requirement + ''
        assignmentForm.explanation = row.explanation + ''
        assignmentForm.title = row.title + ''
        console.log(assignmentForm)
    })
}

//修改
function doMod() {
    console.log('提交！')
    axios.post('/Assignment/mod', assignmentForm).then((res: { data: any; }) => res.data).then((res: { code: number; }) => {
        console.log(res)
        if (res.code == 200) {
            ElMessage({
                message: '修改成功.',
                type: 'success',
            })
            assignmentDialogVisible.value = false
            loadPost()
        }
        else {
            ElMessage({
                message: '修改失败.',
                type: 'error',
            })
        }
        console.log(tableData.value)
    })
}

//添加
function doSave() {
    console.log('提交！')
    axios.post('/Assignment/save', assignmentForm).then((res: { data: any; }) => res.data).then((res: { code: number; }) => {
        console.log(res)
        if (res.code == 200) {
            ElMessage({
                message: '添加成功.',
                type: 'success',
            })
            assignmentDialogVisible.value = false
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
    axios.get('/Assignment/delete?id=' + Id).then((res: { data: any; }) => res.data).then((res: { code: number; }) => {
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