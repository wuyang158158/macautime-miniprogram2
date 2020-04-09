// pages/wallet/bank/bank-list.js
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
    bankList: [],
    isChoose: false,
    noData: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: _t['银行卡'],
    })
    if(options.s) {
      this.setData({ isChoose: true })
    }
  },
  // 选择银行
  chooseBank(e) {
    if(!this.data.isChoose) return
    const bankAuthId = e.currentTarget.dataset.id
    wx.setStorageSync('bankAuthId', bankAuthId)
    wx.navigateBack()
    // wx.redirectTo({
    //   url: `/pages/wallet/cash-out/index?bankAuthId=${bankAuthId}`,
    // })
  },
  // 获取银行卡列表
  getData() {
    NT.showToast(_t['加载中..'])
    api.atsGetBankList().then(data => {
      this.setData({ bankList: data, noData: !data.length })
    }).catch(err => {
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
    this.getData()
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