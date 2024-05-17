<script setup>
defineProps(['items'])
import { ref , inject} from 'vue'
import Clipboard from 'clipboard'
const swal = inject('$swal')

function onCopy(string) {
  Clipboard.copy(string)
  swal({
    title: "已复制!",
    text: `${string}已拷贝入您的剪贴板`,
    icon: "success"
  });
}

</script>


<template>
  <div class="flex flex-wrap justify-around gap-4 p-4">
    <div v-for="item in items">
      <div class="bg-white rounded-lg shadow-lg p-4 w-72" v-if="item.public">
        <div class="md:flex">
          <div class="p-3">
            <div class="uppercase tracking-wide text-sm text-indigo-500 font-semibold">{{ item.name }}</div>
            <a :href="`http://${item.outer_ip}:${item.outer_port}`"
              class="block mt-1 text-lg leading-tight font-medium text-black hover:underline">
              {{ item.intro }}
            </a>
            <table class="table-fixed">
              <tbody>
                <tr>
                  <td class="text-right table-intro">穿透类型：</td>
                  <td class="table-intro">{{ item.type }}</td>
                </tr>
                <tr @click="onCopy(item.inner_ip + ':' + item.inner_port)">
                  <td class="text-right table-intro">本地监听对：</td>
                  <td class="table-intro">
                    <p @click="l">{{ item.inner_ip }}:{{ item.inner_port }}</p>
                  </td>
                </tr>
                <tr v-if="!!item.outer_ip && !!item.outer_port" @click="onCopy(item.outer_ip + ':' + item.outer_port)">
                  <td class="text-right table-intro">转发监听对：</td>
                  <td class="table-intro">{{ item.outer_ip }}:{{ item.outer_port }}</td>
                </tr>
                <tr>
                  <td class="text-right table-intro">打洞状态：</td>
                  <td class="table-intro" v-if="!!item.outer_ip && !!item.outer_port && !!item.status">
                    <p
                      class="group inline-flex items-center rounded-full text-sm font-semibold whitespace-nowrap px-3 focus:outline-none focus:ring-2 bg-cyan-50 text-green-600 hover:bg-cyan-100 hover:text-green-700 focus:ring-green-600">
                      成功</p>
                  </td>
                  <td class="table-intro" v-else>
                    <p
                      class="group inline-flex items-center rounded-full text-sm font-semibold whitespace-nowrap px-3 focus:outline-none focus:ring-2 bg-pink-50 text-pink-600 hover:bg-pink-100 hover:text-pink-700 focus:ring-pink-600">
                      失败</p>
                  </td>
                </tr>
                <tr>
                  <td class="text-right table-intro">打洞方式：</td>
                  <td class="table-intro" v-if="!!item.direct">
                    <p
                      class="group inline-flex items-center rounded-full text-sm font-semibold whitespace-nowrap px-3 focus:outline-none focus:ring-2 bg-cyan-50 text-green-600 hover:bg-cyan-100 hover:text-green-700 focus:ring-green-600">
                      直连</p>
                  </td>
                  <td class="table-intro" v-else>
                    <p
                      class="group inline-flex items-center rounded-full text-sm font-semibold whitespace-nowrap px-3 focus:outline-none focus:ring-2 bg-orange-50 text-yellow-600 hover:bg-orange-100 hover:text-yellow-700 focus:ring-yellow-600">
                      转发</p>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>