// pages/views/all-exp-comment.js
import api from "../../data/api";
import NT from "../../utils/native.js"
import PAGE from "../../utils/config.js"
import util from "../../utils/util.js"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: wx.getStorageSync("userInfo"), //用户信息
    loadmore: false, //加载更多
    loadmoreLine: false, //暂无更多信息
    onReachBottom: false,

    expComment: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.hideShareMenu()
    var params = options.msId ? { //请求列表
      msId: options.msId,
      pageSize: PAGE.limit,
      pageNo: PAGE.start
    } : {}
    this.setData({
      params: params,
      userInfo: wx.getStorageSync("userInfo"), //用户信息
    })
    NT.showToast('加载中...')

    this.imSelectOrderToEvaluateByOrderId()
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
    var params = this.data.params.msId ? { //请求列表
      msId: this.data.params.msId,
      pageSize: PAGE.limit,
      pageNo: PAGE.start
    } : {}
    this.setData({
      userInfo: wx.getStorageSync("userInfo"),
      params: params,
      loadmoreLine: false,
      loadmore: false,
      onReachBottom: false
    })
    this.imSelectOrderToEvaluateByOrderId('onPullDownRefresh')
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if(!this.data.onReachBottom && this.data.params.msId){
      wx.showNavigationBarLoading();
      this.setData({
        loadmoreLine: false,
        loadmore: true
      })
      this.data.params.pageNo = this.data.params.pageNo + 1;
      this.imSelectOrderToEvaluateByOrderId('onReachBottom')
    }
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage(e) {
    if(e.from === 'button'){
      const dataset = e.target.dataset;
      return {
        path: '/pages/login/login?id=' + dataset.experienceSerial + '&title=' + dataset.activityTitle + '&shareType=acDetail',
        title: dataset.activityTitle,
        imageUrl: dataset.coverurl
      }
    }
    
  },
  imSelectOrderToEvaluateByOrderId(source) { // 请求评论列表
    var apiCommon = this.data.params.msId ? api.selectMsEvaluateScoreList : api.imSelectOrderToEvaluateByOrderId;
    apiCommon(this.data.params)
    .then(res=>{
      var res = this.data.params.msId ? res.data : res
      if(source === 'onReachBottom' && !res.length > 0){
        this.data.onReachBottom = true
        if(this.data.expComment.length){
          this.setData({
            loadmoreLine: true,
            loadmore: false
          })
        }else{
          this.setData({
            loadmore: false
          })
        }
        return
      }
      res.forEach(ele => {
        ele.createTime = util.formatTimeTwo(ele.createTime, 'Y-M-D')
      })
      const data = source === 'onPullDownRefresh' ? res : this.data.expComment.concat(res||[])

      if(this.data.params.msId && data.length){
        data.map(item=>{
          item.imageUrl = item.imEvaluationImage.imageUrl
        })
      }

      this.setData({
        expComment: data,
        loadmoreLine: false,
        loadmore: false,
        noData: false,
      })
      if(!this.data.expComment.length>0){ //暂无数据
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
      if(!this.data.expComment.length>0){ //暂无数据
        this.setData({
          noData: true
        })
      }
    })
  },
  // 预览图片
  previewImage: function(e){
    // console.log(e)
    const url = e.currentTarget.dataset.url
    // const expComment = this.data.expComment
    // let urls = []
    // expComment.map(item => {
    //   if(item.id === comment){
    //     item.imgUrl.map(element=>{
    //       urls.push(element.imgUrl)
    //     })
    //   }
    // });
    // console.log(urls)
    // debugger
    wx.previewImage({
        current: url, // 当前显示图片的http链接
        urls: [url] // 需要预览的图片http链接列表
    })
  }, 
})