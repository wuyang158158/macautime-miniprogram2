// pages/message/message.js
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
    noData: false,
    list: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.fnctNotify()
  },
  fnctNotify() {
    NT.showToast(_t['加载中..'])
    api.ctNotify().then(res =>{
    res.map(item => {
      item.createTime = item.createTime?util.formatTimeTwo(item.createTime, 'Y-M-D h:m:s'): ''
    })
      this.setData({ list: res, noData: !res.length})
    }).catch(err => {
      this.setData({ list: [], noData: true })
      NT.showModal(err.codeMsg || err.message || _t['请求失败！'])
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
    this.fnctNotify()
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