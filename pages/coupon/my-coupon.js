// pages/coupon/my-coupon.js
import NT from "../../utils/native.js"
import api from "../../data/api.js"
import util from "../../utils/util.js"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    active: 0,
    noData: false,
    accountList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.fnGetAccount()
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
  // 获取卡券数据
  fnGetAccount() {
    NT.showToast('加载中..')
    api.ctGetUserCoupon({
      isMs: this.data.active
    }).then(res => {
      res.map(item => {
        item.validityTime = item.validityTime?util.formatTimeTwo(item.validityTime, 'Y-M-D h:m:s'): ''
      })
      this.setData({ accountList: util.dealWithData(res), noData: !res.length })
      }).catch(err => {
        this.setData({ accountList: [], noData: true })
        NT.showModal(err.codeMsg || err.message || '请求失败！')
    })
  },
  // 切换tab
  fnChangeTab(e) {
    const type = e.currentTarget.dataset.type
    this.setData({ accountList: [], noData: false, active: type })
    this.fnGetAccount()
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

  // },
  // 领券中心
  tapGetDiscounts(e) {
    // const orderCode = e.currentTarget.dataset.id
    // wx.navigateTo({
    //   url: '/pages/views/ticket-detail?orderCode=' + orderCode + '&userName=' + wx.getStorageSync("userInfo").userName
    // })
    // 业务更改 - 跳转首页
    wx.switchTab({
      url: '/pages/tabs/index?activeMenu=2',
    })
  }
})