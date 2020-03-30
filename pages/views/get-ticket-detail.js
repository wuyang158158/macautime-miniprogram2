import api from "../../data/api"
import NT from "../../utils/native.js"
import util from "../../utils/util.js"
// pages/views/get-ticket-detail.js
var base = require('../../i18n/base.js');  //路径可能做相应调整
const _t = base._t().GET_TICKET_DETAIL; //翻译函数
Page({

  /**
   * 页面的初始数据
   */
  data: {
    _t: _t
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: _t['优惠券详情']
    });
    this.setData({
      userInfo: wx.getStorageSync("userInfo"), //用户信息
      query: {
        id: options.id
      }
    })
    this.mkSelectDiscountsCardById()
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
  // 查询当前优惠券信息
  mkSelectDiscountsCardById() {
    NT.showToast(_t['加载中...'])
    api.mkSelectDiscountsCardById(this.data.query)
    .then(res=>{
      res.endTimeStr = util.formatTimeTwo(res.endTime, 'Y-M-D')
      this.setData({
        item: res
      })
    })
    .catch(err=>{
      NT.showModal(err.message||_t['请求失败！'])
    })
  },
  // 立即领取
  tapNowGet() {
    if(!this.data.userInfo.level){ //如果没有开通会员，则提示开通会员再领取
      wx.showModal({
        title: '提示',
        content: _t['优惠券仅供时光卡会员用户使用，现在开通，领取优惠券，还能享受更多会员增值优惠及特权。'],
        cancelText: '再看看',
        cancelColor: '#999999',
        confirmText: _t['开通会员'],
        confirmColor: '#00A653',
        success (res) {
          if (res.confirm) {
            
            wx.navigateTo({
              url: '/pages/vip/vip-center'
            })
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    }else{
      const that = this
      const item = this.data.item
      const query = {
        userId: that.data.userInfo.userId, //用户名
        msId: item.msId, //商家Id
        id: item.id, //优惠卷ID
        endTime: item.endTime.toString()
      }
      NT.showToast(_t['处理中...'])
      api.poInsertDiscountOrder(query)
      .then(res=>{
        NT.toastFn(_t['领取成功！'],1000)
        setTimeout(()=>{
          wx.navigateTo({
            url: '/pages/vip/spell-route-order-ok?route=get-ticket-detail' 
          })
        },1000)
      })
      .catch(err=>{
        NT.showModal(err.message||_t['请求失败！'])
      })
    }
    
  }
})