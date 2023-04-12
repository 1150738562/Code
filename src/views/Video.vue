<template>
    <button type="button" @click="startVideo();">开始捕获视频信息</button>
    <button type="button" @click="stopVideo();">停止捕获视频信息</button>

    <button type="button" @click="connect();">建立连接</button>
    <button type="button" @click="hangUp();">挂断</button>
    <button type="button" @click="refreshPage();">刷新页面</button>
    <br />
    <div>
        <video id="localVideo" autoplay style="width: 240px; height: 180px;
                                            border: 1px solid black;"></video>
        <video id="remoteVideo" autoplay style="width: 240px; height: 180px;
                                            border: 1px solid black;"></video>
    </div>
</template>

<script setup>
import { ref } from 'vue'

// ===================以下是socket=======================
const TeacherMessage = (JSON.parse(sessionStorage.getItem('CurUser')))
var socketUrl = "ws://localhost:8888/websocket/" + TeacherMessage.name;
var socket = ref(null)
var socketRead = ref(false)

socket = new WebSocket(socketUrl)

window.onload = function () {

    socket = new WebSocket(socketUrl)

    socket.onopen = function () {
        console.log("成功连接到服务器")
        socketRead = true
    }

    socket.onclose = function (e) {
        console.log('与服务器连接关闭: ' + e.code)
        socketRead = false
    }

    socket.onmessage = function (res) {
        var evt = JSON.parse(res.data)
        console.log(evt)
        if (evt.type === 'offer') {
            console.log("接收到offer,设置offer,发送answer....")
            onOffer(evt);
        } else if (evt.type === 'answer' && peerStarted) {
            console.log('接收到answer,设置answer SDP');
            onAnswer(evt);
        } else if (evt.type === 'candidate' && peerStarted) {
            console.log('接收到ICE候选者..');
            onCandidate(evt);
        } else if (evt.type === 'bye' && peerStarted) {
            console.log("WebRTC通信断开");
            stop();
        }
    }
}

//--------------------用于交换信息--------------------
var localVideo = document.getElementById("localVideo");
var remoteVideo = document.getElementById('remoteVideo');
var localStream = ref(null);
var peerConnection = ref(null);
var peerStarted = ref(false);
var mediaConstraints = {
    'mandatory': {
        'OfferToReceiveAudio': false,
        'OfferToReceiveVideo': true
    }
};

//----------------------交换信息 -----------------------
function onOffer(evt) {
    console.log("接收到offer...")
    console.log(evt);
    setOffer(evt);
    sendAnswer(evt);
    peerStarted = true
}

function onAnswer(evt) {
    console.log("接收到Answer...")
    console.log(evt);
    setAnswer(evt);
}

function onCandidate(evt) {
    var candidate = new RTCIceCandidate({
        sdpMLineIndex: evt.sdpMLineIndex,
        sdpMid: evt.sdpMid,
        candidate: evt.candidate
    });
    console.log("接收到Candidate...")
    console.log(candidate);
    peerConnection.addIceCandidate(candidate);
}

function sendSDP(sdp) {
    var text = JSON.stringify(sdp);
    console.log('发送sdp.....')
    console.log(text); // "type":"offer"....
    // textForSendSDP.value = text;
    // 通过socket发送sdp
    socket.send(text)
}

function sendCandidate(candidate) {
    var text = JSON.stringify(candidate);
    console.log(text); // "type":"candidate","sdpMLineIndex":0,"sdpMid":"0","candidate":"....
    socket.send(text) // socket发送
}

//---------------------- 视频处理 -----------------------
function startVideo() {
    navigator.webkitGetUserMedia({ video: true, audio: true },
        function (stream) {  //success
            localStream = stream;
            localVideo = document.getElementById("localVideo")
            localVideo.srcObject = stream;
            //localVideo.src = window.URL.createObjectURL(stream);
            localVideo.play();
            localVideo.volume = 0;
        }
        ,
        function (error) {  //error
            console.error('发生了一个错误: [错误代码：' + error.code + ']');
            return;
        }
    );
}

//刷新界面
function refreshPage() {
    location.reload();
}

//---------------------- 处理连接 -----------------------
function prepareNewConnection() {
    var pc_config = { "iceServers": [] };
    var peer = null;
    try {
        peer = new webkitRTCPeerConnection(pc_config);
    }
    catch (e) {
        console.log("建立连接失败，错误：" + e.message);
    }
    console.log("-------------------------------");
    console.log(peer);//test right

    // 发送所有ICE候选者给对方
    peer.onicecandidate = function (evt) {
        if (evt.candidate) {
            console.log(evt);
            sendCandidate({
                type: "candidate",
                sdpMLineIndex: evt.candidate.sdpMLineIndex,
                sdpMid: evt.candidate.sdpMid,
                candidate: evt.candidate.candidate
            });
        }
    };
    console.log('添加本地视频流...');
    peer.addStream(localStream);

    peer.addEventListener("addstream", onRemoteStreamAdded, false);
    peer.addEventListener("removestream", onRemoteStreamRemoved, false);

    return peer;
}

//当接收到远程视频流时，使用本地video元素进行显示
function onRemoteStreamAdded(event) {
    console.log("添加远程视频流");
    // remoteVideo.src = window.URL.createObjectURL(event.stream);
    remoteVideo.srcObject = event.stream;
}

// 当远程结束通信时，取消本地video元素中的显示
function onRemoteStreamRemoved(event) {
    console.log("移除远程视频流");
    remoteVideo.src = null;
}

// function onCandidate(evt) {
//     var candidate = new RTCIceCandidate({
//         sdpMLineIndex: evt.sdpMLineIndex,
//         sdpMid: evt.sdpMid, candidate: evt.candidate
//     });
//     console.log("接收到Candidate...")
//     console.log(candidate);
//     peerConnection.addIceCandidate(candidate);//读不到方法？
// }

// function sendCandidate(candidate) {
//     var text = JSON.stringify(candidate);
//     console.log(text);// "type":"candidate","sdpMLineIndex":0,"sdpMid":"0","candidate":"....
//     socket.send(text)// socket发送
// }

//---------------------- 视频处理 -----------------------
//deal
// function startVideo() {
//     navigator.webkitGetUserMedia({ video: true, audio: true },
//         function (stream) { //success
//             console.log(stream)
//             localStream = stream
//             console.log(localStream)
//             localVideo = document.getElementById("local-video")
//             localVideo.srcObject = stream;
//             // localVideo.src = window.URL.createObjectURL(stream);
//             localVideo.play();
//             localVideo.volume = 0;
//         },
//         function (error) { //error
//             console.error('发生了一个错误: [错误代码：' + error.code + ']');
//             return;
//         });
// }

//deal
function stopVideo() {
    localVideo.src = null;
    //getTracks()[0].stop()是关闭麦克风
    //getTracks()[1].stop()是关闭摄像头
    localStream.getTracks()[1].stop();
    localStream.getTracks()[0].stop();
    localStream = null;
}

function sendOffer() {
    peerConnection = prepareNewConnection();
    peerConnection.createOffer(function (sessionDescription) { //成功时调用
        peerConnection.setLocalDescription(sessionDescription);
        console.log("发送: SDP");
        console.log(sessionDescription);
        sendSDP(sessionDescription);
    }, function (err) {  //失败时调用
        console.log("创建Offer失败");
    }, mediaConstraints);
}

function setOffer(evt) {
    if (peerConnection) {
        console.error('peerConnection已存在!');
        return;
    }
    peerConnection = prepareNewConnection();
    peerConnection.setRemoteDescription(new RTCSessionDescription(evt));
}

function sendAnswer(evt) {
    console.log('发送Answer,创建远程会话描述...');
    if (!peerConnection) {
        console.error('peerConnection不存在!');
        return;
    }

    peerConnection.createAnswer(function (sessionDescription) {//成功时
        peerConnection.setLocalDescription(sessionDescription);
        console.log("发送: SDP");
        console.log(sessionDescription);
        sendSDP(sessionDescription);
    }, function () {                                             //失败时
        console.log("创建Answer失败");
    }, mediaConstraints);
}

function setAnswer(evt) {
    if (!peerConnection) {
        console.error('peerConnection不存在!');
        return;
    }
    peerConnection.setRemoteDescription(new RTCSessionDescription(evt));
}

//-------- 处理用户UI事件 -----
// 开始建立连接
function connect() {
    console.log('peerSrarted =' + peerStarted.value)
    console.log('localStream =' + localStream)
    console.log('socketRead =' + socketRead)
    if (!localStream)
        alert("请首先捕获本地视频数据.");
    else if (peerStarted.value || !socketRead) {
        alert("请刷新页面后重试。")
    } else {
        sendOffer();
        peerStarted = true;
    }
}

// 停止连接
function hangUp() {
    console.log("挂断.");
    stop();
}

function stop() {
    peerConnection.close();
    peerConnection = null;
    peerStarted = false;
}
</script>

<style scoped></style>