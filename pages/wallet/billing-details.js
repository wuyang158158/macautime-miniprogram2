import NT from "../../utils/native.js"
import api from "../../data/api"
import util from "../../utils/util.js"
var base = require('../../i18n/base.js');
const _t = base._t().wallet.WALLET
var tradeTypeArray = [
  {
    tradeType: '',
    TradeTypeText: '全部'
  },
  {
    tradeType: 1,
    TradeTypeText: _t['充值']
  },
  {
    tradeType: 2,
    TradeTypeText: _t['提现']
  },
  {
    tradeType: 3,
    TradeTypeText: _t['探店']
  },
  {
    tradeType: 4,
    TradeTypeText: _t['活动']
  },
  {
    tradeType: 5,
    TradeTypeText: _t['粉丝返点']
  },
  {
    tradeType: 6,
    TradeTypeText: _t['购劵']
  },
  {
    tradeType: 7,
    TradeTypeText: _t['消费']
  },
  {
    tradeType: 8,
    TradeTypeText: _t['积分兑换']
  },
  {
    tradeType: 9,
    TradeTypeText: _t['会员']
  },
  {
    tradeType: 10,
    TradeTypeText: _t['优惠换提成']
  },
  {
    tradeType: 11,
    TradeTypeText: _t['消费提成']
  },
  {
    tradeType: 12,
    TradeTypeText: _t['退回']
  },
  {
    tradeType: 13,
    TradeTypeText: _t['核销']
  },
  {
    tradeType: 14,
    TradeTypeText: _t['专访']
  }
]
// pages/wallet/billing-details.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    _t: _t,
    date: '',
    accountType: '',
    updateTime: '',
    tradeType: '',
    totalPrice: '',
    result: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var title = options.source === 'djs' ? _t['待结算'] : _t['账单明细']
    wx.setNavigationBarTitle({
      title: title,
    })
    // 待结算
    if(options.source === 'djs'){
      tradeTypeArray = [
        {
          tradeType: '3',
          TradeTypeText: '全部'
        },
        {
          tradeType: '1',
          TradeTypeText: _t['冻结']
        },
        {
          tradeType: '2',
          TradeTypeText: _t['解冻']
        }
      ]
    }
    this.setData({
      userInfo: wx.getStorageSync("userInfo"), //用户信息
      tradeTypeArray: tradeTypeArray,
      tradeType: options.tradeType || tradeTypeArray[0].tradeType,
      source: options.source,
    })
    if (options.tradeType) {
      this.setData({ accountType: options.tradeType === "2"?_t['提现']: '' })
    }
    this.data.source === 'djs'? this.atsUnfreezingAndFreezing() : this.atsSelectByList()
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
  // 触发时间选择器
  bindDateChange(result) {
    this.setData({ date: result.detail.value, updateTime: result.detail.value })
    this.data.source === 'djs'? this.atsUnfreezingAndFreezing() : this.atsSelectByList()
    
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

  },
  // 请求钱包流水
  atsSelectByList() {
    const that = this
    NT.showToast(_t['加载中..'])
    api.atsSelectByList({ tradeType: this.data.tradeType, updateTime: this.data.updateTime })
    .then(res=>{
      var result = res
      let total = 0
      result.forEach(item => {
        item.ctime = util.formatTimeTwo(item.UpdateTime,'Y/M/D h:m:s')
        let key = item.TradeType
        if(item.recordType === 1) {
          total += item.Amount
        } else if(item.recordType === 2) {
          total -= item.Amount
        }
        switch (key) {
          case 1:
            item.TradeTypeText = _t['充值'];
            break;
          case 2:
            item.TradeTypeText = _t['提现'];
            break;
          case 3:
            item.TradeTypeText = _t['探店'];
            break;
          case 4:
            item.TradeTypeText = _t['活动'];
            break;
          case 5:
            item.TradeTypeText = _t['粉丝返点'];
            break;
          case 6:
            item.TradeTypeText = _t['购劵'];
            break;
          case 7:
            item.TradeTypeText = _t['消费'];
            break;
          case 8:
            item.TradeTypeText = _t['积分兑换'];
            break;
          case 9:
            item.TradeTypeText = _t['会员'];
            break;
          case 10:
            item.TradeTypeText = _t['优惠换提成'];
            break;
          case 11:
            item.TradeTypeText = _t['消费提成'];
            break;
          case 12:
            item.TradeTypeText = _t['退回'];
            break;
            case 13:
              item.TradeTypeText = _t['核销'];
              break;
            case 14:
              item.TradeTypeText = _t['专访'];
              break;
          default:
            item.TradeTypeText = _t['未知'];
            break;
        }
      });
      that.setData({
        result: result,
        totalPrice: total
      })
    })
    .catch(err=>{
      NT.showModal(err.message||_t['请求失败！'])
    })
  },
  // 选择交易类型
  bindPickerChange(e) {
    this.setData({ tradeType: tradeTypeArray[e.detail.value].tradeType, accountType: tradeTypeArray[e.detail.value].TradeTypeText })
    this.data.source === 'djs'? this.atsUnfreezingAndFreezing() : this.atsSelectByList()
  },
  // 请求待结算列表
  atsUnfreezingAndFreezing() {
    const that = this
    NT.showToast(_t['加载中..'])
    api.atsUnfreezingAndFreezing({ recordType: this.data.tradeType, updateTime: this.data.updateTime })
    .then(res=>{
      var result = res
      let total = 0
      result.forEach(item => {
        item.ctime = util.formatTimeTwo(item.updateTime,'Y/M/D h:m:s')
        item.Amount = item.amount
        if(item.recordType === 4){
          item.recordType = 2
        }
        if(item.recordType === 3) {
          total += item.Amount
        }
        let key = item.recordType
        switch (key) {
          case 3:
            item.TradeTypeText = _t['冻结'];
            break;
          case 2:
            item.TradeTypeText = _t['解冻'];
            break;
          default:
            item.TradeTypeText = _t['未知'];
            break;
        }
      });
      that.setData({
        result: result,
        totalPrice: total
      })
    })
    .catch(err=>{
      NT.showModal(err.message||_t['请求失败！'])
    })
  }
})