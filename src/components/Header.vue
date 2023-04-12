<template>
    <div class="toolbar">
    <webSocket></webSocket>
        <div>
            <el-icon style="font-size: 20px;padding-top: 24px;" @click="collapse">
                <Expand />
            </el-icon>
        </div>

        <div style="flex:1 ;text-align:center ;font-size:33px">
            <span>欢迎使用课外实验在线监管与检查系统</span>
        </div>


        <div>
            <span>{{ user.userName }}</span>
            <el-dropdown style="text-align: center;padding-top: 24px;margin-left: 5px;color:#fff">
                <el-icon>
                    <ArrowDown />
                </el-icon>
                <template #dropdown>
                    <el-dropdown-menu>
                        <el-dropdown-item @click.native="toUser">个人中心</el-dropdown-item>
                        <el-dropdown-item @click.native="loginOut">退出登录</el-dropdown-item>
                    </el-dropdown-menu>
                </template>
            </el-dropdown>
        </div>
    </div>
</template>
<script setup name = "Header">
import router from '@/router';
import { ArrowDown, Expand } from '@element-plus/icons-vue'
import { ref } from 'vue';
//下面两个组件完成退出登录的提示
import { ElMessageBox } from 'element-plus';
import { ElMessage } from 'element-plus';
import webSocket from '@/components/WebSocket.vue'

//生命周期created不需要声明，包含在setup中
router.push('/home')

//用户信息
const user = ref(JSON.parse(sessionStorage.getItem('CurUser')))


//跳转至个人中心
const toUser = () => {
    console.log('转到个人中心')
    router.push('/home')
}

//登出
const loginOut = () => {
    console.log('退出')
    ElMessageBox.confirm('您确定退出系统吗', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
    })  .then(() => {
            ElMessage.success({
                message: '已退出登录！',
            })
            router.push('/')
            sessionStorage.clear()
        })
        .catch(() => {
            ElMessage.info({
                message: '已取消退出登录.',
            })
        })
}

//用于父子组件之间的传递
let clickOn = true;
let emit = defineEmits(['doCollapse'])
emit("doCollapse", clickOn)
function collapse() {
    emit('doCollapse', clickOn)
}



</script>
<style scoped>
.toolbar {
    display: flex;
    line-height: 60px;
    width: 100%;
}
</style>