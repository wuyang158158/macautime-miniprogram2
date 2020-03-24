// components/halfScreenDialog/halfScreenDialog.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    result: {
			type: Object,
			value: {}
		},
    istrue: {
			type: Boolean,
			value: false
    },
    source: {
			type: String,
			value: ''
    },
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
    closeDialog: function () {
        this.setData({
            istrue: false
        })
        this.triggerEvent('closeDialog', false)
    },
    radioChange(e) {
      // console.log(e)
      var result = this.data.result
      result.map(item=>{
        if(item.id === e.detail.value){
          item.checked = true
        }else{
          item.checked = false
        }
      })
      this.setData({
        result: result
      })
      this.triggerEvent('radioChange', e.detail.value)
    }
  }
})
