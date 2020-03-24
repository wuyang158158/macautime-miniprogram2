// pages/legal/refund.js
import api from "../../data/api";
import NT from "../../utils/native.js"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    array: ['中国银行', '工商银行', '招商银行', '建设银行', '农业银行', '平安银行'],
    typeName: '',
    date: '',
    imgList: []
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

  },
  // 上传图片
  chooseImage: function (e) {
    var that = this;
    const imgList = this.data.imgList
    wx.chooseImage({
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        that.setData({ imgList: imgList.concat(res.tempFilePaths)})
        // NT.showToast('上传中...')
        // // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        // api.userUploadImage(res.tempFilePaths[0]).then(resq => {
        //     // that.setData({ headBackIco: resq.body })
        // }).catch(err => {
        //   NT.showModal(err.codeMsg || err.message || '请求失败！')
        // })
      }
    })
  },
  // 删除图片
  fnDeleteImg(e) {
    const index = e.currentTarget.dataset.index
    const imgList = this.data.imgList
    imgList.splice(index, 1)
    this.setData({ imgList: imgList })
  },
  bindPickerChange: function (e) {
    this.setData({
      typeName: e.detail.value
    })
  },
  // 触发时间选择器
  bindDateChange(result) {
    this.setData({ date: result.detail.value })
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

  }
})