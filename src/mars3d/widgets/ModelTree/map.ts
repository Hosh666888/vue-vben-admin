import * as mars3d from 'mars3d';
import { Cesium3DTileStyle, Resource } from 'mars3d-cesium';
import { Cesium } from 'mars3d';

let map: mars3d.Map;
let preClickLayer: mars3d.layer.TilesetLayer;
let preClickLayerColorStyle: Cesium3DTileStyle;
const defaultColorStyle: Map<any, Cesium.Cesium3DTileStyle> = new Map<
  any,
  Cesium.Cesium3DTileStyle
>(); //layerId:defaultColorStyle

const towerBuildProcessMap: Map<string, TowerBuildProcess> = new Map(); // rankId:完工未完工杆塔eeid

// -----------------------------------------------------------------------------------------------------
export function onMounted(mapInstance: mars3d.Map) {
  map = mapInstance; // 记录首次创建的map

  map.on(mars3d.EventType.click, (e) => {
    if (!e.graphic && preClickLayer && preClickLayerColorStyle) {
      preClickLayer.style = preClickLayerColorStyle;
      preClickLayer = null;
      preClickLayerColorStyle = null;
    }
  });
}

export function onUnmounted() {
  // map.off(mars3d.EventType.click)
  if (preClickLayer) {
    preClickLayer.style = preClickLayerColorStyle;
  }

  // map = null
}

// -----------------------------------------------------------------------------------------------------

export const getLayers = (): any[] => {
  return map.getLayers();
};

export const rendModel = (
  node: CustomNode,
  colorStyle: Cesium.Cesium3DTileStyle,
  clickedModelColor: Cesium.Color,
  doAfterClickModel: (clickEntity: any) => void,
): void => {
  if (map.hasLayer(node.key)) {
    console.log('node对应渲染图层已存在');
    return;
  }

  const layer = new mars3d.layer.TilesetLayer({
    id: node.key,
    name: node.title,
    url: new Resource({
      url: node.url,
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      parseUrl: false,
    }),
    style: colorStyle,
  });

  defaultColorStyle.set(layer.id, colorStyle);
  bindClickEvent(layer, clickedModelColor, node.parentKey, doAfterClickModel);

  map.addLayer(layer, true).then(() => {
    console.log('成功渲染图层', node);
  });
  layer.flyTo();
};

export const clearModel = (node: CustomNode): void => {
  if (!node.children) {
    if (map.hasLayer(node.key)) {
      const layer: mars3d.layer.TilesetLayer = map.getLayerById(node.key);
      layer.remove();
    }
    return;
  }
  for (const child of node.children) {
    clearModel(child);
  }
};

export const flyTo = (node: CustomNode): void => {
  if (!node.children && map.hasLayer(node.key)) {
    map.getLayerById(node.key).flyTo();
  }
};

const bindClickEvent = (
  layer: mars3d.layer.TilesetLayer,
  clickedColor: Cesium.Color,
  rankId: string,
  doAfterClick: (clickEntity: any) => void,
) => {
  clickedColor = clickedColor || Cesium.Color.BLUE;

  layer.on(mars3d.EventType.click, (e: any) => {
    const EEID: number = e.graphic.attr.EEID;

    // 还原上一个layer的样式
    if (preClickLayer && preClickLayer.id !== layer.id) {
      preClickLayer.style = preClickLayerColorStyle;
    }

    preClickLayer = layer;
    preClickLayerColorStyle = defaultColorStyle.get(preClickLayer.id);

    layer.style = new Cesium.Cesium3DTileStyle({
      color: {
        evaluateColor: (feature: any, result: any) => {
          if (feature.getProperty('EEID') === EEID) {
            return Cesium.Color.clone(clickedColor, result);
          } else {
            return defaultColorStyle.get(layer.id).color.evaluateColor(feature, result);
          }
        },
      },
    });

    doAfterClick({
      EEID: EEID,
      rankId: rankId,
    });
  });
};

// eslint-disable-next-line no-use-before-define
export const queryTowerBuildProcessByRankId = (rankId: string): TowerBuildProcess => {
  if (!towerBuildProcessMap.has(rankId)) {
    // todo 发请求获取
    const process = new TowerBuildProcess();
    process.doing = [62, 127, 129, 130, 131];
    process.done = [1, 117, 119, 120, 122, 57, 61, 60, 59, 89, 92, 91, 90];

    towerBuildProcessMap.set(rankId, process);
  }
  return towerBuildProcessMap.get(rankId);
};

export const queryTowerBuildProcessColor = (): any => {
  const colorConfig = JSON.parse(localStorage.getItem('colorConfig')) || {
    towerDoing: '#FF0000',
    towerDone: '#00FF00',
    choose: '#0000FF',
  };
  colorConfig.towerDoing = Cesium.Color.fromCssColorString(colorConfig.towerDoing);
  colorConfig.towerDone = Cesium.Color.fromCssColorString(colorConfig.towerDone);
  colorConfig.choose = Cesium.Color.fromCssColorString(colorConfig.choose);
  return colorConfig;
};

// ------------------------------------------------ types -----------------------------------------------------
export class CustomNode {
  key: string;
  parentKey: string;
  title: string;
  url: string;
  children: CustomNode[];
  type: string;
}

export class TowerBuildProcess {
  done: number[];
  doing: number[];
}

// ------------------------------------------------ types -----------------------------------------------------
