<script setup>
import { ref, shallowRef } from 'vue'
import List from './components/List.vue'
import './style.css'

const items = shallowRef([])
let refresh_time = 0
let refresh_before = ref(0)
setInterval(() => {
  refresh_before.value = Math.floor((new Date().getTime() - refresh_time) / 1000)
}, 500)
const refresh_data = async () => {
  items.value = await fetch('/config.json?t=' + new Date().getTime())
    .then(res => res.json())
  refresh_time = new Date().getTime()
}

let intro = ref("正在获取配置...");
let redirect_url = (new URL(window.location)).searchParams.get("redirect");
(async () => {
  await refresh_data()
  if(!redirect_url){
    intro.value = ""
    return;
  }
  if(!!Number(redirect_url))redirect_url = "http://127.0.0.1:"+redirect_url
  if(!redirect_url.match(/^http/g))redirect_url+="http://"
  const rUrl = new URL(redirect_url)
  for(var bound of items.value){
    if(bound.inner_ip === rUrl.hostname && String(bound.inner_port) === rUrl.port){
      rUrl.hostname = bound.outer_ip
      rUrl.port = String(bound.outer_port)
      intro.value = "正在跳转到 "+rUrl.origin
      setTimeout(() => {
        window.location.href = rUrl.href
      }, 1000);
      return;
    }
  }
  intro.value = "未找到对应的端口映射!"

})();
setInterval(async () => {
  await refresh_data()
}, 60000);
</script>

<template>
  <div class="relative max-w-5xl mx-auto pt-20 sm:pt-24 lg:pt-32">
    <h1 class="text-slate-900 font-extrabold text-4xl sm:text-5xl lg:text-6xl tracking-tight text-center">
      LoliCon Port Forwarder</h1>
    <p class="mt-6 text-lg text-slate-600 text-center max-w-3xl mx-auto ">Lolicon Port Forward Could
      Export Port to <code class="font-mono font-medium text-sky-500 ">Public Internet</code> Without
      <code class="font-mono font-medium text-sky-500 ">Public IP Address </code>Or
      <code class="font-mono font-medium text-sky-500 ">Public Server</code>
    </p>
    <div class="mt-6 sm:mt-10 flex justify-center space-x-6 text-sm">
      <a class="bg-slate-900 hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50 text-white font-semibold h-12 px-6 rounded-lg w-full flex items-center justify-center sm:w-auto"
        @click="refresh_data">
        Refresh This List
      </a>
      <button type="button"
        class="hidden sm:flex items-center w-72 text-left space-x-3 px-4 h-12 bg-white ring-1 ring-slate-900/10 hover:ring-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500 shadow-sm rounded-lg text-slate-400">
        <span class="flex-auto">
          List Was Refreshed Before
        </span>
        <kbd class="font-sans font-semibold">
          <abbr title="Control" class="no-underline text-slate-300 ">
            {{ refresh_before }} </abbr>
          s</kbd>
      </button>
    </div>
  </div>
  <h1>{{ intro }}</h1>
  <List :items="items" v-if="!redirect_url" />
</template>

<style scoped></style>
