import api from "../../data/api"
import NT from "../../utils/native.js"
// pages/attestation/kol-class.js
var base = require('../../i18n/base.js');  //路径可能做相应调整
const _t = base._t().attestation.KOL_CLASS; //翻译函数
Page({

  /**
   * 页面的初始数据
   */
  data: {
    _t: _t,
    tagArray: [
      {
        remark: _t['领域KOL'],
        selected: false
      },
      {
        remark: '普通KOL',
        selected: false
      }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: _t['KOL类别']
    });
    var kolClass = wx.getStorageSync('kolClass')
    var tagArray = this.data.tagArray
    tagArray.forEach(element => {
      if(element.remark === kolClass){
        element.selected = true
      }
    });
    this.setData({
      tagArray: tagArray
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
  // onShareAppMessage: function () {

  // }
  // 点击标签
  tapTag(e) {
    const remark = e.currentTarget.dataset.remark
    const tagArray = this.data.tagArray

    tagArray.map(item=>{
      if(item.remark===remark){
        item.selected = !item.selected
      }else{
        item.selected = false
      }
    })

    this.setData({
      tagArray: tagArray
    })
  },
  // 提交表单
  submit() {
    const tagArray = this.data.tagArray
    var remark = ''
    tagArray.map(item=>{
      if(item.selected){
        remark = item.remark
      }
    })
    if(remark){
      wx.setStorage({
        key:"kolClass",
        data: remark
      })
      wx.navigateBack({
        delta: 1
      })
    }else{
      NT.showToastNone(_t['请选择您的KOL类别标签']+'！')
    }
    
  }
})