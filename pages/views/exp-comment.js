// pages/views/exp-comment.js
import api from "../../data/api";
import NT from "../../utils/native.js"
var base = require('../../i18n/base.js');  //路径可能做相应调整
const _t = base._t().EXP_COMMENT; //翻译函数
Page({

  /**
   * 页面的初始数据
   */
  data: {
    _t: _t,
    files: [],
    imageUrl: '',
    grade: 5,
    options: {},
    canSubmit: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: _t['发表评论']
    });
    // 监听expAllMeal事件，获取上一页面通过eventChannel传送到当前页面的数据
    const eventChannel = this.getOpenerEventChannel()
    // 接受上一个页面传递过来的数据
    eventChannel.on('params', data => {
      console.log(data)
      this.setData({
        options:data,
        mycomment: options.comment
      })
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
  // onShareAppMessage: function () {

  // },
  fnChangeGrade(e) {
    const grade = e.currentTarget.dataset.index +1
    this.setData({ grade })
  },
  bindFormSubmit(e) { // 提交意见反馈
    const that = this
    const textarea = e.detail.value.textarea
    if(textarea===''){
      NT.showModal(_t['请填写评价内容，才能发表哦！'])
      return
    }
    NT.showToast(_t['处理中...'])
    const options = this.data.options
    const expCommentForm = {
      content: textarea, //评论内容 
      grade: this.data.grade, //评分 
      orderId: options.orderNumber || '', //订单id
      imageUrl: this.data.imageUrl || '', //封面图
    }
    if(this.data.canSubmit) {
      this.setData({ canSubmit: false })
    } else {
      return false
    }
    api.orderToEvaluate(expCommentForm)
    .then(res=>{
      // if(!this.data.files.length>0){
        NT.toastFn(_t['评论成功！'],1000)
      //   if(this.data.mycomment === 'myexp'){
      //     wx.setStorage({
      //       key:"mycomment",
      //       data:"myexp"
      //     })
      //   }

        that.setData({ canSubmit: true })
        setTimeout(()=>{
          wx.navigateBack({
            delta: 1
          })
        },1000)
      })
      //   return
      // }
      // NT.showToast('处理中...')
      // const uploadImageForm = {
      //   commentId: res.commentId
      // }
      // api.uploadImage(this.data.files, uploadImageForm)
      // .then(res=>{
      //   NT.toastFn('评论成功！',1000)
      //   if(this.data.mycomment === 'myexp'){
      //     wx.setStorage({
      //       key:"mycomment",
      //       data:"myexp"
      //     })
      //   }
      //   setTimeout(()=>{
      //     wx.navigateBack({
      //       delta: 1
      //     })
      //   },1000)
      // })
    .catch(err=>{
      that.setData({ canSubmit: true })
      NT.showModal(err.message||_t['请求失败！'])
    })
    // console.log(textarea)
    // console.log(phone)
    // const params = {
    //   file: this.data.files[1],
    //   file: this.data.files[2],
    //   expId: this.data.options.expId,
    //   comment: textarea
    // }
    // api.uploadImage(this.data.files[0],params)
    // .then(res=>{
    //   console.log(res)
    // })
    // .catch(err=>{
    //   console.log(err)
    // })
  },
  fnDeleteImage() {
    this.setData({ imageUrl: '' })
  },
  chooseImage: function (e) {
    if(this.data.imageUrl) {
      return NT.showModal(_t['限制上传一张图片'])
    }
    var that = this;
    var files = this.data.files;
    wx.chooseImage({
        count: 9-files.length, // 最多可以选择的图片张数，默认9
        sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
        sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
        success: function (res) {
            // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
            NT.showToast(_t['上传中...'])
            // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
            api.userUploadImage(res.tempFilePaths[0]).then(resq => {
                that.setData({ imageUrl: resq.body })
            }).catch(err => {
              NT.showModal(err.message || _t['请求失败！'])
            })
        }
    })
  },
  previewImage: function(){
      wx.previewImage({
          current: this.data.imageUrl, // 当前显示图片的http链接
          urls: [this.data.imageUrl] // 需要预览的图片http链接列表
      })
  }, 
})