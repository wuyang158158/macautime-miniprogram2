// pages/views/search-center.js
import NT from "../../utils/native.js"
import PAGE from "../../utils/config.js"
import api from "../../data/api.js"
import util from "../../utils/util.js"
var menuData = [
  '商家','用户'
];
var titleBar = [ //顶部标题bar
  {
    name: '全部',
    labelId: ''
  }
];
var seachType = {
  distance: ['1km','5km','10km','全城'],
  // tag: ['美食','娱乐','酒店','景点','购物'],
  tag: titleBar,
  sort: ['好评优先','离我最近','最新上市','最高热度','网红聚集地']
}
const locationCity = wx.getStorageSync("locationCity")
const location = locationCity ? locationCity.originalData.result.location : ''
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: wx.getStorageSync("userInfo"), //用户信息
    params: { //请求首页推荐列表
      limit: PAGE.limit,  //条数
      start: PAGE.start, //页码
      keyWord: '',  //关键字
      labelId: '',  // 类别ID
      distance: '', // 距离（米）
      lng: location.lng,  // 纬度
      lat: location.lat,  // 经度
      sortType: ''  // 排序类型：暂无
    },
    total: 0,
    merchantTotal: 0,
    loadmore: false, //加载更多
    loadmoreLine: false, //暂无更多信息
    noData: false,  //没有数据时
    recommend: [], // 首页推荐体验列表

    menuData: menuData,
    menuDataIndex: 0,
    merchantParams: { //搜索用户请求信息
      limit: PAGE.limit,
      start: PAGE.start,
      nickName: ''
    },
    result: [],

    seachChoseMode: false,
    seachType: seachType,
    distance: '', //已选择的搜索类型
    tag: '',
    sort: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // NT.showToast('加载中...')
    this.setData({
      userInfo: wx.getStorageSync("userInfo"), //用户信息
      source: options.source, // 来源，  首页还是推荐商家，无参数即首页，merchant为推荐商家
    })
    this.hostSearch()
    this.msSelectMsLabelList()
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
   
  onPullDownRefresh: function () {
    NT.showToast('刷新中...')
    this.setData({
      params: { //请求首页推荐列表
        limit: PAGE.limit,
        start: PAGE.start,
        paramEntity: {
          activityTitle: this.data.params.keyWord
        }
      },
      loadmoreLine: false,
      loadmore: false
    })
    this.msSearchHome('onPullDownRefresh')
  },
  */

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if(this.data.menuDataIndex === 0){
      if ((this.data.params.start) * this.data.params.limit < this.data.total) {
        wx.showNavigationBarLoading();
        this.setData({
          loadmoreLine: false,
          loadmore: true
        })
        this.data.params.limit = PAGE.limit
        this.data.params.start = this.data.params.start + 1
        // this.setData({
        //   params:{ //请求首页推荐列表
        //     limit: PAGE.limit,
        //     start: this.data.params.start + 1,
        //     keyWord: this.data.params.keyWord
        //   }
        // })
        this.msSearchHome()
      }else {
        //暂无更多数据
        NT.hideToast()
        if(this.data.recommend.length){
          this.setData({
            loadmoreLine: true,
            loadmore: false
          })
        }else{
          this.setData({
            loadmore: false
          })
        }
      } 
    }
    if(this.data.menuDataIndex === 1){
      if ((this.data.merchantParams.start) * this.data.merchantParams.limit < this.data.merchantTotal) {
        wx.showNavigationBarLoading();
        this.setData({
          loadmoreLine: false,
          loadmore: true
        })
        this.setData({
          merchantParams:{ //请求首页推荐列表
            limit: PAGE.limit,
            start: this.data.merchantParams.start + 1,
            keyWord: this.data.merchantParams.keyWord
          }
        })
        this.getUserByName()
      }else {
        //暂无更多数据
        NT.hideToast()
        if(this.data.recommend.length){
          this.setData({
            loadmoreLine: true,
            loadmore: false
          })
        }else{
          this.setData({
            loadmore: false
          })
        }
      } 
    }
  },

  /**
   * 用户点击右上角分享
   */
  // onShareAppMessage: function () {

  // }
  tapHostSearch(e) {
    const content = e.currentTarget.dataset.content
    this.setData({
      inputVal: content
    })
    this.data.params.keyWord = content
    if(this.data.menuDataIndex === 0){
      this.msSearchHome('onPullDownRefresh')
    }
    if(this.data.menuDataIndex === 1){
      this.getUserByName('onPullDownRefresh')
    }
  },
  // 搜索
  search(e) {
    console.log(e)
    if(e.detail){
      // this.getLikeage(e.detail)
      // 商家搜索
      this.data.params.keyWord = e.detail
      if(this.data.menuDataIndex === 0){
        this.msSearchHome('onPullDownRefresh')
      }
      if(this.data.menuDataIndex === 1){
        this.getUserByName('onPullDownRefresh')
      }
    }else{
      this.setData({
        associativeWords: [],
        recommend: [],
        noData: false
      })
    }
    
  },
  bindconfirm(e) {
    if(e.detail){
      this.setData({
        associativeWords: []
      })
      this.data.params.keyWord = e.detail
      if(this.data.menuDataIndex === 0){
        this.msSearchHome('onPullDownRefresh')
      }
      if(this.data.menuDataIndex === 1){
        this.getUserByName('onPullDownRefresh')
      }
    }
    
  },
  // 联想词
  getLikeage(e) {
    NT.showToast('处理中...')
    api.getLikeage({name: e})
    .then(res=>{
      console.log(res)
      if(!res.length>0){
        this.data.params.keyWord = e
        if(this.data.menuDataIndex === 0){
          this.msSearchHome('onPullDownRefresh')
        }
        if(this.data.menuDataIndex === 1){
          this.getUserByName('onPullDownRefresh')
        }
      }else{
        res.map(item=>{
          const name = item.name
          if(name.indexOf(e) !== -1){
            const content = name.replace(new RegExp(e,'g'),'<span class="c-00A653">'+e+'</span>')
            item.content = '<p>' + content + '</p>'
          }
        })
        this.setData({
          associativeWords: res,
          recommend: [],
          noData: false
        })
      }
    })
    .catch(err=>{
      console.log(err)
    })
  },
  // 热搜词请求
  hostSearch() {
    this.setData({
      historyRecord: wx.getStorageSync('historyRecord') || []
    })
    // api.hostSearch()
    // .then(res=>{
    //   // console.log(res)
    //   this.setData({
    //     hostSearch: res
    //   })
    // })
    // .catch(err=>{
    //   console.log(err)
    // })
  },
  // 清空搜索历史记录
  tapClearRecord() {
    wx.removeStorageSync('historyRecord')
    this.setData({
      historyRecord: []
    })
  },
  //缓存处理
  historyRecordStorage() {
    const keyWord = this.data.params.keyWord
    if(!keyWord){
      return
    }
    var historyRecord = wx.getStorageSync('historyRecord') || []
    //去重
    if(historyRecord.length){
      historyRecord.map((item,index)=>{
        if(item===keyWord){
          historyRecord.splice(index,1)
        }
      })
    }
    //超过8个处理
    if(historyRecord.length>7){
      historyRecord = historyRecord.slice(0,7)
    }
    historyRecord.unshift(keyWord)
    wx.setStorage({
      key:"historyRecord",
      data: historyRecord
    })
    this.setData({
      historyRecord: historyRecord
    })
  },
  //获取推荐列表
  msSearchHome(source) {
    let that = this
    NT.showToast('处理中...')
    //历史记录处理
    this.historyRecordStorage()
    api.msSearchHome(that.data.params)
    .then(res=>{
      let data = res.data || []
      // data.map(item => {
      //   // debugger
      //   item.stime = util.formatTimeTwo(item.stimeStr,'Y/M/D')
      //   item.activityTag = item.activityTag ? item.activityTag.split(',')[0] : ''
      // })
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
      NT.showModal(err.codeMsg||err.message||'请求失败！')
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
  // 点击菜单切换
  tapSMenuItem(e) {
    const index = e.currentTarget.dataset.index;

    this.setData({
      menuDataIndex: index
    })
    // wx.pageScrollTo({
    //   scrollTop: 0,
    //   duration: 300
    // })
    // this.setData({
    //   recommend: [],
    //   loadmoreLine: false,
    //   loadmore: false
    // })
    // this.data.params = { //请求订单列表
    //   limit: PAGE.limit,
    //   start: PAGE.start,
    //   keyWord: this.data.params.keyWord
    // };
    // this.getOrderListPersonal()
    if(index === 0){ //商家搜索
      // this.msSearchHome()
    }
    if(index === 1 && !this.data.result.length) { //请求用户记录
      this.getUserByName()
    }
  },
  getUserByName(source) { // 请求用户记录
    NT.showToast('加载中...')
    this.data.merchantParams.nickName = this.data.params.keyWord
    api.getUserByName(this.data.merchantParams)
    .then(res=>{
      // console.log(res)
      const data = source === 'onPullDownRefresh' ? res.data : this.data.result.concat(res.data)
      this.setData({
        result: data,
        merchantTotal: res.total,
        loadmoreLine: false,
        loadmore: false,
        noData: false,
      })
      if(!this.data.result.length>0){ //暂无数据
        this.setData({
          noData: true
        })
      }
    })
    .catch(err=>{
      console.log(err)
      this.setData({
        loadmore: false,
      })
      if(err.code === '401'){
        this.setData({
          emptytext: err.codeMsg
        })
      }else{
        NT.showModal(err.codeMsg||err.message||'请求失败！')
      }
      if(!this.data.result.length>0){ //暂无数据
        this.setData({
          noData: true
        })
      }
    })
  },
  // 关注用户
  tapUsInsertFocus(e) {
    NT.showToast('处理中...')
    const fAccountId = e.currentTarget.dataset.faccountid
    const isFocus = e.currentTarget.dataset.isfocus
    api.usInsertFocus({fAccountId:fAccountId, isFocus: isFocus})
    .then(res=>{
      NT.toastFn(isFocus?'已取消！': '关注成功！')
      const result = this.data.result
      result.map(item=>{
        if(item.accountId === fAccountId){
          item.isFocus = !isFocus
        }
      })
      this.setData({
        result: result
      })
    })
    .catch(err=>{
      NT.showModal(err.message||'请求失败！')
    })
  },
  // 选择点击的类型
  tapChoseView(e) {
    const id = e.currentTarget.dataset.id
    this.setData({
      seachChoseMode: true,
      choseView: id
    })
  },
  // 选择距离
  tapDistance(e) {
    const text = e.currentTarget.dataset.text
    if(text === '全城'){
      this.data.params.distance = ''
    }else{
      this.data.params.distance = Number(text.split('km')[0]) * 1000
    }
    this.setData({
      distance:text,
      seachChoseMode: false
    })
    this.msSearchHome('onPullDownRefresh')
  },
  // 标签选择
  tapTag(e) {
    const text = e.currentTarget.dataset.text
    this.data.params.labelId = e.currentTarget.dataset.id
    this.setData({
      tag:text,
      seachChoseMode: false
    })
    this.msSearchHome('onPullDownRefresh')
  },
  // 智能排序选择
  tapSort(e) {
    const text = e.currentTarget.dataset.text
    this.setData({
      sort:text,
      seachChoseMode: false
    })
  },
  tapHide() {
    this.setData({
      seachChoseMode: false
    })
  },
  // 请求标签
  msSelectMsLabelList() {
    api.msSelectMsLabelList()
    .then(res=>{
      let data = res.sysLabel || []
      data.map(item => {
        // debugger
        item.name = item.remark
        item.labelId = item.id
      })
      seachType.tag = titleBar.concat(data)
      this.setData({
        seachType: seachType
      })
    })
    .catch(err=>{
      console.log(err)
    })
  }
})