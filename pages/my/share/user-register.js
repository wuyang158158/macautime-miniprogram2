// pages/my/share/user-register.js
import NT from "../../../utils/native.js"
import api from "../../../data/api.js"
import util from "../../../utils/util.js"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showModal: false,
    code: '',
    noData: false,
    showIn: false, //过渡
    accountList: [], //已注册用户
    limitData: [], //领取条件
    rewardData: {} //奖励数据
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // api.shareInsertMoney({ payAmount: '10' }).then( res => {
    //   this.setData({ showModal: false, code: '' })
    //   NT.showModal('成功！')
    // })
    this.fnGetResiger()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  // 获取已注册用户数据
  fnGetResiger() {
    NT.showToast('加载中..')
    api.shareRegisterUser().then(res => {
      res.map(item => {
        item.createTime = item.createTime? util.formatTimeTwo(item.createTime, 'Y.M.D') : item.createTime
      })
      this.setData({ accountList: res, noData: !res.length })
    }).catch(err => {
      this.setData({ accountList: [], noData: true })
      NT.showModal(err.codeMsg || err.message || '请求失败！')
    })
  },
  // 领取奖励
  receiveT() {
    api.shareReward().then(res => {
      this.setData({ rewardData: res, code: res.reward? 1: 2 })
    }).catch(err => {
      NT.showModal(err.codeMsg || err.message || '请求失败！')
    })
    this.setData({ showModal: true })
    setTimeout(() => {
      this.setData({ showIn: true })
    }, 10)
  },
  // 关闭弹窗
  closeModal() {
    this.setData({ code: '', showModal: false })
  },
  // 钱包入账
  fnGetMoney() {
    api.shareInsertMoney({ payAmount: this.data.rewardData }).then( res => {
      this.setData({ showModal: false, code: '' })
      NT.showModal('成功！')
    })
  },
  controlModal(e) {
    let flag = e.currentTarget.dataset.flag
     if(flag) {
      api.shareGetLimit().then(res =>{ 
        this.setData({ limitData: res })
      }).catch(err => {
        NT.showModal(err.codeMsg || err.message || '请求失败！')
      })
    }
    this.setData({ code: 0, showModal: e.currentTarget.dataset.flag })
    setTimeout(()=>{
      this.setData({ showIn: e.currentTarget.dataset.flag})
    },10)

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
  onShareAppMessage: function () {

  }
})