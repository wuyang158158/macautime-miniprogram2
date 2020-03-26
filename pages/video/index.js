// pages/video/index.js
import NT from "../../utils/native.js"
import api from "../../data/api.js"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    videoList: [],
    noData: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.fnGetMyVideo()
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
  // 获取我的视频
  fnGetMyVideo() {
    NT.showToast('加载中..')
    api.ctMyVideoc().then(res => {
      res.vobaseInfo.forEach(ele => {
        ele.contentUrl = encodeURIComponent(ele.contentUrl)
      })
      this.setData({ videoList: res.vobaseInfo, noData:!res.vobaseInfo.length })
    }).catch( err => {
      this.setData({ videoList: [], noData: true })
      NT.showModal(err.codeMsg || err.message || '请求失败！')
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