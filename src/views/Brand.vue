<template>
    <div>
        <div style="flex: left;text-align: left;margin-top: 5px;margin-bottom: 5px;">
            <!--品牌名称搜索框-->
            <el-input v-model="brandName" placeholder="请输入品牌名称" style="width: 150px;margin-left: 10px;"
                @keydown.enter.exact="selectByBrandName">
                <template #prefix>
                    <el-icon class="el-input__icon">
                        <search />
                    </el-icon>
                </template>
            </el-input>
            <!--选择式状态搜索框-->
            <el-select class="m-2" v-model="status" placeholder="是否可用" style="margin-left: 10px;margin-right: 10px;">
                <el-option v-for="item in statusArray" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
            <!--查询按钮-->
            <el-button type="primary" @click="selectByStatus">查询</el-button>
            <!--查询框清零-->
            <el-button type="info" @click="resetParam">重置</el-button>
            <!--新增-->
            <el-button type="danger" @click="add">新增</el-button>
        </div>
        <!--表格部分-->
        <el-scrollbar>
            <el-table v-loading="loading" :data="tableData" border="true">
                <el-table-column prop="id" label="Id" width="100" />
                <el-table-column prop="brandName" label="品牌名称" width="200" />
                <el-table-column prop="ordered" label="优先级" width="100" />
                <el-table-column prop="description" label="描述" width="200" />
                <el-table-column prop="status" label="是否可用" width="100" />
                <el-table-column prop="operate" label="操作">
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
        <el-pagination v-model:current-page="pageNum" v-model:page-size="pageSize" :page-sizes="[2, 5, 10]" :small="small"
            :disabled="disabled" :background="background" layout="total, sizes, prev, pager, next, jumper" :total="total"
            @size-change="handleSizeChange" @current-change="handleCurrentChange" />

        <!--对话框-->
        <el-dialog v-model="centerDialogVisible" title="新增品牌" width="30%" center>
            <el-form ref="ruleFormRef" :model="ruleForm" :rules="rules" label-width="120px" class="demo-ruleForm"
                :size="formSize" status-icon>
                <el-form-item label="品牌名" prop="brandName">
                    <el-input placeholder="您的品牌名" v-model="ruleForm.brandName" />
                </el-form-item>
                <el-form-item label="公司名" prop="companyName">
                    <el-input placeholder="您的公司名" v-model="ruleForm.companyName" />
                </el-form-item>
                <el-form-item label="描述" prop="description">
                    <el-input placeholder="您的描述" v-model="ruleForm.description" />
                </el-form-item>
                <el-form-item label="排序" prop="ordered">
                    <el-input placeholder="排序" v-model="ruleForm.ordered" />
                </el-form-item>
                <el-form-item label="状态" prop="status">
                    <el-radio-group v-model="ruleForm.status">
                        <el-radio label="1">启用</el-radio>
                        <el-radio label="0">不启用</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="submitForm(ruleFormRef)">提交</el-button>
                    <el-button @click="resetForm(ruleFormRef)">重置</el-button>
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

//加载中
const loading = ref(true)

//分页的信息
const pageSize = ref(5)
const pageNum = ref(1)
const total = ref(0)

const small = ref(false)
const background = ref(true)
const disabled = ref(false)

//用于重置和上传的属性
const brandName = ref("")
const status = ref("")

//对话框的开关
const centerDialogVisible = ref(false)

//状态按钮信息
const statusArray = ref
    (
        [
            {
                value: '1',
                label: '可用',
            },
            {
                value: '0',
                label: '不可用',
            },
        ]
    )

const formSize = ref('default')

//绑定验证信息
const ruleFormRef = ref<FormInstance>()

//用户详细信息属性
const ruleForm = reactive({
    id: '',
    brandName: '',
    companyName: '',
    ordered: '',
    description: '',
    status: '',
})

//验证规则
const rules = reactive<FormRules>({
    brandName: [
        { required: true, message: '请输入品牌名', trigger: 'blur' },
        { min: 1, max: 10, message: '长度在1到10之间', trigger: 'blur' },
    ],
    companyName: [
        { required: true, message: '请输入公司名', trigger: 'blur' },
        { min: 1, max: 20, message: '长度在1到20之间', trigger: 'blur' },
    ],
    description: [
        { required: true, message: '请输入描述', trigger: 'blur' },
        { min: 1, max: 200, message: '长度在1到200之间', trigger: 'blur' },
    ],
    ordered: [
        { required: true, message: '请输入排序', trigger: 'blur' },
        { min: 1, max: 1000, message: '长度在1到1000之间', trigger: 'blur' },
    ],
    status: [
        { required: true, message: '请选择状态', trigger: 'blur' },
        { min: 0, max: 1, message: '状态为0或者1', trigger: 'blur' },
    ],
})

//使用axios智能识别通信方法
const axios = require('axios').default;
axios.defaults.baseURL = 'http://localhost:8888'

//重置按钮重置查询属性
function resetParam() {
    brandName.value = ""
    status.value = ""
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

//分页查询：模糊搜索品牌名
function selectByBrandName() {
    axios.post('/Brand/selectByBrandName', {
        pageSize: pageSize.value,
        pageNum: pageNum.value,
        param:
        {
            brandName: brandName.value
        }
    }).then((res: { data: any; }) => res.data).then((res: { code: number; data: never[]; total: number; }) => {
        console.log(res)
        if (res.code == 200) {
            tableData.value = res.data
            total.value = res.total
        }
        else {
            alert('数据获取失败！')
        }
        console.log(tableData.value)
    })
}

//不分页查询:通过状态精准查询
function selectByStatus() {
    axios.post('/Brand/selectByStatus', {}).then((res: any) => res.data).then((res: any) => {
        console.log(res)
        if (res.code == 200) {
            tableData.value = res.data
            total.value = res.total
        }
        else {
            alert('数据获取失败！')
        }
        console.log(tableData.value)
    })
}


axios.post('/Brand/likeSelect', {}).then((res: { data: any; }) => res.data).then((res: { code: number; data: never[]; }) => {
    console.log(res)
    if (res.code == 200) {
        tableData.value = res.data
    }
    else {
        alert('数据获取失败！')
    }
})

//分页搜索
function loadPost() {
    axios.post('/Brand/selectByBrandName', {
        pageSize: pageSize.value,
        pageNum: pageNum.value
    }).then((res: { data: any; }) => res.data).then((res: { code: number; data: never[]; total: number; }) => {
        console.log(res)
        if (res.code == 200) {
            tableData.value = res.data
            total.value = res.total
            loading.value = false
        }
        else {
            alert('数据获取失败！')
        }
    })
}

//单击新增按钮打开dialog
function add() {
    centerDialogVisible.value = true
    nextTick(() => {
        resetForm(ruleFormRef.value)
    })
}

//表单提交
const submitForm = async (formEl: FormInstance | undefined) => {
    if (!formEl) return
    await formEl.validate((valid, fields) => {
        if (valid) {
            if (ruleForm.id) {
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
    centerDialogVisible.value = true
    nextTick(() => {
        ruleForm.id = row.id
        ruleForm.brandName = row.brandName
        ruleForm.companyName = row.companyName
        ruleForm.description = row.description
        ruleForm.ordered = row.ordered + ''
        ruleForm.status = row.status + ''
        console.log(ruleForm)
    })
}

//修改
function doMod() {
    console.log('提交！')
    axios.post('/Brand/mod', ruleForm).then((res: { data: any; }) => res.data).then((res: { code: number; }) => {
        console.log(res)
        if (res.code == 200) {
            ElMessage({
                message: '修改成功.',
                type: 'success',
            })
            centerDialogVisible.value = false
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
    axios.post('/Brand/save', ruleForm).then((res: { data: any; }) => res.data).then((res: { code: number; }) => {
        console.log(res)
        if (res.code == 200) {
            ElMessage({
                message: '添加成功.',
                type: 'success',
            })
            centerDialogVisible.value = false
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
    axios.get('/Brand/delete?id=' + Id).then((res: { data: any; }) => res.data).then((res: { code: number; }) => {
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

<style scoped>
body {
    margin: 0;
}
.example-showcase .el-loading-mask {
    z-index: 9;
}
</style>