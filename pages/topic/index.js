// pages/topic/index.js
import NT from "../../utils/native.js"
import api from "../../data/api.js"
var base = require('../../i18n/base.js');
const _t = base._t().vip
Page({

  /**
   * 页面的初始数据
   */
  data: {
    test: '',
    _t: _t,
    noData: false,
    message: 'error'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    NT.showToast(_t['加载中..'])
    api.MyTopicDetail({id: options.id}).then( res => {
      wx.setNavigationBarTitle({
        title: res.title,
      })
      // res.imageUrl = '/images/default/no-data.png'
      this.setData({
        data: res,
        noData: false
      })
    }).catch(err => {
      this.setData({ noData: true, message: err.codeMsg || err.message || 'error' })
      NT.showModal(err.codeMsg || err.message || _t['请求失败！'])
  })
    this.fnAddCount(options.id)
  },
  // 增加阅读数量
  fnAddCount(id) {
    api.msSpecialColumnAddCount({ id })
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