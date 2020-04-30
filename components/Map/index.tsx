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
  polyline: any;
  AreaMarker: object;
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
    this.polyline = null
    this.AreaMarker = null
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
        console.log('当前地图缩放级别：', this.map.getZoom())
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
    // var markers = []
    for(const i in this.AreaMarker) {
      const centerArr = []
      centerArr.push(this.AreaMarker[i].longitude, this.AreaMarker[i].latitude)
      this.AreaMarker[i].extData = {
        index: Number(i)
      }
      // 创建Marker点
      this.createMarker(centerArr, this.AreaMarker[i])
      // 添加监听事件
      this.marker.on('click', this._onClick)
      this.marker.on('mouseover', this._onMouseover.bind(this, i))
      this.marker.on('mouseout', this._onMouseout.bind(this, i))
      // console.log(this.AreaMarker[i])
    }
    console.log(map)
    // 在视野中显示所有的点
    // map.setFitView();
  }
  createMarker(position, item) {
    // 自定义点标记内容
    var markerContent = document.createElement("div")
    // 点标记中的文本
    var markerSpan = document.createElement("span")
    markerSpan.className = 'circle'
    markerSpan.innerHTML = item.name
    markerContent.appendChild(markerSpan)

    this.marker = new AMap.Marker({
      position: [position[0], position[1]],
      offset: new AMap.Pixel(-10,-34),
      content: markerContent,
      zIndex: 1000
    })
    this.marker.setMap(this.map)
  }
  createLine(line) {
    let LineArr = line.border.split(';')
    LineArr = LineArr.map(v => { return v.split(',') })
    // console.log(LineArr)
    this.polyline = new AMap.Polyline({
        path: LineArr,          // 设置线覆盖物路径
        strokeColor: '#3366FF', // 线颜色
        strokeWeight: 2,        // 线宽
        strokeStyle: 'solid',   // 线样式
        zIndex: 1000
    });
    this.map.add(this.polyline);
  }

  _onClick(e) {
    console.log('鼠标点击事件', e)
  }
  _onMouseover(i, e) {
    // 获取区域边界线
    this.createLine(this.AreaMarker[i])
    const { w } = e.target
    const div = w.content.children[0]
    div.style.backgroundColor="#f73325"
    console.log('鼠标移入事件', e.target, div)
  }
  _onMouseout(i, e) {
    console.log(e)
    const { w } = e.target
    const div = w.content.children[0]
    div.style.backgroundColor=""
    this.polyline.hide(this.AreaMarker[i])
  }
}

export default Map;