// components/myKolList/myKolList.js
import NT from "../../utils/native.js"
import api from "../../data/api.js"
var base = require('../../i18n/base.js');  //路径可能做相应调整
const _ = base._; //翻译函数
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
    _t: base._t(), //翻译
  },

  /**
   * 组件的方法列表
   */
  methods: {
    tapUsInsertFocus(e) {
      NT.showToast(_('处理中...'))
      let isFocus = e.currentTarget.dataset.isfocus
      const fAccountId = e.currentTarget.dataset.faccountid
      api.usInsertFocus({fAccountId:fAccountId, isFocus: isFocus})
      .then(res=>{
        NT.toastFn(isfocus? '已取消' : _('关注成功！'))
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
        NT.showModal(err.message||_('请求失败！'))
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
