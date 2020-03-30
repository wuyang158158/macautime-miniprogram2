// pages/my/share/index.js
// import api from "../../../data/api";
import NT from "../../../utils/native.js"
var base = require('../../../i18n/base.js');
const _t = base._t().my.SHARE
Page({

  /**
   * 页面的初始数据
   */
  data: {
    _t: _t,
    // userInfo: wx.getStorageSync('userInfo') || {},
    // imageUrl: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: _t['分享赚钱'],
    })
    var userInfo = wx.getStorageSync('userInfo') || {}
    this.setData({
      userInfo: userInfo,
      imageUrl: userInfo.filePath || ''
    })
    // if(!userInfo.filePath){
    //   NT.showToast('加载中..')
    //   api.shareIusGetQRCode().then( res => {
    //     this.setData({
    //       imageUrl: res.imageUrl
    //     })
    //   }).catch(err => {
    //     NT.showModal(err.codeMsg || err.message || '请求失败！')
    //   })
    // }
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
  fnTocheck() {
    wx.navigateTo({
      url: '/pages/my/share/user-register',
    })
  },
  downloadImg(e) {//触发函数
    wx.getImageInfo({
      src: e.currentTarget.dataset.url,
      success (res) {
        wx.saveImageToPhotosAlbum({
          filePath: res.path,
          success(res) {
            NT.toastFn('已保存', 1200)
          },
          fail(res) {
            
          },
          complete(res) {
            console.log(res)
            if (res.errMsg === 'saveImageToPhotosAlbum:fail auth deny') {
              console.log(res)
              wx.openSetting({
                success(res) {
                  console.log(res.authSetting)
                }
              })
            }
          }
        })
      }
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
  onShareAppMessage: function () {

  }
})