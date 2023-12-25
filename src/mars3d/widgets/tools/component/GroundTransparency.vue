<template>
  <div class="container">
    <a-form :label-col="{ style: { width: '180px' } }">
      <a-form-item label="开启">
        <a-switch
          v-model:checked="enable"
          checked-children="开"
          un-checked-children="关"
          @change="begin"
        />
      </a-form-item>

      <a-form-item label="透明度">
        <mars-slider v-model:value="opacity" :min="0" :max="1" :step="0.1" />
      </a-form-item>
    </a-form>
  </div>
</template>

<script setup lang="ts">
  import { inject, ref } from 'vue';
  import MarsSlider from '/@/mars3d/components/mars-ui/mars-slider/index.vue';

  const mapWork = inject('mapWork');

  const enable = ref<boolean>(false);
  const opacity = ref<number>(0.5);

  const begin = (e) => {
    mapWork.surfaceTransparency(e, {
      alpha: opacity.value,
      enabled: true,
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
