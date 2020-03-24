// pages/wallet/cash-out/verify.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    active: 1,
    payAmount: 0,
    actionMenu: [
      { type: 1, title: '提现已申请' },
      { type: 2, title: '提现处理中' },
      { type: 3, title: '提现成功' },
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({ payAmount: options.payAmount || 0 })
  },
  // 点击确认
  sureBtn() {
    wx.reLaunch({
      url: '/pages/tabs/center',
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