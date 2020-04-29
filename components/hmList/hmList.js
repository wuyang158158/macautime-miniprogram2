// components/hmList/hmList.js
var base = require('../../i18n/base.js');  //路径可能做相应调整
const _t = base._t().components; //翻译函数
let meigeSP=[] //每个视频的距离顶部的高度
let direction=0 //标记页面是向下还是向上滚动
let indexKey=0 //标记当前滚动到那个视频了
let totalLength = 0 //全部数据的长度
let curScrollTop = 0
let curPage = 1
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
    _t: _t, //翻译
    _index: 0,
    isVideo: false
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
    },
    //获取每个视频的距离顶部的高度
    spHeight() { 
      //微信api获取节点
      let query = wx.createSelectorQuery();
      query.in(this).selectAll(`.hm-list`).boundingClientRect() //每个视频的高度
      query.exec((rect) => {
        rect[0].forEach((item,index) => {
          // 渲染第二页的时候item.top 有问题 需要判断
          if(curPage < 2) {
            return meigeSP.push(item.top)
          }
          if(index > totalLength -1) {
            meigeSP.push(item.top + curScrollTop)
          }
        })
        totalLength = meigeSP.length //保存渲染后长度
      })
    },
    //页面滚动触发
    pageScroll(event) {
      curScrollTop = event.scrollTop
      let scrollTop = event.scrollTop //页面滚动
      if (scrollTop==0){
        indexKey=0
        this.setData({ _index:indexKey})
      }
      if (scrollTop >= direction) { //页面向上滚动indexKey
        if (indexKey + 1 < meigeSP.length && scrollTop >= (meigeSP[indexKey]) - 100) {
          this.setData({ _index: indexKey + 1 })
          indexKey += 1
        }
      } else { //页面向下滚动
        if (direction - scrollTop < 15) { //每次滚动的距离小于15时不改变  减少setData的次数
          return
        }
        if (indexKey - 1 > 0 && scrollTop < (meigeSP[indexKey - 1] - 100)) {
          indexKey -= 1
          this.setData({ _index: indexKey })
        }
      }
      direction = scrollTop
    },
  
    //播放按钮点击时触发触发
    videoPlay(e) {
      let _index = e.currentTarget.dataset.id
      this.setData({ //让video组件显示出来，不然点击时没有效果
        _index
      })
      //停止正在播放的视频
      let videoContextPrev = wx.createVideoContext(_index )
      videoContextPrev.stop();
  
      setTimeout( ()=> {
        //将点击视频进行播放
        let videoContext = wx.createVideoContext(_index )
        videoContext.play();
      }, 500)
    },
  },
  observers: {
    'merchantList': function (params) {//  'params'是要监听的字段，（params）是已更新变化后的数据
    if(!params.length) return
    // 是否为第一页的数据 是则清空
     if(params.length <= 8) {
      meigeSP = []
      totalLength = 0
     }
     this.setData({ isVideo: wx.getStorageSync('isVideo') })
     curPage = Math.ceil(params.length/8)
      setTimeout(()=>{
        this.spHeight()
      }, 500)
    }
  }
})
