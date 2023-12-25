<template>
  <div class="container">
    <a-form :label-col="{ style: { width: '180px' } }">
      <a-form-item label="颜色">
        <mars-color-picker v-model:value="color" @change="colorChange" />
      </a-form-item>

      <a-form-item label="保留小数位">
        <mars-input-number v-model:value="decimal" :min="0" :max="10" :step="1" />
      </a-form-item>

      <a-form-item label="最大允许点数">
        <mars-input-number v-model:value="maxPointNum" :min="2" :max="999" :step="1" />
      </a-form-item>

      <a-form-item label="显示每段增加部分距离">
        <a-switch v-model:checked="showAddText" checked-children="开" un-checked-children="关" />
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
  import { inject, ref } from 'vue';
  import MarsColorPicker from '/@/mars3d/components/mars-ui/mars-color-picker';
  import MarsInputNumber from '/@/mars3d/components/mars-ui/mars-input-number/index.vue';
  import MarsInput from '/@/mars3d/components/mars-ui/mars-input/index.vue';
  import MarsButton from '/@/mars3d/components/mars-ui/mars-button/index.vue';

  const mapWork = inject('mapWork');

  // 可选值：auto、m、km、wm、mile、zhang 等。auto时根据距离值自动选用k或km
  const unit = ref<string>('auto');
  const showAddText = ref<boolean>(true);
  const decimal = ref<number>(2);
  const maxPointNum = ref<number>(10);
  const color = ref<string>('yellow');
  const label = ref<string>('');

  const begin = () => {
    const tempColor = mapWork.transColor(color.value);
    mapWork.measureSurfaceDistance({
      unit: unit.value,
      maxPointNum: maxPointNum.value,
      showAddText: showAddText.value,
      decimal: decimal.value,
      style: {
        color: tempColor,
        label: {
          text: label.value,
          scala: 1.2,
          color: tempColor,
        },
      },
    });
  };

  const colorChange = (colorObj) => {
    color.value = colorObj.hex;
  };
</script>

<style scoped lang="less">
  .container {
    display: flex;
    flex-direction: column;
    gap: 5px;
  }
</style>
