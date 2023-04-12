<template>
    <el-table :data="tableData" style="width: 100%">
        <el-table-column label="详细情况">
            <el-table-column prop="name" label="姓名" width="80" align="center"/>
            <el-table-column label="实验情况">
                <el-table-column prop="title" label="实验题目" width="100" align="center"/>
                <el-table-column prop="requirement" label="实验要求" width="400">
                    <template #default="scope">
                        <p v-html='scope.row.requirement'></p>
                    </template>
                </el-table-column>
                <el-table-column prop="submit" label="学生提交" width="400" />
                <el-table-column prop="score" label="最终得分" align="center"/>
                <el-table-column label="打分" align="center">
                    <template #default="scope">
                        <el-button @click="mod(scope.row.assignment, scope.row.student)">批改</el-button>
                    </template>
                </el-table-column>
            </el-table-column>
        </el-table-column>
    </el-table>

    <!-- Form -->
    <el-button text @click="markVisible = true">
        open a Form nested Dialog
    </el-button>

    <el-dialog v-model="markVisible" title="打分界面">
        <el-form :model="form">
            <el-form-item label="Promotion name" :label-width="formLabelWidth">
                <el-input v-model="form.name" autocomplete="off" />
            </el-form-item>
        </el-form>
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="markVisible = false">Cancel</el-button>
                <el-button type="primary" @click="markVisible = false">
                    Confirm
                </el-button>
            </span>
        </template>
    </el-dialog>
</template>
  
<script lang="ts" setup>
import { ElMessage } from 'element-plus';
import { onBeforeMount, ref } from 'vue'


//数据封装
const tableData = ref([])
const axios = require('axios').default;
const score = ref(null)
axios.defaults.baseURL = 'http://localhost:8888/Score'
const markVisible=ref(false)

//分页搜索
function loadPost() {
    axios.get('/listAll').then((res: { data: any; }) => res.data).then((res: { code: number; data: never[]; total: number; }) => {
        console.log(res)
        if (res.code == 200) {
            tableData.value = res.data
        }
        else {
            alert('数据获取失败！')
        }
        console.log(tableData)
    })
}

//修改分数
function mod(assid: any, stuid: any) {
    axios.get('/Brand/delete?=assignment=' + assid + '&student=' + stuid + '&score=' + score).then((res: { data: any; }) => res.data).then((res: { code: number; }) => {
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