import api from "../../data/api";
import NT from "../../utils/native.js"
import PAGE from "../../utils/config.js"
import util from "../../utils/util.js"
var base = require('../../i18n/base.js');  //路径可能做相应调整
const _t = base._t().AC_DETAIL; //翻译函数

// pages/views/ac-detail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    _t: _t,
    isIphoneX: getApp().globalData.isIphoneX, //iphonex适配
    roleFrom: { //评论请求参数
      // msId: 
    }, 
    userInfo: wx.getStorageSync("userInfo"), //用户信息
    acData: '', //详情数据
    markers: [{ //定位信息
      id: 1,
      latitude: 23.099994,
      longitude: 113.324520,
      name: 'T.I.T 创意园',
      iconPath: '/images/detail/map_icon_logo.png',
      width: '52rpx',
      height: '62rpx',
      callout: {
        content: '',
        color: '#FF0000',
        fontSize: 15,
        borderRadius: 1,
        display: 'ALWAYS',
      }
    }],
    recommend: false, //是否有喜欢推荐
    noData: false, //缺省页面
    type: 'video', //媒体展示默认作品
    current: 0,
    direction: 'vertical', // 作品播放默认垂直
    expAllMeal: [], //套餐列表
    seeVideoData: [],
    _index: null, //初始值
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    NT.showToast(_t['加载中...'])
    wx.setNavigationBarTitle({
      title: options.title
    })
    this.setData({
      statusBarHeight: wx.getStorageSync('systemInfo').statusBarHeight - 5,
      options: options,
      msId: options.id,
      recommend: options.recommend,
      roleFrom: { //评论请求参数
        msId: options.id,
        pageSize: 2,
        pageNo: PAGE.start
      }, 
    })
    this.getExpDetails()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.videoContext = wx.createVideoContext('video')
    this.mapCtx = wx.createMapContext('myMap')
    // this.videoContext.play()
    // this.videoContext.pause()
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.setData({
      userInfo: wx.getStorageSync("userInfo")
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
    NT.showToast(_t['加载中...'])
    this.getExpDetails()
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
    const acData = this.data.acData;
    const options = this.data.options;
    return {
      path: '/pages/login/login?id=' + options.id + '&title=' + options.title + '&shareType=acDetail',
      title:options.title,
      imageUrl: acData.msPhotoVoList.length ? acData.msPhotoVoList[0].imageUrl : ''
    }
  },
  //滑动
  swiperHandle(e) {
    const that = this //使用this 下面的视频暂停会有问题
    const current = e.detail.current
    that.setData({ current })
    if(that.data.acData.msMyVideoVo && that.data.acData.msMyVideoVo.videoUrl && current === 0 && this.data._index == null){
      that.videoContext.play()
    } else {
      that.videoContext.pause()
    }
  },
  fnChangeVideoPlay(e){
    this.videoContext.pause()
    var _index = e.currentTarget.dataset.id
    this.setData({
        _index: _index
    })
    //停止正在播放的视频
    var videoContextPrev = wx.createVideoContext(_index + "")
    videoContextPrev.pause();
    setTimeout(function () {
      //将点击视频进行播放
      var videoContext = wx.createVideoContext(_index + "")
      videoContext.play();
    }, 500)
  },
  // 顶部视频播放时停止其他视频播放
  bindplay() {
    this.setData({
      _index: null
    })
  },
  // 作品进入和退出全屏时触发
  bindfullscreenchange(e) {
    const direction = e.detail.direction
    this.setData({
      direction: direction
    })
  },
  //获取详情数据
  getExpDetails() {
    api.msSelectedMsDetailsByMsId({msId:this.data.msId})
    .then(res=>{
      // 是否存在商家信息
      if(!res.msBaseInfo) return this.setData({noData: {text: res.msg, type: 'no-data'}})
      const data = res
      const location = { //定位信息
        latitude: data.msBaseInfo.lat,
        longitude: data.msBaseInfo.lng,
        name: data.msBaseInfo.name
      }
      if(data.msIntroductionVo && data.msIntroductionVo.text){
        var text = data.msIntroductionVo.text.replace(/##/gi, '=')
        text = text.replace(/\<img/gi, '<img style="border-radius: 8px;width:100%;" ')
        data.msIntroductionVo.text =  text
      }
      data.markers = this.data.markers ? [Object.assign(this.data.markers[0],location)] : ''

      data.msMenuVoList ? data.msMenuVoList.map(item=>{
        item.imageUrlArray = item.imageUrl.split(',')
      }) : ''
      data.msBaseInfo.openDate = util.transleteDate(data.msBaseInfo.openDate || '')

      // 优惠券时间戳转换
      if(data.discountsCardList) {
        data.discountsCardList.map(item=>{
          item.endTimeStr = util.formatTimeTwo(item.endTime,'Y-M-D')
        })
      }
      var isVideo = wx.getStorageSync('isVideo')
      data.msInterviewVideoVoList = isVideo ? data.msInterviewVideoVoList : ''
      data.msMyVideoVo = isVideo ? data.msMyVideoVo : ''
      this.setData({
        acData: data
      })
      this.selectMsEvaluateScoreList() //评论列表
      //获取视频轮播高度
      if(data.msInterviewVideoVoList.length){
        this.getViewHeight('item-video-0')
      }
    })
    .catch(err=>{
      this.setData({
        noData: {
          text: err.message ||_t['请求失败！'],
          type: err.code === '00'? 'no-network' : 'no-data'
        }
      })
    })
  },
  //打开地图
  openLocation() {
    const markers = this.data.acData.markers[0]
    wx.openLocation({
      latitude: markers.latitude,
      longitude: markers.longitude,
      name: markers.addr ||this.data.acData.msBaseInfo.address || '',
      scale: 15
    })
  },
  tapToDetail(e) {
    const ID = e.currentTarget.dataset.id
    const TITLE = e.currentTarget.dataset.title
    wx.navigateTo({
      url: '/pages/views/ac-detail?id=' + ID + '&title=' + TITLE + '&recommend=true'
    })
  },
  //切换展示媒体
  tapMedia(e) {
    const current = Number(e.currentTarget.dataset.current)
    this.setData({
      current: current
    })
  },
  //预览图片
  tapPreviewImage(e){
    const item = e.currentTarget.dataset.item
    var msPhotoVoList = this.data.acData.msPhotoVoList
    var urls = []
    msPhotoVoList.map(item=>{
      urls.push(item.imageUrl)
    })
    wx.previewImage({
      current: item, // 当前显示图片的http链接
      urls: urls // 需要预览的图片http链接列表
    })
  },
  tapToLogin(e) {
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
  // 点击喜欢
  tapLike() {
    const type = this.data.acData.isMarK
    NT.showToast(_t['处理中...'])
    if(type) {
      this.fnCancelCollect({
        msId: this.data.acData.msId,
        type: 3
      })
    } else {
      this.fnInsertCollect({
        msId: this.data.acData.msId,
        type: 3
      })
    }
  },
  // 收藏
  fnInsertCollect(likeForm) {
    api.collectInsert(likeForm)
    .then(res=>{
      this.setData({
        'acData.isMarK': true
      })
      NT.toastFn('已收藏！',1000)
    })
    .catch(err=>{
      NT.showModal(err.message||_t['请求失败！'])
    })
  },
  // 取消收藏
  fnCancelCollect(likeForm) {
    api.collectCancel(likeForm)
    .then(res=>{
      this.setData({
        'acData.isMarK': false
      })
      NT.toastFn( '已取消！',1000)
    })
    .catch(err=>{
      NT.showModal(err.message||_t['请求失败！'])
    })
  },
  // 关闭half-screen-dialog
  closeDialog(e){
    this.setData({
      istrue: false
    })
    if(this.data.acData.videoUrl&&this.data.current===0){
      this.videoContext.play()
    }
  },
  //点击查看套餐详情
  tapShowMealDetail(e){
    const id = e.currentTarget.dataset.id
    const msMenuVoList = this.data.acData.msMenuVoList
    msMenuVoList.map(item=>{
      if(item.id === id){
        wx.navigateTo({
          url: '/pages/views/set-meal?id=' + id,
          success: function(result) {
            // 通过eventChannel向被打开页面传送数据
            result.eventChannel.emit('params', msMenuVoList)
          }
        })
      }
    })
    // NT.showToast(_t['加载中...'])
    // this.getMealDetails(mealserial)
  },
  // 跳转到套餐页面
  tapToSetMeal(e) {
    const that = this
    const expAllMeal = this.data.expAllMeal
    const acData = this.data.acData
    const params = {
      expAllMeal: expAllMeal, //套餐
      acData: acData, // 详情相关数据
    }
    const mealSerial = e.currentTarget.dataset.mealserial ? e.currentTarget.dataset.mealserial : expAllMeal[0].mealSerial
    wx.navigateTo({
      url: '/pages/views/set-meal?mealSerial=' + mealSerial,
      success: function(result) {
        // 通过eventChannel向被打开页面传送数据
        result.eventChannel.emit('params', params)
      }
    })
  },
  // 领取体验
  tapGetEx() {
    NT.showToast(_t['处理中...'])
    const acData = this.data.acData
    const expAllMeal = this.data.expAllMeal
    const saveDisCountOrderForm = {
      expMealSerial: expAllMeal[0].mealSerial,
      expSerial: acData.experienceSerial
    }
    api.saveDisCountOrder(saveDisCountOrderForm)
    .then(res=>{
      acData.isBuyed = true;
      this.setData({
        acData: acData
      })
      NT.showModalPromise(_t['领取成功，是否查看订单详情？'])
        .then(()=>{
          wx.navigateTo({
            url: '/pages/views/ticket-detail?orderCode=' + res + '&userName=' + this.data.userInfo.userName
          })
        })
        .catch(()=>{

        })
    })
    .catch(err=>{
      NT.showModal(err.message||_t['请求失败！'])
    })
  },
  //点击查看全部评论
  tapToAllExpComment() {
    wx.navigateTo({
      url: '/pages/views/all-exp-comment?msId=' + this.data.msId,
    })
  },
  // 预览图片
  previewImage: function(e){
    const url = e.currentTarget.dataset.url
    wx.previewImage({
        current: url, // 当前显示图片的http链接
        urls: [url] // 需要预览的图片http链接列表
    })
  }, 
  // 领券中心
  // tapGetDiscounts(e) {
  //   if(!this.data.userInfo.level){ //如果没有开通会员，则提示开通会员再领取
  //     wx.showModal({
  //       title: '提示',
  //       content: _t['优惠券仅供时光卡会员用户使用，现在开通，领取优惠券，还能享受更多会员增值优惠及特权。'],
  //       cancelText: '再看看',
  //       cancelColor: '#999999',
  //       confirmText: _t['开通会员'],
  //       confirmColor: '#00A653',
  //       success (res) {
  //         if (res.confirm) {
  //           wx.navigateTo({
  //             url: '/pages/vip/vip-center'
  //           })
  //         }
  //       }
  //     })
  //   }else{
  //     const that = this
  //     const id = e.currentTarget.dataset.id
  //     const query = {
  //       userId: that.data.userInfo.userId, //用户名
  //       msId: that.data.msId, //商家Id
  //       id: id, //优惠卷ID
  //       endTime: e.currentTarget.dataset.endtime.toString()
  //     }
  //     NT.showToast(_t['处理中...'])
  //     api.poInsertDiscountOrder(query)
  //     .then(res=>{
  //       NT.toastFn('领取成功！',1000)
  //       setTimeout(()=>{},1000)
  //     })
  //     .catch(err=>{
  //       NT.showModal(err.codeMsg||err.message||_t['请求失败！'])
  //     })
  //   }
  // },

  // 跳转到领券详情
  tapTopagesGetTicketDetail(e) {
    const id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/views/get-ticket-detail?id=' + id
    })
  },
  // 获取评价列表
  selectMsEvaluateScoreList() {
    api.selectMsEvaluateScoreList(this.data.roleFrom)
    .then(res=>{
      var evaluateScore = res.data || []
      // 评论时间
      // debugger
      if(evaluateScore){
        evaluateScore.map(item=>{
          item.createTimeStr = util.formatTimeTwo(item.createTime,'Y年M月D日')
        })
      }
      this.setData({
        evaluateScore: evaluateScore,
        total: res.total
      })
    })
  },
  // 获取view高度
  getViewHeight(id) {
    var that = this;
    var query = wx.createSelectorQuery();
    query.select('#' + id).boundingClientRect(function (rect) {
      that.setData({
        height: rect.height
      })
    }).exec();
  },
  // 视频轮播
  bindChangeVideo(e) {
    const current = e.detail.current
    const id = 'item-video-' + current
    this.getViewHeight(id)
    
    // this.videoContext.pause()
    // var _index = current
    this.setData({
        _index: null
    })
    // //停止正在播放的视频
    // var videoContextPrev = wx.createVideoContext(_index + "")
    // videoContextPrev.pause();
    // setTimeout(function () {
    //   //将点击视频进行播放
    //   var videoContext = wx.createVideoContext(_index + "")
    //   videoContext.play();
    // }, 500)
  },
  // 返回上一页
  tapToBack() {
    let pages = getCurrentPages()
    if(pages.length === 1) {
      wx.switchTab({
        url: '/pages/tabs/index',
      })
    } else {
      NT.navigateBackDelta(1)
    }
  }
})