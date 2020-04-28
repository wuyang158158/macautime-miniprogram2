// pages/tabs/experience.js
import NT from "../../utils/native.js"
import PAGE from "../../utils/config.js"
import api from "../../data/api.js"
import bmap from "../../utils/bmap-wx.min.js"
var base = require('../../i18n/base.js');  //路径可能做相应调整
const _t = base._t().EXPERIENCE; //翻译函数
var city = wx.getStorageSync("locationCity") ? wx.getStorageSync("locationCity").originalData.result.addressComponent.city : '';
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
  sort: [_t['离我最近'],_t['好评优先'],_t['销量最高']]
}
Page({

  /**
   * 页面的初始数据
   */
  data: {
    seachChoseMode: false,
    seachType: seachType,
    distance: '', //已选择的搜索类型
    tag: '',
    sort: '',
    _t: _t,
    navArray: [_t['推荐路线'],_t['精选商家']],
    loadmore: false, //加载更多
    loadmoreLine: false, //暂无更多信息
    noData: false,  //没有数据时
    merchantList: [], // 商家列表
    customLocation: {},
    params: {
      limit: PAGE.limit,  //条数
      start: PAGE.start, //页码
      keyWord: '',  //关键字
      labelId: '',  // 类别ID
      distance: '', // 距离（米）
      lng: '',  // 纬度
      lat: '',  // 经度
      sortType: ''  // 排序类型：暂无
    },
    statusBarHeight: wx.getStorageSync('systemInfo').statusBarHeight - 5,
    menuData: [
      { title: '美食', icon: '/images/index/icon_food.png', url: ''},
      { title: '酒店', icon: '/images/index/icon_hotel.png', url: ''},
      { title: '购物', icon: '/images/index/icon_shopping.png', url: ''},
      { title: '景点路线', icon: '/images/index/icon_attractions.png', url: ''},
      { title: '优惠券', icon: '/images/index/icon_coupons.png', url: ''},
      { title: '出入境', icon: '/images/index/icon_entry.png', url: ''},
    ],
    titleBarFixed: [
      {name: '全部',labelId: ''},
      {name: '综合排序',labelId: ''},
      {name: '离我最近',labelId: '', distance: true},
    ],
    isFixed: false,
    msParams: {
      limit: PAGE.limit,  //条数
      start: PAGE.start, //页码
    }
  },
  onPageScroll(e) {
    this.setData({ isFixed: e.scrollTop > 500 })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: _t['首页']
    });
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
    var customLocation = wx.getStorageSync("customLocation");
    if(customLocation.isFirst){
      delete customLocation.isFirst
      wx.setStorage({
        key:"customLocation",
        data: customLocation
      })
      this.data.params.lng = customLocation.lng  // 纬度
      this.data.params.lat = customLocation.lat  // 经度
      const rgcData = {
        city: customLocation.name ? customLocation.name : city
      }
      this.setData({
        rgcData: rgcData
      })
      this.msSearchHome('onPullDownRefresh')
    }
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
    NT.showToast(_t['加载中...'])
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
    NT.showToast(_t['加载中...'])
    this.msSearchHome('onPullDownRefresh')
  },
  // 智能排序选择
  tapSort(e) {
    const text = e.currentTarget.dataset.text
    var index = e.currentTarget.dataset.index
    this.setData({
      sort:text,
      seachChoseMode: false,
      'params.sortType':  ++index
    })
    NT.showToast(_t['加载中...'])
    this.msSearchHome('onPullDownRefresh')
  },
  // 选择点击的类型
  tapChoseView(e) {
    const id = e.currentTarget.dataset.id
    const detail = e.currentTarget.dataset.detail
    // 精选商家
    if(id === 'special') {
      this.setData({
        sort:'',
        tag:'',
        distance:'',
        choseView: id,
        seachChoseMode: false,
        'params.sortType':  ''
      })
      NT.showToast(_t['加载中...'])
      this.msSelectedMsListHome('onPullDownRefresh')
      return
    }

    if(!detail && this.data.choseView === id) {
      const flag = this.data.seachChoseMode
      this.setData({
        seachChoseMode: !flag,
        choseView: flag?'':id
      })
      return
    }
    this.setData({
      seachChoseMode: true,
      choseView: id
    })
  },
  // 精选商家-首页
  msSelectedMsListHome(source) {
    const that = this
    api.msSelectedMsListHome(this.data.msParams)
    .then(res=>{
      let data = res.data || []
      data.map(item=>{
        if(item.distince) {
          item.distince = item.distince > 1000 ? `${(item.distince / 1000).toFixed(1)}km` : `${item.distince}m`
        }
      })
      var merchantList = source === 'onPullDownRefresh' ? data : this.data.merchantList.concat(data)
      that.setData({
        noData: false,
        merchantList: merchantList,
        total: res.total,
        loadmore: false
      })
      if(!that.data.merchantList.length>0){ //暂无数据
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
      if(!that.data.merchantList.length>0){ //暂无数据
        that.setData({
          noData: true
        })
      }
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
    this.setData({
      choseView: '',
      sort:'',
      tag:'',
      distance:'',
      'params.labelId': '',
      'params.sortType': '',
      seachChoseMode: false,
      loadmoreLine: false,
      loadmore: false
    })
    this.data.params.limit = PAGE.limit
    this.data.params.start = PAGE.start
    this.msSelectMsLabelList(true)
    // this.msSearchHome('onPullDownRefresh')
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if(this.data.choseView !== 'special') {
      if ((this.data.params.start) * this.data.params.limit < this.data.total) {
        wx.showNavigationBarLoading();
        this.setData({
          loadmoreLine: false,
          loadmore: true
        })
        this.data.params.start = this.data.params.start + 1;
        this.msSearchHome()
      }else {
        //暂无更多数据
        NT.hideToast()
        if(this.data.merchantList.length){
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
    } else {
      if ((this.data.msParams.start) * this.data.msParams.limit < this.data.total) {
        wx.showNavigationBarLoading();
        this.setData({
          loadmoreLine: false,
          loadmore: true
        })
        this.data.msParams.start = this.data.msParams.start + 1;
        this.msSelectedMsListHome()
      }else {
        //暂无更多数据
        NT.hideToast()
        if(this.data.merchantList.length){
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
  //搜索事件
  search(e) {
    console.log(e)
  },
  //跳转搜索中心
  tapSearch() {
    wx.navigateTo({
      url: '/pages/views/search-center?source=merchant'
    })
  },
  tapToMapActivity() { // 点击进入活动地图
    // wx.navigateTo({
    //   url: '/pages/views/map-activity'
    // })
    wx.navigateTo({
      url: '/pages/location/seach-location?city=' + city
    })
  },
  // 获取当前定位城市或者商圈
  getLocationCity() {
    // 是否有请求当前地点，否则正常请求
    var locationCity = wx.getStorageSync("locationCity");
    if(locationCity){
      const pois = locationCity.originalData.result.pois[0]
      city = locationCity.originalData.result.addressComponent.city
      const rgcData = {
        business: pois.name,
        distance: pois.distance + 'm',
        city: city
      }
      this.setData({
        rgcData: rgcData,
        customLocation: locationCity.originalData.result.location
      })
      this.data.params.lng = locationCity.originalData.result.location.lng  // 纬度
      this.data.params.lat = locationCity.originalData.result.location.lat  // 经度
      this.msSearchHome('onPullDownRefresh')
      return false;
    }

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
        city: data.originalData.result.addressComponent.city
      }
      this.setData({
        rgcData: rgcData
      })
      this.data.params.lng = data.originalData.result.location.lng  // 纬度
      this.data.params.lat = data.originalData.result.location.lat  // 经度
      this.msSearchHome('onPullDownRefresh')
    }
    BMap.regeocoding({
        success: success
    });  
  },
  //点击tabbbar事件
  tapTitleBar: function(e){
    let name = e.currentTarget.dataset.name,
        labelId = e.currentTarget.dataset.labelid,
        t = this;
        
        // if(name===this.data.name){
        //   return
        // }
        NT.showToast(_t['加载中...'])
        wx.pageScrollTo({
          scrollTop: 0,
          duration: 300
        })
        t.setData({
          choseView: '',
          sort:'',
          tag:'',
          distance:'',
          name:name,
          merchantList: [],
          loadmoreLine: false,
          loadmore: false,
          'params.labelId': labelId
        })
        this.msSearchHome()
        
        
  },

  // 轮播图
  vSwiperChange(e) {
    // console.log(e)
  },
  // 精选商家-按标签类别获取列表
  msSearchHome(source) {
    const that = this
    api.msSearchHome(this.data.params)
    .then(res=>{
      let data = res.data || []
      if(data.length && !this.data.params.labelId){
        that.setData({
          swiperData: data.slice(0,3)
        })
      }
      data.map(item=>{
        if(item.distince) {
          item.distince = item.distince > 1000 ? `${(item.distince / 1000).toFixed(1)}km` : `${item.distince}m`
        }
      })

      var merchantList = source === 'onPullDownRefresh' ? data : this.data.merchantList.concat(data)

      that.setData({
        noData: false,
        merchantList: merchantList,
        total: res.total,
        loadmore: false
      })
      if(!that.data.merchantList.length>0){ //暂无数据
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
      if(!that.data.merchantList.length>0){ //暂无数据
        that.setData({
          noData: true
        })
      }
    })
  },
  // 请求标签
  msSelectMsLabelList(flag) {
    // NT.showToast(_t['加载中...'])
    api.msSelectMsLabelList()
    .then(res=>{
      let data = res.sysLabel || []
      data.map(item => {
        // debugger
        item.name = item.remark
        item.labelId = item.id
        item.ext1 = `${item.ext1}?t=${new Date().getTime()}`
      })
      seachType.tag = titleBar.concat(data)
      this.setData({ titleBar: data, seachType: seachType})
      NT.showToast(_t['加载中...'])
      this.getLocationCity()
    }).catch(err => {
      NT.showModal(err.message||_t['请求失败！'])
    })
  },
  // 跳转到详情
  tapToDetail(e) {
    const ID = e.currentTarget.dataset.id
    const TITLE = e.currentTarget.dataset.title
    wx.navigateTo({
      url: '/pages/views/ac-detail?id=' + ID + '&title=' + TITLE
    })
  }
})