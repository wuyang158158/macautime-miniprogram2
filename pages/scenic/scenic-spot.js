// pages/scenic/scenic-spot.js
import NT from "../../utils/native.js"
import PAGE from "../../utils/config.js"
import api from "../../data/api.js"
import util from "../../utils/util.js"
const app = getApp()
const titleBar = [ //顶部标题bar
  {
    name: '全部',
    labelId: ''
  },
  {
    name: '美食',
    labelId: ''
  },
  {
    name: '娱乐',
    labelId: ''
  },
  {
    name: '酒店',
    labelId: ''
  },
  {
    name: '景点',
    labelId: ''
  },
  {
    name: '购物',
    labelId: ''
  }
];
Page({

  /**
   * 页面的初始数据
   */
  data: {
    titleBar: titleBar,
    name: titleBar[0].name, // 选中标题bar,默认第一位

    userInfo: wx.getStorageSync("userInfo"), //用户信息
    params: { //请求订单列表
      limit: PAGE.limit,
      start: PAGE.start,
      paramEntity: {
        userName: wx.getStorageSync("userInfo").userName
      }
    },
    total: 0,
    loadmore: false, //加载更多
    loadmoreLine: false, //暂无更多信息
    result: [
      {
        name: '测试',
        address: '2-3人餐120元，4-5人餐200元',
        // labelRemark: '满100元减10'
      }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      params: { //请求列表
        limit: PAGE.limit,
        start: PAGE.start,
        paramEntity: {
          userName: wx.getStorageSync("userInfo").userName
        }
      },
      userInfo: wx.getStorageSync("userInfo"), //用户信息
    })
    this.getUserRecord()
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
    NT.showToast('刷新中...')
    this.setData({
      userInfo: wx.getStorageSync("userInfo"),
      params: { //请求列表
        limit: PAGE.limit,
        start: PAGE.start,
        paramEntity: {
          userName: wx.getStorageSync("userInfo").userName
        }
      },
      loadmoreLine: false,
      loadmore: false
    })
    this.getUserRecord('onPullDownRefresh')
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if ((this.data.params.start) * this.data.params.limit < this.data.total) {
      wx.showNavigationBarLoading();
      this.setData({
        loadmoreLine: false,
        loadmore: true
      })
      this.data.params.start = this.data.params.start + 1;
      this.getUserRecord()
    }else {
      //暂无更多数据
      NT.hideToast()
      if(this.data.result.length){
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
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  //点击tabbbar事件
  tapTitleBar: function(e){
    let name = e.currentTarget.dataset.name,
        labelId = e.currentTarget.dataset.labelid,
        t = this;
        if(name===this.data.name){
          return
        }
        // NT.showToast('加载中...');
        wx.pageScrollTo({
          scrollTop: 0,
          duration: 300
        })
        t.setData({
          name:name,
          result: [],
          loadmoreLine: false,
          loadmore: false,
          total: 0,
          params: { //请求订单列表
            limit: PAGE.limit,
            start: PAGE.start,
            paramEntity: {
              userName: wx.getStorageSync("userInfo").userName
            }
          }
        })
        // this.getUserRecord()
        
  },
  getUserRecord(source) { // 请求数据
    // NT.showToast('加载中...')
    // api.getUserRecord(this.data.params)
    // .then(res=>{
    //   // console.log(res)
    //   const data = source === 'onPullDownRefresh' ? res.rows : this.data.result.concat(res.rows)
    //   this.setData({
    //     result: data,
    //     total: res.total,
    //     loadmoreLine: false,
    //     loadmore: false,
    //     noData: false,
    //   })
    //   if(!this.data.result.length>0){ //暂无数据
    //     this.setData({
    //       noData: true
    //     })
    //   }
    // })
    // .catch(err=>{
    //   console.log(err)
    //   this.setData({
    //     loadmore: false,
    //   })
    //   if(err.code === '401'){
    //     this.setData({
    //       emptytext: err.codeMsg
    //     })
    //   }else{
    //     NT.showModal(err.codeMsg||err.message||'请求失败！')
    //   }
    //   if(!this.data.result.length>0){ //暂无数据
    //     this.setData({
    //       noData: true
    //     })
    //   }
    // })
  },
})