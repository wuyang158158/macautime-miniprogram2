// pages/views/more-settings.js
var base = require('../../i18n/base.js');  //路径可能做相应调整
const _t = base._t().MORE_SETTINGS; //翻译函数
Page({

  /**
   * 页面的初始数据
   */
  data: {
    _t: _t,
    language: wx.getStorageSync('Language'),
    userInfo: {}, //用户信息
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: _t['更多设置']
    });
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
    this.setData({ userInfo: wx.getStorageSync("userInfo") || {} })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  changeLang() {
    wx.navigateTo({
      url: '/pages/language/language',
    })
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
  // onShareAppMessage: function () {

  // },
  tapToCenterDetail() { //进入个人中心详情
    wx.navigateTo({
      url: '/pages/views/center-detail'
    })
  },
  tapToAccountManagement(e) { //进入到账号管理
    const url = e.currentTarget.dataset.url
    wx.navigateTo({
      url: url
    })
  },
  tapToAboutUs(e) { // 跳转到关于我们
    const id = e.currentTarget.dataset.id
    const url = e.currentTarget.dataset.url || ''
    wx.navigateTo({
      url: url?url:'/pages/views/about-us?id=' + id
    })
  }
})