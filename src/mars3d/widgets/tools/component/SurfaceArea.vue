<template>
  <div class="container">
    <a-form :label-col="{ style: { width: '180px' } }">
      <a-form-item label="区域颜色">
        <mars-color-picker v-model:value="color" />
      </a-form-item>

      <a-form-item label="轮廓颜色">
        <mars-color-picker v-model:value="outlineColor" />
      </a-form-item>

      <a-form-item label="保留小数位">
        <mars-input-number v-model:value="decimal" :min="0" :max="10" :step="1" />
      </a-form-item>

      <a-form-item label="不透明度">
        <mars-slider v-model:value="opacity" :min="0" :max="1" :step="0.1" />
      </a-form-item>

      <a-form-item label="显示轮廓">
        <a-switch v-model:checked="enableOutline" checked-children="开" un-checked-children="关" />
      </a-form-item>

      <a-form-item label="单位">
        <a-select v-model:value="unit" theme="dark">
          <a-select-option value="auto">自动</a-select-option>
          <a-select-option value="m">平方米</a-select-option>
          <a-select-option value="km">平方公里</a-select-option>
          <a-select-option value="mu">亩</a-select-option>
          <a-select-option value="ha">公顷</a-select-option>
        </a-select>
      </a-form-item>

      <a-form-item label="轮廓宽度">
        <mars-input-number v-model:value="outlineWidth" :max="10" :min="0" :step="1" />
      </a-form-item>

      <a-form-item label="插值分隔数">
        <MarsInputNumber v-model:value="splitNum" :max="100" :min="1" />
      </a-form-item>
    </a-form>

    <mars-button @click="begin">开始选点</mars-button>
  </div>
</template>

<script setup lang="ts">
  import { inject, ref } from 'vue';
  import MarsSlider from '/@/mars3d/components/mars-ui/mars-slider/index.vue';
  import MarsColorPicker from '/@/mars3d/components/mars-ui/mars-color-picker';
  import MarsInputNumber from '/@/mars3d/components/mars-ui/mars-input-number/index.vue';
  import MarsButton from '/@/mars3d/components/mars-ui/mars-button/index.vue';

  const mapWork = inject('mapWork');

  const unit = ref<string>('auto');
  const decimal = ref<number>(2);
  const color = ref<string>('#ffff00');
  const opacity = ref<number>(0.4);
  const enableOutline = ref<boolean>(true);
  const outlineColor = ref<string>('#fafa5a');
  const outlineWidth = ref<number>(1);
  const splitNum = ref<number>(10); // step插值分割的个数

  const begin = () => {
    mapWork.measureSurfaceArea({
      unit: unit.value,
      decimal: decimal.value,
      splitNum: splitNum.value,
      style: {
        color: mapWork.transColor(color.value),
        opacity: opacity.value,
        outline: enableOutline.value,
        outlineColor: mapWork.transColor(outlineColor.value),
        outlineWidth: outlineWidth.value,
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
