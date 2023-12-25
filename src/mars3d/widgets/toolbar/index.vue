<template>
  <mars-dialog :draggable="false" customClass="base-pannel" right="10" top="10">
    <template v-for="(item, i) in data" :key="i">
      <div
        v-if="item.widget && !item.children"
        class="toolbar-item"
        @click="showWidget(item.widget)"
      >
        <mars-icon :icon="item.icon" width="18" />
        <span class="title">{{ item.name }}</span>
      </div>

      <mars-dropdown-menu
        v-if="item.children && !item.widget"
        trigger="hover"
        placement="bottomRight"
      >
        <div class="toolbar-item">
          <mars-icon :icon="item.icon" width="18" />
          <span class="title">{{ item.name }}</span>
          <mars-icon icon="down" width="18" />
        </div>
        <template #overlay>
          <a-menu @click="clickMenu">
            <a-menu-item v-for="child in item.children" :key="child.widget" :title="child.name">
              <mars-icon :icon="child.icon" width="18" />
              <span>{{ child.name }}</span>
            </a-menu-item>
          </a-menu>
        </template>
      </mars-dropdown-menu>
    </template>
  </mars-dialog>
</template>

<script setup lang="ts">
  import { useWidget } from '/@/mars3d/common/store/widget';
  import MarsDialog from '/@/mars3d/components/mars-ui/mars-dialog/index.vue';
  import MarsIcon from '/@/mars3d/components/mars-ui/mars-icon/index.vue';
  import MarsDropdownMenu from '/@/mars3d/components/mars-ui/mars-dropdown';

  const { activate } = useWidget();

  const data = [
    { name: '工具箱', icon: 'tool', widget: 'tools' },
    // {
    //   name: '工具',
    //   icon: 'tool',
    //   children: [
    //     { name: '坐标定位', icon: 'local', widget: 'location-point' },
    //     { name: 'Point点', icon: 'local', widget: 'point' },
    //   ],
    // },
  ];

  const showWidget = (widget: string) => {
    activate(widget);
  };

  const clickMenu = ({ key }: any) => {
    showWidget(key);
  };
</script>

<style lang="less">
  .base-pannel {
    display: flex;
    flex-direction: row;

    padding: 0 !important;
    background-image: none !important;
    border: none;
    border-radius: 2px !important;
    background-color: var(--mars-bg-base);
    height: 40px;

    .toolbar-item {
      display: flex;
      padding: 6px 12px;
      height: 100%;
      color: var(--mars-text-color);
      font-size: 15px;
      cursor: pointer;
      &:hover {
        background-color: var(--mars-select-bg);
      }
    }
    .mars-icon {
      margin-right: 5px;
      color: var(--mars-text-color);
    }
  }
</style>
