// components/acMyList.js
var base = require('../../i18n/base.js');  //路径可能做相应调整
const _ = base._; //翻译函数
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    result: Object
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
    tapToDetail(e) { // 点击查看体验详情
      const ID = e.currentTarget.dataset.id
      const TITLE = e.currentTarget.dataset.title
      wx.navigateTo({
        url: '/pages/views/ac-detail?id=' + ID + '&title=' + TITLE
      })
    },
  }
})
