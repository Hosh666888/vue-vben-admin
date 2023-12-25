<template>
  <div class="container">
    <a-form :label-col="{ style: { width: '180px' } }">
      <a-form-item label="颜色">
        <mars-color-picker v-model:value="color" />
      </a-form-item>

      <a-form-item label="线宽">
        <mars-input-number v-model:value="width" :min="1" :max="20" :step="1" />
      </a-form-item>

      <a-form-item label="保留小数位">
        <mars-input-number v-model:value="decimal" :min="0" :max="10" :step="1" />
      </a-form-item>

      <a-form-item label="线段分割数">
        <mars-input-number v-model:value="splitNum" :min="1" :max="999" :step="1" />
      </a-form-item>

      <a-form-item label="最大选点数">
        <mars-input-number v-model:value="maxPointNum" :min="2" :max="10" :step="1" />
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
    </a-form>

    <mars-button @click="begin">开始选点</mars-button>

    <mars-dialog v-model:visible="showDialog" :left="70" :bottom="40">
      <div class="echatsView">
        <div id="echartsView1" style="width: 100%; height: 100%"></div>
      </div>
    </mars-dialog>
  </div>
</template>

<script setup lang="ts">
  import { inject, onMounted, onUnmounted, ref } from 'vue';
  import * as echarts from 'echarts';
  import { $hideLoading, $showLoading } from '/src/mars3d/components/mars-ui';
  import MarsColorPicker from '/@/mars3d/components/mars-ui/mars-color-picker';
  import MarsInputNumber from '/@/mars3d/components/mars-ui/mars-input-number/index.vue';
  import MarsButton from '/@/mars3d/components/mars-ui/mars-button/index.vue';
  import MarsDialog from '/@/mars3d/components/mars-ui/mars-dialog/index.vue';

  let myChart1: echarts.ECharts;
  const mapWork = inject('mapWork');
  const showDialog = ref<boolean>(false);

  const unit = ref<string>('auto');
  const maxPointNum = ref<number>(10);
  const splitNum = ref<number>(100);
  const decimal = ref<number>(2);
  const color = ref<string>('yellow');
  const width = ref<number>(8);

  mapWork.eventTarget.on('BisectChooseDone', (e) => {
    $showLoading();
    showDialog.value = true;
    setTimeout(() => renderEchartsData(e), 300);
  });

  window.onresize = function () {
    myChart1.resize();
  };

  onMounted(() => {
    myChart1 = echarts.init(document.getElementById('echartsView1'));
  });

  onUnmounted(() => {
    showDialog.value = false;
  });

  const begin = () => {
    showDialog.value = false;
    mapWork.measureSection({
      unit: unit.value,
      maxPointNum: maxPointNum.value,
      splitNum: splitNum.value,
      exact: true,
      decimal: decimal.value,
      style: {
        color: mapWork.transColor(color.value),
        width: width.value,
      },
    });
  };

  const renderEchartsData = (data: any) => {
    if (data == null || data.arrPoint == null) {
      return;
    }
    const arrPoint = data.arrPoint;
    let inhtml = '';

    const option = {
      grid: {
        left: 10,
        right: 40,
        bottom: 10,
        top: 40,
        containLabel: true,
      },
      dataZoom: [
        {
          type: 'inside',
          throttle: 50,
        },
      ],
      tooltip: {
        trigger: 'axis',
        formatter: (params: any) => {
          if (params.length === 0) {
            mapWork.hideTipMarker();
            return inhtml;
          }

          const hbgd = params[0].value; // 海拔高度
          const point = arrPoint[params[0].dataIndex]; // 所在经纬度
          const result = mapWork.calculation(params[0]);

          inhtml = `当前位置<br />
                      距起点：${result.len}<br />
                      海拔：<span style='color:${params[0].color};'>${result.hbgdStr}</span><br />
                      经度：${point.lng}<br />
                      纬度：${point.lat}`;

          mapWork.showTipMarker(point, hbgd, inhtml);

          return inhtml;
        },
      },
      xAxis: [
        {
          name: '行程',
          type: 'category',
          nameTextStyle: { color: 'rgb(255, 70, 131)' },
          boundaryGap: false,
          axisLine: {
            show: true,
          },
          axisLabel: {
            show: true,
            formatter: '{value} 米',
            color: '#fff',
          },
          data: data.arrLen,
        },
      ],
      yAxis: [
        {
          name: '高程',
          nameTextStyle: { color: 'rgb(255, 70, 131)' },
          type: 'value',
          min: getMinZ(arrPoint),
          axisLabel: {
            formatter: '{value} 米',
            color: '#fff',
          },
        },
      ],
      series: [
        {
          name: '高程值',
          type: 'line',
          smooth: true,
          symbol: 'none',
          sampling: 'average',
          itemStyle: {
            normal: {
              color: 'rgb(255, 70, 131)',
            },
          },
          areaStyle: {
            normal: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: 'rgb(255, 158, 68)',
                },
                {
                  offset: 1,
                  color: 'rgb(255, 70, 131)',
                },
              ]),
            },
          },
          data: data.arrHB,
        },
      ],
    };

    myChart1.setOption(option);
    myChart1.resize();
    $hideLoading();
  };

  const getMinZ = (arr: any): any => {
    let minz = 'dataMin';
    if (arr == null || arr.length === 0) {
      return minz;
    }

    minz = arr[0].alt;
    for (let i = 0; i < arr.length; i++) {
      if (arr[i].alt < minz) {
        minz = arr[i].alt;
      }
    }
    return minz;
  };
</script>

<style scoped lang="less">
  .container {
    display: flex;
    flex-direction: column;
    gap: 5px;
  }

  .echatsView {
    width: calc(100vw - 160px);
    height: 240px;
  }
</style>
