// pages/views/order-detail.js
import api from "../../data/api";
import NT from "../../utils/native.js"
import util from "../../utils/util.js"
import QR from "../../utils/qrcode.js"
const app = getApp();
var base = require('../../i18n/base.js');  //路径可能做相应调整
const _t = base._t().ORDER_DETAIL; //翻译函数
Page({

  /**
   * 页面的初始数据
   */
  data: {
    _t: _t,
    showQrcode: false,
    imagePath: '',
    roleFrom: {}, //请求详情参数
    orderData: {}, //订单信息
    options: {}, //传递参数
    isIphoneX: app.globalData.isIphoneX, //iphonex适配
    isGetData: 1,
    orderNumber: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: _t['订单详情']
    });
    this.setData({ orderNumber: options.orderNumber })
    this.getOrderDetails()
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
    if(this.data.isGetData !== 1) {
      this.getOrderDetails()
    }
    // const mycomment = wx.getStorageSync("mycomment")
    // if(mycomment==='myexp'){
    //   wx.removeStorageSync('mycomment')
    //   const orderData = this.data.orderData
    //   orderData.isComment = '1'
    //   this.setData({
    //     orderData: orderData
    //   })
    // }
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
  //请求详情
  getOrderDetails() {
    NT.showToast(_t['加载中...'])
    api.getOrderDetails({ orderNumber: this.data.orderNumber  })
    .then(res=>{
      const data = res;
      this.createQrCode(data.checkCode, "mycanvas", 200, 200);
      this.createQrCode(data.checkCode, "mincanvas", 40, 40)
      // 生成二维码
      this.setData({
        isGetData: 2,
        orderData: Object.assign({ orderNumber: this.data.orderNumber }, data)
      })
    })
    .catch(err=>{
      NT.showModal(err.message||_t['请求失败！'])
    })
  },
  // 联系商家
  tapCallMerchant() {
    wx.makePhoneCall({
      phoneNumber: this.data.orderData.merchantPhone
    })
  },
  // 跳转到评价页面
  tapToExpComment() {
    const orderData = this.data.orderData
    wx.navigateTo({
      url: '/pages/views/exp-comment?comment=myexp',
      success: function(result) {
        // 通过eventChannel向被打开页面传送数据
        result.eventChannel.emit('params', orderData)
      }
    })
  },
  // 跳转到申请退款页面
  tapToRefund() {
    const orderData = this.data.orderData
    wx.navigateTo({
      url: '/pages/order/apply-refund',
      success: function(result) {
        // 通过eventChannel向被打开页面传送数据
        result.eventChannel.emit('params', orderData)
      }
    })
  },
  // 取消订单
  tapCancelOrder() {
    const that = this
    const orderCode = this.data.orderData.orderNumber
    wx.showModal({
      title: '提示',
      content: _t['您确定要取消该订单吗？取消将不可撤回'],
      success (res) {
        if (res.confirm) {
          NT.showToast(_t['处理中...'])
          api.MyOrderDeleteDetail({orderNumber:orderCode})
          .then(res=>{
            wx.showToast({
              title: _t['订单取消成功'],
              duration: 1000
            })
            setTimeout(() => {
              that.getOrderDetails()
            }, 1000)
            // that.refreshData(orderCode)
          })
          .catch(err=>{
            console.log(err)
            NT.showModal(err.message||_t['请求失败！'])
          })
        }
      }
    })    
  },
  // 展示二维码
  fnShowQrcode(e) {
    const type = e.currentTarget.dataset.type
    if(type === '1') {
      this.setData({ showQrcode: true })
    }else if( type === '2') {
      this.setData({ showQrcode: false })
    } else {
      return false
    }
  },
  createQrCode:function(url,canvasId,cavW,cavH){
    //调用插件中的draw方法，绘制二维码图片
    QR.api.draw(url,canvasId,cavW,cavH);
    setTimeout(() => { this.canvasToTempImage();},250);
    
  },
  //获取临时缓存照片路径，存入data中
  canvasToTempImage:function(){
    var that = this;
    wx.canvasToTempFilePath({
      canvasId: 'mycanvas',
      destWidth: 100,
      success(res) {
        console.log(res.tempFilePath)
      },
      fail: function (res) {
          console.log('1235dd');
      },
      complete: function(res) {
        console.log('eee')
      }
    });
  },
  // 去支付
  tapToPay(e) {
    const id = e.currentTarget.dataset.id
    const reciprocal = e.currentTarget.dataset.reciprocal
    const price = e.currentTarget.dataset.price
    wx.navigateTo({
      url: '/pages/vip/payment?id=' + id + '&money=' + price + '&reciprocal=' + reciprocal + '&source=meal'
    })
  },
})