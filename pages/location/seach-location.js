// pages/location/seach-location.js
import PAGE from "../../utils/config.js"
import api from "../../data/api";
import NT from "../../utils/native.js"
// 引用百度地图微信小程序JSAPI模块 
import bmap from "../../utils/bmap-wx.min.js"
var base = require('../../i18n/base.js');
const _t = base._t().components
Page({

  /**
   * 页面的初始数据
   */
  data: {
    _t: _t,
    sugData: '' ,
    params: {keyword: '',region: '',pageSize:20,pageIndex: PAGE.start },
    hadNextPage: false,
    rgcData: {},
    historyCity: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    const data = wx.getStorageSync('locationCity') || ''
    this.setData({ historyCity: wx.getStorageSync('historyCity') || []})
    if(!data) return
    const rgcData = {
      city: data.originalData.result.addressComponent.city,
      lng: data.originalData.result.location.lng,  // 纬度
      lat: data.originalData.result.location.lat  // 经度
    }
    this.setData({ rgcData })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },
  getCurrentCity() {
    var BMap = new bmap.BMapWX({
      ak: PAGE.baiduMapAk
    });
    var success = data => {
      // console.log(data)
      wx.setStorage({
        key:"locationCity",
        data:data
      })
      const rgcData = {
        city: data.originalData.result.addressComponent.city,
        lng: data.originalData.result.location.lng,  // 纬度
        lat: data.originalData.result.location.lat  // 经度
      }
      this.setData({ rgcData })
    }
    BMap.regeocoding({
        success: success,
        fail: () => {
          wx.hideLoading()
          wx.showModal({
            content: _t['检测到您没打开定位权限，是否去设置打开'],
            confirmText: _t['前往设置'],
            confirmColor: '#00A653',
            success(res) {
              if (res.confirm) {
                wx.openSetting()
              }
            }
          })
        }
    });  
  },
  //缓存处理
  historyCityStorage(keyWord) {
    console.log(keyWord)
    if(!keyWord){
      return
    }
    var historyCity = wx.getStorageSync('historyCity') || []
    //去重
    if(historyCity.length){
      historyCity.map((item,index)=>{
        if(item===keyWord){
          historyCity.splice(index,1)
        }
      })
    }
    //超过8个处理
    if(historyCity.length>7){
      historyCity = historyCity.slice(0,7)
    }
    historyCity.unshift(keyWord)
    wx.setStorage({
      key:"historyCity",
      data: historyCity
    })
    this.setData({
      historyCity: historyCity
    })
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if(this.data.hadNextPage) {
      this.data.params.pageIndex++
      this.getLocationData(true)
    }
  },

  /**
   * 用户点击右上角分享
   */
  // onShareAppMessage: function () {

  // }
  // 搜索
  bindconfirm(e) {
    if(!e.detail) {
      this.setData({ sugData: [], 'params.pageIndex': PAGE.start })
      return
    }
    wx.pageScrollTo({
      scrollTop: 0,
      duration: 300
    })
    this.setData({ params: {keyword: e.detail,region: e.detail,pageSize:20,pageIndex: PAGE.start }})
    this.historyCityStorage(e.detail)
    this.getLocationData(false)
    // 新建百度地图对象 
    // var BMap = new bmap.BMapWX({ 
    //     ak: PAGE.baiduMapAk
    // }); 
    // var fail = function(data) { 
    //     console.log(data) 
    // }; 
    // var success = function(data) { 
    //    const formatData =  []
    //    data.result.forEach(element => {
    //      if(element.location) {
    //        return formatData.push(element)
    //      }
    //    });
    //     that.setData({ 
    //         sugData: formatData 
    //     }); 
    // } 
    // 发起suggestion检索请求 
    // BMap.suggestion({ 
    //     query: e.detail, 
    //     // region: this.data.city, 
    //     region: e.detail, 
    //     city_limit: true, 
    //     fail: fail, 
    //     success: success 
    // });
  },
  // 历史搜索
  tapGetHistory(e){
    const keyWord = e.currentTarget.dataset.name
    wx.pageScrollTo({
      scrollTop: 0,
      duration: 300
    })
    this.setData({ params: {keyword: keyWord,region: keyWord,pageSize:20,pageIndex: PAGE.start }})
    this.getLocationData(false)
  },
  getLocationData(isConcat) {
    const that = this
    wx.showLoading({
      title: _t['加载中..'],
    })
    api.locationSearch(this.data.params).then(res => {
      const formatData =  []
      res.data.forEach(element => {
        if(element.location) {
          return formatData.push(element)
        }
      });
       that.setData({ 
           sugData: isConcat?this.data.sugData.concat(formatData):formatData,
           hadNextPage:  res.data.length === 20
       }); 
       wx.hideLoading()
    })
  },
  tapTable(e) { // 点击table
    const index = e.currentTarget.dataset.index
    var item = this.data.sugData[index]
    // Custom Location
    const data = Object.assign(item.location,{name:item.title},{isFirst:true})
    wx.setStorage({
      key:"customLocation",
      data: data
    })
    wx.navigateBack({
      delta: 1
    })
  },
  tapTableCur() { // 点击table
    var item = this.data.rgcData
    // Custom Location
    const data = Object.assign(item,{isFirst:true})
    wx.setStorage({
      key:"customLocation",
      data: data
    })
    wx.navigateBack({
      delta: 1
    })
  }
})