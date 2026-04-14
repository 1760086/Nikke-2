<template>
  <div>
    <div class="l2d-char-panel-wrap">
      <CharacterList />
      <div class="l2d-download-aside" v-show="!market.live2d.hideUI">
        <DownloadAssetZip />
      </div>
    </div>
    <ToolList />
  </div>
</template>

<script setup lang="ts">
import CharacterList from './CharacterList.vue'
import ToolList from './ToolList.vue'
import DownloadAssetZip from './Tools/DownloadAssetZip.vue'
import { useMarket } from '@/stores/market'

const market = useMarket()
</script>

<style scoped lang="less">
.l2d-char-panel-wrap {
  position: absolute;
  left: 20px;
  top: 130px;
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  gap: 8px;
  height: calc(85vh - 120px);
  z-index: 1;
}

.l2d-download-aside {
  flex: 0 0 132px;
  min-width: 132px;
  padding-top: 2px;
}
</style>
