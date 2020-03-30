// pages/attestation/kol-tag.js
import api from "../../data/api";
import NT from "../../utils/native.js"
var base = require('../../i18n/base.js');  //路径可能做相应调整
const _t = base._t().attestation.KOL_TAG; //翻译函数
var length = 2;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    _t: _t,
    userInfo: wx.getStorageSync("userInfo"), //用户信息
    tagArray: [],
    length: length,
    tagSelectedLen: 0,

    source: '',
    query:{ // 请求参数
      ext: 'us'
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const source = options.source
    if(source === 'class'){ // 用户类别标签
      length = 0;
      this.setData({
        query:{ // 请求参数
          ext: 'ustyle'
        },
        source: source,
        length: length
      })
      wx.setNavigationBarTitle({
        title: _t['申请类别']
      })
    }
    this.sysLabelInfo()
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
  // 新增标签
  tapToAddTag() {
    this.setData({
      isShowConfirm: true
    })
  },
  // 输入绑定
  bindinput(e) {
    // console.log(e)
  },
  confirm(e) {
    const detail = e.detail.replace(/^\s+|\s+$/g,"")
    const tagArray = this.data.tagArray
    let flag = false
    tagArray.map(item=>{
      if(item.remark===detail){
        NT.showToastNone(_t['该标签已存在，请勿重复添加！'])
        flag = true
      }
    })
    if(!flag){
      this.usInsertCustomLabel(detail)
    }
    
  },
  // 点击标签
  tapTag(e) {
    var tagSelectedLen = 0;
    var id = e.currentTarget.dataset.id
    var tagArray = this.data.tagArray

    tagArray.map(item=>{
      if(item.selected){
        tagSelectedLen += 1
      }
    })
    

    tagArray.forEach(item=>{
      if(item.id===id){
        item.selected = !item.selected
        if(item.selected){
          // tagSelectedLen += 1
          if(tagSelectedLen>this.data.length){
            item.selected = false
            let num = this.data.source === 'class' ? '1' : '3'
            NT.showToastNone(_t['优势特长标签不能超过'] + num + '次！')
            return false;
          }
        }
      }
    })
    this.setData({
      tagSelectedLen: tagSelectedLen,
      tagArray: tagArray
    })
    
  },
  submitNext() { // 下一步
    if(this.data.source === 'class'){
      this.usInsertLabelTyle()
    }else{
      this.setStorageTag()
    }
    
  },
  setStorageTag() { //缓存用户数据
    const tagArray = this.data.tagArray
    let sysLabelList = []
    tagArray.map(item=>{
      if(item.selected){
        let obj = {
          labelTypeId: item.labelTypeId,
          labelId: item.id,
          labelRemark: item.remark
        }
        sysLabelList.push(obj)
      }
    })
    let query = {
      sysLabelList: sysLabelList
    }
    this.usInsertLabel(query)

    
  },
  // 获取系统标签
  sysLabelInfo() {
    NT.showToast(_t['加载中...'])
    api.sysLabelInfo(this.data.query)
    .then(res=>{
      let data;
      if(this.data.source !== 'class'){
        data = res.sysLabel.concat(res.usSysCustomLabel || [])
        // var choseTag = wx.getStorageSync('choseTag')
        var usSysLabel = res.usSysLabel
        if(usSysLabel.length){
          for (let index = 0; index < usSysLabel.length; index++) {
            const element = usSysLabel[index];
            data.map(item=>{
              item.remark = item.remark ? item.remark : item.labelRemark
              if(item.id === element.labelId){
                item.selected = true
              }
            })
          }
        }
      }else{
        data = res.sysLabel
        var kolClass = wx.getStorageSync('choseTagClass')
        data.map(item=>{
          if(item.remark === kolClass){
            item.selected = true
          }
        })
      }
      this.setData({
        tagArray: data
      })
    })
    .catch(err=>{
      NT.showModal(err.message||_t['请求失败！'])
    })
  },
  // 新增用户系统标签
  usInsertCustomLabel(labelRemark) {
    NT.showToast(_t['处理中...'])
    api.usInsertCustomLabel({labelRemark:labelRemark})
    .then(res=>{
      NT.toastFn(_t['处理成功！'])
      var result = res;
      result.remark = result.labelRemark
      result.selected = false
      this.setData({
        tagArray: this.data.tagArray.concat(result)
      })
    })
    .catch(err=>{
      NT.showModal(err.message||_t['请求失败！'])
    })
  },
  // 新增标签
  usInsertLabel(obj,source) {
    NT.showToast(_t['处理中...'])
    api.usInsertLabel(obj)
    .then(res=>{
      NT.toastFn(_t['处理成功！'])
      setTimeout(()=>{
        const tagArray = this.data.tagArray
        let choseTag = []
        tagArray.map(item=>{
          if(item.selected){
            choseTag.push(item)
          }
        })
        wx.setStorage({
          key:"choseTag",
          data:choseTag
        })
        wx.navigateBack({
          delta: 1
        })
      },2000)
    })
    .catch(err=>{
      NT.showModal(err.message||_t['请求失败！'])
    })
  },
  // 新增用户标签
  usInsertLabelTyle() {
    var tagArray = this.data.tagArray
    var obj = {}
    tagArray.map(item=>{
      if(item.selected){
        obj = item
      }
    })
    var query = {
      labelTypeId: obj.labelTypeId,
      id: obj.id,
      remark: obj.remark
    }
    api.usInsertLabelTyle(query)
    .then(res=>{
      wx.setStorage({
        key:"choseTagClass",
        data: obj.remark
      })
      wx.navigateBack({
        delta: 1
      })
    })
    .catch(err=>{
      NT.showModal(err.message||_t['请求失败！'])
    })
  }
})