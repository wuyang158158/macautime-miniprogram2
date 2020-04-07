// pages/wallet/cash-out/cash-list.js
import NT from "../../../utils/native.js"
import api from "../../../data/api"
import util from "../../../utils/util.js"
var base = require('../../../i18n/base.js');
const _t = base._t().wallet.BANK
Page({

  /**
   * 页面的初始数据
   */
  data: {
    _t: _t,
    cashData: [],
    noData: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: _t['提现账单'],
    })
    this.fnGetDatas()
  },
  fnGetDatas() {
    NT.showToast(_t['加载中..'])
    api.sysGetCashList().then(res => {
      // res = []
      res.map(item => {
        item.withdrawDate = item.withdrawDate? util.formatTimeTwo(item.withdrawDate, 'Y年M月D日') : item.withdrawDate
      })
      this.setData({ cashData: res, noData: !res.length })
    }).catch(err => {
      NT.showModal(err.codeMsg || err.message || _t['请求失败！'])
    })
  },
  fnLinkTo(e) {
    const orderNumber = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `/pages/wallet/cash-out/verify?orderNumber=${orderNumber}`,
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
    this.fnGetDatas()
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