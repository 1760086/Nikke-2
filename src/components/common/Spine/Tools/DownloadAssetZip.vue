<template>
  <n-button
    ghost
    type="primary"
    round
    :loading="loading"
    :disabled="loading"
    @click="onDownload"
  >
    Download
  </n-button>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useMarket } from '@/stores/market'
import { messagesEnum } from '@/utils/enum/globalParams'
import { buildL2dAssetsZipBlob } from '@/utils/downloadL2dAssetsZip'

const market = useMarket()
const loading = ref(false)

const onDownload = async () => {
  loading.value = true
  try {
    const blob = await buildL2dAssetsZipBlob({
      current_id: market.live2d.current_id,
      current_pose: market.live2d.current_pose,
      f: market.live2d.f
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download =
      'NIKKE-DB_' +
      market.live2d.current_id +
      '_' +
      market.live2d.current_pose +
      '_' +
      new Date().getTime().toString().slice(-8) +
      '.zip'
    a.click()
    URL.revokeObjectURL(url)
    market.message.getMessage().success('ZIP downloaded', market.message.short_message)
  } catch (e) {
    console.error(e)
    market.message.getMessage().error(messagesEnum.MESSAGE_ERROR, market.message.long_message)
  } finally {
    loading.value = false
  }
}
</script>

<style lang="less" scoped>
.n-button {
  width: 100%;
  height: 40px;
}
</style>
