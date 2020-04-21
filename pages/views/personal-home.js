// pages/views/personal-home.js
import NT from "../../utils/native.js"
import PAGE from "../../utils/config.js"
import api from "../../data/api.js"
import util from "../../utils/util.js"
var base = require('../../i18n/base.js');  //路径可能做相应调整
const _t = base._t().PERSONAL_HOME; //翻译函数
Page({

  /**
   * 页面的初始数据
   */
  data: {
    _t: _t,
    navArray: [
      {
        name: _t['相册'],
        number: 0,
        selected: true
      },
      {
        name: _t['作品'],
        number: 12,
        selected: false
      },
      // {
      //   name: '已发布',
      //   number: 8,
      //   selected: false
      // }
    ],
    index: 0,
    params: { //请求首页推荐列表
      limit: PAGE.limit,
      start: PAGE.start,
      paramEntity: {}
    },
    total: 0,
    loadmore: false, //加载更多
    loadmoreLine: true, //暂无更多信息
    noData1: true,  //没有相册数据时
    noData2: false,  //没有作品数据时
    recommend: [], // 首页推荐体验列表
    userInfo: {},
    photoList: [],
    videoList: [],
    usSysLabel: [],
    userId: '',
    isMine: false,
    isFocus: false,
    isLogin: wx.getStorageSync('userInfo'),
    options: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: _t['个人主页']
    });
    if(options && options.id) {
      this.setData({ options: options, userId: options.id,isMine: options.id === wx.getStorageSync('userInfo').userId})
    } else {
      this.setData({isMine: true })
    }
  },
  // 关注或者取消用户
  tapUsInsertFocus() {
    NT.showToast(_t['处理中...'])
    const isFocus = this.data.isFocus
    let fans = parseInt(this.data.userInfo.fans) ||0
    api.usInsertFocus({fAccountId:this.data.userId, isFocus: isFocus})
    .then(res=>{
      this.setData({ isFocus: !isFocus, 'userInfo.fans': isFocus? --fans : ++fans })
    })
    .catch(err=>{
      NT.showModal(err.message||_t['处理中...'])
    })
  },
  tapToLogin: function(e) {
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
                  isLogin: true
                })
                wx.setStorage({
                  key:"userInfo",
                  data:res
                })
                that.tapUsInsertFocus()
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
  // 获取我的信息
  fnGetMyVideoInfo() {
    NT.showToast(_t['加载中...'])
    api.ctMyVideoc({ userId: this.data.userId }).then(res => {
      res.vobaseInfo.forEach(ele => {
        ele.contentUrl = encodeURIComponent(ele.contentUrl)
      })
      this.setData({ isFocus: res.isfocus && res.isfocus.isfocus || false,usSysLabel: res.usSysLabel,userInfo: res.usBaseInfo,videoList: res.vobaseInfo, noData2:!res.vobaseInfo.length })
    }).catch( err => {
      this.setData({ noData2: true, noData1: true })
      NT.showModal(err.message || _t['请求失败！'])
    })
  },
  // 获取我的相册
  fnGetMyphoto() {
    this.setData({ photoList: [], noData: true })
    // api.ctMyVideo().then(res => {
    //   this.setData({ videoList: res.vobaseInfo, noData:!res.vobaseInfo.length })
    // }).catch( err => {
    //   NT.showModal(err.codeMsg || err.message || '请求失败！')
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
    this.fnGetMyVideoInfo()
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
  fnLinkInfos() {
    wx.navigateTo({
      url: '/pages/my/editInfo/index',
    })
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    this.fnGetMyVideoInfo()
    // NT.showToast('刷新中...')
    // this.setData({
    //   params: { //请求首页推荐列表
    //     limit: PAGE.limit,
    //     start: PAGE.start,
    //     paramEntity: {}
    //   },
    //   loadmoreLine: false,
    //   loadmore: false
    // })
    // this.getExperience('onPullDownRefresh')
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    // NT.showToast('加载中...')
    // if ((this.data.params.start) * this.data.params.limit < this.data.total) {
    //   wx.showNavigationBarLoading();
    //   this.setData({
    //     loadmoreLine: false,
    //     loadmore: true
    //   })
    //   this.setData({
    //     params:{ //请求首页推荐列表
    //       limit: PAGE.limit,
    //       start: this.data.params.start + 1,
    //       paramEntity: {}
    //     }
    //   })
    //   this.getExperience()
    // }else {
    //   //暂无更多数据
    //   NT.hideToast()
    //   if(this.data.recommend.length){
    //     this.setData({
    //       loadmoreLine: true,
    //       loadmore: false
    //     })
    //   }else{
    //     this.setData({
    //       loadmore: false
    //     })
    //   }
    // }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: `${this.data.userInfo.nickName}的` + _t['个人主页'],
      path: `/pages/views/personal-home?id=${this.data.userInfo.accountId}`,
      imageUrl: `${this.data.userInfo.headBackIco}`
    }
  },
  // 切换菜单栏
  tapNavArray(e) {
    const index = e.currentTarget.dataset.index
    const navArray = this.data.navArray
    if(index===this.data.index){
      return false;
    }
    navArray.map((item,i)=>{
      i===index ? item.selected = true : item.selected = false
    })
    this.setData({
      navArray: navArray,
      index: index
    })
  },
  //获取推荐列表
  getExperience(source) {
    let that = this
    api.getExperience(that.data.params)
    .then(res=>{
      let data = res.rows || []
      data.map(item => {
        // debugger
        item.stime = util.formatTimeTwo(item.stimeStr,'Y/M/D')
        item.activityTag = item.activityTag ? item.activityTag.split(',')[0] : ''
      })
      that.setData({
        noData: false,
        recommend: source === 'onPullDownRefresh' ? data : this.data.recommend.concat(data),
        total: res.total,
        loadmore: false
      })
      if(!that.data.recommend.length>0){ //暂无数据
        that.setData({
          noData: true
        })
      }
    })
    .catch(err=>{
      NT.showModal(err.message||_t['请求失败！'])
      this.setData({
        loadmore: false,
      })
      if(!that.data.recommend.length>0){ //暂无数据
        that.setData({
          noData: true
        })
      }
    })
  },
})