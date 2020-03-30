var base = require('../../i18n/base.js');  //路径可能做相应调整
const _t = base._t().ABOUT_US; //翻译函数

// pages/views/about-us.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    titleBar: [
      { title: _t['使用协议'], type: '1' },
      { title: _t['订单规则'], type: '2' },
      { title: _t['服务协议'], type: '4' },
      { title: _t['服务接受协议'], type: '3' },
      { title: _t['会员隐私政策'], type: '5' },
      { title: _t['商家隐私政策'], type: '6' },
    ],
    roleForm: { //1: 协议政策 2：Macau Time服务协议 3：关于我们 4：注册服务协议 ，5隐私策略
      type: ''
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: _t['协议政策']
    });
    console.log(options)
    // options.id = '1'
    this.setData({
      roleForm: {
        type: options.id
      }
    })
    // if(options.id == '4' || options.id == '1' || options.id == '5'|| options.id == '2'){
      // return false;
    // }
  },
  //点击tabbbar事件
  tapTitleBar: function(e){
    let type = e.currentTarget.dataset.type
    this.setData({ 'roleForm.type': type })
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