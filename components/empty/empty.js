// components/searchbar/searchbar.js
var base = require('../../i18n/base.js');  //路径可能做相应调整
const _t = base._t().components; //翻译函数
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        propType: String,
        propText: String,
        propSrc: String,
        propUrl: String,
        propMt: Number,
        propMb: Number
    },
    /**
     * 组件的初始数据
     */
    data: {
        _t: _t, //翻译
    },
    lifetimes: {
        // 生命周期函数，组件生命周期函数-在组件实例进入页面节点树时执行)
        attached: function () {
            // console.log(this.data.propType)
         },
    },
    /**
     * 组件的方法列表
     */
    methods: {
        fnLinkTo(e) {
            const url = e.currentTarget.dataset.url
            if(url === '/pages/tabs/experience') {
                wx.setStorageSync('activeMenu', 1)
            }
            wx.switchTab({
              url: url,
            })
        }
    }
});