<template>
  <mars-dialog
    title="模型颜色配置"
    width="250"
    bottom="60"
    left="70"
    class="container"
    v-show="showFlag"
  >
    <div class="innerItem">
      <span style="width: 100px">杆塔(施工中)</span>
      <mars-color-picker v-model:value="colorConfig.towerDoing" @change="colorChanged1" />
    </div>
    <div class="innerItem">
      <span style="width: 100px">杆塔(已完工)</span>
      <mars-color-picker v-model:value="colorConfig.towerDone" @change="colorChanged2" />
    </div>
    <div class="innerItem">
      <span style="width: 100px">选中模型</span>
      <mars-color-picker v-model:value="colorConfig.choose" @change="colorChanged3" />
    </div>
  </mars-dialog>
</template>

<script setup lang="ts">
  import { onBeforeMount, ref } from 'vue';
  import MarsDialog from '/@/mars3d/components/mars-ui/mars-dialog/index.vue';
  import MarsColorPicker from '/@/mars3d/components/mars-ui/mars-color-picker';

  interface ColorConfigObj {
    towerDoing: string;
    towerDone: string;
    choose: string;
  }

  let showFlag: boolean = ref<boolean>(true);

  const colorConfig: ColorConfigObj = ref<ColorConfigObj>({
    towerDoing: '#FF0000',
    towerDone: '#00FF00',
    choose: '#0000FF',
  });

  onBeforeMount(() => {
    //去localstorage查看配置
    const obj = JSON.parse(localStorage.getItem('colorConfig'));
    if (obj) {
      colorConfig.value = obj;
    }
  });

  const colorChanged1 = (color: any) => {
    showFlag.value = false;
    colorConfig.value.towerDoing = color.hex;
    localStorage.setItem('colorConfig', JSON.stringify(colorConfig.value));
    showFlag.value = true;
  };

  const colorChanged2 = (color: any) => {
    showFlag.value = false;
    colorConfig.value.towerDone = color.hex;
    localStorage.setItem('colorConfig', JSON.stringify(colorConfig.value));
    showFlag.value = true;
  };

  const colorChanged3 = (color: any) => {
    showFlag.value = false;
    colorConfig.value.choose = color.hex;
    localStorage.setItem('colorConfig', JSON.stringify(colorConfig.value));
    showFlag.value = true;
  };
</script>

<style scoped lang="less">
  .container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 10px;
  }

  .innerItem {
    display: flex;
    margin-top: 5px;
  }
</style>
