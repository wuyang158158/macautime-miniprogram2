// components/kolList.js
import NT from "../../utils/native.js"
import api from "../../data/api.js"
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

  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 关注或者取消用户
    tapUsInsertFocus(e) {
      NT.showToast('处理中...')
      const fAccountId = e.currentTarget.dataset.faccountid
      const isfocus = e.currentTarget.dataset.isfocus
      api.usInsertFocus({fAccountId:fAccountId, isFocus: isfocus})
      .then(res=>{
        NT.toastFn(isfocus?'已取消！': '关注成功！')
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
        NT.showModal(err.message||'请求失败！')
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
