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
    array: ['中国银行', '工商银行', '招商银行', '建设银行', '农业银行', '平安银行'],
    cardTypeArray: ['储蓄卡', '银联信用卡', 'VISA信用卡'],

    backQuery: {  // 表单提交信息
      bankId: '',
      realName: '',
      bankCode: '',
      bankName: '',
      branchBankInfo: '',
      bankAddr: '',
      cardType: '',
      reservedPhone: ''
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: _t['绑定银行卡']
    });
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
  // 单列选择器
  bindPickerChange: function(e) {
    const index = e.currentTarget.dataset.index
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index: e.detail.value
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
    let params = e.detail.value
    let data = Object.assign(this.data.backQuery, params)
    console.log(data)
    if(!data.realName){
      NT.showModal( _t['请输入持卡人姓名'] + '！' )
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
    NT.showToast(_t['处理中...'])
    api.usInsertCard(data)
    .then(res=>{
      console.log(res)
      NT.toastFn(_t['处理成功'],1000)
      setTimeout(()=>{
        wx.navigateBack({
          delta: 1
        })
      },1000)
    })
    .catch(err=>{
      NT.showModal(err.message||_t['请求失败！'])
    })
  }
})