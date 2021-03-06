// pages/message/detail.js
import NT from "../../utils/native.js"
import api from "../../data/api.js"
import util from "../../utils/util.js"
var base = require('../../i18n/base.js');
const _t = base._t().message
Page({

  /**
   * 页面的初始数据
   */
  data: {
    _t: _t,
    result: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
        // 监听expAllMeal事件，获取上一页面通过eventChannel传送到当前页面的数据
        const eventChannel = this.getOpenerEventChannel()
        // 接受上一个页面传递过来的数据
        eventChannel.on('params', data => {
          wx.setNavigationBarTitle({
            title: data.type === 2?_t['服务通知']:_t['系统消息']
          });
          this.setData({
            result: data
          })
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
  onShareAppMessage: function () {

  }
})