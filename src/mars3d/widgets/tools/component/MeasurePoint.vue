<template>
  <div class="container">
    <a-form :label-col="{ style: { width: '180px' } }">
      <a-form-item label="颜色">
        <mars-color-picker v-model:value="color" />
      </a-form-item>

      <a-form-item label="线宽">
        <mars-input-number v-model:value="pixelSize" :min="1" :max="50" :step="1" />
      </a-form-item>
    </a-form>

    <mars-button @click="begin">开始选点</mars-button>
  </div>
</template>

<script setup lang="ts">
  import { inject, ref } from 'vue';
  import MarsInputNumber from '/@/mars3d/components/mars-ui/mars-input-number/index.vue';
  import MarsColorPicker from '/@/mars3d/components/mars-ui/mars-color-picker';
  import MarsButton from '/@/mars3d/components/mars-ui/mars-button/index.vue';

  const mapWork = inject('mapWork');

  const color = ref<string>('yellow');
  const pixelSize = ref<number>(10);

  const begin = () => {
    mapWork.measurePoint({
      style: {
        pixelSize: pixelSize.value,
        color: mapWork.transColor(color.value),
      },
    });
  };
</script>

<style scoped lang="less">
  .container {
    display: flex;
    flex-direction: column;
    gap: 5px;
  }
</style>
