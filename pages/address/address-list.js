// pages/address/address-list.js
import NT from "../../utils/native.js"
import api from "../../data/api.js"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    addressList: [],
    noData: false
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
    this.fnGetAddress(true)
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },
  // 获取收货地址列表
  fnGetAddress(type) {
    if(type) NT.showToast('加载中...')
    api.ctAddressList().then(res => {
      this.setData({ addressList: res, noData: !res.length })
    }).catch(err => {
      this.setData({ noData: true, addressList: [] })
      NT.showModal(err.codeMsg || err.message || '请求失败！')
    })
  },
  //选择默认收货地址
  fnDefaultAddress(e) {
    NT.showToast('加载中...')
    const index = e.currentTarget.dataset.index
    let params = this.data.addressList[index]
    let data = this.data.addressList
    let submitParam = {
      realname: params.realname,
      phone: params.phone,
      province: params.province,
      city: params.city,
      county: params.county,
      addr: params.addr,
      id: params.id,
      isDefault: !params.isDefault
    }
    api.ctAddressUpdata(submitParam).then(res => {
      if(params.isDefault) {
        data[index].isDefault = false
        this.setData({
          addressList: data
        })
      } else {
        data.forEach(element => {
          if(element.isDefault) {
            element.isDefault = false
          }
        })
        data[index].isDefault = true
        this.setData({
          addressList: data
        })
      }
      NT.toastFn('成功', 1000)
      // this.fnGetAddress(false)
    }).catch(err => {
      NT.showModal(err.codeMsg || err.message || '请求失败！')
    })
  },
  // 删除收货地址
  fnDeleteAddress(e) {
    const id = e.currentTarget.dataset.id
    const index = e.currentTarget.dataset.index
    let addList = this.data.addressList
    let that = this
    wx.showModal({
      content: '确认删除该地址?',
      confirmColor: '#00A653',
      success: function (res) {
        if (res.confirm) {
          api.ctAddressDelete({ id: id }).then(res => {
            NT.toastFn('已删除', 1000)
            addList.splice(index, 1)
            that.setData({ addressList: addList })
          }).catch( err => {
            NT.showModal(err.codeMsg || err.message || '请求失败！')
          })
        }
      }
    })
  },
  // 编辑地址
  fnEditAddress(e) {
    const addId = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `/pages/address/address-add?addressId=${addId}`,
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