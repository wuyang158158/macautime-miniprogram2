// components/video/video.js
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
    userInfo: wx.getStorageSync("userInfo"), //用户信息
    isVideo: wx.getStorageSync('isVideo')
  },
  attached() {
    
  },

  /**
   * 组件的方法列表
   */
  methods: {
    fnLinkTo(e) {
      const src = e.currentTarget.dataset.src || ''
      const id = e.currentTarget.dataset.id || ''
      wx.navigateTo({
        url: `/pages/video/video?id=${id}&src=${src}`,
      })
    }
  }
})
