// pages/wallet/cash-out/index.js
import NT from "../../../utils/native.js"
import api from "../../../data/api"
var base = require('../../../i18n/base.js');
const _t = base._t().wallet.BANK
Page({

  /**
   * 页面的初始数据
   */
  data: {
    _t: _t,
    totalNum: '',
    number: '',
    bankList: [],
    bankJson: {

    },
    bankAuthId: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: _t['提现'],
    })
    console.log(options)
    if (options.bankAuthId) { this.setData({ bankAuthId: options.bankAuthId })}
  },
  setInputValue(e){
    this.setData({
      number: e.detail.value
    });
  },
  chooseTotal() {
    this.setData({ number: this.data.totalNum })
  },
  // 获取可提现金额
  getAllMoney() {
    api.atsSelect().then(res => {
      this.setData({ totalNum: res.balance || '0.00' })
    }).catch( err => {
      NT.showModal(err.codeMsg || err.message || _t['请求失败！'])
    })
  },
  // 获取银行卡列表
  getData() {
    NT.showToast(_t['加载中..'])
    api.atsGetBankList().then(data => {
      const arr = data
      arr.forEach((element, index) => {
        element.lastFourNum = element.bankCode.substring(element.bankCode.length - 4)
        if (this.data.bankAuthId && this.data.bankAuthId === element.bankCode) {
          this.setData({ bankJson: element })
        } else if (index === 0) {
          this.setData({ bankJson: element })
        }
      })
      this.setData({ bankList: arr })
    }).catch(err => {
      NT.showModal(err.codeMsg || err.message || _t['请求失败！'])
    })
  },
  
  // 确认提现
  submitRefund() {
    if (!this.data.bankJson.bankCode) {
      NT.showModal(_t['请选择银行卡！'])
      return
    }
    if (!this.data.number) {
      NT.showModal(_t['请输入提现金额！'])
      return
    }
    if (this.data.number === '0.00' || this.data.number === '0' || this.data.number === '0.0') {
      NT.showModal(_t['提现金额不能为0'])
      return
    }
    NT.showToast(_t['处理中..'])
    api.atsCashMoney({ payAmount: this.data.number, bankAuthId: this.data.bankJson.bankCode }).then(res => {
      wx.navigateTo({
        url:`/pages/wallet/cash-out/verify?payAmount=${res.payAmount}&bankName=${this.data.bankJson.bankName}&branchBankInfo=${this.data.bankJson.branchBankInfo}`,
      })
    }).catch(err => {
      NT.showModal(err.codeMsg || err.message || _t['请求失败！'])
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
    this.getData()
    this.getAllMoney()
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
  onShareAppMessage: function () {

  }
})