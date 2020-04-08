//app.js
import api from "./data/api.js"
App({
  /**
   * 生命周期-初始化
   */
  onLaunch(options) {
    api.sysGetGlobalConf({key:'isVideo'})
    .then(res=>{
      // debugger
      wx.setStorageSync('isVideo', res.isVideo);
    })
    
    // 打开调试
    // wx.setEnableDebug({
    //   enableDebug: true
    // })
    // 获取设备信息
    wx.getSystemInfo({
      success: res=>{
        wx.setStorageSync('systemInfo', res);
        var L = res.language
        if(L === 'zh_HK' || L === 'zh_MO' || L === 'zh_TW'){
          L = 'zh_HK' //繁体
        }else{
          L = 'zh' //简体
        }
        wx.setStorageSync('Language', L);
        // console.log('手机信息res'+res.model)
        let modelmes = res.model;
        if (modelmes.search('iPhone X') != -1) {
          this.globalData.isIphoneX = true;
        }
      }
    })
    // 获取定位权限
    // wx.getSetting({
    //   success(res) {
    //     if (!res.authSetting['scope.userLocation']) {
    //       wx.authorize({
    //         scope: 'scope.userLocation',
    //         success (res) {
    //           // 用户已经同意 后续调用 wx.getLocation, 接口不会弹窗询问
    //           // 必须是在用户已经授权的情况下调用
    //           wx.getLocation()
    //         }
    //       })
    //     }
    //   }
    // })
  },
  globalData: {
    isIphoneX: false,
    ticket: false
  }
});