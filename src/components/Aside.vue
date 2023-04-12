<template>
    <el-scrollbar>
        <el-menu active-text-color="#ffd04b" background-color="#545c64" text-color="#fff" style="height: 100%; min-height: 730px;"
            default-active="/home" :collapse="isCollapse" :collapse-transition="false" router>
            <el-menu-item index="/home">
                <el-icon>
                    <HomeFilled />
                </el-icon>
                <template #title>
                    <span>
                        首页
                    </span>
                </template>
            </el-menu-item>

            <el-menu-item index="/user">
                <el-icon>
                    <HomeFilled />
                </el-icon>
                <template #title>
                    <span>
                        用户管理
                    </span>
                </template>
            </el-menu-item>

            <el-menu-item index="/assignment">
                <el-icon>
                    <HomeFilled />
                </el-icon>
                <template #title>
                    <span>
                        实验管理
                    </span>
                </template>
            </el-menu-item>

            <el-menu-item index="/mark">
                <el-icon>
                    <HomeFilled />
                </el-icon>
                <template #title>
                    <span>
                        实验评价
                    </span>
                </template>
            </el-menu-item>

            <el-menu-item index="/Video">
                <el-icon>
                    <HomeFilled />
                </el-icon>
                <template #title>
                    <span>
                        视频
                    </span>
                </template>
            </el-menu-item>
        </el-menu>
    </el-scrollbar>
</template>

<script setup name = "Aside">
import { Menu as HomeFilled } from '@element-plus/icons-vue'

//用于接收父组件传来的信息
const props = defineProps({
    isCollapse:
    {
        type: Boolean
    },
})
</script>

<style scoped></style>