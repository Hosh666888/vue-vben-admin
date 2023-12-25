<template>
  <mars-dialog :draggable="true" title="模型树" width="350" :min-width="250" top="20" left="20">
    <mars-tree
      checkable
      :tree-data="treeData"
      v-model:expandedKeys="expandedKeys"
      v-model:checkedKeys="checkedKeys"
      @check="checkedChange"
      @click="flyTo"
    />
  </mars-dialog>
</template>

<script setup lang="ts">
  import useLifecycle from '@/mars3d/common/uses/use-lifecycle';
  import * as mapWork from './map';
  import { onMounted, ref } from 'vue';
  import axios from 'axios';
  import { useWidget } from '@/mars3d/common/store/widget';
  import shareData from '@/mars3d/common/store/ShareData';
  import { Cesium } from 'mars3d';
  import {
    CustomNode,
    queryTowerBuildProcessByRankId,
    queryTowerBuildProcessColor,
    TowerBuildProcess,
  } from './map';
  import MarsDialog from '@/mars3d/components/mars-ui/mars-dialog/index.vue';
  import MarsTree from '@/mars3d/components/mars-ui/mars-tree';
  import { useRoute } from 'vue-router';

  const { activate } = useWidget();
  useLifecycle(mapWork);
  const treeData = ref<mapWork.CustomNode[]>([]);
  const expandedKeys = ref<string[]>([]);
  const checkedKeys = ref<string[]>([]);
  const colorConf = ref({});
  const route = useRoute();

  onMounted(() => {
    colorConf.value = queryTowerBuildProcessColor();
    initTree();
  });
  const initTree = async () => {
    // 构建树
    const res = await axios.get('http://localhost/layers');
    const data: any[] = res.data;
    if (data) {
      for (const item of data) {
        treeData.value.push(item);
      }

      // 默认展开第一个工程第一个标段
      let temp = data[0];
      while (temp.children) {
        expandedKeys.value.push(temp.key);
        temp = temp.children[0];
      }
    }

    // 默认勾选已渲染的图层
    const layers = mapWork.getLayers();
    for (const layer of layers) {
      if (layer.id === 2021) continue;
      checkedKeys.value.push(layer.id);
    }

    //rankId
    const rankId = route.query.rankId;
    if (rankId) {
      console.log('检测到url携带 rankId', rankId);
      checkedKeys.value.push(rankId);
      for (const projectNode of treeData.value) {
        for (const rankNode of projectNode.children) {
          if (rankNode.key !== rankId) continue;
          rende(rankNode);
        }
      }
    }
  };

  const checkedChange = (_: any[], e: any) => {
    let node = e.node;
    if (e.checked) {
      // 渲染
      rende(node);
    } else {
      // 清除模型
      mapWork.clearModel(node);
    }
  };

  const rende = (node: mapWork.CustomNode): void => {
    if (!node.children && node.url) {
      // 检查是否已存在
      const currentTowerBuildProcess: TowerBuildProcess = queryTowerBuildProcessByRankId(
        node.parentKey,
      );

      const colorStyle: Cesium.Cesium3DTileStyle = new Cesium.Cesium3DTileStyle({
        color: {
          evaluateColor: (feature: any, result: any) => {
            const eeid: number = feature.getProperty('EEID');
            if (currentTowerBuildProcess.doing && currentTowerBuildProcess.doing.includes(eeid)) {
              return Cesium.Color.clone(colorConf.value.towerDoing, result);
            }
            if (currentTowerBuildProcess.done && currentTowerBuildProcess.done.includes(eeid)) {
              return Cesium.Color.clone(colorConf.value.towerDone, result);
            }
          },
        },
      });

      mapWork.rendModel(node, colorStyle, colorConf.value.choose, (clickEntity: any) => {
        shareData.commit('updateClickEntity', clickEntity);
        activate('Attributes');
      });
      return;
    }

    for (const nodeChild of node.children) {
      rende(nodeChild);
    }
  };

  const flyTo = (_: any, e: any) => {
    if (e.checked) {
      mapWork.flyTo(e.dataRef);
    }
  };
</script>

<style scoped lang="less"></style>
