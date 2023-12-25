<template>
  <mars-dialog title="工具箱" right="10" top="60" width="400" height="600">
    <a-menu
      v-model:selectedKeys="selectedKeys"
      mode="horizontal"
      theme="dark"
      @select="select"
      :items="items"
    />

    <div class="config-box">
      <div v-if="currentKey != '管理'" class="title"> {{ currentKey }}配置项: </div>

      <div v-if="currentKey == '管理'" class="manege-box">
        <MarsButton @click="notReady">加载本地GeoJson</MarsButton>
        <MarsButton @click="notReady">保存GeoJSON到本地</MarsButton>
        <MarsButton @click="notReady">保存到数据库</MarsButton>
        <MarsButton @click="clearGraphics">清空标绘(工具箱中绘制)</MarsButton>
        <MarsButton @click="disposeLayers">销毁控件</MarsButton>
      </div>
      <SpaceLength v-if="currentKey == '空间距离'" />
      <SurfaceLength v-if="currentKey == '贴地距离'" />
      <HorizontalArea v-if="currentKey == '水平面积'" />
      <SurfaceArea v-if="currentKey == '贴地面积'" />
      <AltitudeDiff v-if="currentKey == '高度差'" />
      <TriangleHeight v-if="currentKey == '三角测量'" />
      <PositionAngle v-if="currentKey == '方位角'" />
      <MeasurePoint v-if="currentKey == '坐标测量'" />

      <BisectAnalyse v-if="currentKey == '剖面分析'" />
      <VolumeMeasure v-if="currentKey == '方量分析'" />

      <GroundTransparency v-if="currentKey == '地表'" />
    </div>
  </mars-dialog>
</template>

<script setup lang="ts">
  import useLifecycle from '@/mars3d/common/uses/use-lifecycle';
  import * as mapWork from './map';
  import { h, provide, ref } from 'vue';
  import { MenuProps } from 'ant-design-vue';
  import { CalculatorOutlined } from '@ant-design/icons-vue';
  import { $message } from '@/mars3d/components/mars-ui';

  import GroundTransparency from '@/mars3d/widgets/tools/component/GroundTransparency.vue';
  import MarsButton from '@/mars3d/components/mars-ui/mars-button/index.vue';
  import MarsDialog from '@/mars3d/components/mars-ui/mars-dialog/index.vue';
  import SurfaceLength from '@/mars3d/widgets/tools/component/SurfaceLength.vue';
  import HorizontalArea from '@/mars3d/widgets/tools/component/HorizontalArea.vue';
  import SurfaceArea from '@/mars3d/widgets/tools/component/SurfaceArea.vue';
  import AltitudeDiff from '@/mars3d/widgets/tools/component/AltitudeDiff.vue';
  import TriangleHeight from '@/mars3d/widgets/tools/component/TriangleHeight.vue';
  import PositionAngle from '@/mars3d/widgets/tools/component/PositionAngle.vue';
  import MeasurePoint from '@/mars3d/widgets/tools/component/MeasurePoint.vue';
  import BisectAnalyse from '@/mars3d/widgets/tools/component/BisectAnalyse.vue';
  import VolumeMeasure from '@/mars3d/widgets/tools/component/VolumeMeasure.vue';
  import SpaceLength from '@/mars3d/widgets/tools/component/SpaceLength.vue';

  useLifecycle(mapWork);
  provide('mapWork', mapWork);

  // const currentKey: string = ref<string>("管理")
  const currentKey = ref<string>('贴地距离');
  const selectedKeys = ref<string[]>([]);
  const items = ref<MenuProps['items']>([
    {
      key: '量算',
      icon: () => h(CalculatorOutlined),
      label: '量算',
      title: 'Navigation One',
      children: [
        {
          key: '空间距离',
          label: '空间距离',
        },
        {
          key: '贴地距离',
          label: '贴地距离',
        },
        {
          key: '水平面积',
          label: '水平面积',
        },
        {
          key: '贴地面积',
          label: '贴地面积',
        },
        {
          key: '高度差',
          label: '高度差',
        },
        {
          key: '三角测量',
          label: '三角测量',
        },
        {
          key: '方位角',
          label: '方位角',
        },
        {
          key: '坐标测量',
          label: '坐标测量',
        },
      ],
    },
    {
      key: '分析',
      label: '分析',
      children: [
        {
          key: '剖面分析',
          label: '剖面分析',
        },
        {
          key: '方量分析',
          label: '方量分析',
        },
        {
          key: '通视分析',
          label: '通视分析',
        },
        {
          key: '淹没分析',
          label: '淹没分析',
        },
      ],
    },
    {
      key: '地表',
      label: '地表',
    },
    {
      key: '预览',
      label: '预览',
    },
    {
      key: '管理',
      label: '管理',
    },
  ]);

  const select = ({ key }) => {
    currentKey.value = key;
  };

  const notReady = async () => {
    await $message('还没写');
  };

  const clearGraphics = () => {
    mapWork.clearAllPlot();
  };

  const disposeLayers = () => {
    mapWork.dispose();
  };
</script>

<style scoped lang="less">
  .config-box {
    min-height: 200px;
    padding-top: 10px;
  }

  .manege-box {
    display: flex;
    flex-direction: column;
    gap: 5px;
  }

  .title {
    font-weight: bolder;
    font-size: 1.2em;
    margin-bottom: 10px;
  }
</style>
