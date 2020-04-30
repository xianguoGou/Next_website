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
  constructor(props) {
    super(props)
    this.state = {
      latitude: 104.07,
      longitude: 30.67,
      CityCode: '510100',
      areaList: areaData[1]
    }
    this.map = null
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
    console.log(this)
    window.initMap = () => {
      this.map = new AMap.Map('allMap', {
        center: [this.state.latitude, this.state.longitude],
        zoom: 12,
        showLabel: false,
        expandZoomRange: true,
        pitch: 60,
        mapStyle: 'amap://styles/whiteblue'
        // viewMode: '2D'
      })
      this.map.on('click', this.mapClick)
      this.renderMap(this.map)
    }
    var url = 'https://webapi.amap.com/maps?v=1.4.15&key=ab2b5d6ec30d0474e6646385abb483bc&callback=initMap';
    var jsapi = document.createElement('script');
    jsapi.charset = 'utf-8';
    jsapi.src = url;
    document.head.appendChild(jsapi);
  }
  renderMap(map) {
    const { areaList } = this.state
    const AreaObj: object = Object.values(areaList['children'])
    var markers = [];
    // var layer = new AMap.LabelsLayer({
    //   zooms: [10, 20],
    //   zIndex: 1000,
    //   // 开启标注避让，默认为开启，v1.4.15 新增属性
    //   collision: true,
    //   // 开启标注淡入动画，默认为开启，v1.4.15 新增属性
    //   animation: true,
    // });
    // map.add(layer);
    for(const i in AreaObj) {
      const centerArr = []
      centerArr.push(AreaObj[i].longitude, AreaObj[i].latitude)
      AreaObj[i].extData = {
        index: Number(i)
      }
      AreaObj[i].position = centerArr
      AreaObj[i].zooms = [10, 16]
      AreaObj[i].opacity = 1
      AreaObj[i].zIndex = 10
      AreaObj[i].text = {
        content: AreaObj[i].name,
        direction: 'center',
        offset: [0, -5],
        style: {
            fontSize: 15,
            fontWeight: 'normal',
            fillColor: '#fff',
            // strokeColor: '#fff',
            // strokeWidth: 2,
        }
      }
      // console.log(AreaObj[i])
      var circleMarker = new AMap.CircleMarker({
        center: [centerArr[0], centerArr[1]],
        radius: 50,//3D视图下，CircleMarker半径不要超过64px
        fillOpacity: 0.8, // 填充透明度
        zIndex: 10,
        bubble: true,
        cursor: 'pointer',
        clickable: true,
        strokeColor: 'rgba(48,114,246,0.9)',  // 线颜色
        strokeOpacity: 0.5,  // 线透明度
        strokeWeight: 2,  // 线粗细度
        fillColor: '#3072f6',  // 填充颜色
      })
      var labelMarker = new AMap.LabelMarker(AreaObj[i]);
      markers.push(labelMarker);
      // layer.add(labelMarker);
      circleMarker.on('mouseover', (e) => {
        // const { w } = e.target
        circleMarker.setOptions({
          fillColor: '#FF3D00',
          strokeColor: '#FF3D00'
        })
        // const { w } = e.target
        // console.log(circleMarker)
        // w.fillColor = '#FF3D00'
        // w.strokeColor = '#FF3D00'
        console.log('圆事件', e.target)
      })
      circleMarker.setMap(map)
    }
    // 在视野中显示所有的点
    // map.setFitView();
    // var lineArr = [
    //     [104.07333, 30.67123],
    //     [105.382122, 31.901176],
    //     [106.382122, 30.901176]
    // ];
    // var polyline = new AMap.Polyline({
    //     path: lineArr,          //设置线覆盖物路径
    //     strokeColor: "#3366FF", //线颜色
    //     strokeWeight: 5,        //线宽
    //     strokeStyle: "solid",   //线样式
    // });
    // map.add(polyline);
    // 构造矢量圆形
    // var circle = new AMap.Circle({
    //   center: new AMap.LngLat("104.07333", "30.67123"), // 圆心位置
    //   radius: 1000,  // 半径
    //   strokeColor: "#F33",  // 线颜色
    //   strokeOpacity: 1,  // 线透明度
    //   strokeWeight: 3,  // 线粗细度
    //   fillColor: "#ee2200",  // 填充颜色
    //   fillOpacity: 0.35 // 填充透明度
    // });
    // // 创建两个点标记
    // var marker1 = new AMap.Marker({
    //   position: [104.07333, 30.67123],   // 经纬度对象，如 [116.39, 39.9]; 也可以是经纬度构成的一维数组[116.39, 39.9]
    //   title: '成都'
    // });
    // var marker2 = new AMap.Marker({
    //   position: [105.382122, 31.901176],   // 经纬度对象，如 new AMap.LngLat(116.39, 39.9); 也可以是经纬度构成的一维数组[116.39, 39.9]
    //   title: '成都1'
    // });
    // map.add([marker1, marker2, circle]);
    // 获取地图缩放级别
    var currentZoom = map.getZoom();
    console.log(currentZoom)
  }
  mapClick(e) {
    console.log(e)
  }
}

export default Map;