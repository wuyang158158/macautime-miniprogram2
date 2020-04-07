/**
 * api数据控制器
 */
import config from './api_config.js'
import utils from '../utils/util.js'
import NT from '../utils/native.js'

const app = getApp()
const env = config.env[config.curEnv]
const baseUrl = env.baseUrl

const global = {
  appType: 1,  // appType  1-用户 2-商户
  appVersion: '',
  deviceMode: 3, //deviceMode   1-IOS 2-Android 3-小程序
  sellerId: '', 
  userId: wx.getStorageSync('userInfo').userId || ''
  // , langType: 1 //1为简体，2为繁体
}

/**
 * 公共request方法(登录后接口调用)
 * @param url 请求接口地址
 * @param method 请求接口方式
 * @param params 请求参数
 * @param callback 请求成功回调
 */
const execute = (url, method, params, resolve, reject) => {
  const token = wx.getStorageSync('userInfo').token || ''
  const obj = { userName: wx.getStorageSync('userInfo').userName || '' }

  const header = {
    'content-type': 'text/DM-', // 默认值
    // Authorization: 'Basic Yml4aW46Qml4aW5AMjAxOA==',
    auth: wx.getStorageSync('userInfo').auth || '' 
    // token: token,
    // loginType: 1
  }
  // const data = Object.assign(params || {}, obj)

  // const body = {
  //   "password":"123456","account":"18168723160","verCode":"1"
  // }
  global.userId = wx.getStorageSync('userInfo').userId || ''
  var langType = 1 //简体
  var L = wx.getStorageSync('Language')
  if(L === 'zh_HK' || L === 'zh_MO' || L === 'zh_TW'){
    langType = 2 //繁体
  }
  global.langType = langType
  const body = params || {}
  wx.request({
    url: baseUrl + url,
    method: method,
    data: {body,global},
    // data: data,
    header: header,
    dataType: 'json',
    success: res => {
      // console.log({url:baseUrl + url,body,global})
      NT.hideToast()
      const result = res.data.body || {}
      // if(url === '/usRegist/1.0/'&&result.openId === 'oBV8p4yY71L8CE18QD7KDq_ydfWM'){
      //   // 打开调试
      //   wx.setEnableDebug({
      //     enableDebug: true
      //   })
      // }
      if(url==='/usRegist/1.0/' && result.hasOwnProperty('register') && !result.register){ //未注册
        wx.removeStorageSync('userInfo')
        reject({
          code: '10019',
          data: {
            openId: result.openId,
            sessionKey: result.sessionKey
          }
        })
        return
      }
      // if (res.statusCode === 401) {
      //   //需要校验用户信息
      //   reject({
      //     code: '401',
      //     codeMsg: '暂未登录'
      //   })
      //   NT.showToastNone('需要登录！')
      //   // wx.switchTab({
      //   //   url: '/pages/tabs/center'
      //   // })
      //   if(getApp()){
      //     NT.showToast('登录中...')
      //     getApp().login()
      //   }
      //   return
      // }
      if (res.data.code === '000000') {
        resolve(result)
      } else if(url === '/usInsertFocus/1.0/' && res.data.code === 'E00024') {
        // 防止重复关注接口未resolve
        resolve(result)
      } else {
        reject(res.data)
      }
    },
    fail: res => {
      NT.hideToast()
      reject({
        code: '00',
        codeMsg: '请求失败，请检查您的网络连接。'
      })
      // NT.showModal('请求失败，请检查您的网络连接。')
    }
  })
}
/**
 * 公共request方法(登录后接口调用)  请求百度地图定位信息
 */
const executeBdMap = (url, method, params, resolve, reject) => {
  wx.request({
    url: url + '?ak=yGcrSwdG3beEibxivQuiShqGQxp4BSqc&location=' + params.latitude + ',' + params.longitude + '&output=json',
    method: method,
    data: {},
    header: {
      'content-type': 'application/json', // 默认值
    },
    dataType: 'json',
    success: res => {
      resolve(res)
    },
    fail: res => {
      reject(res)
    }
  })
}

/**
 * 公共WebSocket方法
 */
const socket = (url, method, params, source, callback) => {
  let token = wx.getStorageSync('sie_iot_user_token')
  const ws = wx.connectSocket({
    url: wssBaseUrl + url,
    data: dealParam(params),
    header: {
      Authorization: `Basic dXNlcjpwYXNzd29yZA==`,
      'content-type': 'application/json'
    },
    //子协议
    // protocols: [],
    method: method,
    success: res => {
      callback(ws, res)
    },
    fail: res => {
      NT.showModal('请求失败，请检查您的网络连接。')
    }
  })
  ws.onOpen(res => {
    source.wsController(ws)
  })
}

// 已上传的图片域名
const baseImageHost = config.baseImageHost

export default {
  ENV_CONFIG: config.curEnv,
  /**
   * 图片上传 - 多张
   */
  uploadImage(filePath,params) {
    // console.log(filePath)
    const upImgHeader = {
      'content-type': 'multipart/form-data',
      auth: wx.getStorageSync('userInfo').auth || '' ,
    }
    let uploads=[];
    const url = config.env[config.curEnv].baseUrl + `/experience/expCMNT/expCommentUploadImg`
    const obj = { userName: wx.getStorageSync('userInfo').userName || '' }
    const token = wx.getStorageSync('userInfo').token || ''
    const formData = Object.assign(params || {}, obj)
    return new Promise(resolve => {
      for(var i=0;i<filePath.length;i++){
        uploads[i] = new Promise(resolve1 => {
          wx.uploadFile({
            url: url,
            header: upImgHeader,
            filePath: filePath[i],
            formData: formData,
            name: 'file',
            success: res => {
              // console.log('上传成功')
              const data = JSON.parse(res.data)
              resolve1(data)
            },
            fail: err => {
              // console.log(err)
              NT.showModal(err)
            }
          })
        })
      }
      Promise.all(uploads).then((result)=>{
        // console.log('上传成功Promise')
        // console.log(result)
        resolve(result)
      })
    })
    /*
    return new Promise(resolve => {
      wx.uploadFile({
        url: config.env[config.curEnv].baseUrl + `/experience/expCMNT/expCommentImg`,
        header: header,
        filePath: filePath,
        formData: formData,
        name: 'file',
        success: res => {
          console.log('上传成功')
          resolve(res)
        },
        fail: err => {
          console.log(err)
          NT.showModal(err)
        }
      })
    })
    */
  },
  // 上传图片 - 单张
  userUploadImage(filePath,noBaseUrl) {
    const userId = wx.getStorageSync('userInfo').userId || ''
    const url = config.env[config.curEnv].baseUrl + `/uploadFile?appType=1&deviceMode=3&userId=${userId}`
    return new Promise(resolve => {
      wx.uploadFile({
        url: url,
        header: {
          'content-type': 'multipart/form-data',
          auth: wx.getStorageSync('userInfo').auth || '' ,
        },
        filePath: filePath,
        formData: {},
        name: 'files',
        success: res => {
          wx.hideLoading();
          wx.stopPullDownRefresh();
          wx.hideNavigationBarLoading();
          const data = JSON.parse(res.data)
          data.body = noBaseUrl? `${data.body}` : `${baseImageHost}/${data.body}`
          resolve(data)
        },
        fail: err => {
          // console.log(err)
          NT.showModal(err)
        }
      })
    })
  },
  // 登录
  login(option) {
    return new Promise((resolve, reject) => {
      wx.login({
        success(res) {
          if (res.code) {
            // console.log(res.code)
            const query = { code: res.code }
            if(option && option.spreadCode) {
              query.spreadCode = option.spreadCode
            }
            //发起网络请求
            // execute(
            //   `/user/user/wxMiniProgramLogin`,
            //   'POST',
            //   query,
            //   resolve,
            //   reject
            // )
            execute(`/usRegist/1.0/`, 'POST', query, resolve, reject)
          } else {
            reject('登录失败！')
          }
        }
      })
      // return new Promise((resolve, reject) => {
      //   execute(`/usRegist/1.0/`, 'POST', query, resolve, reject)
      // })
    })
  },
  // 登录
  usLogin(query) {
    return new Promise((resolve, reject) => {
      execute(`/usLoginForPhone/1.0/`, 'POST', query, resolve, reject)
    })
  },
  // 注册
  register(query) {
    // return new Promise((resolve, reject) => {
    //   execute(`/user/user/wxRegistered`, 'POST', query, resolve, reject)
    // })
    return new Promise((resolve, reject) => {
      execute(`/usRegist/1.0/`, 'POST', query, resolve, reject)
    })
  },
  // 获取所有体验产品
  getExperience(query) {
    return new Promise((resolve, reject) => {
      execute(
        `/experience/experience/getExperience`,
        'POST',
        query,
        resolve,
        reject
      )
    })
  },
  // 获取会员限时礼接口
  getLimitTimeGift(query) {
    return new Promise((resolve, reject) => {
      execute(
        `/experience/experience/getLimitTimeGift`,
        'POST',
        query,
        resolve,
        reject
      )
    })
  },
  // 获取会员专属体验接口
  getVipExperience(query) {
    return new Promise((resolve, reject) => {
      execute(
        `/experience/experience/getVipExperience`,
        'POST',
        query,
        resolve,
        reject
      )
    })
  },
  //获取体验详情接口
  getExpDetails(query) {
    return new Promise((resolve, reject) => {
      execute(
        `/experience/experience/getExpDetails`,
        'POST',
        query,
        resolve,
        reject
      )
    })
  },
  //猜你喜欢推荐接口
  getGuessLike(query) {
    return new Promise((resolve, reject) => {
      execute(
        `/experience/experience/getGuessLike`,
        'POST',
        query,
        resolve,
        reject
      )
    })
  },
  //提交订单接口
  saveOrder(query) {
    return new Promise((resolve, reject) => {
      execute(
        `/experience/experience/order/saveOrder`,
        'POST',
        query,
        resolve,
        reject
      )
    })
  },
  //获取个人订单列表
  getOrderListPersonal(query) {
    return new Promise((resolve, reject) => {
      execute(
        `/experience/experience/order/getOrderListPersonal`,
        'POST',
        query,
        resolve,
        reject
      )
    })
  },
  //获取订单详情
  getOrderDetails(query) {
    return new Promise((resolve, reject) => {
      execute(
        // `/experience/experience/order/getOrderDetails`,
        `/poUsOrderInfo/1.0/`,
        'POST',
        query,
        resolve,
        reject
      )
    })
  },
  // 购买会员
  payVipOrder(query) {
    return new Promise((resolve, reject) => {
      execute(`/payment/vipPay/payVipOrder`, 'POST', query, resolve, reject)
    })
  },
  //获取用户信息
  getUserInfo(query) {
    return new Promise((resolve, reject) => {
      execute(`/user/user/getUserInfo`, 'POST', query, resolve, reject)
    })
  },
  //获取体验日历接口
  getExpCalendar(query) {
    return new Promise((resolve, reject) => {
      execute(
        `/experience/experience/getExpCalendar`,
        'POST',
        query,
        resolve,
        reject
      )
    })
  },
  //取消订单
  cancelOrder(query) {
    return new Promise((resolve, reject) => {
      execute(
        `/experience/experience/order/cancelOrder`,
        'POST',
        query,
        resolve,
        reject
      )
    })
  },
  //删除订单
  deleteOrder(query) {
    return new Promise((resolve, reject) => {
      execute(
        `/experience/experience/order/deleteOrder`,
        'POST',
        query,
        resolve,
        reject
      )
    })
  },
  // 会员价格列表
  vipPriceList(query) {
    return new Promise((resolve, reject) => {
      execute(
        `/baseService/vipPrice/vipPriceList`,
        'GET',
        query,
        resolve,
        reject
      )
    })
  },
  //  获取我的行程
  getMyJourney(query) {
    return new Promise((resolve, reject) => {
      execute(
        `/experience/experience/order/getMyJourney`,
        'POST',
        query,
        resolve,
        reject
      )
    })
  },
  // 获取用户的浏览记录接口
  getUserRecord(query) {
    return new Promise((resolve, reject) => {
      execute(
        `/experience/experience/record/getUserRecord`,
        'POST',
        query,
        resolve,
        reject
      )
    })
  },
  // 获取体验活动接口
  getPromotions(query) {
    return new Promise((resolve, reject) => {
      execute(
        `/experience/experience/promotion/getPromotions`,
        'POST',
        query,
        resolve,
        reject
      )
    })
  },
  // 获取当前城市
  getLocationCity(query) {
    return new Promise((resolve, reject) => {
      executeBdMap(
        `https://api.map.baidu.com/geocoder/v2/`,
        'GET',
        query,
        resolve,
        reject
      )
    })
  },
  // 点赞体验（点赞和取消点赞）
  likeExp(query) {
    return new Promise((resolve, reject) => {
      execute(
        `/experience/experience/likeExp`,
        'POST',
        query,
        resolve,
        reject
      )
    })
  },
  // 我的点赞体验列表
  likeExpLike(query) {
    return new Promise((resolve, reject) => {
      execute(
        `/experience/experience/likeExpLike`,
        'POST',
        query,
        resolve,
        reject
      )
    })
  },
  // 获取附近体验列表
  getNearExp(query) {
    return new Promise((resolve, reject) => {
      execute(
        `/experience/experience/getNearExp`,
        'POST',
        query,
        resolve,
        reject
      )
    })
  },
  // 人气体验
  expRanking(query) {
    return new Promise((resolve, reject) => {
      execute(
        `/experience/experience/expRanking`,
        'POST',
        query,
        resolve,
        reject
      )
    })
  },
  // 获取体验的套餐
  getExpAllMeal(query) {
    return new Promise((resolve, reject) => {
      execute(
        `/experience/meal/getExpAllMeal`,
        'POST',
        query,
        resolve,
        reject
      )
    })
  },
  // 获取套餐详情
  getMealDetails(query) {
    return new Promise((resolve, reject) => {
      execute(
        `/experience/meal/getMealDetails`,
        'POST',
        query,
        resolve,
        reject
      )
    })
  },
  // 获取套餐时间表
  getMealCalendar(query) {
    return new Promise((resolve, reject) => {
      execute(
        `/experience/meal/getMealCalendar`,
        'POST',
        query,
        resolve,
        reject
      )
    })
  },
  // 体验线上支付
  payOrder(query) {
    return new Promise((resolve, reject) => {
      execute(
        `/payment/expPay/payOrder`,
        'POST',
        query,
        resolve,
        reject
      )
    })
  },
  // 体验评论
  expComment(query) {
    return new Promise((resolve, reject) => {
      execute(
        `/experience/expCMNT/expComment`,
        'POST',
        query,
        resolve,
        reject
      )
    })
  },
  // 我的评论
  myComment(query) {
    return new Promise((resolve, reject) => {
      execute(
        `/experience/expCMNT/myComment`,
        'POST',
        query,
        resolve,
        reject
      )
    })
  },
  // 协议政策等
  getClerkByType(query){
    return new Promise((resolve, reject) => {
      execute(
        `/baseService/clerkApi/getClerkByType`,
        'POST',
        query,
        resolve,
        reject
      )
    })
  },
  // 搜索联想词
  getLikeage(query) {
    return new Promise((resolve, reject) => {
      execute(
        `/baseService/module/getLikeage`,
        'GET',
        query,
        resolve,
        reject
      )
    })
  },
  // 热搜词汇
  hostSearch(query) {
    return new Promise((resolve, reject) => {
      execute(
        `/baseService/base/hostSearch`,
        'POST',
        query,
        resolve,
        reject
      )
    })
  },
  // 领取体验
  saveDisCountOrder(query) {
    return new Promise((resolve, reject) => {
      execute(
        `/experience/experience/order/saveDisCountOrder`,
        'POST',
        query,
        resolve,
        reject
      )
    })
  },
  // 新增kol审核
  addKolAduit(query) {
    return new Promise((resolve, reject) => {
      execute(
        `/user/kol/addKolAduit`,
        'POST',
        query,
        resolve,
        reject
      )
    })
  },



  // 商家搜索列表-按关键字分页搜索
  msSelectedMsByKeyWord(query) {
    return new Promise((resolve, reject) => {
      execute(
        `/msSelectedMsByKeyWord/1.0/`,
        'POST',
        query,
        resolve,
        reject
      )
    })
  },
  // 精选商家-按标签类别获取列表
  msSelectedMsByLabel(query) {
    return new Promise((resolve, reject) => {
      execute(
        `/msSelectedMsByLabel/1.0/`,
        'POST',
        query,
        resolve,
        reject
      )
    })
  },
  // 商家详情
  msSelectedMsDetailsByMsId(query) {
    return new Promise((resolve, reject) => {
      execute(
        `/msSelectedMsDetailsByMsId/1.0/`,
        'POST',
        query,
        resolve,
        reject
      )
    })
  },
  // 查询当前优惠券信息
  mkSelectDiscountsCardById(query) {
    return new Promise((resolve, reject) => {
      execute(
        `/mkSelectDiscountsCardById/1.0/`,
        'POST',
        query,
        resolve,
        reject
      )
    })
  },
  // 获取kol用户信息
  usKolInfoById(query) {
    return new Promise((resolve, reject) => {
      execute(
        `/usKolInfoById/1.0/`,
        'POST',
        query,
        resolve,
        reject
      )
    })
  },
  // 添加kol用户信息
  usKolOtherInfo(query) {
    return new Promise((resolve, reject) => {
      execute(
        `/usKolOtherInfo/1.0/`,
        'POST',
        query,
        resolve,
        reject
      )
    })
  },
  // 新增用户标签关联信息
  usInsertLabel(query) {
    return new Promise((resolve, reject) => {
      execute(
        `/usInsertLabel/1.0/`,
        'POST',
        query,
        resolve,
        reject
      )
    })
  },
  // 新增用户身份证信息
  usInsertIdentity(query) {
    return new Promise((resolve, reject) => {
      execute(
        `/usInsertIdentity/1.0/`,
        'POST',
        query,
        resolve,
        reject
      )
    })
  },
  // 新增用户银行卡信息
  usInsertCard(query) {
    return new Promise((resolve, reject) => {
      execute(
        `/usInsertCard/1.0/`,
        'POST',
        query,
        resolve,
        reject
      )
    })
  },
  // 专访栏目 - 首页
  msSpecialColumn(query) {
    return new Promise((resolve, reject) => {
      execute(`/gdMsInterviewVideoList/1.0/`,'POST',query,resolve,reject
      )
    })
  },
  // 专访栏目 - 首页 - 增加阅读量
  msSpecialColumnAddCount(query) {
    return new Promise((resolve, reject) => {
      execute(`/InterviewVideoAddReadNumber/1.0/`,'POST',query,resolve,reject
      )
    })
  },
  // 精选商家-首页
  msSelectedMsListHome(query) {
    return new Promise((resolve, reject) => {
      execute(
        `/msSelectedMsListHome/1.0/`,
        'POST',
        query,
        resolve,
        reject
      )
    })
  },
  // 精选商家-详情-猜你喜欢
  msSelectedMsListGuessYouLike(query) {
    return new Promise((resolve, reject) => {
      execute(
        `/msSelectedMsListGuessYouLike/1.0/`,
        'POST',
        query,
        resolve,
        reject
      )
    })
  },
  // 精选商家-详情-相关视频
  msSelectedMsVideoByMsId(query) {
    return new Promise((resolve, reject) => {
      execute(
        `/msSelectedMsVideoByMsId/1.0/`,
        'POST',
        query,
        resolve,
        reject
      )
    })
  },
  // 分页获取商家评价的接口
  selectMsEvaluateScoreList(query) {
    return new Promise((resolve, reject) => {
      execute(
        `/selectMsEvaluateScoreList/1.0/`,
        'POST',
        query,
        resolve,
        reject
      )
    })
  },
  // 获取商家标签类别列表
  msSelectMsLabelList(query) {
    return new Promise((resolve, reject) => {
      execute(
        `/msSelectMsLabelList/1.0/`,
        'POST',
        query,
        resolve,
        reject
      )
    })
  },
  // 获取系统标签
  sysLabelInfo(query) {
    return new Promise((resolve, reject) => {
      execute(
        `/sysLabelInfo/1.0/`,
        'POST',
        query,
        resolve,
        reject
      )
    })
  },
  // 新增用户标签
  usInsertLabel(query) {
    return new Promise((resolve, reject) => {
      execute(
        `/usInsertLabel/1.0/`,
        'POST',
        query,
        resolve,
        reject
      )
    })
  },
  // 获取认证KOL信息列表
  usIsCertificationKol(query) {
    return new Promise((resolve, reject) => {
      execute(
        `/usGetAllKol/1.0/`,
        'POST',
        query,
        resolve,
        reject
      )
    })
  },
  // 关注用户,取消关注
  usInsertFocus(query) {
    const url = query.isFocus?'/usDelFocus':'/usInsertFocus'
    delete query.isFocus
    // console.log(query)
    return new Promise((resolve, reject) => {
      execute(
        `${url}/1.0/`,
        'POST',
        query,
        resolve,
        reject
      )
    })
  },
  // 获取用户关注列表
  getFocusList(query) {
    return new Promise((resolve, reject) => {
      execute(
        `/getFocusList/1.0/`,
        'POST',
        query,
        resolve,
        reject
      )
    })
  },
  // 获取用户的粉丝列表
  getFansList(query) {
    return new Promise((resolve, reject) => {
      execute(
        `/getFansList/1.0/`,
        'POST',
        query,
        resolve,
        reject
      )
    })
  },
  // 领取优惠卷
  poInsertDiscountOrder(query) {
    return new Promise((resolve, reject) => {
      execute(
        `/poInsertDiscountOrder/1.0/`,
        'POST',
        query,
        resolve,
        reject
      )
    })
  },
  // 查询所有优惠卷
  poSelectDiscountList(query) {
    return new Promise((resolve, reject) => {
      execute(
        `/poSelectDiscountList/1.0/`,
        'POST',
        query,
        resolve,
        reject
      )
    })
  },
  // 购买优惠卷
  poInsertDiscountOrder(query) {
    return new Promise((resolve, reject) => {
      execute(
        `/poInsertDiscountOrder/1.0/`,
        'POST',
        query,
        resolve,
        reject
      )
    })
  },
  // 商品消费下单
  poInsertGoodsOrderAddDiscount(query) {
    return new Promise((resolve, reject) => {
      execute(
        `/poInsertGoodsOrderAddDiscount/1.0/`,
        'POST',
        query,
        resolve,
        reject
      )
    })
  },
  // 会员下单
  poVipOrder(query) {
    return new Promise((resolve, reject) => {
      execute(
        `/poVipOrder/1.0/`,
        'POST',
        query,
        resolve,
        reject
      )
    })
  },
  // 微信支付
  wxPay(query) {
    return new Promise((resolve, reject) => {
      execute(
        `/wxPay/1.0/`,
        'POST',
        query,
        resolve,
        reject
      )
    })
  },
  // 钱包支付
  WalletPay(query) {
    return new Promise((resolve, reject) => {
      execute(
        `/WalletPay/1.0/`,
        'POST',
        query,
        resolve,
        reject
      )
    })
  },
  // e支付
  ghPay(query) {
    return new Promise((resolve, reject) => {
      execute(
        `/ghPay/1.0/`,
        'POST',
        query,
        resolve,
        reject
      )
    })
  },
  // 轮训查询结果接口
  poSelectOrderPaySuccess(query) {
    return new Promise((resolve, reject) => {
      execute(
        `/poSelectOrderPaySuccess/1.0/`,
        'POST',
        query,
        resolve,
        reject
      )
    })
  },
  // 首页搜索——用户昵称模糊搜索
  getUserByName(query) {
    return new Promise((resolve, reject) => {
      execute(
        `/getUserByName/1.0/`,
        'POST',
        query,
        resolve,
        reject
      )
    })
  },
  // 我的钱包界面
  atsSelect(query) {
    return new Promise((resolve, reject) => {
      execute(
        `/atsSelect/1.0/`,
        'POST',
        query,
        resolve,
        reject
      )
    })
  },
  // 钱包流水
  atsSelectByList(query) {
    return new Promise((resolve, reject) => {
      execute(
        `/atsSelectByList/1.0/`,
        'POST',
        query,
        resolve,
        reject
      )
    })
  },
  // 获取会员套餐
  mkGetVipPackage(query) {
    return new Promise((resolve, reject) => {
      execute(
        `/mkGetVipPackageList/1.0/`,
        'POST',
        query,
        resolve,
        reject
      )
    })
  },
  // 钱包提现
  atsCashMoney(query) {
    return new Promise((resolve, reject) => {
      execute(`/atsWithdraw/1.0/`, 'POST', query, resolve, reject)
    })
  },
  // 钱包 获取银行卡列表 
  atsGetBankList(query) {
    return new Promise((resolve, reject) => {
      execute(`/getBankInfo/1.0/`, 'POST', query, resolve, reject)
    })
  },
  // 钱包 获取钱包金额
  atsGetAllMoney(query) {
    return new Promise((resolve, reject) => {
      execute(`/atsSelectAmount/1.0/`, 'POST', query, resolve, reject)
    })
  },
  // 个人中心 更新收货地址
  ctAddressUpdata(query) {
    const url = query.id? 'usUpdateDeliveryAddress' : 'usInsertDeliveryAddress'
    return new Promise((resolve, reject) => {
      execute(`/${url}/1.0/`, 'POST', query, resolve, reject)
    })
  },
  // 个人中心 收货地址列表
  ctAddressList(query) {
    return new Promise((resolve, reject) => {
      execute(`/usGetDeliveryAddress/1.0/`, 'POST', query, resolve, reject)
    })
  },
  // 个人中心 收货地址详情
  ctAddressDetail(query) {
    return new Promise((resolve, reject) => {
      execute(`/usGetDeliveryAddressById/1.0/`, 'POST', query, resolve, reject)
    })
  },
  // 个人中心 删除收货地址
  ctAddressDelete(query) {
    return new Promise((resolve, reject) => {
      execute(`/usDelDeliveryAddressById/1.0/`, 'POST', query, resolve, reject)
    })
  },
  // 个人中心 更新个人信息
  ctUpdataUserInfo(query) {
    return new Promise((resolve, reject) => {
      execute(`/usUpdateBaseInfo/1.0/`, 'POST', query, resolve, reject)
    })
  },
  // 新增用户类别标签接口
  usInsertLabelTyle(query) {
    return new Promise((resolve, reject) => {
      execute(`/usInsertLabelTyle/1.0/`, 'POST', query, resolve, reject)
    })
  },
  // 添加kol用户信息接口
  usInsertKol(query) {
    return new Promise((resolve, reject) => {
      execute(`/usInsertKol/1.0/`, 'POST', query, resolve, reject)
    })
  },
  // 新增用户自定义标签接口
  usInsertCustomLabel(query) {
    return new Promise((resolve, reject) => {
      execute(`/usInsertCustomLabel/1.0/`, 'POST', query, resolve, reject)
    })
  },
  // 获取KOL实名认证信息
  usGetAuthentication(query) {
    return new Promise((resolve, reject) => {
      execute(`/usGetAuthentication/1.0/`, 'POST', query, resolve, reject)
    })
  },
  // 个人中心 获取个人信息
  ctGetUserInfo(query) {
    return new Promise((resolve, reject) => {
      execute(`/getBaseInfo/1.0/`, 'POST', query, resolve, reject)
    })
  },
  // 个人中心 我的卡券
  ctGetUserCoupon(query) {
    return new Promise((resolve, reject) => {
      execute(`/poUsDiscountList/1.0/`, 'POST', query, resolve, reject)
    })
  },
  // 首页-搜索
  msSearchHome(query) {
    return new Promise((resolve, reject) => {
      execute(`/msSearchHome/1.0/`, 'POST', query, resolve, reject)
    })
  },
  // 会员中心 福利升级
  ctMembershipCoupon(query) {
    return new Promise((resolve, reject) => {
      execute(`/mkSelectMembershipCoupon/1.0/`, 'POST', query, resolve, reject)
    })
  },
  // 个人中心 我的订单
  ctOrderList(query) {
    return new Promise((resolve, reject) => {
      execute(`/poUsAllOrder/1.0/`, 'POST', query, resolve, reject)
    })
  },
  // 个人中心 我的点赞视频
  ctMyLikeVideo(query) {
    return new Promise((resolve, reject) => {
      execute(`/voSelectUserLikeVoId/1.0/`, 'POST', query, resolve, reject)
    })
  },
  // 个人中心 我的点赞商家
  ctMyLikeStore(query) {
    return new Promise((resolve, reject) => {
      execute(`/imSelectOrderEvaluateByOrderIdAndMsId/1.0/`, 'POST', query, resolve, reject)
    })
  },
  // 观看视频记录次数
  voInsertLookRecord(query) {
    return new Promise((resolve, reject) => {
      execute(`/voInsertLookRecord/1.0/`, 'POST', query, resolve, reject)
    })
  },
  // 我的视频
  ctMyVideoc(query) {
    const header = {
      'content-type': 'text/DM-', // 默认值
      auth: wx.getStorageSync('userInfo').auth || ''
    }
    return new Promise((resolve, reject) => {
      wx.request({
        url: `${baseUrl}/voSelectByUserId/1.0/`,
        method: 'POST',
        data: {
          body: {
            accountId: query && query.userId || wx.getStorageSync('userInfo').userId
          },
          global:{
          appType: 1,  // appType  1-用户 2-商户
          appVersion: '',
          deviceMode: 3, //deviceMode   1-IOS 2-Android 3-小程序
          sellerId: '', 
          userId: wx.getStorageSync('userInfo').userId || ''
        }
      },
        header: header,
        dataType: 'json',
        success: res => {
          NT.hideToast()
          const result = res.data.body
          if (res.data.code === '000000') {
            resolve(result)
          } else {
            reject(res.data)
          }
        },
        fail: res => {
          NT.hideToast()
          reject({
            code: '00',
            codeMsg: '请求失败，请检查您的网络连接。'
          })
          // NT.showModal('请求失败，请检查您的网络连接。')
        }
      })
    })
  },
  // 我的订单 取消订单
  MyOrderDeleteDetail(query) {
    return new Promise((resolve, reject) => {
      execute(`/poOrderMatureCancle/1.0/`, 'POST', query, resolve, reject)
    })
  },
  // 我的订单 退款
  MyOrderRefund(query) {
    return new Promise((resolve, reject) => {
      execute(`/poOrderRefund/1.0/`, 'POST', query, resolve, reject)
    })
  },
  // 查询评价列表
  imSelectOrderToEvaluateByOrderId(query) {
    return new Promise((resolve, reject) => {
      execute(`/imSelectOrderToEvaluateByOrderId/1.0/`, 'POST', query, resolve, reject)
    })
  },
  // 查询可用的优惠券
  mkSelectStoreCardsAndUserCard(query) {
    return new Promise((resolve, reject) => {
      execute(`/mkSelectStoreCardsAndUserCard/1.0/`, 'POST', query, resolve, reject)
    })
  },
  // 个人中心 我的收藏
  ctMyCollection(query) {
    return new Promise((resolve, reject) => {
      execute(`/usGetFav/1.0/`, 'POST', query, resolve, reject)
    })
  },
  // 收藏
  collectInsert(query) {
    return new Promise((resolve, reject) => {
      execute(`/usInsertFav/1.0/`, 'POST', query, resolve, reject)
    })
  },
  // 取消收藏
  collectCancel(query) {
    return new Promise((resolve, reject) => {
      execute(`/usDelFav/1.0/`, 'POST', query, resolve, reject)
    })
  },
  // 我的订单 - 评价订单
  orderToEvaluate(query) {
    return new Promise((resolve, reject) => {
      execute(`/imUserOrderToEvaluate/1.0/`, 'POST', query, resolve, reject)
    })
  },
  // 预约探店
  ctPoAgentByUs(query) {
    return new Promise((resolve, reject) => {
      execute(`/poAgentByUs/1.0/`, 'POST', query, resolve, reject)
    })
  },
  // 获取kolId
  ctGetKolId(query) {
    return new Promise((resolve, reject) => {
      execute(`/usKolInfo/1.0/`, 'POST', query, resolve, reject)
    })
  },
  // 分享赚钱 已注册用户
  shareRegisterUser(query) {
    return new Promise((resolve, reject) => {
      execute(`/usGetSpreadInfo/1.0/`, 'POST', query, resolve, reject)
    })
  },
  // 分享赚钱 领取条件
  shareGetLimit(query) {
    return new Promise((resolve, reject) => {
      execute(`/sysGetSpreadConfig/1.0/`, 'POST', query, resolve, reject)
    })
  },
  // 分享赚钱 领取奖励
  shareReward(query) {
    return new Promise((resolve, reject) => {
      execute(`/usGetNumberInfo/1.0/`, 'POST', query, resolve, reject)
    })
  },
  // 分享赚钱 确认领取
  shareInsertMoney(query) {
    return new Promise((resolve, reject) => {
      execute(`/usGetSpreadAmount/1.0/`, 'POST', query, resolve, reject)
    })
  },
  // 分享赚钱 获取邀请码二维码
  shareIusGetQRCode(query) {
    return new Promise((resolve, reject) => {
      execute(`/usGetQRCode/1.0/`, 'POST', query, resolve, reject)
    })
  },
  // 获取所有银行卡
  sysGetBankConf(query) {
    return new Promise((resolve, reject) => {
      execute(`/sysGetBankConf/1.0/`, 'POST', query, resolve, reject)
    })
  },
  // 待提现
  atsUnfreezingAndFreezing(query) {
    return new Promise((resolve, reject) => {
      execute(`/atsUnfreezingAndFreezing/1.0/`, 'POST', query, resolve, reject)
    })
  },
  // 获取钱包已提现
  sysGetCashList(query) {
    return new Promise((resolve, reject) => {
      execute(`/atsWithdrawList/1.0/`, 'POST', query, resolve, reject)
    })
  },
  // 获取钱包已提现 - 详情
  sysGetCashDetail(query) {
    return new Promise((resolve, reject) => {
      execute(`/atsRecordInfo/1.0/`, 'POST', query, resolve, reject)
    })
  }
  
  /*** file-end ***/
}
