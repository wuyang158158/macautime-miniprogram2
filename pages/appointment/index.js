// pages/coupon/my-coupon.js
import NT from "../../utils/native.js"
import api from "../../data/api.js"
import util from "../../utils/util.js"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    active: 1,
    kolId: '',
    noData: false,
    accountList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    api.ctGetKolId().then(res => {
      const kolId = res && res.id || ''
      this.setData({ kolId: kolId })
      this.fnGetAccount(kolId)
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
  // 获取预约数据
  fnGetAccount(kolId) {
    NT.showToast('加载中..')
    api.ctPoAgentByUs({
      status: this.data.active,
      kolId: kolId,
      userId: wx.getStorageSync('userInfo').userId
    }).then(res => {
      // res = [
      //   {"address":"比心科技","msName":"1","discoveryTime":1584606936000,"profitRatio":100.000}
      //   ]
      res.map(item => {
        item.discoveryTime = util.formatTimeTwo(item.discoveryTime, 'Y年M月D日')
      })
      this.setData({ accountList: res, noData: !res.length })
    }).catch(err => {
      this.setData({ accountList: [], noData: true })
      NT.showModal(err.codeMsg || err.message || '请求失败！')
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
    this.fnGetAccount(this.data.kolId)
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