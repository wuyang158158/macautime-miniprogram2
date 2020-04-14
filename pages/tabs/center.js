// pages/tabs/center.js
import NT from "../../utils/native.js"
import api from "../../data/api.js"
var base = require('../../i18n/base.js');  //路径可能做相应调整
const _t = base._t().CENTER; //翻译函数
const record = [{
  iconPath: '/images/center/mine_icon_like.png',
    text: _t['我的点赞']
  },
  {
    iconPath: '/images/center/mine_icon_comment.png',
    text: _t['我的评价']
  },
  {
    iconPath: '/images/center/mine_icon_history.png',
    text: _t['浏览历史']
  },
  {
    iconPath: '/images/center/mine_icon_video.png',
    text: _t['我的作品'],
    url: '/pages/video/index'
  },
  // {
  //   iconPath: '/images/center/mine_icon_photo.png',
  //   text: _t['我的相册'],
  //   url: '/pages/photo/index'
  // },
  // {
  //   iconPath: '/images/center/mine_icon_line.png',
  //   text: _t['我的路线']
  // },
  {
    iconPath: '/images/center/mine_icon_wallet.png',
    text: _t['我的钱包']
  },
  // {
  //   iconPath: '/images/center/mine_icon_list.png',
  //   text: _t['我的发布']
  // },
  // {
  //   iconPath: '/images/center/mine_icon_push.png',
  //   text: _t['我要发布']
  // },
  {
    iconPath: '/images/center/mine_icon_share.png',
    text: _t['分享赚钱'],
    url: '/pages/my/share/index'
  },
  {
    iconPath: '/images/center/mine_icon_card.png',
    text: '我的卡券',
    // isMember: true //KOL用户享有菜单
  },
  {
    iconPath: '/images/center/mine_icon_store.png',
    text: _t['预约探店'],
    url: '/pages/appointment/index',
    isMember: true //KOL用户享有菜单
  },
  // {
  //   iconPath: '/images/center/_mine_icon_equity.png',
  //   text: _t['权益KOL'],
  //   url: '/pages/legal/index',
  //   isMember: true //KOL用户享有菜单
  // }
];
const menu = [
  {
    iconPath: '/images/center/mine_icon_message.png',
    text: '我的消息'
  },
  {
    iconPath: '/images/center/mine_icon_service.png',
    text: _t['联系客服']
  },
  // {
  //   iconPath: '/images/center/mine_icon_set.png',
  //   text: _t['更多设置']
  // },
  {
    iconPath: '/images/center/mine_icon_suggestion.png',
    text: _t['意见反馈']
}];
Page({

  /**
   * 页面的初始数据
   */
  data: {
    _t: _t,
    userInfo: wx.getStorageSync("userInfo"), //用户信息
    record: record,
    menu: menu,
    orderMenu: [
      {
        icon: '/images/center/icon_order1.png',
        title: '待支付',
        type: 1
      },
      {
        icon: '/images/center/icon_order2.png',
        title: '待使用',
        type: 2
      },
      {
        icon: '/images/center/icon_order3.png',
        title: '已完成',
        type: 3
      },
      // {
      //   icon: '/images/center/icon_order4.png',
      //   title: '已过期',
      //   type: ''
      // },
      {
        icon: '/images/center/icon_order5.png',
        title: _t['退款售后'],
        type: 4
      }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // wx.navigateTo({
    //   url: '/pages/integral/time-coin-task'
    // })
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
    // console.log(this.data.userInfo)
    // this.setData({
    //   userInfo: wx.getStorageSync("userInfo"), //用户信息
    // })
    this.fnGetUserInfo()
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
    // NT.showToast('刷新中...')
    this.onShow()
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
  // 获取个人信息
  fnGetUserInfo() {
    // if(!wx.getStorageSync('userInfo')) return
    // NT.showToast('加载中')
    api.ctGetUserInfo().then(res => {
      this.setData({ userInfo: res })
      const data = Object.assign(wx.getStorageSync('userInfo') || {}, res)
      wx.setStorageSync('userInfo', data)
      this.setData({ userInfo: data })
    }).catch(err => {
      this.setData({ userInfo: '' })
      wx.removeStorageSync('userInfo')
    })
  },
  tapToLogin: function(e) {
    let that = this;
    wx.getSetting({
      success(res) {
        console.log(res)
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
                console.log(err)
                if(err.code==='10019'){ //用户未注册
                  wx.navigateTo({
                    url: '/pages/login/login?openId='+err.data.openId + '&sessionKey=' + err.data.sessionKey,
                    success: function(res) {
                      // 通过eventChannel向被打开页面传送数据
                      res.eventChannel.emit('acceptDataFromOpenerPage', err.data)
                    }
                  })
                }else{
                  NT.showModal(err.message||_t['登录失败！'])
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
  tapToVipCenter() { // 点击进入会员介绍中心
    wx.navigateTo({
      url: '/pages/views/vip-center'
    })
  },
  tapToVipCenter() { // 点击进入会员介绍中心
    wx.navigateTo({
      url: '/pages/views/vip-center'
    })
  },
  tapToCenterDetail() { //进入个人中心详情
    wx.navigateTo({
      url: '/pages/views/center-detail'
    })
  },
  tapMenu(e) { //点击菜单
    const menu = e.currentTarget.dataset.menu
    const url = e.currentTarget.dataset.url
    if (url) return wx.navigateTo({ url})
    // if(menu === '意见反馈'){
    //   wx.navigateTo({
    //     url: '/pages/views/feedback'
    //   })
    // }
    if(menu === '我的消息'){
      wx.navigateTo({
        url: '/pages/message/message'
      })
    }
    if(menu === _t['更多设置']){
      wx.navigateTo({
        url: '/pages/views/more-settings'
      })
    }
    if(menu === _t['浏览历史']){
      wx.navigateTo({
        url: '/pages/views/my-seen'
      })
    }
    if(menu === _t['我的评价']){
      wx.navigateTo({
        url: '/pages/views/all-exp-comment'
      })
    }
    if(menu === _t['我的点赞']){
      wx.navigateTo({
        url: '/pages/upvote/upvote'
      })
    }
    if (menu === '我的卡券'){
      wx.navigateTo({
        url: '/pages/coupon/my-coupon'
      })
    }
    if(menu === _t['我要发布']){
      wx.navigateTo({
        url: '/pages/route/release-route'
      })
    }
    if(menu === _t['我的钱包']){
      wx.navigateTo({
        url: '/pages/wallet/wallet-index'
      })
    }
  },
  // 跳转到时光币商城页面
  tapToTimeCoinStore() {
    wx.navigateTo({
      url: '/pages/integral/time-coin-store'
    })
  },
  // 跳转到个人主页
  tapTopagesPersonalHome() {
    wx.navigateTo({
      url: '/pages/views/personal-home'
    })
  },
  // 跳转到我的关注
  tapToMyFocusKol() {
    wx.navigateTo({
      url: '/pages/my/my-focus-kol'
    })
  },
  // 跳转到我的粉丝
  getFansList() {
    wx.navigateTo({
      url: '/pages/my/my-fans'
    })
  },
  // 跳转到会员中心
  tapToVip() {
    wx.navigateTo({
      url: '/pages/vip/vip-center'
    })
  },
  // 跳转到认证中心
  tapAttestation() {
    wx.navigateTo({
      url: '/pages/attestation/attestation-center'
    })
  },
  // 跳转到我的订单
  tapToMyOrder(e) {
      const type = e.currentTarget.dataset.type
      const title = e.currentTarget.dataset.title
      wx.navigateTo({
        url: type ? `/pages/order/my-order?type=${type}&name=${title}`:`/pages/order/my-order`
      })
  },
  // 跳转我的收藏页面
  tapToMyLike() {
    wx.navigateTo({
      url: '/pages/views/my-like'
    })
  }
})