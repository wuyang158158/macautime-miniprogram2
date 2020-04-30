// pages/views/submit-order.js
import api from "../../data/api";
import NT from "../../utils/native.js"
// import PAGE from "../../utils/config.js"
import util from "../../utils/util.js"
const app = getApp();
var base = require('../../i18n/base.js');  //路径可能做相应调整
const _t = base._t().SUBMIT_ORDER; //翻译函数
Page({

  /**
   * 页面的初始数据
   */
  data: {
    _t: _t,
    isIphoneX: app.globalData.isIphoneX, //iphonex适配
    userInfo: wx.getStorageSync("userInfo"), //用户信息
    orderCount: 1, //订单计数
    istrue: false, // 优惠券列表
    cardResult: '',


    choseVip: false, // 默认不选中会员优惠
    userAgreement: true, //购买协议需要用户手动确认
    discountPrice: 0, //已优惠
    payAmount: '', //总价
    ePrice: 0, //最终价格
    params: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: _t['提交订单']
    });
    // 监听expAllMeal事件，获取上一页面通过eventChannel传送到当前页面的数据
    const eventChannel = this.getOpenerEventChannel()
    // 接受上一个页面传递过来的数据
    eventChannel.on('params', data => {
      this.setData({
        params: data,
        payAmount: data.price, //总价
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
    this.setData({
      userInfo: wx.getStorageSync("userInfo"), //用户信息
    })
    this.initCard()
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
  checkboxChange(e) { // 会员优惠
    this.setData({
      choseVip: e.detail.value.length > 0 ? true : false
    })
  },
  radioChange(e) { //用户协议
    this.setData({
      userAgreement: e.detail.value.length > 0 ? true : false
    })
  },
  // 数量减少
  tapReduce() {
    if(this.data.orderCount > 1){
      var orderCount = this.data.orderCount -=1
      this.amountComputed(orderCount,this.data.money,this.data.discount,this.data.typeId)
      this.setData({
        orderCount: orderCount
      })
    }
  },
  tapAdd() {
    var orderCount = this.data.orderCount +=1
    this.amountComputed(orderCount,this.data.money,this.data.discount,this.data.typeId)
    this.setData({
      orderCount: orderCount
    })
  },
  // 跳转到会员中心
  tapToVip() {
    wx.navigateTo({
      url: '/pages/vip/vip-center'
    })
  },
  submitOrder() { //提交订单
    const that = this
    if(!this.data.userAgreement){
      NT.showToastNone(_t['需要同意Macau Time服务协议才能预定'],2000)
      return
    }
    NT.showToast('处理中...')
    const data = this.data
    const saveOrderRequest = {
      expMealSerial: data.options.expMealSerial,
      expSerial: data.options.expSerial,
      linkman: data.userInfo.nickName,
      linkmanPhone: data.userInfo.phone,
      number: data.orderCount,
      price: data.ePrice,
      useDate: data.options.useDate,
      userName: data.userInfo.userName
    }
    api.saveOrder(saveOrderRequest)
    .then(res=>{
      if(Number(data.options.paymentType) === 1){ //线上支付
        const expPayOrderModel = {
          amount: data.ePrice ,
          billType: 'E',
          orderCode: res,
          payType: 'WXPAY_JSAPI', //支付类型（微信支付：WXPAY_APP，公众号支付或小程序支付：WXPAY_JSAPI，支付宝支付：ALIPAY_APP 
        }
        api.payOrder(expPayOrderModel)
        .then(res=>{
          wx.requestPayment({
            timeStamp: res.timeStamp,
            nonceStr: res.nonceStr,
            package: res.package,
            signType: res.signType,
            paySign: res.paySign,
            success (res) {
              that.orderConfirmHandle()
            },
            fail (res) {
              console.log(res)
              NT.showModal(_t['支付失败！'])
            }
          })
        })
        .catch(err=>{
          NT.showModal(err.message||_t['请求失败！'])
        })
      }else{
        that.orderConfirmHandle()
      }
            
    })
    .catch(err=>{
      if(err.codeMsg === _t['该用户不是会员']){
        wx.showModal({
          title: '提示',
          content: _t['您不是会员暂不能预定，是否立即加入会员立即享受体验优惠？'],
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
        NT.showModal(err.message||_t['请求失败！'])
      }
    })
  },
  tapToAgreement() { //跳转到Macau Time协议
    wx.navigateTo({
      url: '/pages/views/about-us?id=2'
    })
  },
  orderConfirmHandle() { //预定订单成功后
    app.globalData.ticket = true
    wx.showModal({
      title: '提示',
      content: _t['预定成功！'],
      confirmText: _t['查看订单'],
      confirmColor: '#00A653',
      cancelColor: '#222222',
      cancelText: _t['继续浏览'],
      success (res) {
        if (res.confirm) {
          // 
          wx.switchTab({
            url: '/pages/order/my-order'
          })
        } else if (res.cancel) {
          // console.log('用户点击取消')
          wx.navigateBack({
            delta: 2
          })
        }
      }
    })
  },
  // 打开half-screen-dialog
  tapGetCard() {
    NT.showToast(_t['加载中...'])
    var query = {
      msId: this.data.params.msId,
      money: this.data.params.price * this.data.orderCount
    }
    api.mkSelectStoreCardsAndUserCard(query).then(res=>{
      console.log(res)
      if(!res.length){
        NT.showModal(_t['抱歉，没有符合您的优惠券！'])
        return false;
      }
      res.map(item=>{
        // 是否是当前选择的券
        if(item.id === this.data.choseCardId){
          item.checked = true
        }
      })
      this.setData({
        cardResult: res,
        istrue: true
      })
    }).catch(err=>{
      NT.showModal(err.message||_t['请求失败！'])
    })
    
  },
  // 关闭half-screen-dialog
  closeDialog(e){
    this.setData({
      istrue: false
    })
  },
  // 选中的卡劵
  cardRadioChange(e) {
    console.log(e)
    var id = e.detail;
    if(!id){
      this.initCard(id)
      return
    }
    var cardResult = this.data.cardResult;
    cardResult.map(item=>{
      if(item.id === id) {
        var money = item.money;
        var discount = item.discount;
        var typeId = item.typeId;
        this.amountComputed(this.data.orderCount,money,discount,typeId)
        this.setData({
          choseCardId: id,
          discountsName: item.discountsName,
          typeId: typeId,
          discount: discount,
          money: money
        })
      }
    })
  },
  // 下单
  submitOrderNew(){
    var choseData = this.data.params
    var orderCount = this.data.orderCount;
    var price = choseData.price;
    const query = {
      userId: this.data.userInfo.userId,  // 用户账户
      payAmount: this.data.payAmount, //支付金额
      contentTypeId: choseData.contentTypeId ,//商品内容类别Id
      contentInfoId: choseData.id, // 内容详情Id
      price: price, // 商品单价
      quantity: orderCount, //数量
      msAccountId: choseData.msId, // 店铺所属者Id
      baseTypeId: choseData.baseTypeId, //基础类别Id
      baseTypeName: choseData.baseTypeName, //基础类别名称
      discountId: this.data.choseCardId, //优惠券id
      msId: choseData.msId
    }
    NT.showToast(_t['处理中...'])
    api.poInsertGoodsOrderAddDiscount(query).then(res=>{
      wx.navigateTo({
        url: '/pages/vip/payment?id=' + res.orderNumber + '&money=' + this.data.payAmount + '&reciprocal=' + res.reciprocal + '&source=meal' + '&msId=' + choseData.msId
      })
    }).catch(err=>{
      NT.showModal(err.message||_t['请求失败！'])
    })
    // wx.navigateTo({
    //   url: '/pages/views/spell-route-order-ok'
    // })
  },
  // 不是会员下单则点击提示跳转到去开通会员
  tapModalToVip() {
    wx.showModal({
      title: '提示',
      content: _t['您不是会员暂不能预定，是否立即加入会员立即享受体验优惠？'],
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
  },
  // 初始化卡劵
  initCard(id) {
    var money = '';
    var discount = '';
    var typeId = '';
    this.amountComputed(this.data.orderCount,money,discount,typeId)
    this.setData({
      choseCardId: id || '',
      discountsName: '',
      typeId: typeId,
      discount: discount,
      money: money
    })
  },
  /**
   * 计算总价
   * @param {*} orderCount  数量
   * @param {*} money  单价
   * @param {*} discount  折扣卷
   * @param {*} typeId 折扣类型
   */
  amountComputed(orderCount,money,discount,typeId) {
    var price = this.data.params.price;
    var payAmount;
    if(typeId == 1) { //折扣券
      payAmount = this.computed(price * orderCount * discount)
    }else if(typeId == 2) { //满减券
      payAmount = this.computed(price * orderCount - money < 0 ? 0 : price * orderCount - money)
    }else if(typeId == 3) { // 抵扣券
      payAmount = this.computed(price * orderCount - money < 0 ? 0 : price * orderCount - money)
    }else{ // 没有选中券
      payAmount = this.computed(price * orderCount)
    }
    this.setData({
      payAmount: payAmount,
    })
  },
  // 计算价格，保留2位小数，第二位小数后面只要有数字就进1，例如123.0000001为123.01，123.201999为123.21
  computed(num) {
    var str = num.toString().split('.');
    if(str.length>1){
      var fStr = str[1]
      if(fStr.length > 2) {
        var float =  '0.' + fStr.substring(0,2)
        var newFloat = Number(float) + 0.01
        return Number(str[0]) + newFloat
      }else{
        var float =  fStr.substring(0,2)
        var rStr = str[0] + '.' + float
        return Number(rStr)
      }
    }else{
      return Number(str)
    }
  }
})