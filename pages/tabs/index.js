// pages/tabs/index.js
import NT from "../../utils/native.js"
import PAGE from "../../utils/config.js"
import api from "../../data/api.js"
import util from "../../utils/util.js"
import bmap from "../../utils/bmap-wx.min.js"

var base = require('../../i18n/base.js');  //路径可能做相应调整
const _t = base._t().INDEX; //翻译函数

Page({
  /**
   * 页面的初始数据
   */
  data: {
    _t: _t,
    userInfo: wx.getStorageSync("userInfo") || {}, //用户信息
    params: { //请求首页推荐列表
      limit: PAGE.limit,
      start: PAGE.start
    },
    total: 0,
    sceneryData: [], //景点周边 数据
    specialData: [], //专访栏目 数据
    noData: false,  //没有数据时
    activeMenu: 1,
    // menuList: [{ title: '景点周边', type: 0},{ title: '金牌KOL', type: 1},{ title: '精选商家', type: 2},{ title: '专访栏目', type: 3}],
    menuList: [{ title: '金牌KOL', type: 1},{ title: _t['精选商家'], type: 2},{ title: _t['专访栏目'], type: 3}],
    loadmore: false, //加载更多
    loadmoreLine: false, //暂无更多信息
    recommend: [], // 首页推荐体验列表
    vImgUrls: [], // 会员限时礼体验列表
    promotions: [], //会员专属列表
    vTimeTitle: '', //会员限时礼标题
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.fnComputeH()
    this.getLocationCity()
    
    wx.setNavigationBarTitle({
      title: _t['首页']
    });
    // 底部tab切换成繁体
    base.setTabBarLang()
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    this.setData({
      userInfo: wx.getStorageSync("userInfo"), //用户信息
    })
  },
  // 切换菜单
  changeTab(e) {
    const index = e.currentTarget.dataset.index
    if(index === this.data.activeMenu) {
      return 
    }
    this.setData({ noData: false,activeMenu: index, 'params.start': PAGE.start })
    this.fnComputeH()
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },
  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    NT.showToast('刷新中...')
    this.setData({
      params: { //请求首页推荐列表
        limit: PAGE.limit,
        start: PAGE.start
      }
    })
    this.getLocationCity()
    this.fnComputeH()
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    // 金牌KOL和景点周边不做分页
    if(this.data.activeMenu === 0 || this.data.activeMenu === 1) return

    if ((this.data.params.start) * this.data.params.limit < this.data.total) {
      wx.showNavigationBarLoading();
      this.setData({
        params:{
          limit: PAGE.limit,
          start: this.data.params.start + 1
        }
      })
      // 拉取数据
      this.fnComputeH()
    }else {
      //暂无更多数据
      NT.hideToast()
    }
  },
  //跳转搜索中心
  tapSearch() {
    wx.navigateTo({
      url: '/pages/views/search-center'
    })
  },
  vSwiperChange(e) { // 会员专属礼物滑动
    const current = e.detail.current
    this.data.vImgUrls.forEach((v,i) => {
      if(Number(i) === current){
        this.setData({
          vTimeTitle: v.vipActivityTitle
        })
      }
    });
  },
  tapToDetail(e) { // 点击查看体验详情
    const ID = e.currentTarget.dataset.id
    const TITLE = e.currentTarget.dataset.title
    wx.navigateTo({
      url: '/pages/views/ac-detail?id=' + ID + '&title=' + TITLE
    })
  },
  tapToVipCenter() { // 点击进入会员介绍中心
    wx.navigateTo({
      url: '/pages/vip/vip-center'
    })
  },
  tapToMapActivity() { // 点击进入活动地图
    // wx.navigateTo({
    //   url: '/pages/views/map-activity'
    // })
    wx.switchTab({
      url: '/pages/tabs/experience'
    })
  },
  // 获取会员专属体验接口
  getPromotions() {
    api.getPromotions()
    .then(res=>{
      this.setData({
        promotions: res
      })
    })
    .catch(err=>{
      console.log(err)
    })
  },
  //会员限时礼
  getLimitTimeGift() {
    let that = this
    api.getLimitTimeGift()
    .then(res=>{
      this.setData({
        vImgUrls: res,
        vTimeTitle: res.length ? res[0].vipActivityTitle : ''
      })
    })
    .catch(err=>{
      console.log(err)
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
      console.log(err)
      NT.showModal(err.codeMsg||err.message||_t['请求失败！'])
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
  // 跳转到kol入驻
  tapToKolEnter() {
    wx.navigateTo({
      url: '/pages/attestation/kol-enter'
    })
  },
  // 获取当前定位城市或者商圈
  getLocationCity() {
    var BMap = new bmap.BMapWX({
      ak: PAGE.baiduMapAk
    });
    var success = data => {
        // console.log(data)
        wx.setStorage({
          key:"locationCity",
          data:data
        })
        const pois = data.originalData.result.pois[0]
        const rgcData = {
          business: pois.name,
          distance: pois.distance + 'm',
        }
        this.setData({
          rgcData: rgcData
        })
    }
    BMap.regeocoding({
        success: success
    });  
  },
  // 景点周边 - 首页 -没有接口
  sceneryNear() {
    wx.hideNavigationBarLoading()
    setTimeout(()=>{
      wx.hideLoading()
      this.setData({
        kolList: [],
        noData: true
      })
    }, 500)
  },
  // 金牌KOL - 首页
  usIsCertificationKol() {
    api.usIsCertificationKol()
      .then(res => {
        this.setData({
          kolList: res,
          noData: !res.length
        })
      }).catch(err => {
        this.setData({ noData: true })
        NT.showModal(err.codeMsg || err.message || _t['请求失败！'])
      })
  },
  // 专访栏目 - 首页
  msSpecialColumn() {
    api.msSpecialColumn(this.data.params).then(res => {
        this.setData({
          specialData: this.data.params.start === 1? res.data: this.data.specialData.concat(res.data),
          total: res.total,
          noData: !res.total
        })
    }).catch(err => {
      this.setData({ noData: true })
      NT.showModal(err.codeMsg || err.message || _t['请求失败！'])
    })
  },
  // 精选商家-首页
  msSelectedMsListHome() {
    api.msSelectedMsListHome(this.data.params)
    .then(res=>{
      var data = res.data || []
      if(data.length) {
        data.map(item=>{
          item.imageUrls =  item.imageUrls ? item.imageUrls.split(',') : ''
        })
      }
      this.setData({
        selecMerchants: this.data.params.start === 1 ? data : this.data.selecMerchants.concat(data),
        total: res.total,
        noData: !res.total
      })
      }).catch(err => {
        this.setData({ noData: true })
        NT.showModal(err.codeMsg || err.message || _t['请求失败！'])
      })
  },
  // 根据type进行对应查询
  fnComputeH() {
    NT.showToast(_t['加载中...'])
    let type = this.data.activeMenu
    switch (type) {
      case 0:
        this.sceneryNear()
        break;
      case 1:
        this.usIsCertificationKol()
        break;
      case 2:
        this.msSelectedMsListHome()
        break;
      case 3:
        this.msSpecialColumn()
        break;
    }
  },
  // 跳转专访详情
  fnLinkTo(e) {
    const id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `/pages/topic/index?id=${id}`,
    })
  }
})