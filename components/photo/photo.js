// components/photo/photo.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    result: {
      type: Array,
      value: []
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    
  },
  attached() {
    
  },

  /**
   * 组件的方法列表
   */
  methods: {
    fnPreviewPhoto(e) {
      const cur = e.currentTarget.dataset.cur
      const urls = this.properties.result
      wx.previewImage({
        current: cur, // 当前显示图片的http链接
        urls: urls // 需要预览的图片http链接列表
      })
    }
  }
})
