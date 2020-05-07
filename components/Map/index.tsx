import React, { Component } from 'react';
import './map.css'
import areaData from '../../utils/MapData/area_data.json'
declare const AMap: any
declare const window: Window & { initMap: any }
export interface MState {
  latitude: number
  longitude: number
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
  constructor(props) {
    super(props)
    this.state = {
      latitude: areaData[1].latitude,
      longitude: areaData[1].longitude,
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
    this.initMap()
  }
  initMap = () => {
    console.log(this.state.areaList)
    // 初始化地图
    window.initMap = () => {
      this.map = new AMap.Map('allMap', {
        center: [this.state.longitude, this.state.latitude],
        zoom: 11,
        showLabel: false,
        expandZoomRange: true,
        pitch: 60,
        mapStyle: 'amap://styles/whiteblue' // 设置地图style
        // viewMode: '2D'
      })
      this.renderMap(this.map)
    }
    var url = 'https://webapi.amap.com/maps?v=1.4.15&key=ab2b5d6ec30d0474e6646385abb483bc&callback=initMap';
    var jsapi = document.createElement('script');
    jsapi.charset = 'utf-8';
    jsapi.src = url;
    document.head.appendChild(jsapi);
  }
  renderMap(map) {
    // 获取区域数据
    const { areaList } = this.state
    console.log(areaList)
    this.AreaMarker = areaList['children']
    this.markerLevelOneList = []
    this.AreaMarker.forEach((v, i) => {
      const centerArr = []
      centerArr.push(v.longitude, v.latitude)
      v.extData = {
        index: Number(i)
      }
      // 创建标记点
      this.marker = this.createMarker(centerArr, v)
      this.marker.subMarkers = []
      if(v.children && v.children.length) {
        v.children.forEach((list, i) => {
          this.marker.subMarkers.push(this.createMarker([list.longitude, list.latitude], list))
          this.marker.subMarkers[i].on('click', this._onClickTwo.bind(this, list))
          this.marker.subMarkers[i].on('mouseover', this._onMouseoverTwo.bind(this, list))
          this.marker.subMarkers[i].on('mouseout', this._onMouseoutTwo.bind(this, list))
        })
      }
      this.map.remove(this.marker.subMarkers)
      this.markerLevelOneList.push(this.marker)
      // 添加监听事件
      this.marker.on('click', this._onClick.bind(this, i))
      this.marker.on('mouseover', this._onMouseover.bind(this, i))
      this.marker.on('mouseout', this._onMouseout.bind(this, i))
    })
    // 在视野中显示所有的点
    // map.setFitView();
    AMap.event.addListener(map, 'zoomend', this._onZoomEnd.bind(this));
  }
  createMarker(position, item) {
    // 自定义点标记内容
    var markerContent = document.createElement("div")
    markerContent.className = 'circle'
    // 点标记中的文本
    var markerSpan1 = document.createElement("span")
    markerSpan1.innerHTML = item.name
    var markerSpan2 = document.createElement("span")
    markerSpan2.innerHTML = item.count
    markerContent.appendChild(markerSpan1)
    markerContent.appendChild(markerSpan2)

    const markerPoint = new AMap.Marker({
      position: [position[0], position[1]],
      offset: new AMap.Pixel(-10,-34),
      content: markerContent,
      zIndex: 1000
    })
    markerPoint.setMap(this.map)
    return markerPoint
  }
  createLine(line) {
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
  _onClick(i, e) {
    console.log(i, e)
    // 设置地图缩放级别和中心点
    this.map.setZoomAndCenter(14,
      [this.AreaMarker[i].longitude,
      this.AreaMarker[i].latitude]
    )
  }
  // (一级区域)覆盖事件
  _onMouseover(i, e) {
    // 绘制区域边界
    this.createLine(this.AreaMarker[i])
    const { w } = e.target
    const div = w.content
    div.className = 'circle-hover'
  }
  // (一级区域)移除事件
  _onMouseout(i, e) {
    const { w } = e.target
    const div = w.content
    div.className = 'circle'
    this.polygon.hide(this.AreaMarker[i])
  }
  // (二级区域)点击事件
  _onClickTwo(list, e) {
    console.log(list, e)
  }
  // (二级区域)覆盖事件
  _onMouseoverTwo(list, e) {
    console.log(list, e)
    // 获取区域边界线
    this.createLine(list)
    const { w } = e.target
    const div = w.content
    div.className = 'circle-hover'
  }
  // (二级区域)移除事件
  _onMouseoutTwo(list, e) {
    const { w } = e.target
    const div = w.content
    div.className = 'circle'
    this.polygon.hide(list)
  }
  // 地图缩放事件
  _onZoomEnd() {
    this.polygon.hide(this.markerLevelOneList)
    const zoomLevel = this.map.getZoom()
    if (zoomLevel < 9) {
      // 隐藏一级区域
      this.removeMarkerLevelOne()
    } else if (zoomLevel >= 9 && zoomLevel < 12) {
      // 显示一级区域
      this.map.add(this.markerLevelOneList)
      // 隐藏二级区域
      for (var i = 0; i < this.markerLevelOneList.length; i++) {
        this.map.remove(this.markerLevelOneList[i].subMarkers)
      }
    } else if (zoomLevel >= 12 && zoomLevel < 15) {
      // 隐藏一级区域
      this.removeMarkerLevelOne()
      // 显示二级区域
      for (var i = 0; i < this.markerLevelOneList.length; i++) {
        this.map.add(this.markerLevelOneList[i].subMarkers)
      }
    }
    console.log('地图缩放级别', zoomLevel)
  }
  removeMarkerLevelOne() {
    for(var i = 0; i < this.markerLevelOneList.length; i++) {
      this.map.remove(this.markerLevelOneList[i])
    }
  }
}

export default Map;