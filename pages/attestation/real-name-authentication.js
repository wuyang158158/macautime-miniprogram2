// pages/attestation/real-name-authentication.js
import NT from "../../utils/native.js"
import api from "../../data/api.js"
import config from "../../data/api_config.js"
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    baseImageHost: config.baseImageHost,
    array: ['男', '女'],
    ageArray: [],
    identityQuery: {
      cardFrontImage: '',
      cardBackImage: '',
      sex: '',
      age: '',
      realName: '',
      identityType: '身份证',
      identityCode: ''
    }, //上传参数
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const that = this

    let ageArray = []
    for (let index = 0; index < 100; index++) {
      ageArray.push(index)
    }
    this.setData({
      ageArray: ageArray
    })
    this.usGetAuthentication()
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
  onShareAppMessage: function () {

  },
  // 单列选择器
  bindPickerChange: function(e) {
    this.setData({
      'identityQuery.sex': Number(e.detail.value)
    })
  },
  bindPickerChangeAge(e) {
    this.setData({
      'identityQuery.age': Number(e.detail.value)
    })
  },
  // 跳转去绑定银行卡页面
  tapToBindBankCard() {
    wx.navigateTo({
      url: '/pages/attestation/bind-bank-card'
    })
  },
  // 上传身份证正反面
  tapChooseImage(e) {
    const type = e.currentTarget.dataset.type
    const that = this
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success (res) {
        // tempFilePath可以作为img标签的src属性显示图片
        const tempFilePaths = res.tempFilePaths[0]
        api.userUploadImage(tempFilePaths)
          .then(res => {
            if (type === 'front') {
              that.setData({ 'identityQuery.cardFrontImage': res.body })
            } else {
              that.setData({ 'identityQuery.cardBackImage': res.body })
            }
        })
        .catch(err=>{
          NT.showModal(err.message || '请求失败！')
        })
      }
    })
  },
  // 下一步
  formSubmit(e) {
    const that = this
    let params = e.detail.value
    let data = Object.assign(this.data.identityQuery, params)
    if(!data.realName){
      NT.showModal('请输入真实姓名！')
      return
    }
    if(!data.sex){
      NT.showModal('请选择年龄！')
      return
    }
    if(!data.age){
      NT.showModal('请选择性别！')
      return
    }
    if(!data.identityCode){
      NT.showModal('请输入身份证！')
      return
    }
    if(!data.cardFrontImage){
      NT.showModal('请上传身份证正面图！')
      return
    }
    if(!data.cardBackImage){
      NT.showModal('请上传身份证反面图！')
      return
    }
    data.sex === '男' ? data.sex = 0 : data.sex = 1
    NT.showToast('处理中...')
    api.usInsertIdentity(data)
    .then(res=>{
      NT.toastFn('提交成功！')
      setTimeout(()=>{
        wx.navigateBack({
          delta: 1
        })
      },2000)
    })
    .catch(err=>{
      NT.showModal(err.message||'请求失败！')
    })
    
  },
  // 获取KOL实名认证信息
  usGetAuthentication() {
    NT.showToast('加载中...')
    api.usGetAuthentication()
    .then(res=>{
      console.log(res)
      let identityQuery = Object.assign(this.data.identityQuery,res.identityAuth)
      this.setData({
        identityQuery: identityQuery,
        isUsBankAuth: res.usBankAuth.length, //是否有绑定有银行卡
      })
    })
    .catch(err=>{
      NT.showModal(err.message||'请求失败！')
    })
  }
})