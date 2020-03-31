// pages/cropper/cropper.js
import NT from "../../utils/native.js"
import api from "../../data/api.js"
import WeCropper from '../../utils/cropper.js';

var base = require('../../i18n/base.js');
const _t = base._t().CROPPER

//设备参数
const device = wx.getStorageSync('systemInfo')
const windowWidth = device.windowWidth;
const windowHeight = device.windowHeight;
const width = windowWidth;
const height = windowHeight - 50;

//默认宽高
var insWidth = 351 * 0.8;
var insHeight = 468 * 0.8;

//获取本地图片的路径
var pathSrc = null;

//从上传身份证页面带过来的图片路径
var tempPhoto = null;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    _t: _t,
    isIphoneX: getApp().globalData.isIphoneX, //iphonex适配
    cropperOpt: {
      id: 'cropper',
      width,
      height,
      scale: 2.5,
      zoom: 8,
      router: 45,
      cut: {
        x: (width - insWidth) / 2,
        y: (height - insHeight) / 2,
        width: insWidth,
        height: insHeight
      }
    }
  },
  touchStart (e) {
    this.wecropper.touchStart(e)
  },
  touchMove (e) {
    this.wecropper.touchMove(e)
  },
  touchEnd (e) {
    this.wecropper.touchEnd(e)
  },
  toRouterTap (e) {
    this.wecropper.touchRouter(e)
  },
  toImagesTap (e) {
    //选择图片
    wxChooseImage(this);
  },
  getCropperImage () {
    if(pathSrc==null){
      NT.showModal(_t['请先选择图片']);
      return;
    }
    var opt = {
      quality: 10,
    };
    let cropperInsWidth = insWidth;
    let cropperInsHeight = insHeight;
    // pxToRpx = 750 / cropperInsWidth;
    // cropperInsWidth = insWidth * pxToRpx;
    // cropperInsHeight = insHeight * pxToRpx;
    cropperInsWidth = insWidth * 2;
    cropperInsHeight = insHeight * 2;
    this.wecropper.getCropperImage(opt,(src) => {
      if (src) {
        //  获取裁剪图片资源后，上传图片
        var data = {
            path: src,
            x: 0,
            y: 0,
            width: cropperInsWidth,
            height: cropperInsHeight,
            rotate: 0,
            scaleX: 1,
            scaleY: 1,
            naturalWidth: cropperInsWidth,
            naturalHeight: cropperInsHeight
        };
        console.log(data)
        // wx.previewImage({
        //   current: data.path, // 当前显示图片的http链接
        //   urls: [data.path] // 需要预览的图片http链接列表
        // })
        NT.showToast(_t['上传中']+'...')
        api.userUploadImage(data.path)
          .then(res => {
            console.log(res.body)
            wx.setStorageSync('accordingImage', res.body);
            NT.navigateBackDelta(1);
        })
        .catch(err=>{
          console.log(err)
        })
      } else {
        NT.showModal(_t['获取图片地址失败，请稍后重试']);
      }
    })
  },
  uploadTap () {
    const self = this
    //选择图片
    // wxChooseImage(self);
  },
  toBackTap () {
    //点击取消返回上一页
    NT.navigateBackDelta(1);
  },
  returnTap() {
    //点击还原
    this.wecropper.pushOrign(pathSrc);
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: _t['图片裁剪']
    });
    // const { cropperOpt } = this.data

    const cropperOpt = {
      id: 'cropper',
      width,
      height,
      scale: 2.5,
      zoom: 8,
      cut: {
        x: (width - insWidth) / 2,
        y: (height - insHeight) / 2,
        width: insWidth,
        height: insHeight
      }
    }

    new WeCropper(cropperOpt)
      .on('ready', (ctx) => {
        console.log(`wecropper is ready for work!`)
      })
      .on('beforeImageLoad', (ctx) => {
        console.log(`before picture loaded, i can do something`)
        console.log(`current canvas context:`, ctx)
        // NT.showToast('上传中');
      })
      .on('imageLoad', (ctx) => {
        console.log(`picture loaded`)
        console.log(`current canvas context:`, ctx)
        NT.hideToast()
      })
      .on('beforeDraw', (ctx, instance) => {
        console.log(`before canvas draw,i can do something`)
        console.log(`current canvas context:`, ctx)
      })
      .updateCanvas()
      if(tempPhoto == null) {
          //选择图片
          wxChooseImage(this);
      } else {
            pathSrc = tempPhoto;
            this.wecropper.pushOrign(pathSrc);
      }
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

  // }
})

//选择图片
function wxChooseImage(self){
  wx.chooseImage({
    count: 1, // 默认9
    sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
    sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
    success (res) {
      pathSrc = res.tempFilePaths[0]
      //  获取裁剪图片资源后，给data添加src属性及其值
      self.wecropper.pushOrign(pathSrc);
    },
    fail (err) {
      // debugger
      console.log('err='+JSON.stringify(err));
      if(err.errMsg.indexOf('cancel')>-1){
        NT.navigateBackDelta(1);
      }
    }
  })
}