// pages/legal/apply-redpack.js
import api from "../../data/api";
import NT from "../../utils/native.js"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    link: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
  fnSetLink(e) {
    console.log(e)
    // this.setData({})
  },
  fnApplyRedpack() {
    if(!this.data.link) {
      return NT.showModal('请输入你的链接')
    }
    NT.showToast('成功!', 1200)
    setTimeout(()=>{
      wx.navigateBack()
    },1200)
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