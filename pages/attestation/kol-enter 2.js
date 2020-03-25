// pages/attestation/kol-enter.js
import NT from "../../utils/native.js"
import api from "../../data/api.js"
import config from "../../data/api_config.js"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    baseImageHost: config.baseImageHost,
    userAgreement: true,
    accordingImage: '',
    array: ['微博', '抖音', '快手', '微视'],
    platformList: [
      {
        platformName: '微博',
        account: 0,
        nickName: '',
        accountId: ''
      }
    ],
    container: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.usKolInfoById()
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
      choseTag: wx.getStorageSync('choseTag'),
      kolClass: wx.getStorageSync('kolClass'),
      choseTagClass: wx.getStorageSync('choseTagClass')
    })
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
  radioChange(e) { //用户协议
    this.setData({
      userAgreement: e.detail.value.length > 0 ? true : false
    })
  },
  tapToAgreement() { //跳转到Macau Time协议
    // wx.navigateTo({
    //   url: '/pages/views/gh-agreement'
    // })
    wx.navigateTo({
      url: '/pages/views/about-us?id=3'
    })
  },
  // 添加平台信息
  tapAddPlatformMsg() {
    console.log('添加平台信息')
    const obj = {
      platformName: '',
      account: 0,
      nickName: '',
      accountId: ''
    }
    this.setData({
      platformList: this.data.platformList.concat(obj)
    })
  },
  // 删除详细信息
  tapDeletePlatformMsg(e) {
    const index = e.currentTarget.dataset.index
    const platformList = this.data.platformList
    platformList.map((item,i)=>{
      if(i === index){
        platformList.splice(i,1)
      }
    })
    this.setData({
      platformList: platformList
    })
  },
  // 点击下一波
  tapNext() {
    if(!this.data.userAgreement){
      NT.showToastNone('需要同意服务协议才能继续提交',2000)
      return
    }
    
    this.usKolOtherInfo()
    
    // 跳转到实名认证
    // wx.navigateTo({
    //   url: '/pages/attestation/real-name-authentication'
    // })
  },
  // 单列选择器
  bindPickerChange: function(e) {
    const index = e.currentTarget.dataset.index
    const platformList = this.data.platformList
    platformList.map((item,i)=>{
      if(i === index){
        item.account = e.detail.value
        item.platformName = this.data.array[e.detail.value]
      }
    })
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index: e.detail.value,
      platformList: platformList
    })
  },
  bindinput(e) {
    const index = e.currentTarget.dataset.index
    const type = e.currentTarget.dataset.type
    const platformList = this.data.platformList
    platformList.map((item,i)=>{
      if(i === index){
        if(type === 'nickName'){
          item.nickName = e.detail.value
        }
        if(type === 'accountId'){
          item.accountId = e.detail.value
        }
      }
    })
    this.setData({
      platformList: platformList
    })
  },
  // 新增kol
  usKolOtherInfo() {
    // NT.showToast('处理中...')
    const userId = wx.getStorageSync("userInfo").userId
    const list = this.data.platformList
    let query = {
      accordingImage: this.data.accordingImage,
      tyle: this.data.kolClass === '普通KOL' ? 1 : 2,
      kolOtherPlatformList: list,
      // sysLabelList: this.data.choseTag
    }
    if(!this.data.choseTag.length){
      NT.showModal('请选择优势特长！')
      return
    }
    if(!this.data.kolClass){
      NT.showModal('请选择KOL类别！')
      return
    }
    if(!query.accordingImage){
      NT.showModal('请上传个人形象照！')
      return
    }
    if(!query.kolOtherPlatformList.length){
      NT.showModal('请至少填写一个其它平台信息！')
      return
    }
    NT.showToast('处理中...')
    api.usInsertKol(query)
    .then(res=>{
      wx.navigateTo({
        url: '/pages/attestation/kol-enter-msg'
      })
    })
    .catch(err=>{
      NT.showModal(err.message||'请求失败！')
    })
  },
  // 获取kol用户信息
  usKolInfoById() {
    NT.showToast('加载中...')
    api.usKolInfoById({id:wx.getStorageSync("userInfo").userId})
    .then(res=>{
      // 是否认证KOL(0： 待审核 1：审核通过 2：审核失败)进入相应提示
      if(res.isCertificationKol == '0' || res.isCertificationKol == '2'){
        wx.redirectTo({
          url: '/pages/attestation/kol-enter-msg?isCertificationKol=' + res.isCertificationKol
        })
        return false;
      }
      //用户类别
      var choseTagClass = res.usSysLabelTyle.labelRemark
      wx.setStorage({key:"choseTagClass",data: choseTagClass})
      //kol类别
      var kolClass = res.tyle == '1' ? '普通KOL' : '领域KOL'
      wx.setStorage({key:"kolClass",data: kolClass})
      //用户标签
      var choseTag = res.usSysLabel
      if(choseTag.length > 0) {
        choseTag.map(item=>{
          item.remark = item.labelRemark
        })
      }
      wx.setStorage({key:"choseTag",data: choseTag})
      // 其他平台信息
      var usKolOtherPlatform = res.UsKolOtherPlatform;
      if(usKolOtherPlatform.length > 0) {
        usKolOtherPlatform.map(item=>{
          item.account = this.data.array.indexOf(item.platformName)
        })
      }else{
        usKolOtherPlatform = this.data.platformList
      }
      this.setData({
        userInfo: res.kolBaseInfo, //用户信息
        accordingImage: res.accordingImage, //个人形象照
        choseTagClass: choseTagClass, //用户类别
        kolClass: kolClass,
        choseTag: choseTag,
        platformList: usKolOtherPlatform,
        container: true
      })
    })
    .catch(err=>{
      this.setData({
        noData: {
          text: err.codeMsg ||'请求失败！',
          type: err.code === '00'? 'no-network' : 'no-data'
        }
      })
    })
  },
  // 上传图片
  tapChooseImage() {
    const that = this
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success (res) {
        // tempFilePath可以作为img标签的src属性显示图片
        const tempFilePaths = res.tempFilePaths
        api.userUploadImage(tempFilePaths[0], true)
          .then(res => {
            that.setData({
              accordingImage: res.body
            })
        })
        .catch(err=>{
          console.log(err)
        })
      }
    })
  },
  // 跳转到优势特长选择
  tapToSpeciality(e) {
    const source = e.currentTarget.dataset.source
    wx.navigateTo({
      url : '/pages/attestation/kol-tag?source=' + source
    })
  },
  // 跳转到kol 类别认证
  tapToKolClass() {
    wx.navigateTo({
      url : '/pages/attestation/kol-class'
    })
  }
})