/**
 * 格式化时间
 */
const formatTime = date => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hour = date.getHours();
  const minute = date.getMinutes();
  const second = date.getSeconds();

  return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute, second].map(formatNumber).join(':');
};

/**
 * 格式化数字
 */
const formatNumber = n => {
  n = n.toString();
  return n[1] ? n : '0' + n;
};

/** 
 * 时间戳转化为年 月 日 时 分 秒 
 * number: 传入时间戳 
 * format：返回格式，支持自定义，但参数必须与formateArr里保持一致 
 */
const formatTimeTwo = (time, format) => {
    let date
    if (typeof time === 'object') {
      date = time
    } else {
      if (isNaN(Number(time))) {
        date = new Date(time)
      } else {
        if (('' + time).length === 10) time = parseInt(time) * 1000
        date = new Date(time)
      }
    }

    var formateArr = ['Y', 'M', 'D', 'h', 'm', 's'];
    var returnArr = [];
    returnArr.push(date.getFullYear());
    returnArr.push(formatNumber(date.getMonth() + 1));
    returnArr.push(formatNumber(date.getDate()));

    returnArr.push(formatNumber(date.getHours()));
    returnArr.push(formatNumber(date.getMinutes()));
    returnArr.push(formatNumber(date.getSeconds()));

    for (var i in returnArr) {
      format = format.replace(formateArr[i], returnArr[i]);
    }
    return format;
  };
  /**
   * 根据起止时间计算有效期 日期格式为 YYYY-MM-dd  
   */
  const daysBetween = (DateOne, DateTwo) => {
      var OneMonth = DateOne.substring(5, DateOne.lastIndexOf('/'));
      var OneDay = DateOne.substring(DateOne.length, DateOne.lastIndexOf('/') + 1);
      var OneYear = DateOne.substring(0, DateOne.indexOf('/'));

      var TwoMonth = DateTwo.substring(5, DateTwo.lastIndexOf('/'));
      var TwoDay = DateTwo.substring(DateTwo.length, DateTwo.lastIndexOf('/') + 1);
      var TwoYear = DateTwo.substring(0, DateTwo.indexOf('/'));

      var cha = ((Date.parse(OneMonth + '/' + OneDay + '/' + OneYear) - Date.parse(TwoMonth + '/' + TwoDay + '/' + TwoYear)) / 86400000);
      return Math.abs(cha);
    };

    /**
     * 判断字符串是否为空
     */
    const isNull = str => {
      if (str) {
        str = str.toString().replace(/\s/g, "")
        return str === '' || str === undefined || str === null || str === "undefined";
      } else {
        return true
      }
    };
/**
 * 会员中心领取劵合并数组
 */
const packedArray = array => {
  if (array.length) {
    let newArray = []
    let obj = {}
    array.forEach((v, i) => {
      Number(i) % 2 === 0 ? Number(i) + 1 === array.length ? newArray.push(objPush(v)) : obj = v : newArray.push(objPush(v, obj))
    });
    return newArray;
  } else {
    return true
  }
};
const objPush = (v, array) => {
  let obj = {
    array: []
  };
  array ? obj.array.push(array) : '';
  obj.array.push(v);
  return obj;
}
//折扣计算
const discountPrice = (price, discount) => {
  let newPrice = price * (Number(discount) / 100)
  return newPrice.toFixed(2)
}
// 根据对象属性labelId归类
const dealWithData = (data) => {
  var map = {},
  dest = [];
  for(var i = 0; i < data.length; i++){
    var ai = data[i];
    if(!map[ai.labelId]){
        dest.push({
          labelId: ai.labelId,
          labelName: ai.labelName || '',
            couponData: [ai]
        });
        map[ai.labelId] = ai;
    }else{
        for(var j = 0; j < dest.length; j++){
            var dj = dest[j];
            if(dj.labelId== ai.labelId){
                dj.couponData.push(ai);
                break;
            }
        }
    }
  }
  return dest
}

//转换日期 传入1,2,3 - 周一 周二 周三
const transleteDate = (date) => {
  if(!date) return ''
  const dataArr = date.split(',')
  const newDataArr = []
  dataArr.forEach(ele => {
    switch(ele) {
      case "1":
        newDataArr.push('一')
        break;
      case "2":
        newDataArr.push('二')
        break;
      case "3":
        newDataArr.push('三')
        break;
      case "4":
        newDataArr.push('四')
        break;
      case "5":
        newDataArr.push('五')
        break;
      case "6":
        newDataArr.push('六')
        break;
      case "7":
        newDataArr.push('日')
        break;
    }
  })
  if(newDataArr.length === 7) {
    return '周一至周日'
  } else if(newDataArr.length === 6 && newDataArr.indexOf('日') === -1 )  {
    return '周一至周六'
  } else if(newDataArr.length === 5 && newDataArr.indexOf('六') === -1 && newDataArr.indexOf('日') === -1 )  {
    return '工作日'
  } else {
    let str = ''
    newDataArr.forEach(element => {
      str += `周${element} `
    })
    return str
  }
}

// 排序
const compare = (property,desc) => {
  return function (a, b) {
      var value1 = a[property];
      var value2 = b[property];
      if(desc === true) {
          // 升序排列
          return value1 - value2;
      } else {
          // 降序排列
          return value2 - value1;
      }
  }
}


module.exports = {
  formatTime: formatTime,
  formatNumber: formatNumber,
  formatTimeTwo: formatTimeTwo,
  daysBetween: daysBetween,
  isNull: isNull,
  packedArray: packedArray,
  discountPrice: discountPrice,
  dealWithData: dealWithData,
  transleteDate: transleteDate,
  compare
};