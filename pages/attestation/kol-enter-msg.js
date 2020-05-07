// pages/attestation/kol-enter-msg.js
var base = require('../../i18n/base.js');  //路径可能做相应调整
const _t = base._t().attestation.KOL_ENTER_MSG; //翻译函数
Page({

  /**
   * 页面的初始数据
   */
  data: {
    _t: _t,
    isAudit: false, //是否是审核中状态
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      isCertificationKol: options.isCertificationKol || ''
    })
    wx.setNavigationBarTitle({
      title: options.isCertificationKol ? _t['审核通知'] : '提交完成'
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
  tapToConfirm() {
    wx.switchTab({
      url: '/pages/tabs/index'
    })
  },
  tapToBack() {
    wx.navigateBack({
      delta: 1
    })
  },
  tapResubmit() {
    // wx.redirectTo({
    //   url: '/pages/attestation/kol-enter'
    // })
    wx.navigateBack({
      delta: 1
    })
  }
})