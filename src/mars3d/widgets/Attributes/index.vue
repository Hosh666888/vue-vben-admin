<template>
  <mars-dialog title="属性信息" top="60" right="20" width="400">
    <mars-select
      v-model:value="currentShowGroup"
      :options="groups"
      @change="handleGroupChange"
      style="width: 350px"
    />

    <mars-table :dataSource="showData" :columns="columns">
      <template #title>
        <span>EEID: {{ clickInfo.EEID }}</span>
        <br />
        <span>{{ clickInfo.rankId }}</span>
      </template>
    </mars-table>
  </mars-dialog>
</template>

<script setup lang="ts">
  import ShareData from '/@/mars3d/common/store/ShareData';
  import { onBeforeMount, reactive, ref } from 'vue';
  import { SelectProps } from 'ant-design-vue';
  import MarsDialog from '/@/mars3d/components/mars-ui/mars-dialog/index.vue';
  import MarsSelect from '/@/mars3d/components/mars-ui/mars-select/index.vue';
  import MarsTable from '/@/mars3d/components/mars-ui/mars-table/index.vue';

  const clickInfo = ShareData.state.clickEntity || {
    EEID: '',
    rankId: '',
  };

  let showData = reactive([]);
  const columns = reactive([
    {
      title: '名称',
      dataIndex: 'key',
      key: 'key',
    },
    {
      title: '属性',
      dataIndex: 'value',
      key: 'value',
    },
  ]);
  let currentShowGroup = ref('');
  let groups: SelectProps['options'] = reactive<SelectProps['options']>([]);

  let groupDic: Map<string, any[]> = new Map<string, any[]>();

  onBeforeMount(async () => {
    if (clickInfo.EEID && clickInfo.rankId) {
      const r = await fetch(
        `http://localhost/layers/attr?eeid=${clickInfo.EEID}&rankId=${clickInfo.rankId}`,
      );
      const res = await r.json();
      const originData = [...res];
      if (originData) {
        for (const item of originData) {
          if (!groupDic.has(item.group)) {
            groupDic.set(item.group, []);
          }
          groupDic.get(item.group).push(item);
        }

        for (const group of groupDic.keys()) {
          groups.push({
            label: group,
            value: group,
          });
        }
        currentShowGroup.value = groups[0].value;
        showData = groupDic.get(currentShowGroup.value);
      }
    } else {
      console.log('Attributes未能获取到ShareData中的clickEntity信息', clickInfo);
    }
  });

  const handleGroupChange = (value) => {
    showData = groupDic.get(value);
  };
</script>
