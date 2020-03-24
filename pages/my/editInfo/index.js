// pages/my/editInfo/index.js
import api from "../../../data/api";
import NT from "../../../utils/native.js"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    kolClass: '',
    choseTagClass: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  // 获取个人信息
  fnGetUserInfo() {
    NT.showToast('加载中')
    api.ctGetUserInfo().then(res => {
      this.setData({ userInfo: res })
      const data = Object.assign(wx.getStorageSync('userInfo'), res)
      wx.setStorageSync('userInfo', data)
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
      choseTagClass: wx.getStorageSync('choseTagClass') || '',
      kolClass: wx.getStorageSync('kolClass') || '',
    })
    this.fnGetUserInfo()
  },

  fnLinkToEdit(e) {
    const types = e.currentTarget.dataset.type
    const content = e.currentTarget.dataset.cont
    wx.navigateTo({
      url: `/pages/my/information/index?type=${types}&content=${content}`,
    })
  },
  fnLinkToClass(e) {
    const url = e.currentTarget.dataset.url
    wx.navigateTo({
      url
    })
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