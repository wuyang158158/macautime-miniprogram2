// components/myKolList/myKolList.js
import NT from "../../utils/native.js"
import api from "../../data/api.js"
var base = require('../../i18n/base.js');  //路径可能做相应调整
const _t = base._t().components; //翻译函数
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    result: Object,
    source: String
  },

  /**
   * 组件的初始数据
   */
  data: {
    _t: _t, //翻译
  },

  /**
   * 组件的方法列表
   */
  methods: {
    tapUsInsertFocus(e) {
      if(!wx.getStorageSync('userInfo')){
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
      let isFocus = e.currentTarget.dataset.isfocus
      const fAccountId = e.currentTarget.dataset.faccountid
      api.usInsertFocus({fAccountId:fAccountId, isFocus: isFocus})
      .then(res=>{
        NT.toastFn(isFocus? '已取消' : _t['关注成功！'])
        const result = this.data.result
        result.map(item=>{
          if(item.accountId === fAccountId){
            item.isFocus = !isFocus
          }
        })
        this.setData({
          result: result
        })
      })
      .catch(err=>{
        NT.showModal(err.message || _t['请求失败！'])
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
