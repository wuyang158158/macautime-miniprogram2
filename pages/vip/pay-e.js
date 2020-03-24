import api from "../../data/api"
import NT from "../../utils/native.js"
var ctime = null
// pages/pay/pay-e.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    copyTxt: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const that = this
    const eventChannel = this.getOpenerEventChannel()
    eventChannel.on('copyUrl', function(res) {
      const data = res.data
      console.log(data)
      that.setData({
        copyTxt: data,
        options: options,
      })
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
    this.poSelectOrderPaySuccess()
    // ctime = setInterval(()=>{
    //   this.poSelectOrderPaySuccess()
    // },2000)
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    // clearInterval(ctime)
    // ctime = null
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    // clearInterval(ctime)
    // ctime = null
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

  // }
  copy() { //复制
    const copyTxt = this.data.copyTxt;
    wx.setClipboardData({
      data: copyTxt,
      success (res) {
        wx.getClipboardData({
          success (res) {
            console.log(res.data) // data
          }
        })
      }
    })
  },
  // 支付成功
  poSelectOrderPaySuccess() {
    var that = this;
    var options = that.data.options
    api.poSelectOrderPaySuccess({orderNumber:'200320175813010500000'})
    .then(res=>{
      if(res){
        // clearInterval(that.data.ctime)
        // that.data.ctime = null
        if(res.result){
          wx.redirectTo({
            url: '/pages/vip/payment-ok?source=' + options.source + '&orderNumber=' + options.orderNumber
          })
        }
      }
    })
    .catch(err=>{
      NT.showModal(err.codeMsg||err.message||'请求失败！')
    })
  }
})