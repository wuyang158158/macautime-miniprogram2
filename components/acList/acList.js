// components/acList.js
import api from "../../data/api";
import NT from "../../utils/native.js";
var base = require('../../i18n/base.js');  //路径可能做相应调整
const _ = base._; //翻译函数
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    source: String,
    recommend: Object
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
    // 点击喜欢
    tapLike(e) {
      NT.showToast(_('处理中...'))
      // console.log(e)
      const likeForm = {
        expId: e.currentTarget.dataset.id,
        type: e.currentTarget.dataset.like ? 1 : 0
      }
      api.likeExp(likeForm)
      .then(res=>{
        this.properties.recommend.map(item=>{
          if(item.experienceSerial === likeForm.expId){
            item.like = !item.like
            NT.toastFn(item.like ? _('已收藏！') : _('已取消！'),1000)
          }
        })
        this.setData({
          recommend: this.properties.recommend
        })
      })
      .catch(err=>{
        console.log(err)
        NT.showModal(err.message|| _('请求失败！'))
      })
    }
  }
})
