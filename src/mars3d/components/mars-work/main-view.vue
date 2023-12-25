<template>
  <ConfigProvider :locale="zhCN">
    <div class="mars-main-view" id="mars-main-view">
      <div id="centerDiv" class="centerDiv-container">
        <mars-map :url="configUrl" :options="mapOptions" @onload="marsOnload" />
      </div>

      <template v-if="loaded">
        <template v-for="comp in widgets" :key="comp.key">
          <mars-widget
            v-if="openAtStart.includes(comp.name) && comp.visible"
            v-model:visible="comp.visible"
            :widget="comp"
          />
        </template>
      </template>
    </div>
  </ConfigProvider>
</template>

<script setup lang="ts">
  import { computed, provide, ref } from 'vue';
  import { ConfigProvider } from 'ant-design-vue';
  import { useWidget, useWidgetStore } from '/@/mars3d/common/store/widget';
  import MarsWidget from './widget.vue';
  import * as mars3d from 'mars3d';
  import MarsMap from '/@/mars3d/components/mars-work/mars-map.vue';
  import zhCN from 'ant-design-vue/es/locale/zh_CN';

  import 'mars3d-cesium/Build/Cesium/Widgets/widgets.css';
  import 'mars3d/dist/mars3d.css';
  import '../mars-ui/themes/dark/index.less';
  import '../mars-ui/themes/light/index.less';

  const widgetStore = useWidgetStore();
  const { activate, isActivate, disable } = useWidget();

  const widgets = computed(() => widgetStore.state.widgets);
  const openAtStart = computed(() => widgetStore.state.openAtStart);

  const props = withDefaults(
    defineProps<{
      mapOptions?: any;
      url?: string;
    }>(),
    {
      mapOptions: () => ({}),
      url: '',
    },
  );
  // const configUrl =
  //   props.url === '' || !props.url
  //     ? `${process.env.BASE_URL}config/config.json?time=${new Date().getTime()}`
  //     : props.url;

  // todo 动态从后台获取

  const configUrl = '/config/config.json';

  let mapInstance: any = null;
  //向子组件暴露getMapInstance(获取地图控件的方法)
  provide('getMapInstance', () => {
    return mapInstance;
  });

  const emit = defineEmits(['mapLoaded']);

  const loaded = ref(false);

  const marsOnload = (map: any) => {
    console.log('map构造完成', map);
    mapInstance = map;

    map.changeMouseModel(true);

    map.addControl(
      new mars3d.control.ToolButton({
        title: '模型树',
        icon: '/img/manager-layers.svg',
        insertIndex: 0,
        click: () => {
          if (isActivate('ModelTree')) {
            disable('ModelTree');
          } else {
            activate('ModelTree');
          }
        },
      }),
    );

    map.addControl(
      new mars3d.control.ToolButton({
        title: '配置模型颜色',
        icon: '/img/color-picker.svg',
        insertIndex: 1,
        click: () => {
          if (isActivate('TileColorControl')) {
            disable('TileColorControl');
          } else {
            activate('TileColorControl');
          }
        },
      }),
    );

    emit('mapLoaded', mapInstance);
    loaded.value = true;
  };
</script>

<style lang="less" scoped>
  .mars-main-view {
    height: 100%;
    width: 100%;
    position: relative;
  }

  .centerDiv-container {
    height: 100%;
    width: 100%;
    overflow: hidden;
  }

  .forceDarkMode .ant-select-selector {
    background-color: #141414 !important; /* 设置背景色为暗色 */
    color: #ffffff !important; /* 设置文字颜色为亮色 */
  }

</style>
