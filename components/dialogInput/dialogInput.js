// components/dialogInput/dialogInput.js
var base = require('../../i18n/base.js');  //路径可能做相应调整
const _t = base._t().components; //翻译函数
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    isShowConfirm: {
      type: 'Boolean',
      value: false
    },
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
    setValue: function (e) {
      this.setData({
        walletPsd: e.detail.value
      })
      this.triggerEvent('bindinput', e.detail.value)
    },
    cancel: function () {
      var that = this
      that.setData({
        isShowConfirm: false,
      })
    },
    confirmAcceptance:function(){
      var that = this
      that.setData({
        isShowConfirm: false,
      })
      this.triggerEvent('confirm', this.data.walletPsd)
    },
  }
})
