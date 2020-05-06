import React, { Component } from 'react';
import './map.css'
import areaData from '../../utils/MapData/area_data.json'
// import LabelsData from '../../utils/MapData/demo_data'
declare const AMap: any
declare const window: Window & { initMap: any }
export interface MState {
  latitude: number
  longitude: number
  CityCode?: string
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
  AreaMarker: any;
  markerTwo: any;
  markerLevelOneList: any;
  markerLevelTwoList: any;
  constructor(props) {
    super(props)
    this.state = {
      latitude: 104.07,
      longitude: 30.67,
      CityCode: '510100',
      areaList: areaData[1]
    }
    this.map = null
    this.marker = null
    this.polygon = null
    this.AreaMarker = null
    this.markerTwo = null
    this.markerLevelOneList = []
    this.markerLevelTwoList = []
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
    // 初始化地图
    window.initMap = () => {
      this.map = new AMap.Map('allMap', {
        center: [this.state.latitude, this.state.longitude],
        zoom: 12,
        showLabel: false,
        expandZoomRange: true,
        pitch: 60,
        mapStyle: 'amap://styles/whiteblue' // 设置地图style
        // viewMode: '2D'
      })
      // 添加监听: 当前地图缩放级别
      AMap.event.addListener(this.map, 'zoomend', () => {
        // console.log('当前地图缩放级别：', this.map.getZoom())
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
    // 获取地理数据
    const { areaList } = this.state
    this.AreaMarker = Object.values(areaList['children'])
    // const markers = []
    this.markerLevelOneList = []
    this.AreaMarker.forEach((v, i) => {
      // console.log(Object.values(v.children))
      const centerArr = []
      centerArr.push(v.longitude, v.latitude)
      v.extData = {
        index: Number(i)
      }
      // 创建Marker点
      const marker = this.createMarker(centerArr, v)
      this.markerLevelOneList.push(marker)
      // 添加监听事件
      this.marker.on('click', this._onClick.bind(this, i))
      this.marker.on('mouseover', this._onMouseover.bind(this, i))
      this.marker.on('mouseout', this._onMouseout.bind(this, i))
      // console.log(v)
    })
    // console.log('this.markerLevelOneList', this.markerLevelOneList)
    console.log(map)
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

    this.marker = new AMap.Marker({
      position: [position[0], position[1]],
      offset: new AMap.Pixel(-10,-34),
      content: markerContent,
      zIndex: 1000
    })
    this.marker.subMarkers = []
    this.marker.setMap(this.map)
    const subMarkers = Object.values(item.children)
    console.log(subMarkers)
    if (subMarkers.length) {
      for(var i = 0; i < subMarkers.length; i++) {
        // this.marker.subMarkers.push()
      }
    }
    return this.marker
  }
  createLine(line) {
    let LineArr = line.border.split(';')
    LineArr = LineArr.map(v => v.split(','))
    // console.log(LineArr)
    this.polygon = new AMap.Polygon({
        path: LineArr,
        fillColor: '#1791fc',
        fillOpacity: 0.4,       // 设置线覆盖物路径
        strokeColor: '#3366FF', // 线颜色
        strokeWeight: 2,        // 线宽
        strokeStyle: 'solid',   // 线样式
        zIndex: 1000
    });
    this.map.add(this.polygon);
  }

  _onClick(i, e) {
    console.log(e)
    console.log(this.AreaMarker[i])
    this.markerTwo = Object.values(this.AreaMarker[i].children)
    const { w } = e.target
    const div = w.content
    div.className = 'circle'
    this.polygon.hide(this.AreaMarker)
    this.removeMarkerLevelOne()
    if (this.markerTwo.length) {
      // this.map.setFitView(this.markerTwo);
      this.markerLevelTwoList = []
      this.markerTwo.forEach((v, n) => {
        const centerArr = []
        centerArr.push(v.longitude, v.latitude)
        const marker = this.createMarker(centerArr, v)
        this.markerLevelTwoList.push(marker)
        // 二级节点添加监听
        this.marker.on('click', this._onClickTwo.bind(this, n))
        this.marker.on('mouseover', this._onMouseoverTwo.bind(this, n))
        this.marker.on('mouseout', this._onMouseoutTwo.bind(this, n))
      })
      console.log(this.markerLevelTwoList)
    }
    this.map.setZoomAndCenter(14, [this.AreaMarker[i].longitude, this.AreaMarker[i].latitude])
  }
  _onMouseover(i, e) {
    // 获取区域边界线
    this.createLine(this.AreaMarker[i])
    const { w } = e.target
    const div = w.content
    // div.style.backgroundColor="#f73325"
    div.className = 'circle-hover'
    console.log('鼠标移入事件', e.target, div)
  }
  _onMouseout(i, e) {
    console.log(e)
    const { w } = e.target
    const div = w.content
    // div.style.backgroundColor=""
    div.className = 'circle'
    this.polygon.hide(this.AreaMarker[i])
  }
  _onClickTwo(i, e) {
    console.log(i, e)
  }
  _onMouseoverTwo(i, e) {
    console.log(i, e)
    console.log(this.markerTwo[i])
    // 获取区域边界线
    this.createLine(this.markerTwo[i])
    const { w } = e.target
    const div = w.content
    div.className = 'circle-hover'
  }
  _onMouseoutTwo(i, e) {
    const { w } = e.target
    const div = w.content
    div.className = 'circle'
    this.polygon.hide(this.markerTwo[i])
  }
  _onZoomEnd() {
    // this.polygon.hide(this.AreaMarker)
    const zoomLevel = this.map.getZoom()
    if (zoomLevel <= 8) {
      this.removeMarkerLevelOne()
    } else if (zoomLevel > 8 && zoomLevel <= 11) {
      // 显示一级区域
      this.removeMarkerLevelTwo()
      this.map.add(this.markerLevelOneList)
      // this.map.add(this.markerLevelTwoList)
    } else if (zoomLevel > 11 && zoomLevel <= 13) {
      this.map.add(this.markerLevelTwoList)
      console.log('10---13')
    }
    // else {
    //   this.map.add(this.markerLevelOneList)
    // }
    console.log('地图缩放', zoomLevel)
  }
  _onMousemove() {
    // console.log(e)
  }
  removeMarkerLevelOne() {
    for(var i = 0; i < this.markerLevelOneList.length; i++) {
      this.map.remove(this.markerLevelOneList[i])
    }
  }
  removeMarkerLevelTwo() {
    for(var i = 0; i < this.markerLevelTwoList.length; i++) {
      this.map.remove(this.markerLevelTwoList[i])
    }
  }
}

export default Map;