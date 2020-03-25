import { BMapWX } from "../../utils/bmap-wx.min"

// components/hmList/hmList.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    merchantList: Object,
    bd: {
      type: 'Boolean',
      value: false
    },
    source: {
      type: 'String',
      value: 'common'
    }
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
    tapToDetail(e) {
      const ID = e.currentTarget.dataset.id
      const TITLE = e.currentTarget.dataset.title
      var url = this.data.source === 'common' ? '/pages/views/ac-detail?id=' + ID + '&title=' + TITLE + '&recommend=true' : '/pages/views/ac-detail?id=' + ID + '&title=' + TITLE 
      wx.navigateTo({
        url: url
      })
      this.triggerEvent('toDetail')
    }
  }
})
