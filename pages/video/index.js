// pages/video/index.js
import NT from "../../utils/native.js"
import api from "../../data/api.js"
var base = require('../../i18n/base.js');
const _t = base._t().video
Page({

  /**
   * 页面的初始数据
   */
  data: {
    _t: _t,
    videoList: [],
    noData: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: _t['我的作品'],
    })
    this.fnGetMyVideo()
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
  // 获取我的作品
  fnGetMyVideo() {
    NT.showToast(_t['加载中..'])
    api.ctMyVideoc().then(res => {
      res.vobaseInfo.forEach(ele => {
        ele.contentUrl = encodeURIComponent(ele.contentUrl)
      })
      this.setData({ videoList: res.vobaseInfo, noData:!res.vobaseInfo.length })
    }).catch( err => {
      this.setData({ videoList: [], noData: true })
      NT.showModal(err.codeMsg || err.message || _t['请求失败！'])
    })
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
  onShareAppMessage: function () {

  }
})