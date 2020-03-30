// pages/order/apply-refund.js
import api from "../../data/api";
import NT from "../../utils/native.js"
var base = require('../../i18n/base.js');
const _t = base._t().order
Page({

  /**
   * 页面的初始数据
   */
  data: {
    _t: _t,
    data: {},
    reason: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: _t['申请退款'],
    })
    // 监听expAllMeal事件，获取上一页面通过eventChannel传送到当前页面的数据
    const eventChannel = this.getOpenerEventChannel()
    // 接受上一个页面传递过来的数据
    eventChannel.on('params', data => {
      console.log(data)
      this.setData({
        data:data
      })
    })
  },
  fnSetReason(e) {
    this.setData({ reason: e.detail.value })
  },
  fnApplyRefund() {
    NT.showToast(_t['处理中..'])
    api.MyOrderRefund({orderNumber: this.data.data.orderNumber, reason: this.data.reason })
    .then(res=>{
      NT.showToastNone(_t['已申请!'])
      setTimeout(()=> {
        wx.navigateBack({
          delta: 1
        })
      },1000)
    })
    .catch(err=>{
      NT.showModal(err.codeMsg||err.message||_t['请求失败！'])
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