import api from "../../data/api"
import NT from "../../utils/native.js"

// pages/views/about-us.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    titleBar: [
      { title: '使用协议', type: '1' },
      { title: '订单规则', type: '2' },
      { title: '服务协议', type: '4' },
      { title: '服务接受协议', type: '3' },
      { title: '会员隐私政策', type: '5' },
      { title: '商家隐私政策', type: '6' },
    ],
    roleForm: { //1: 协议政策 2：Macau Time服务协议 3：关于我们 4：注册服务协议 ，5隐私策略
      type: ''
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
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
    // NT.showToast('加载中...')
    // this.getClerkByType()
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
  getClerkByType() {
    api.getClerkByType(this.data.roleForm)
    .then(res=>{
      wx.setNavigationBarTitle({
        title: res.name
      })
      let content = res.content || ''
      content = content ? content.replace(/\<img/gi, '<img class="rich-img"') : ''
      this.setData({
        content: content
      })
    })
    .catch(err=>{
      NT.showModal(err.codeMsg||err.message||'请求失败！')
    })
  }

  /**
   * 用户点击右上角分享
   */
  // onShareAppMessage: function () {

  // }
})