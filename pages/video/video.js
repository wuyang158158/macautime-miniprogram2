// pages/video/video.js
import api from "../../data/api.js"
var base = require('../../i18n/base.js');
const _t = base._t().video
Page({

  /**
   * 页面的初始数据
   */
  data: {
    src: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 记录观看人数
    this.fnvoInsertLookRecord(options.id ||'')

    wx.setNavigationBarTitle({
      title: _t['观看作品'],
    })
    this.setData({
      src: decodeURIComponent(options.src)
    })
    this.videoContext = wx.createVideoContext('myVideo')
    this.videoContext.play()

  },
  fnvoInsertLookRecord(id) {
    if(!id) return
    api.voInsertLookRecord({voId: id})
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
  onShareAppMessage: function () {

  }
})