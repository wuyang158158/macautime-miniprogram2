// pages/wallet/wallet-index.js
import NT from "../../utils/native.js"
import api from "../../data/api.js"
var base = require('../../i18n/base.js');
const _t = base._t().wallet.WALLET
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
      title: _t['我的钱包'],
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
    this.setData({
      userInfo: wx.getStorageSync("userInfo"), //用户信息
    })
    this.atsSelect()
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
    this.onShow()
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
  // 请求数据
  atsSelect() {
    const that = this
    NT.showToast(_t['加载中..'])
    api.atsSelect()
    .then(res=>{
      that.setData({
        result: res
      })
    })
    .catch(err=>{
      NT.showModal(err.codeMsg||err.message||_t['请求失败！'])
    })
  },
  fnShowToast(e) {
    const num = e.currentTarget.dataset.num
    NT.showModal(`${_t['待结算金额']}：${num}`)
  },
  // 跳转到详情
  tapToDetail(e) {
    const url = e.currentTarget.dataset.url
      // 如果没有实名认证则不允许提现
      return wx.navigateTo({ url })
  },
  // 我要提现
  fnToRecash() {
    NT.showToast(_t['加载中..'])
    api.ctGetUserInfo().then(res => {
      if(res.identityState === 1) {
        wx.navigateTo({
          url: '/pages/wallet/cash-out/index',
        })
      } else if( res.identityState === 2) {
        NT.showModal(_t['实名认证审核中, 审核通过后才可提现！'])
      } else {
        wx.showModal({
          content: _t['提现需要实名认证'],
          confirmText: _t['前往认证'],
          confirmColor: '#00A653',
          success(res) {
            if (res.confirm) {
              //   跳转到实名认证
              wx.navigateTo({
                url: '/pages/attestation/real-name-authentication'
              })
            }
          }
        })
      }
    })
  }
})