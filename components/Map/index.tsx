import React, { Component } from 'react';
import './map.css'
import areaData from '../../utils/MapData/area_data.json'
declare const AMap: any
declare const window: Window & { initMap: any }
export interface MState {
  areaList: object
  [propName: string]: any
  // [propName: string]: string | number
}
export interface MProps {
  name: string
}
class Map extends Component<MProps, MState> {
  map: any;
  marker: any;
  polygon: any;
  AreaMarker: any[];
  markerLevelOneList: any[];
  markerLevelTwoList: any[];
  markerLevelThreeList: any[];
  isLine: boolean = false;
  constructor(props) {
    super(props)
    this.state = {
      areaList: areaData[1]
    }
    this.map = null
    this.polygon = null
    this.AreaMarker = []
  }
  render() {
    return (
      <div>
          BMap.com111
          <div id="allMap"></div>
      </div>
    );
  }
  componentDidMount() {
    console.log(areaData)
    // this.getCurrentCity()
    // 获取当前城市： areaData[0]-成都 | areaData[1]-重庆
    this.initMap(areaData[0])
  }
  initMap = (city) => {
    // 初始化地图
    window.initMap = () => {
      this.map = new AMap.Map('allMap', {
        resizeEnable: true // 是否监控地图容器尺寸变化
      })
      // 根据城市的名字，进行地址解析，拿到我们所在城市的经纬度
      this.map.setCity(city.name, position => {
        if (position) {
          this.map.setZoomAndCenter(10, position);
        }
      })
      this.renderMap(city['children'])
    }
    var url = 'https://webapi.amap.com/maps?v=1.4.15&key=ab2b5d6ec30d0474e6646385abb483bc&callback=initMap';
    var jsapi = document.createElement('script');
    jsapi.charset = 'utf-8';
    jsapi.src = url;
    document.head.appendChild(jsapi);
  }
  renderMap(city) {
    // 获取当前地图的缩放级别和中心点
    const parmList = this.getZoomAndCenter()
    console.log('初始化数据', parmList)
    // 添加覆盖物
    this.renderOverlays(city, parmList.type, parmList.nextZoom)
    // 根据当前的地图的缩放级别，来决定当前渲染什么形状的覆盖物
    // AMap.event.addListener(this.map, 'zoomend', this._onZoomEnd.bind(this))
    this.map.on('movestart', this.mapMovestart.bind(this));
    this.map.on('mapmove', this.mapMove.bind(this));
    this.map.on('moveend', () => {
      const param = this.getZoomAndCenter()
      console.log('地图移动结束param', param)
      // 调接口
    });
    // 在视野中显示所有的点
    // this.map.setFitView();
  }
  renderOverlays = (city, type, nextZoom) => {
    // 初始化区域数据-调接口
    this.AreaMarker = city
    this.markerLevelOneList = []
    this.AreaMarker.forEach((v, i) => {
      v.extData = {
        index: Number(i)
      }
      if (type === 'circle') {
        this.renderCircleOverlay(v, type, nextZoom)
      } else {
        this.renderRectOverlay(v, type)
      }
    })
  }
  renderCircleOverlay = (item, type, nextZoom) => {
    const {longitude, latitude} = item
    // 自定义点标记内容
    const markerContent = document.createElement("div")
    markerContent.className = type
    // 点标记中的文本
    const markerSpan1 = document.createElement("span")
    markerSpan1.innerHTML = item.name
    const markerSpan2 = document.createElement("span")
    markerSpan2.innerHTML = item.count
    markerContent.appendChild(markerSpan1)
    markerContent.appendChild(markerSpan2)
    const markerPoint = new AMap.Marker({
      position: [longitude, latitude],
      offset: new AMap.Pixel(-10,-34),
      content: markerContent,
      zIndex: 1000
    })
    this.markerLevelOneList.push(markerPoint)
    // 添加一级覆盖物监听事件
    markerPoint.on('click', this._onClick.bind(this, markerPoint, item, nextZoom, type))
    markerPoint.on('mouseover', this._onMouseover.bind(this, item))
    markerPoint.on('mouseout', this._onMouseout.bind(this, item))
    this.map.add(markerPoint)
  }
  renderRectOverlay = (item, type) => {
    const {longitude, latitude} = item
    // 自定义点标记内容
    const markerContent = document.createElement("div")
    markerContent.className = type
    // 点标记中的文本
    const markerSpan1 = document.createElement("span")
    markerSpan1.innerHTML = item.name
    const markerSpan2 = document.createElement("span")
    markerSpan2.innerHTML = item.count
    markerContent.appendChild(markerSpan1)
    markerContent.appendChild(markerSpan2)
    const markerPoint = new AMap.Marker({
      position: [longitude, latitude],
      offset: new AMap.Pixel(-10,-34),
      content: markerContent,
      zIndex: 1000
    })
    markerPoint.on('click', this._onClickThree.bind(this, item))
    markerPoint.on('mouseover', this._onMouseoverThree.bind(this, item))
    markerPoint.on('mouseout', this._onMouseoutThree.bind(this, item))
    // console.log(item)
    this.map.add(markerPoint)
  }
  createLine(line) {
    this.isLine = true
    let LineArr = line.border.split(';')
    LineArr = LineArr.map(v => v.split(','))
    this.polygon = new AMap.Polygon({
        path: LineArr,
        fillColor: '#1791fc',
        fillOpacity: 0.1,       // 设置线覆盖物路径
        strokeColor: '#3366FF', // 线颜色
        strokeWeight: 2,        // 线宽
        strokeStyle: 'solid',   // 线样式
        zIndex: 1000
    });
    this.map.add(this.polygon);
  }
  // (一级区域)点击事件
  _onClick(point, item, nextZoom, type) {
    // 获取地图中心点
    // var currentCenter = this.map.getCenter();
    // console.log(currentCenter)
    // console.log(point, item, e, nextZoom)
    // 把之前的一级覆盖物干掉
    this.map.remove(point)
    this.polygon.hide(item)
    // 重新设置中心点和缩放级别
    this.map.setZoomAndCenter(nextZoom, [item.longitude, item.latitude]);
    // const { w } = e.target
    // const div = w.content
    // div.className = 'circle'
    console.log(item)
    if (item['children']) {
      this.renderOverlays(item['children'], type, nextZoom)
    } else {
      item.children = [
        {
          "id": 3011053445241,
          "name": "新和名座",
          "longitude": 104.029758,
          "latitude": 30.693769,
          "count": 28,
          "unit_price": 14122
        },
        {
          "id": 3011054758502,
          "name": "西城天下",
          "longitude": 104.020531,
          "latitude": 30.699832,
          "count": 58,
          "unit_price": 17716
        }
      ]
      this.renderOverlays(item['children'], type, nextZoom)
      console.log('no')
    }
  }
  // (一级区域)覆盖事件
  _onMouseover(item, e) {
    // console.log(item, nextZoom, e)
    // 绘制区域边界
    this.createLine(item)
    const { w } = e.target
    const div = w.content
    div.className = 'circle-hover'
  }
  // (一级区域)移除事件
  _onMouseout(item, e) {
    const { w } = e.target
    const div = w.content
    div.className = 'circle'
    this.polygon.hide(item)
  }
  _onClickThree(item, e) {
    console.log(item, e)
  }
  _onMouseoverThree(item, e) {
    const { w } = e.target
    const div = w.content
    div.className = 'rect-hover'
    console.log(item, e)
  }
  _onMouseoutThree(item, e) {
    const { w } = e.target
    const div = w.content
    div.className = 'rect'
    console.log(item, e)
  }
  mapMovestart() {
    console.log('地图移动开始')
  }
  mapMove() {
    console.log('地图正在移动')
  }
  mapMoveend() {
    const param = this.getZoomAndCenter()
    // this.renderOverlays(city, type, nextZoom)
    console.log('地图移动结束', param)
    return param
  }
  // 获取地图缩放级别和地图中心点
  getZoomAndCenter = () => {
    if (this.isLine) {
      this.polygon.hide(this.markerLevelOneList)
    }
    let type = 'circle' // 默认渲染圆形覆盖物
    let nextZoom = 10
    let zoom = this.map.getZoom()
    let {lng, lat} = this.map.getCenter()
    let center = [lng, lat]
    let {northeast} = this.map.getBounds()
    let disBetweenPoint = [northeast.lng, northeast.lat]
    // 返回地图中心点 到 地图右上角点之间的地面距离，单位：米
    let distance = AMap.GeometryUtil.distance(center, disBetweenPoint);
    if (zoom <= 9) {
      // // 隐藏一级区域
      // this.map.remove(this.markerLevelOneList)
    } else if (zoom > 9 && zoom < 12) {
      type = 'circle'
      nextZoom = 13
    } else if (zoom > 12 && zoom < 15) {
      // // 隐藏一级区域
      type = 'circle'
      nextZoom = 16
    } else if (zoom > 15) {
      type = 'rect'
    }
    console.log('地图缩放级别', zoom)
    return {type, nextZoom, zoom, center, distance}
  }
}

export default Map;