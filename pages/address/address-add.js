// pages/address/address-add.js
import NT from "../../utils/native.js"
import api from "../../data/api.js"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    region: [],
    area: '',
    id: '',
    submitParam: {
      realname: '',
      phone: '',
      province: '',
      city: '',
      county: '',
      addr: '',
      isDefault: false
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: options.addressId?'编辑地址':'添加新地址'
    })
    // 地址回显
    if(options.addressId) {
      this.setData({ id: options.addressId })
      this.fnGetAddress(options.addressId)
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
  // 选择所在地区
  bindRegionChange: function (e) {
    let arr = e.detail.value
    console.log(arr)
    this.setData({
      region: arr,
      area: arr.join(' '),
      'submitParam.province': arr[0],
      'submitParam.city': arr[1],
      'submitParam.county': arr[2]
    })
  },
  // 设置为默认地址
  fnDefaultAddress() {
    this.setData({ 'submitParam.isDefault': !this.data.submitParam.isDefault  })
  },
  // 保存地址
  fnFormSubmit(e) {
    let params = e.detail.value
    let data = Object.assign(this.data.submitParam, params)
    if (this.data.id) {
      data.id = this.data.id
    }
    if (!data.realname) {
      NT.showModal('请输入收货人姓名！')
      return
    }
    if (!data.phone) {
      NT.showModal('请输入联系电话！')
      return
    }
    if (!data.province) {
      NT.showModal('请选择所在地区！')
      return
    }
    if (!data.addr) {
      NT.showModal('请输入详细地址！')
      return
    }
    api.ctAddressUpdata(data).then(res => {
      wx.showToast({
        title: '保存成功',
        success(res) {
          setTimeout(res => {
            wx.navigateBack({
              delta: 1
            })
          }, 1000)
        }
      })
    }).catch( err => {
      NT.showModal(err.codeMsg || err.message || '请求失败！')
    })
    
  },
  // 地址回显
  fnGetAddress(id) {
    NT.showToast('加载中...')
    api.ctAddressDetail({ id : id}).then(res => {
      this.setData({
        submitParam: {
          realname: res.realname,
          phone: res.phone,
          province: res.province,
          city: res.city,
          county: res.county,
          addr: res.addr,
          isDefault: res.isDefault
        },
        area: `${res.province}${res.city}${res.county}`,
        region: [res.province, res.city, res.county]
      })
    }).catch(err => {
      NT.showModal(err.codeMsg || err.message || '请求失败！')
    })
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