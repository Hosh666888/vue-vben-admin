<template>
  <div class="container">
    <a-form :label-col="{ style: { width: '180px' } }">
      <a-form-item label="颜色">
        <mars-color-picker v-model:value="color" />
      </a-form-item>

      <a-form-item label="线宽">
        <mars-input-number v-model:value="width" :min="0" :max="50" :step="1" />
      </a-form-item>

      <a-form-item label="距离小数位">
        <mars-input-number v-model:value="decimal" :min="0" :max="10" :step="1" />
      </a-form-item>

      <a-form-item label="角度小数位">
        <mars-input-number v-model:value="angleDecimal" :min="0" :max="10" :step="1" />
      </a-form-item>
    </a-form>

    <mars-button @click="begin">开始选点</mars-button>
  </div>
</template>

<script setup lang="ts">
  import { inject, ref } from 'vue';
  import MarsColorPicker from '/@/mars3d/components/mars-ui/mars-color-picker';
  import MarsInputNumber from '/@/mars3d/components/mars-ui/mars-input-number/index.vue';
  import MarsButton from '/@/mars3d/components/mars-ui/mars-button/index.vue';

  const mapWork = inject('mapWork');

  const angleDecimal = ref<number>(2);
  const decimal = ref<number>(2);
  const color = ref<string>('yellow');
  const width = ref<number>(10);

  const begin = () => {
    mapWork.measureAngle({
      style: {
        color: mapWork.transColor(color.value),
        width: width.value,
      },
      label: {
        scale: 1.2,
      },
      angleDecimal: angleDecimal.value,
      decimal: decimal.value,
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
