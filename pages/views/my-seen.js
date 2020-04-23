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
    showEndLine: false,
    params: {
      start: PAGE.start,
      limit: PAGE.limit
    }
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
    this.setData({ 'params.start': 1 })
    this.getUserRecord()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if(!this.data.showEndLine) return
    let start = this.data.params.start
    this.setData({ 'params.start': ++start })
    this.getUserRecord()
  },

  /**
   * 用户点击右上角分享
   */
  // onShareAppMessage: function () {

  // }
  getUserRecord() { // 请求用户记录
    NT.showToast(_t['加载中...'])
    api.getUserRecord(this.data.params)
    .then(res=>{
      const resData = res.data
      const arr = []
      resData.forEach(ele => {
          const objNew = ele.MsBaseInfo || {}
          objNew.msId = ele && ele.msId || ''
          arr.push(objNew)
      })
      const result = this.data.params.start === 1?arr: this.data.result.concat(arr)
      this.setData({
        result: result,
        noData: !result.length,
        showEndLine: res.total > 5 && (this.data.params.start * this.data.params.limit >= res.total)
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