// pages/location/seach-location.js
import PAGE from "../../utils/config.js"
// 引用百度地图微信小程序JSAPI模块 
import bmap from "../../utils/bmap-wx.min.js"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    sugData: '' 
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      city: options.city
    })
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

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  // onShareAppMessage: function () {

  // }
  // 搜索
  bindconfirm(e) {
    console.log(e)
    var that = this; 
    // 新建百度地图对象 
    var BMap = new bmap.BMapWX({ 
        ak: PAGE.baiduMapAk
    }); 
    var fail = function(data) { 
        console.log(data) 
    }; 
    var success = function(data) { 
        that.setData({ 
            sugData: data.result 
        }); 
    } 
    // 发起suggestion检索请求 
    BMap.suggestion({ 
        query: e.detail, 
        region: this.data.city, 
        city_limit: true, 
        fail: fail, 
        success: success 
    });
  },
  tapTable(e) { // 点击table
    const uid = e.currentTarget.dataset.uid
    var sugData = this.data.sugData
    sugData.map(item=>{
      if(item.uid === uid){
        // Custom Location
        const data = Object.assign(item.location,{name:item.name},{isFirst:true})
        wx.setStorage({
          key:"customLocation",
          data: data
        })
        wx.navigateBack({
          delta: 1
        })
      }
    })
  }
})