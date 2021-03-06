// pages/vip/payment.js
import NT from "../../utils/native.js"
import api from "../../data/api.js"
var base = require('../../i18n/base.js');
const _t = base._t().vip
var ctime = null
Page({

  /**
   * 页面的初始数据
   */
  data: {
    _t: _t,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const userInfo = wx.getStorageSync("userInfo") || {};
    const phone = userInfo.phone;
    var payArray = [
      {
        icon: '/images/vip/icon_pay_we.png',
        name: _t['微信支付'],
        checked: true
      },
      {
        icon: '/images/vip/icon_pay_e.png',
        name: _t['工银e支付(银联、信用卡、VISA)'],
        checked: false
      },
      {
        icon: '/images/vip/icon_pay_wallet.png',
        name: _t['钱包支付'],
        checked: false
      },
      // {
      //   icon: '/images/vip/icon_pay_alipay.png',
      //   name: '支付宝支付'
      // },
      // {
      //   icon: '/images/vip/icon_pay_union.png',
      //   name: '银联支付'
      // }
    ]
    // 是否是内地手机号11位，不是则隐藏微信支付
    if(phone.length !== 11){
      payArray = [
        {
          icon: '/images/vip/icon_pay_e.png',
          name: _t['工银e支付(银联、信用卡、VISA)'],
          checked: true
        },
        {
          icon: '/images/vip/icon_pay_wallet.png',
          name: _t['钱包支付'],
          checked: false
        },
      ]
    }
    this.setData({
      payArray: payArray,
      payType: payArray[0].name
    })

    var source = options.source
    wx.setNavigationBarTitle({
      title: source === 'vip' ? _t['开通会员'] : _t['购买商品']
    })
    var reciprocal = Number(options.reciprocal)
    //获取当前时间
    var nowDate = new Date().getTime();
    //时间差
    var differTime = reciprocal - nowDate;
    this.setData({
      source: source,
      id: options.id,
      msId: options.msId,
      money: options.money,
      reciprocal: reciprocal,
      h: Math.floor(differTime / 1000 / 60 / 60),
      type: options.type
    })
    // var reciprocal = Number(options.reciprocal)
    ctime = setInterval(()=> {
      this.timer()
    }, 1000);
  },
  timer() {
    //获取当前时间
    var date = new Date();
    var now = date.getTime();
    //设置截止时间
    var end = this.data.reciprocal;
    //时间差
    var differTime = end - now;
    //定义变量,h,m,s保存倒计时的时间
    var h, m, s, timeDom;
    if (differTime >= 0) {
      h = Math.floor(differTime / 1000 / 60 / 60);
      m = Math.floor(differTime / 1000 / 60 % 60);
      s = Math.floor(differTime / 1000 % 60);
      h = h < 10 ? ("0" + h) : h;
      m = m < 10 ? ("0" + m) : m;
      s = s < 10 ? ("0" + s) : s;
      timeDom = h + ":" + m + ":" + s;
    } else {
      timeDom ="00:00:00";
    }
    this.setData({
      timeDom: timeDom,
      // reciprocal: this.data.reciprocal - 1000
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
    // clearInterval(ctime)
    // ctime = null
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    clearInterval(ctime)
    ctime = null
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

  },
  // 单选
  radioChange(e) {
    this.setData({
      payType: e.detail.value
    })
  },
  // 支付
  chosePay() {
    const payType = this.data.payType
    if(payType === _t['微信支付']) {
      this.wxPay()
    }
    if(payType === _t['工银e支付(银联、信用卡、VISA)']) {
      this.ghPay()
      // const data = res
    }
    if(payType === _t['钱包支付']) {
      this.walletPay()
    }
  },
  // 微信支付
  wxPay(e) {
    var that = this
    NT.showToast(_t['处理中..'])
    const wxPayQuery = {
      tradeType: 'JSAPI', //小程序支付
      orderNumber: this.data.id, //订单id
    }
    api.wxPay(wxPayQuery)
    .then(res=>{
      var res = res.msg
      wx.requestPayment({
        timeStamp: res.timeStamp,
        nonceStr: res.nonceStr,
        package: res.package,
        paySign: res.paySign,
        signType: res.signType,
        success (res) {
          console.log(res)
          wx.redirectTo({
            url: '/pages/vip/payment-ok?source=' + that.data.source + '&orderNumber=' + that.data.id
          })
        },
        fail (res) {
          console.log(res)
          // NT.showModal('支付失败！')
        }
      })
    })
    .catch(err=>{
      NT.showModal(err.codeMsg||err.message||_t['请求失败！'])
    })
    
  },
  // e支付
  ghPay(e) {
    var that = this
    NT.showToast(_t['处理中..'])
    const ePayQuery = {
      orderNumber: this.data.id, //订单id
    }
    api.ghPay(ePayQuery)
    .then(res=>{
      console.log(res)
      var data = res;
      // debugger
      wx.navigateTo({
        url: '/pages/vip/pay-e?source=' + this.data.source + '&orderNumber=' + this.data.id,
        success: function(res) {
          // 通过eventChannel向被打开页面传送数据
          res.eventChannel.emit('copyUrl', { data: data })
        }
      })
    })
    .catch(err=>{
      NT.showModal(err.codeMsg||err.message||_t['请求失败！'])
    })
  },
  // 钱包支付
  walletPay(e) {
    var that = this
    NT.showToast(_t['处理中..'])
    const walletPayQuery = {
      orderNumber: this.data.id, //订单id
      payAmount: this.data.money, //支付金额
      payId: 0, // 支付ID
      payName: _t['钱包支付'], // 支付名称
      msId: this.data.msId || '', //商家id
      tradeType: '', // 交易类型
    }
    api.WalletPay(walletPayQuery)
    .then(res=>{
      wx.redirectTo({
        url: '/pages/vip/payment-ok?source=' + that.data.source + '&orderNumber=' + that.data.id
      })
    })
    .catch(err=>{
      NT.showModal(err.codeMsg||err.message||_t['请求失败！'])
    })
  }
})