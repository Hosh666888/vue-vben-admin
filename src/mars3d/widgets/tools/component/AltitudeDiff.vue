<template>
  <div class="container">
    <a-form :label-col="{ style: { width: '180px' } }">
      <a-form-item label="颜色">
        <mars-color-picker v-model:value="color" />
      </a-form-item>

      <a-form-item label="保留小数位">
        <mars-input-number v-model:value="decimal" :min="0" :max="10" :step="1" />
      </a-form-item>

      <a-form-item label="不透明度">
        <mars-slider v-model:value="opacity" :min="0" :max="1" :step="0.1" />
      </a-form-item>

      <a-form-item label="单位">
        <a-select v-model:value="unit">
          <a-select-option value="auto">自动</a-select-option>
          <a-select-option value="m">米</a-select-option>
          <a-select-option value="km">千米</a-select-option>
          <a-select-option value="wm">万米</a-select-option>
          <a-select-option value="mile">海里</a-select-option>
          <a-select-option value="zhang">丈</a-select-option>
        </a-select>
      </a-form-item>

      <a-form-item label="标签">
        <mars-input v-model:value="label" allow-clear />
      </a-form-item>
    </a-form>

    <mars-button @click="begin">开始选点</mars-button>
  </div>
</template>

<script setup lang="ts">
  import MarsColorPicker from '/src/mars3d/components/mars-ui/mars-color-picker';
  import { inject, ref } from 'vue';
  import MarsInput from '/@/mars3d/components/mars-ui/mars-input/index.vue';
  import MarsInputNumber from '/@/mars3d/components/mars-ui/mars-input-number/index.vue';
  import MarsSlider from '/@/mars3d/components/mars-ui/mars-slider/index.vue';
  import MarsButton from '/@/mars3d/components/mars-ui/mars-button/index.vue';

  const mapWork = inject('mapWork');
  const unit = ref<string>('auto');
  const decimal = ref<number>(2);
  const color = ref<string>('yellow');
  const opacity = ref<number>(0.4);
  const label = ref<string>('');

  const begin = () => {
    mapWork.measureHeightDiff({
      unit: unit.value,
      decimal: decimal.value,
      style: {
        color: mapWork.transColor(color.value),
        opacity: opacity.value,
        label: {
          text: label.value,
          scale: 1.2,
        },
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
