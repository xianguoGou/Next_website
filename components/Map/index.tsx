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
  markerLevelTwoList: any[];
  markerLevelThreeList: any[];
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
        showLabel: true,
        expandZoomRange: true,
        pitch: 60,
        // mapStyle: 'amap://styles/whitesmoke' // 设置图层样式
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
    // console.log(areaList)
    this.AreaMarker = areaList['children']
    this.markerLevelOneList = [] // 一级marker点
    this.markerLevelTwoList = [] // 二级marker点
    this.markerLevelThreeList = [] // 三级marker点
    this.AreaMarker.forEach((v, i) => {
      const centerArr = []
      centerArr.push(v.longitude, v.latitude)
      v.extData = {
        index: Number(i)
      }
      // 创建标记点
      const markerOne = this.createMarker(centerArr, v, 'circle')
      if(v.children && v.children.length) {
        v.children.forEach((list) => {
          list.children = [
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
          if (list.children && list.children.length) {
            list.children.forEach((item) => {
              // this.marker.nextMarkers.push(this.createMarker([item.longitude, item.latitude], item, 'rect'))
              const markerThree = this.createMarker([item.longitude, item.latitude], item, 'rect')
              this.markerLevelThreeList.push(markerThree)
              this.map.remove(markerThree)
              markerThree.on('click', this._onClickThree)
              markerThree.on('mouseover', this._onMouseoverThree.bind(this, item))
              markerThree.on('mouseout', this._onMouseoutThree.bind(this, item))
            })
          }
          const markerTwo = this.createMarker([list.longitude, list.latitude], list, 'circle')
          this.markerLevelTwoList.push(markerTwo)
          this.map.remove(markerTwo)
          markerTwo.on('click', this._onClickTwo.bind(this, list))
          markerTwo.on('mouseover', this._onMouseoverTwo.bind(this, list))
          markerTwo.on('mouseout', this._onMouseoutTwo.bind(this, list))
        })
      }
      // this.map.remove(this.marker.nextMarkers)
      // this.map.remove(this.marker.subMarkers)
      this.markerLevelOneList.push(markerOne)
      // 添加监听事件
      markerOne.on('click', this._onClick.bind(this, i))
      markerOne.on('mouseover', this._onMouseover.bind(this, i))
      markerOne.on('mouseout', this._onMouseout.bind(this, i))
    })
    // 在视野中显示所有的点
    // map.setFitView();
    AMap.event.addListener(map, 'zoomend', this._onZoomEnd.bind(this));
  }
  createMarker(position, item, type) {
    // 自定义点标记内容
    var markerContent = document.createElement("div")
    markerContent.className = type
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
    const { w } = e.target
    const div = w.content
    div.className = 'circle'
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
    this.map.setZoomAndCenter(16,
      [
        list.longitude,
        list.latitude
      ]
    )
    console.log(list, e)
    const { w } = e.target
    const div = w.content
    div.className = 'circle'
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
  // (三级区域)点击事件
  _onClickThree(item, e) {
    console.log(item, e)
  }
  // (三级区域)覆盖事件
  _onMouseoverThree(item, e) {
    console.log(item, e)
    const { w } = e.target
    const div = w.content
    div.className = 'rect-hover'
  }
  // (三级区域)移除事件
  _onMouseoutThree(item, e) {
    console.log(item)
    const { w } = e.target
    const div = w.content
    div.className = 'rect'
  }
  // 地图缩放事件
  _onZoomEnd() {
    // console.log(this.markerLevelTwoList)
    this.polygon.hide(this.markerLevelOneList)
    const zoomLevel = this.map.getZoom()
    if (zoomLevel <= 9) {
      // 隐藏一级区域
      this.map.remove(this.markerLevelOneList)
    } else if (zoomLevel > 9 && zoomLevel <= 12) {
      // 显示一级区域
      this.map.add(this.markerLevelOneList)
      // 隐藏二级区域
      this.map.remove(this.markerLevelTwoList)
    } else if (zoomLevel > 12 && zoomLevel < 15) {
      // 隐藏一级区域
      this.map.remove(this.markerLevelOneList)
      // 显示二级区域
      this.map.add(this.markerLevelTwoList)
      // 隐藏三级区域
      this.map.remove(this.markerLevelThreeList)
    } else if (zoomLevel >= 16) {
      // 隐藏二级区域
      this.map.remove(this.markerLevelTwoList)
      // 显示三级区域
      this.map.add(this.markerLevelThreeList)
    }
    console.log('地图缩放级别', zoomLevel)
  }
}

export default Map;