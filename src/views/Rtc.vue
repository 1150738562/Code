
<template>
  <div class="container">
  <!-- <input type="number" id="roomId" name="roomId" placeholder="roomId" required>
    <input type="text" id="userId" name="userId" placeholder="userId" required>
        <input type="text" id="userSig" name="userSig" placeholder="userSig" required> -->
    <el-input v-model="roomId" placeholder="请输入房间Id" />
    <el-input v-model="userId" placeholder="请输入用户Id" />
    <el-input v-model="userSig" placeholder="请输入安全密钥" />
    <el-button @click="startTRTC()">开始通话</el-button>
    <el-button @click="closeTRTC()">结束通话</el-button>

  <!-- <button type="button" id="startCall">开始通话</button>
          <button type="button" id="finishCall">结束通话</button> -->
  </div>
  <div id="localStreamContainer" style="border: solid;"></div>
  <div id="remoteStreamContainer" style="border: solid;"></div>
</template>

<script setup>
import { ref } from 'vue'
import { TRTC } from 'trtc-js-sdk'
import getTestUserSig from "@/utils/lib-generate-test-usersig.min.js"

const TeacherMessage = (JSON.parse(sessionStorage.getItem('CurUser')|| '{}'))
const sdkAppId = 1400803934; // '填入您创建应用的 sdkAppId'
let roomId = ref(1); // '您指定的房间号'
let userId = ref(TeacherMessage.account); // '您指定的用户id'
let userSig = ref(getTestUserSig(userId.value)); // '生成的userSig'

let client = ref(null);
let localStream = ref(null);

async function startTRTC() {
  console.log("开始使用TRTC")
  roomId = roomId.value;
  userId = userId.value;
  userSig = userSig.value;
  // 创建客户端
  client = TRTC.createClient({ mode: 'rtc', sdkAppId, userId, userSig });
  console.log("成功创建Client对象")
  console.log("---------------------------------")

  // 订阅远端音视频流
  client.on('stream-added', event => {
    const remoteStream = event.stream;
    console.log('远端流增加: ' + remoteStream.getId());
    console.log("---------------------------------")
    //订阅远端流
    client.subscribe(remoteStream);
    console.log("---------------------------------")
  });
  client.on('stream-subscribed', event => {
    // 远端流订阅成功
    console.log("远端流订阅成功")
    console.log("---------------------------------")
    const remoteStream = event.stream;
    // 播放远端流，传入的元素 ID 必须是页面里存在的 div 元素
    remoteStream.play('remoteStreamContainer');
  });

  // 2.进房成功后开始推流
  try {
    await client.join({ roomId });//可能为空
    console.log("进入房间成功")
    console.log("----------------------------------------------")

    // 创建本地音视频流
    localStream = TRTC.createStream({ userId, audio: true, video: true });
    console.log("")
    await localStream.initialize();
    // 播放本地音视频流
    localStream.play("localStreamContainer");

    // 发布本地音视频流
    await client.publish(localStream);
  } catch (error) {
    console.log("进入房间失败")
    console.error(error);
  }
}

async function closeTRTC() {
  localStream.close();
  await client.leave();
  // 退房成功，如果没有调用 client.destroy()，可再次调用 client.join 重新进房开启新的通话
  // 调用 destroy() 结束当前 client 的生命周期
  client.destroy();
}

</script>
<style></style>