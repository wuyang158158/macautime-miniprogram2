// pages/my/information/index.js
import api from "../../../data/api";
import NT from "../../../utils/native.js"
var base = require('../../../i18n/base.js');
const _t = base._t().my.INFORMATION
const infoName = [_t['头像'], _t['主页背景'], _t['昵称'], _t['性别'], _t['生日'], _t['简介']]
const date = new Date()
const years = []
const months = []
const days = []
for (let i = 1950; i <= date.getFullYear(); i++) {
  years.push(i)
}

for (let i = 1; i <= 12; i++) {
  months.push(i)
}

for (let i = 1; i <= 31; i++) {
  days.push(i)
}
Page({

  /**
   * 页面的初始数据
   */
  data: {
    _t: _t,
    isIphoneX: getApp().globalData.isIphoneX, //iphonex适配
    editType: 0, //类型
    Len: 0, //文字长度
    LenT: 0, //简介长度
    nickName: '', //昵称
    remark: '', //简介
    sex: '', //性别,
    years: years,
    months: months,
    days: days,
    value: [40, 5, 14], //数据为对应的索引
    birthday: '1990-6-15', //生日
    headIco: '', //头像
    headBackIco: '', //主页背景
    userInfo: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({ editType: Number(options.type) })
    console.log(infoName[Number(options.type)])
    wx.setNavigationBarTitle({
      title: infoName[Number(options.type)],
    })
    this.fnShowOldInfo(options.content)
  },
  // 个人信息回显
  fnShowOldInfo(cont){
    switch (this.data.editType) {
      case 0:
        this.setData({ headIco: cont })
        break;
      case 1:
        this.setData({ headBackIco: cont })
        break;
      case 2:
        this.setData({ nickName: cont, Len: cont.length })
        break;
      case 3:
        this.setData({ sex: Number(cont) })
        break;
      case 4:
        let arrVal = cont.split('-')
        let newV = []
        // 年月日回显
        this.data.years.forEach((ele, index) => {
          if (ele === Number(arrVal[0])) {
            newV[0] = index
          }
        })
        this.data.months.forEach((ele, index) => {
          if (ele === Number(arrVal[1])) {
            newV[1] = index
          }
        })
        this.data.days.forEach((ele, index) => {
          if (ele === Number(arrVal[2])) {
            newV[2] = index
          }
        })
        this.setData({ birthday: cont, value: newV })
        break;
      case 5:
        this.setData({ remark: cont, LenT: cont.length })
        break;
    }
  },
  tapToAboutUs() { // 跳转到协议
    wx.navigateTo({
      url: '/pages/views/about-us?id=1'
    })
  },
  // 上传图片
  chooseImage: function (e) {
    let type = this.data.editType
    var that = this;
    wx.chooseImage({
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        NT.showToast(_t['上传中...'])
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        api.userUploadImage(res.tempFilePaths[0]).then(resq => {
          if (type === 1) {
            that.setData({ headBackIco: resq.body })
          } else {
            that.setData({ headIco: resq.body })
          }
        }).catch(err => {
          NT.showModal(err.codeMsg || err.message || _t['请求失败！'])
        })
      }
    })
  },
  // 修改昵称
  fnInputValue(e) {
    this.setData({
      nickName: e.detail.value,
      Len: e.detail.value.length
    })
  },
  // 修改简介
  fnTextareaValue(e) {
    this.setData({
      remark: e.detail.value,
      LenT: e.detail.value.length
    })
  },
  // 选择性别
  fnUpdataSex(e) {
    const sex = e.currentTarget.dataset.sex
    this.setData({ sex: sex })
  },
  // 选择生日
   fnBindChange(e) {
    const val = e.detail.value
    this.setData({
      birthday: `${this.data.years[val[0]]}-${this.data.months[val[1]]}-${this.data.days[val[2]]}`
     })
  },
  // 提交表单
  fnUpdataInfo() {
    let data = {}
    let type = this.data.editType
    // 没有改动则不能保存修改
    if(
      (this.data.nickName === this.data.userInfo.nickName) || 
      (this.data.sex === this.data.userInfo.sex) ||
      (this.data.birthday === this.data.userInfo.birthday)
      ){
      return NT.showModal(_t['您好像没有改动哦~~'])
    }
    // 修改昵称
    if (type === 2 && this.data.nickName.length < 2) {
      return NT.showModal(_t['请输入2-15个字'])
    } else if(type === 2) {
      data.nickName = this.data.nickName
    }
    // 修改生日
    if (type === 4) {
      data.birthday = this.data.birthday
    }
    // 修改性别
    if (type === 3 && this.data.sex === '') {
      return NT.showModal(_t['请选择性别!'])
    } else if(type === 3) {
      data.sex = this.data.sex
    }
    //修改头像
    if (type === 0 && this.data.headIco === '') {
      return NT.showModal(_t['请选择图片上传!'])
    } else if (type === 0) {
      data.headIco = this.data.headIco
    }
    //修改主页背景
    if (type === 1 && this.data.headBackIco === '') {
      return NT.showModal(_t['请选择图片上传'])
    } else if (type === 1) {
      data.headBackIco = this.data.headBackIco
    }
    // 修改简介
    if (type === 5 && !this.data.remark) {
      return NT.showModal(_t['请输入个人简介!'])
    } else if (type === 5) {
      data.remark = this.data.remark
    }
    // 修改次数
    // data.modifyCount = 3
    if (this.data.userInfo.modifyCount === 0) {
      return NT.showModal(_t['当月可修改次数为0'])
    } else {
      data.modifyCount = --this.data.userInfo.modifyCount
    }
    
    api.ctUpdataUserInfo(data).then( res => { 
      NT.toastFn(_t['成功!'], 1000)
      setTimeout(() =>{
        wx.navigateBack()
      }, 1000)
    }).catch( err => {
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
    this.setData({ userInfo: wx.getStorageSync('userInfo') || {} })
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