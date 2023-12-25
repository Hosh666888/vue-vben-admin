<template>
  <div class="container">
    <Form :label-col="{ style: { width: '180px' } }">
      <FormItem label="基准面颜色">
        <MarsColorPicker v-model:value="color" />
      </FormItem>

      <FormItem label="围墙面颜色">
        <MarsColorPicker v-model:value="colorWall" />
      </FormItem>

      <FormItem label="基准面高度(m)" tooltip="默认是绘制后的最低高度值">
        <MarsInputNumber v-model:value="height" />
      </FormItem>

      <FormItem label="精度" tooltip="保留小数位">
        <MarsInputNumber v-model:value="decimal" :min="0" :max="10" :step="1" />
      </FormItem>

      <FormItem label="插值数" tooltip="将面分割的网格数(概略值，有经纬网网格来插值)">
        <mars-input-number v-model:value="splitNum" :min="1" :max="999" :step="1" />
      </FormItem>

      <FormItem label="单位">
        <Select v-model:value="unit">
          <SelectOption value="auto">自动</SelectOption>
          <SelectOption value="m">平方米</SelectOption>
          <SelectOption value="km">平方公里</SelectOption>
          <SelectOption value="mu">亩</SelectOption>
          <SelectOption value="ha">公顷</SelectOption>
        </Select>
      </FormItem>
    </Form>

    <!--    <mars-button @click="chooseBaseHeight">点选基准面高度</mars-button>-->
    <mars-button @click="begin">开始选点</mars-button>
  </div>
</template>

<script setup lang="ts">
  import { inject, ref } from 'vue';
  import MarsButton from '/@/mars3d/components/mars-ui/mars-button/index.vue';
  import { Form, FormItem, Select, SelectOption } from 'ant-design-vue';
  import MarsColorPicker from '/@/mars3d/components/mars-ui/mars-color-picker';
  import MarsInputNumber from '/@/mars3d/components/mars-ui/mars-input-number/index.vue';

  const mapWork = inject('mapWork');

  const unit = ref<string>('auto');
  const height = ref<number>();
  const splitNum = ref<number>(10);
  const decimal = ref<number>(2);
  const color = ref<string>('yellow');
  const colorWall = ref<string>('red');

  const begin = () => {
    mapWork.measureVolume({
      style: {
        color: mapWork.transColor(color.value),
      },
      polygonWall: {
        color: mapWork.transColor(colorWall.value),
      },
      offsetLabel: true,
      decimal: decimal.value,
      unit: unit.value,
      splitNum: splitNum.value,
      height: height.value,
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
