// pages/attestation/bind-bank-card.js
import NT from "../../utils/native.js"
import api from "../../data/api.js"
var base = require('../../i18n/base.js');  //路径可能做相应调整
const _t = base._t().attestation.BIND_BANK_CARD; //翻译函数
Page({

  /**
   * 页面的初始数据
   */
  data: {
    _t: _t,
    array: [],
    cardTypeArray: [_t['储蓄卡'], '信用卡', 'VISA'],
    canSend: true,
    sendText: _t['发送验证码'],
    backQuery: {  // 表单提交信息
      bankId: '',
      realName: '',
      bankCode: '',
      bankName: '',
      cardType: '',
      reservedPhone: ''
    },
    canSubmit: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: _t['绑定银行卡']
    });
    this.sysGetBankConf()
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
  fnSetPhone(e) {
    this.setData({ phone: e.detail.value })
  },
  // 发送验证码
  fnGetCode() {
    if(!this.data.phone) return NT.showModal( _t['请输入手机号码'] + '！' )
    if(this.data.canSend) {
      this.setData({ canSend: false })
    } else {
      return false
    }
    api.usGetPhoneCode({phone: this.data.phone}).then(res => {
      let count = 60
      let that = this
      let timer = setInterval(() => {
        count--
        this.setData({sendText: count < 10?`0${count}`: count })
        if(count === 0) {
          that.setData({canSend: true, sendText: _t['发送验证码'] })
          clearInterval(timer)
        }
      }, 1000)
    }).catch(err=>{
      that.setData({ canSend: true, sendText: _t['发送验证码'] })
      NT.showModal(err.message||_t['请求失败！'])
    })
  },
  // 单列选择器
  bindPickerChange: function(e) {
    const index = e.detail.value
    const array = this.data.array
    var backObj = ''
    array.map((item,i)=>{
      if(i==index){
        backObj = item
      }
    })
    this.setData({
      index: index,
      backObj: backObj
    })
  },
  // 卡类型
  bindPickerChangeCardType(e) {
    this.setData({
      cardTypeIndex: e.detail.value
    })
  },
  // 提交表单
  formSubmit(e) {
    const that = this
    var backObj = this.data.backObj
    let params = e.detail.value
    let data = Object.assign(this.data.backQuery, params)
    data.bankId = backObj.bankCode;
    data.bankName = backObj.bankName;
    if(!data.realName){
      NT.showModal( _t['请输入持卡人姓名'] + '！' )
      return
    }
    if(!data.verCode){
      NT.showModal( _t['请输入验证码'] + '！' )
      return
    }
    if(!data.bankCode){
      NT.showModal( _t['请输入银行卡号'] + '！' )
      return
    }
    if(!data.bankName){
      NT.showModal( _t['请选择银行名称！'] )
      return
    }
    if(!data.cardType){
      NT.showModal( _t['请选择卡类型'] + '！' )
      return
    }
    if(!data.reservedPhone){
      NT.showModal( _t['请输入手机号码'] + '！' )
      return
    }
    if(data.cardType === 'VISA') {
      data.cardType = 'Visa'
    }
    if(this.data.canSubmit) {
      this.setData({ canSubmit: false })
    } else {
      return false
    }
    NT.showToast(_t['处理中...'])
    api.usInsertCard(data)
    .then(res=>{
      that.setData({ canSubmit: true })
      NT.toastFn(_t['处理成功'],1000)
      setTimeout(()=>{
        wx.navigateBack({
          delta: 1
        })
      },1000)
    })
    .catch(err=>{
      that.setData({ canSubmit: true })
      NT.showModal(err.message||_t['请求失败！'])
    })
  },
  // 获取银行卡
  sysGetBankConf() {
    api.sysGetBankConf()
    .then(res=>{
      this.setData({
        array: res || []
      })
    })
    .catch(err=>{
      NT.showModal(err.message||_t['请求失败！'])
    })
  }
})