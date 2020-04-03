// pages/topic/index.js
import NT from "../../utils/native.js"
import api from "../../data/api.js"
var base = require('../../i18n/base.js');
const _t = base._t().vip
Page({

  /**
   * 页面的初始数据
   */
  data: {
    test: '',
    _t: _t,
    noData: false,
    message: 'error'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 监听expAllMeal事件，获取上一页面通过eventChannel传送到当前页面的数据
    const eventChannel = this.getOpenerEventChannel()
    // 接受上一个页面传递过来的数据
    eventChannel.on('params', data => {
      console.log(data)
      this.setData({
        data:data
      })
      wx.setNavigationBarTitle({
        title: data.title,
      })
    })
    this.fnAddCount(options.id)
  },
  // 增加阅读数量
  fnAddCount(id) {
    api.msSpecialColumnAddCount({ id })
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
    this.setData({
      userInfo: wx.getStorageSync("userInfo"), //用户信息
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