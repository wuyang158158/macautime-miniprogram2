function getLanguage() {
    //返回缓存中的language属性 (en / zh_CN) 	
    return wx.getStorageSync('Language') || 'zh'
};
  
function translate(){
    //返回翻译的对照信息
    return require(getLanguage() + '.js').languageMap;
}
  
function translateTxt(desc){
    //翻译	
    return translate()[desc] || '竟然没有翻译';
}

let tabBarLangs = {
    'zh': [
        '首页',
        '推荐',
        '我的'
    ],
    'zh_HK': [
        '首頁',
        '推薦',
        '我的'
    ]
};
// 设置 TabBar 语言
function setTabBarLang() {
    var L = getLanguage()
    let tabBarLang = tabBarLangs[L];
    tabBarLang.forEach((element, index) => {
      wx.setTabBarItem({
        'index': index,
        'text': element
      });
    });
};
  
module.exports = {
    getLanguage: getLanguage,
    setTabBarLang:setTabBarLang,
    _t: translate,
    _: translateTxt,
  }