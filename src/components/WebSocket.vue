<!-- <template>
<div>WebSocket</div>
</template>
<script setup name ="WebSocket">
import {ref} from 'vue'
const webSocket = ref(null)
const wsUrl=ref(null)
const TeacherMessage = (JSON.parse(sessionStorage.getItem('CurUser')))
initWebSocket()
function initWebSocket()
{
    initWebSocketUrl();
    if(typeof(WebSocket)=='undefined')
    {
        console.log("浏览器不支持WebSocket");
    }
    else
    {
        webSocket.value = new WebSocket(wsUrl.value);
        console.log("该WebSocket为:",webSocket.value);
        webSocket.onopen = webSocketOnOpen();
        webSocket.onerror = webSocketOnError();
        webSocket.onmessage = webSocketOnMessage();
        webSocket.onclose = webSocketOnClose();
        console.log(webSocket.value)
    }
}

function initWebSocketUrl()
{   
    wsUrl.value="ws://localhost:8888/websocket/" + TeacherMessage.name;
    console.log(wsUrl);
}

function webSocketOnOpen()
{
    console.log("连接成功")
}
function webSocketOnError()
{
    console.log("连接失败")
}
function webSocketOnMessage(res)
{
    console.log("接收消息",res)
}
function webSocketOnClose()
{
    console.log("关闭连接")
}
</script>
<style scoped>
</style> -->