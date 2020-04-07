// pages/wallet/cash-out/verify.js
import NT from "../../../utils/native.js"
import api from "../../../data/api"
var base = require('../../../i18n/base.js');
const _t = base._t().wallet.BANK
Page({

  /**
   * 页面的初始数据
   */
  data: {
    _t: _t,
    active: 0,
    actionMenu: [
      { type: 0, title: _t['提现已申请'] },
      { type: 1, title: _t['提现处理中'] },
      { type: 2, title: _t['提现成功'] },
    ],
    data: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: _t['提现'],
    })
    this.fnsysGetCashDetail(options.orderNumber)
  },
  fnsysGetCashDetail(orderNumber) {
    NT.showToast(_t['加载中..'])
    api.sysGetCashDetail({orderNumber}).then(res => {
      res.lastFourNum = res.bankCode.substring(res.bankCode.length - 4)
      this.setData({
        active: res.status,
        data: res
      })
      if(res.status === 3) {
        this.setData({'actionMenu[2].title': _t['提现失败']})
      }
    })
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