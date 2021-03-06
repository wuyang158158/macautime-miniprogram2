// pages/coupon/my-coupon.js
import NT from "../../utils/native.js"
import api from "../../data/api.js"
import util from "../../utils/util.js"
var base = require('../../i18n/base.js');
const _t = base._t().appointment
Page({

  /**
   * 页面的初始数据
   */
  data: {
    _t: _t,
    active: 1,
    kolId: '',
    noData: false,
    accountList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: _t['探店预约']
    });
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
  // 打开地图
  fnOpenMap(e) {
    let lat = e.currentTarget.dataset.lat
    let lng = e.currentTarget.dataset.lng
    let address = e.currentTarget.dataset.address
    wx.openLocation({
      latitude: lat,
      longitude: lng,
      name: address,
      scale: 15
    })
  },
  // 获取预约数据
  fnGetAccount() {
    NT.showToast(_t['加载中..'])
    api.ctPoAgentByUs({
      status: this.data.active,
      userId: wx.getStorageSync('userInfo').userId
    }).then(res => {
      // res = [
      //   {"address":"比心科技比心科技比心科技比心科技比心科技比心科技比心科技比心科技比心科技比心科技比心科技比心科技比心科技比心科技比心科技","msName":"1","discoveryTime":1584606936000,"profitRatio":100.000}
      //   ]
      res.sort(util.compare("discoveryTime",false)) //倒序
      res.map(item => {
        item.discoveryTime = util.formatTimeTwo(item.discoveryTime, 'Y年M月D日')
      })
      this.setData({ accountList: res, noData: !res.length })
    }).catch(err => {
      this.setData({ accountList: [], noData: true })
      NT.showModal(err.codeMsg || err.message || _t['请求失败！'])
    })
  },
  // 切换tab
  fnChangeTab(e) {
    const type = e.currentTarget.dataset.type
    this.setData({ active: type, accountList: [], noData: false })
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
    this.fnGetAccount()
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
})