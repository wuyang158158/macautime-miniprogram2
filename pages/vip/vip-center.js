import NT from "../../utils/native.js"
import api from "../../data/api.js"
import util from "../../utils/util.js"

// pages/vip/vip-center.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isUserVip: false,
    memberConponData: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
    
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
    const userInfo = wx.getStorageSync("userInfo")
    this.setData({
      userInfo: userInfo
    })
    this.mkGetVipPackage()
    // if(userInfo.level){
    //   this.fnMembershipCoupon()
    // }else{
    //   this.mkGetVipPackage()
    // }
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
  tapToLogin: function(e) { //登录
    let that = this;
    wx.getSetting({
      success(res) {
        if (!res.authSetting['scope.userInfo']) {
          wx.authorize({
            scope: 'scope.userInfo',
            success (res) {
              // 用户已经同意 后续调用 wx.getUserInfo 接口不会弹窗询问
              // 必须是在用户已经授权的情况下调用
              wx.getUserInfo()
            },
            fail () { //用户拒绝授权 则提示用户去授权
              wx.openSetting({
                success (res) {
                  console.log(res.authSetting)
                  res.authSetting = {
                    "scope.userInfo": true,
                    "scope.userLocation": true
                  }
                }
              })
            }
          })
        }else{
          // 必须是在用户已经授权的情况下调用
          wx.getUserInfo({
            success: function(res) {
              console.log(res)
              var userInfo = res.userInfo
              var nickName = userInfo.nickName
              var avatarUrl = userInfo.avatarUrl
              var gender = userInfo.gender //性别 0：未知、1：男、2：女
              var province = userInfo.province
              var city = userInfo.city
              var country = userInfo.country
              api.login()
              .then((res) => {
                that.setData({
                  userInfo: res
                })
                wx.setStorage({
                  key:"userInfo",
                  data:res
                })
              })
              .catch((err)=>{
                if(err.code==='10019'){ //用户未注册
                  wx.navigateTo({
                    url: '/pages/login/login?openId='+err.data.openId + '&sessionKey=' + err.data.sessionKey,
                    success: function(res) {
                      // 通过eventChannel向被打开页面传送数据
                      res.eventChannel.emit('acceptDataFromOpenerPage', err.data)
                    }
                  })
                }else{
                  NT.showModal(err.message||'登录失败！')
                }
              })
            },
            fail : function(err) {
              console.log(err)
            }
          })
        }
      }
    })
  },
  // 获取会员套餐
  mkGetVipPackage() {
    NT.showToast('加载中...')
    api.mkGetVipPackage()
    .then(res=>{
      var list = res || []
      list.forEach(item=>{
        if(item.description){
          var text = item.description.split('(')
          item.description1 = text[0]
          item.description2 = '('+text[1]
        }
      })
      this.setData({
        list: list
      })
    })
    .catch(err=>{
      NT.showModal(err.codeMsg||err.message||'请求失败！')
    })
  },
  getPass(e) { //领取卡劵
    const id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/views/get-ticket-detail?id=' + id
    })
  },
  // 获取福利升级数据 -- 未完成
  fnMembershipCoupon() {
    api.ctMembershipCoupon().then(res => {

      let arr = []
      for (const key in res) {
        res[key].forEach(ele => {
          ele.endTime = ele.endTime?util.formatTimeTwo(ele.endTime, 'Y-M-D h:m:s'): ''
        })
        arr.push({
          title: key,
          data: res[key]
        })
      }
      this.setData({ memberConponData: arr})
    })
    .catch(err=>{
      NT.showModal(err.codeMsg||err.message||'请求失败！')
    })
  },
  tapJoinVip(){
    NT.showModal('请选择下面适合您的会员套餐开通！')
  },
  // 支付开通会员
  poVipOrder(e) {
    NT.showToast('处理中...')
    const id = e.currentTarget.dataset.id
    const money = e.currentTarget.dataset.money
    const query = {
      userId: this.data.userInfo.userId,
      vipPackageId: id
    }
    api.poVipOrder(query)
    .then(res=>{
      console.log(res)
      wx.navigateTo({
        url: '/pages/vip/payment?id=' + res.orderNumber + '&money=' + money + '&reciprocal=' + res.reciprocal + '&source=vip'
      })
    })
    .catch(err=>{
      NT.showModal(err.codeMsg||err.message||'请求失败！')
    })
    
  }
})