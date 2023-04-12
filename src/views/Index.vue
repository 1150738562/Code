<template>
    <el-container class="layout-container-demo" >
        <el-aside :width="asideWidth">  
            <Aside :isCollapse="isCollapse"></Aside>
            <!--父组件定义属性isCollapse-->
        </el-aside>

        <el-container>
            <el-header style="text-align: right; font-size: 12px">
                <Header @doCollapse="doCo"></Header>
            </el-header>
            
            <el-main>
                <RouterView></RouterView>
            </el-main>
        </el-container>

    </el-container>
</template>
  
<script setup>
import Aside from "../components/Aside.vue"
import Header from "../components/Header.vue"
import {ref} from "vue"

let isCollapse = ref(true)
let asideWidth = ref('200px')
function doCo(clickOn)
{
    isCollapse.value = !isCollapse.value;
    if(!isCollapse.value)
        asideWidth.value = '200px'
    else
        asideWidth.value ='65px'
}
</script>
  
<style scoped>
.layout-container-demo .el-header {
    position: relative;
    background-color:#545c64;
    color:#fff;
    height: 60px;
}

.layout-container-demo .el-aside {

    color: var(--el-text-color-primary);
    background-color:#545c64;
}

.layout-container-demo .el-menu {
    border-right: none;
}

.layout-container-demo .el-main {
    padding: 20px;
}

.layout-container-demo .toolbar {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    right: 20px;
}</style>
  