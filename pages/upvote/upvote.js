// pages/upvote/upvote.js
import NT from "../../utils/native.js"
import api from "../../data/api.js"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    active: 0,
    noData: false,
    storeData: [],
    videoList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.fnGetMyStore()
  },
  // 获取我的视频
  fnGetMyVideo() {
    NT.showToast('加载中..')
    api.ctMyLikeVideo({ accountId: wx.getStorageSync('userInfo').userId }).then(res => {
      res.forEach(ele => {
        ele.contentUrl = encodeURIComponent(ele.contentUrl)
      })
      this.setData({ videoList: res, noData:!res.length })
    }).catch( err => {
      this.setData({ noData: true })
      NT.showModal(err.codeMsg || err.message || '请求失败！')
    })
  },
  // 获取我的商家
  fnGetMyStore() {
    NT.showToast('加载中..')
    api.ctMyLikeStore().then(res => {
      this.setData({ storeData: res, noData:!res.length })
    }).catch( err => {
      this.setData({ storeData: [], noData: true })
      NT.showModal(err.codeMsg || err.message || '请求失败！')
    })
  },
  tapToDetail(e) { // 点击查看体验详情
    const ID = e.currentTarget.dataset.id
    const TITLE = e.currentTarget.dataset.title
    wx.navigateTo({
      url: '/pages/views/ac-detail?id=' + ID + '&title=' + TITLE
    })
  },
  // 切换tab
  fnChangeTab(e) {
    const type = e.currentTarget.dataset.type
    this.setData({ accountList: [], noData: false, active: type })
    if(type === 0) {
      this.fnGetMyStore()
    } else {
      this.fnGetMyVideo()
    }
    
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
    let type = this.data.active
    if(type === 0) {
      this.fnGetMyStore()
    } else {
      this.fnGetMyVideo()
    }
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