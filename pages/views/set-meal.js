// pages/views/set-meal.js
import api from "../../data/api"
import NT from "../../utils/native.js"
const app = getApp();
var base = require('../../i18n/base.js');  //路径可能做相应调整
const _t = base._t().SET_MEAL; //翻译函数
Page({

  /**
   * 页面的初始数据
   */
  data: {
    _t: _t,
    isIphoneX: app.globalData.isIphoneX, //iphonex适配
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: _t['套餐详情']
    });
    var id = options.id
    // NT.showToast('加载中...')
    // 监听expAllMeal事件，获取上一页面通过eventChannel传送到当前页面的数据
    const eventChannel = this.getOpenerEventChannel()
    // 接受上一个页面传递过来的数据
    eventChannel.on('params', data => {
      console.log(data)
      var choseData = '';
      data.map(item=>{
        if(item.id === id){
          choseData = item
        }
      })
      this.setData({
        result: data,
        id: id,
        choseData: choseData,
        userInfo: wx.getStorageSync("userInfo"), //用户信息
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

  // },

  //点击tabbbar事件
  tapTitleBar: function(e){
    let id = e.currentTarget.dataset.id,
        t = this;
        if(id===this.data.id){
          return
        }
        // NT.showToast('加载中...');
        wx.pageScrollTo({
          scrollTop: 0,
          duration: 300
        })
        var choseData = '';
        this.data.result.map(item=>{
          if(item.id === id){
            choseData = item
          }
        })
        this.setData({
          id: id,
          choseData: choseData
        })
        t.setData({
          id:id
        })
  },
  // 选择套餐购买商品
  tapToSubmitOrder() {
    var choseData = this.data.choseData
    if(choseData.status == 1) { //
      NT.showModal(_t['该套餐已下架！']);
      return false;
    }
    if(choseData.payType == 2) { //线下支付
      NT.showModal(_t['该套餐为线下支付！']);
      return false;
    }
    wx.navigateTo({
      url: '/pages/views/submit-order',
      success: function(result) {
        // 通过eventChannel向被打开页面传送数据
        result.eventChannel.emit('params', choseData)
      }
    })
    return false;
  },
  //预览图片
  tapPreviewImage(e){
    const item = e.currentTarget.dataset.item
    wx.previewImage({
      current: item, // 当前显示图片的http链接
      urls: this.data.choseData.imageUrlArray // 需要预览的图片http链接列表
    })
  },
})