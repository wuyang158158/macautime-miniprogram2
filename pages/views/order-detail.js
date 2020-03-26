// pages/views/order-detail.js
import api from "../../data/api";
import NT from "../../utils/native.js"
import util from "../../utils/util.js"
import QR from "../../utils/qrcode.js"
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showQrcode: false,
    imagePath: '',
    roleFrom: {}, //请求详情参数
    orderData: {}, //订单信息
    options: {}, //传递参数
    isIphoneX: app.globalData.isIphoneX, //iphonex适配
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getOrderDetails(options)
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
  getOrderDetails(options) {
    NT.showToast('加载中...')
    api.getOrderDetails({ orderNumber: options.orderNumber  })
    .then(res=>{
      const data = res;
      // data.chargeOffCode = res.chargeOffCode ? res.chargeOffCode.replace(/(.{4})/g, "$1 ") : ''
      // data.orderTimeStamp = res.orderTimeStamp ? util.formatTimeTwo(data.orderTimeStamp,'Y/M/D') : ''
      this.createQrCode(data.checkCode, "mycanvas", 200, 200);
      // 生成二维码
      this.setData({
        orderData: Object.assign(options, data)
      })
    })
    .catch(err=>{
      NT.showModal(err.codeMsg||err.message||'请求失败！')
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
    const orderCode = this.data.orderData.ordernumber
    wx.showModal({
      title: '提示',
      content: '您确定要取消该订单吗？取消将不可撤回',
      success (res) {
        if (res.confirm) {
          NT.showToast('处理中...')
          api.MyOrderDeleteDetail({orderNumber:orderCode})
          .then(res=>{
            NT.showToastNone('订单取消成功')
            setTimeout(()=> {
              wx.navigateBack({
                delta: 1
              })
            },1000)
            // that.refreshData(orderCode)
          })
          .catch(err=>{
            console.log(err)
            NT.showModal(err.codeMsg||err.message||'请求失败！')
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
    console.log(123)
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