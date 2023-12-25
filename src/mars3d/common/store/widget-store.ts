/**
 * index页面的widget配置
 * @copyright 火星科技 mars3d.cn
 * @author 火星渣渣灰 2022-02-19
 */
import { defineAsyncComponent, markRaw } from 'vue';
import { WidgetState } from '/@/mars3d/common/store/widget';
import { StoreOptions } from 'vuex';

const store: StoreOptions<WidgetState> = {
  state: {
    widgets: [
      {
        component: markRaw(
          defineAsyncComponent(() => import('/@/mars3d/widgets/toolbar/index.vue')),
        ),
        name: 'toolbar',
        autoDisable: true,
      },
      {
        component: markRaw(
          defineAsyncComponent(() => import('/@/mars3d/widgets/Attributes/index.vue')),
        ),
        name: 'Attributes',
      },
      {
        component: markRaw(
          defineAsyncComponent(() => import('/@/mars3d/widgets/TileColorControl/index.vue')),
        ),
        name: 'TileColorControl',
      },
      {
        component: markRaw(
          defineAsyncComponent(() => import('/@/mars3d/widgets/ModelTree/index.vue')),
        ),
        name: 'ModelTree',
      },
      {
        component: markRaw(defineAsyncComponent(() => import('/@/mars3d/widgets/tools/index.vue'))),
        name: 'tools',
        disableOther: ['Attributes'],
      },
    ],
    openAtStart: ['toolbar', 'ModelTree'],
  },
};

export default store;
