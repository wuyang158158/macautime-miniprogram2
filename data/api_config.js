export default {
  "env": {
    "dev": {
      // "baseUrl": "http://120.24.150.182:8055",
      // "baseUrl": "http://abcde.vaiwan.com",
      // "baseUrl": "https://test.guoh.com.cn:8443",
      // "baseUrl": "http://bixin.vipgz1.idcfengye.com",
      // "baseUrl": "http://192.168.31.146:8055",
      "baseUrl": "http://120.24.150.182:8055",
    },
    "prod": {
      "baseUrl": "https://time.guoh.com.cn:8443"
    },
  },
  "baseImageHost": "https://bixintech.oss-cn-shenzhen.aliyuncs.com", //上传图片的域名
  "curEnv": "dev",
  //接口请求返回码
  //TODO 了解当前后台系统所有返回code并添加进错误码枚举对象里面
  "messageCode": {
    "200": "请求成功！",
    "400": "服务请求失败！",
    "401": "当前登录已过期，请重新登录！",
    "403": "当前用户无权限请求该内容！",
    "404": "请求的资源不存在！",
    "500": "当前服务不可用！",
    "503": "当前服务不可用！"
  }
}