import api from "../../data/api";
import NT from "../../utils/native.js"
import PAGE from "../../utils/config.js"
import util from "../../utils/util.js"
var base = require('../../i18n/base.js');  //路径可能做相应调整
const _t = base._t().MY_COMMON; //翻译函数
// pages/views/my-seen.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    _t: _t,
    userInfo: wx.getStorageSync("userInfo"), //用户信息
    total: 0,
    noData: false,
    result: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: _t['浏览历史']
    });
    this.setData({
      userInfo: wx.getStorageSync("userInfo") || {}, //用户信息
    })
    NT.showToast(_t['加载中...'])
    this.getUserRecord()
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
    NT.showToast('刷新中...')
    this.getUserRecord()
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
  getUserRecord() { // 请求用户记录
    api.getUserRecord()
    .then(res=>{
      // res.forEach(item => {
      //   item.createTimeStr = util.formatTimeTwo(item.creatTimeStamp?item.creatTimeStamp:item.createTime || '','Y年M月D日')
      // })
      this.setData({
        result: res,
        noData: !res.length
      })
    })
    .catch(err=>{
      this.setData({
        result: [],
        noData: true
      })
      NT.showModal(err.message||_t['请求失败！'])
      
    })
  },
})