// pages/attestation/attestation-center.js
var base = require('../../i18n/base.js');  //路径可能做相应调整
const _t = base._t().attestation.ATTESTATION_CENTER; //翻译函数
Page({

  /**
   * 页面的初始数据
   */
  data: {
    _t: _t,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: _t['认证中心']
    });
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
      isVideo: wx.getStorageSync('isVideo')
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
  // onShareAppMessage: function () {

  // }
  tapToKol() {
    wx.navigateTo({
      url: '/pages/attestation/kol-enter'
    })
  },
  // 跳转到实名认证
  tapToId() {
    wx.navigateTo({
      url: '/pages/attestation/real-name-authentication'
    })
  }
})