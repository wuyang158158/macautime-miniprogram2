// pages/vip/payment-ok.js
import api from "../../data/api.js"
const app = getApp();
var base = require('../../i18n/base.js');
const _t = base._t().vip
Page({

  /**
   * 页面的初始数据
   */
  data: {
    _t: _t

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var source = options.source
    this.setData({
      source: source,
      orderNumber: options.orderNumber
    })
    wx.setNavigationBarTitle({
      title: source === 'vip' ? _t['开通成功'] : _t['购买成功']
    })
    source === 'vip' ? this.ctGetUserInfo() : ''
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

  },
  seeVip() {
    // wx.setStorageSync('payVip', true)
    wx.navigateBack({
      delta: 1
    })
  },
  // 更新用户信息
  ctGetUserInfo() {
    api.ctGetUserInfo().then(res => {
      this.setData({ userInfo: res })
      const data = Object.assign(wx.getStorageSync('userInfo'), res)
      wx.setStorageSync('userInfo', data)
      // this.setData({ userInfo: data })
    })
  },
  seeOrder() {
    wx.navigateTo({
      url: '/pages/views/order-detail?orderNumber=' + this.data.orderNumber
    })
    // const type = 2
    // const title = '待使用'
    // wx.redirectTo({
    //   url: type ? `/pages/order/my-order?type=${type}&name=${title}`:`/pages/order/my-order`
    // })
    
  }
  
})