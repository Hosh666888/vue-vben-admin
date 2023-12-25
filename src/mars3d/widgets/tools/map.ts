import * as mars3d from 'mars3d';
import { BaseClass, Cesium, LabelEntity, PointEntity, PolygonEntity, PolylineEntity } from 'mars3d';

let map: mars3d.Map;
let graphicLayer: mars3d.layer.GraphicLayer;
let measure: mars3d.thing.Measure;
let tipGraphic: mars3d.graphic.BillboardEntity; //剖面分析图中显示位置
let underground: mars3d.thing.Underground; //地表透明

const graphicLayerId = 'graphicLayer4Tools';
const measureId = 'measure4Tools';
const tipGraphicId = 'BisectAnalyseTipGraphic4Tools';
const undergroundId = 'undergroundId4Tools';

export const eventTarget = new mars3d.BaseClass();

//-------------------------------------------------------------
export function onMounted(mapInstance: mars3d.Map) {
  map = mapInstance; // 记录首次创建的map

  if (map.hasLayer(graphicLayerId)) {
    graphicLayer = map.getLayerById(graphicLayerId);
  } else {
    graphicLayer = new mars3d.layer.GraphicLayer({
      id: graphicLayerId,
    });
    map.addLayer(graphicLayer);
  }

  if (map.hasThing(measureId)) {
    measure = map.getThing(measureId, 'id');
  } else {
    measure = new mars3d.thing.Measure({ id: measureId });
    map.addThing(measure);
  }

  tipGraphic = graphicLayer.getGraphicById(tipGraphicId);

  //向剖面分析页传递选点完毕事件
  measure.on(mars3d.EventType.end, (e) => {
    if (mars3d.graphic.SectionMeasure.type === e.graphic?.type) {
      eventTarget.fire('BisectChooseDone', e);
    }
  });


}

export function onUnmounted() {
  // dispose()
  map = null;
}

//-------------------------------------------------------------

//css颜色转换CesiumColor
export const transColor = (cssStyle): Cesium.Color => {
  return Cesium.Color.fromCssColorString(cssStyle);
};

//格式化海拔和累距
export function calculation(params) {
  const len = mars3d.MeasureUtil.formatDistance(Number(params.axisValue));
  const hbgdStr = mars3d.MeasureUtil.formatDistance(Number(params.value));

  return { len, hbgdStr };
}

export const showTipMarker = (point, z, inthtml) => {
  const position = Cesium.Cartesian3.fromDegrees(point.lng, point.lat, z);

  if (!tipGraphic) {
    tipGraphic = new mars3d.graphic.BillboardEntity({
      id: tipGraphicId,
      name: '当前点',
      position: position,
      style: {
        image: 'img/marker/mark-blue.png',
        scale: 1,
        horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
        verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
        scaleByDistance: new Cesium.NearFarScalar(10000, 1.0, 500000, 0.2),
      },
    }).addTo(graphicLayer);
  }
  tipGraphic.position = position;

  tipGraphic.bindPopup(inthtml).openPopup();
};

export const hideTipMarker = () => {
  if (tipGraphic && graphicLayer) {
    graphicLayer.removeGraphic(tipGraphic);
  }
};

//=============================图上量算=============================
//清空标绘
export const clearAllPlot = () => {
  measure.clear();
  graphicLayer.clear();
  console.log('已清除工具箱产生的所有标绘物');
};

export const dispose = () => {
  if (measure) {
    map.removeThing(measure);
    console.log('已移除', '图上量算图层');
  }

  if (underground) {
    map.removeThing(underground);
    console.log('已移除', '地表透明图层');
  }

  if (graphicLayer) {
    if (tipGraphic) {
      graphicLayer.removeGraphic(tipGraphic);
      console.log('已移除', '剖面分析位置标识图标图');
    }

    map.removeLayer(graphicLayer);
    console.log('已移除', '工具箱图层');
  }
};

//================================================================

//=============================图上量算=============================

export const measureDistance = (options?: {
  style?: PolylineEntity.StyleOptions | any;
  label?: LabelEntity.StyleOptions | any;
  unit?: string;
  maxPointNum?: number;
  addHeight?: number;
  showAddText?: boolean;
  decimal?: number;
}) => {
  measure.distance(options);
};

export const measureSurfaceDistance = (options?: {
  style?: PolygonEntity.StyleOptions | any;
  label?: LabelEntity.StyleOptions | any;
  unit?: string;
  splitNum?: number;
  has3dtiles?: boolean;
  decimal?: number;
  exact?: boolean;
}) => {
  measure.distanceSurface(options);
};

export const measureHorizontalArea = (options?: {
  style?: PolygonEntity.StyleOptions | any;
  label?: LabelEntity.StyleOptions | any;
  unit?: string;
  decimal?: number;
}) => {
  measure.area(options);
};

export const measureSurfaceArea = (options?: {
  style?: PolygonEntity.StyleOptions | any;
  label?: LabelEntity.StyleOptions | any;
  unit?: string;
  splitNum?: number;
  has3dtiles?: boolean;
  decimal?: number;
  exact?: boolean;
}) => {
  measure.areaSurface(options);
};

export const measureHeightDiff = (options?: {
  style?: PolylineEntity.StyleOptions | any;
  label?: LabelEntity.StyleOptions | any;
  unit?: string;
  decimal?: number;
}) => {
  measure.height(options);
};

export const measureTriangleHeight = (options?: {
  style?: PolylineEntity.StyleOptions | any;
  label?: LabelEntity.StyleOptions | any;
  unit?: string;
  decimal?: number;
}) => {
  measure.heightTriangle(options);
};

export const measureAngle = (options?: {
  style?: PolylineEntity.StyleOptions | any;
  label?: LabelEntity.StyleOptions | any;
  angleDecimal?: number;
  decimal?: number;
}) => {
  measure.angle(options);
};

export const measurePoint = (options?: { style?: PointEntity.StyleOptions | any }) => {
  measure.point(options);
};

//==========================================================

//============================分析==============================
export const measureSection = (options?: {
  style?: PolylineEntity.StyleOptions | any;
  label?: LabelEntity.StyleOptions | any | any;
  unit?: string;
  maxPointNum?: number;
  addHeight?: number;
  splitNum?: number;
  has3dtiles?: boolean;
  exact?: boolean;
  decimal?: number;
}) => {
  return measure.section(options);
};

export const measureVolume = (options?: {
  style?: PolygonEntity.StyleOptions | any;
  polygonWall?: PolygonEntity.StyleOptions | any;
  label?: LabelEntity.StyleOptions | any;
  showFillVolume?: boolean;
  fillVolumeName?: string;
  showDigVolume?: boolean;
  digVolumeName?: string;
  showArea?: boolean;
  areaName?: string;
  heightLabel?: boolean;
  offsetLabel?: boolean;
  labelHeight?: LabelEntity.StyleOptions | any;
  decimal?: number;
  has3dtiles?: boolean;
  exact?: boolean;
  unit?: string;
  splitNum?: number;
  minHeight?: number;
  maxHeight?: number;
  height?: number;
  depth?: boolean;
}) => {
  return measure.volume(options);
};

//==========================================================

//============================地表透明==============================

export const surfaceTransparency = (
  enable: boolean,
  options?: {
    alpha?: number;
    color?: Cesium.Color;
    id?: string | number;
    enabled?: boolean;
    eventParent?: BaseClass | boolean;
  },
) => {
  if (!map.hasThing(undergroundId)) {
    options.id = undergroundId;
    underground = new mars3d.thing.Underground(options);
    map.addThing(underground);
  }

  underground.alpha = options.alpha;
  underground.enabled = enable;
};

//================================================================
