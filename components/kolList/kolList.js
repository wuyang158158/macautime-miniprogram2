// components/kolList.js
import NT from "../../utils/native.js"
import api from "../../data/api.js"
import config from "../../data/api_config.js"
var base = require('../../i18n/base.js');  //路径可能做相应调整
const _t = base._t().components; //翻译函数
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    kolList: Object
  },

  /**
   * 组件的初始数据
   */
  data: {
    baseImageHost: config.baseImageHost,
    userInfo: wx.getStorageSync('userInfo'),
    _t: _t, //翻译
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 关注或者取消用户
    tapUsInsertFocus(e) {
      if(!this.data.userInfo){
        NT.showModalPromise(_t['您还未注册，请去个人中心点击「登录/注册」，再来关注KOL！'])
        .then(()=>{
          wx.switchTab({
            url: '/pages/tabs/center'
          })
        })
        .catch(()=>{

        })
        return false;
      }
      NT.showToast(_t['处理中...'])
      const fAccountId = e.currentTarget.dataset.faccountid
      const isfocus = e.currentTarget.dataset.isfocus
      api.usInsertFocus({fAccountId:fAccountId, isFocus: isfocus})
      .then(res=>{
        NT.toastFn(isfocus? '已取消' : _t['关注成功！'])
        const kolList = this.data.kolList
        kolList.map(item=>{
          if(item.id === fAccountId){
            item.isfocus = !isfocus
          }
        })
        this.setData({
          kolList: kolList
        })
      })
      .catch(err=>{
        NT.showModal(err.message|| _t['请求失败！'])
      })
    },
    fnLinkTo(e) {
      let id = e.currentTarget.dataset.id
      wx.navigateTo({
        url: `/pages/views/personal-home?id=${id}`,
      })
    }
  }
})
