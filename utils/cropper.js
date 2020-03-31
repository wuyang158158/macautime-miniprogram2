(function(global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
      typeof define === 'function' && define.amd ? define(factory) :
      (global.WeCropper = factory());
  }(this, (function() {
    'use strict';
  
    var device = void 0;
    var TOUCH_STATE = ['touchstarted', 'touchmoved', 'touchended'];
  
    function isFunction(obj) {
      return typeof obj === 'function'
    }
  
    function firstLetterUpper(str) {
      return str.charAt(0).toUpperCase() + str.slice(1)
    }
  
    function setTouchState(instance) {
      var arg = [],
        len = arguments.length - 1;
      while (len-- > 0) arg[len] = arguments[len + 1];
  
      TOUCH_STATE.forEach(function(key, i) {
        if (arg[i] !== undefined) {
          instance[key] = arg[i];
        }
      });
    }
  
    function validator(instance, o) {
      Object.defineProperties(instance, o);
    }
  
    function getDevice() {
      if (!device) {
        device = wx.getSystemInfoSync();
      }
      return device
    }
  
    var tmp = {};
  
    var DEFAULT = {
      id: {
        default: 'cropper',
        get: function get() {
          return tmp.id
        },
        set: function set(value) {
          if (typeof(value) !== 'string') {
            console.error(("id：" + value + " is invalid"));
          }
          tmp.id = value;
        }
      },
      width: {
        default: 750,
        get: function get() {
          return tmp.width
        },
        set: function set(value) {
          if (typeof(value) !== 'number') {
            console.error(("width：" + value + " is invalid"));
          }
          tmp.width = value;
        }
      },
      height: {
        default: 750,
        get: function get() {
          return tmp.height
        },
        set: function set(value) {
          if (typeof(value) !== 'number') {
            console.error(("height：" + value + " is invalid"));
          }
          tmp.height = value;
        }
      },
      scale: {
        default: 2.5,
        get: function get() {
          return tmp.scale
        },
        set: function set(value) {
          if (typeof(value) !== 'number') {
            console.error(("scale：" + value + " is invalid"));
          }
          tmp.scale = value;
        }
      },
      zoom: {
        default: 5,
        get: function get() {
          return tmp.zoom
        },
        set: function set(value) {
          if (typeof(value) !== 'number') {
            console.error(("zoom：" + value + " is invalid"));
          } else if (value < 0 || value > 10) {
            console.error("zoom should be ranged in 0 ~ 10");
          }
          tmp.zoom = value;
        }
      },
      router: {
        default: 0,
        get: function get() {
          return tmp.router
        },
        set: function set(value) {
          if (typeof(value) !== 'number') {
            console.error(("router" + value + " is invalid"));
          } else if (value < 0 || value > 360) {
            console.error("router should be ranged in 0 ~ 360");
          }
          tmp.router = value;
        }
      },
      src: {
        default: 'cropper',
        get: function get() {
          return tmp.src
        },
        set: function set(value) {
          if (typeof(value) !== 'string') {
            console.error(("id：" + value + " is invalid"));
          }
          tmp.src = value;
        }
      },
      cut: {
        default: {},
        get: function get() {
          return tmp.cut
        },
        set: function set(value) {
          if (typeof(value) !== 'object') {
            console.error(("id：" + value + " is invalid"));
          }
          tmp.cut = value;
        }
      },
      onReady: {
        default: null,
        get: function get() {
          return tmp.ready
        },
        set: function set(value) {
          tmp.ready = value;
        }
      },
      onBeforeImageLoad: {
        default: null,
        get: function get() {
          return tmp.beforeImageLoad
        },
        set: function set(value) {
          tmp.beforeImageLoad = value;
        }
      },
      onImageLoad: {
        default: null,
        get: function get() {
          return tmp.imageLoad
        },
        set: function set(value) {
          tmp.imageLoad = value;
        }
      },
      onBeforeDraw: {
        default: null,
        get: function get() {
          return tmp.beforeDraw
        },
        set: function set(value) {
          tmp.beforeDraw = value;
        }
      }
    };
  
    function prepare() {
      var self = this;
      var ref = getDevice();
      var windowWidth = ref.windowWidth;
  
      self.attachPage = function() {
        var pages = getCurrentPages();
        //  获取到当前page上下文
        var pageContext = pages[pages.length - 1];
        //  把this依附在Page上下文的wecropper属性上，便于在page钩子函数中访问
        pageContext.wecropper = self;
      };
  
      self.createCtx = function() {
        var id = self.id;
        if (id) {
          self.ctx = wx.createCanvasContext(id);
        } else {
          console.error("constructor: create canvas context failed, 'id' must be valuable");
        }
      };
  
      self.deviceRadio = windowWidth / 750;
    }
  
    function observer() {
      var self = this;
  
      var EVENT_TYPE = ['ready', 'beforeImageLoad', 'beforeDraw', 'imageLoad'];
  
      self.on = function(event, fn) {
        if (EVENT_TYPE.indexOf(event) > -1) {
          if (typeof(fn) === 'function') {
            event === 'ready' ?
              fn(self) :
              self[("on" + (firstLetterUpper(event)))] = fn;
          }
        } else {
          console.error(("event: " + event + " is invalid"));
        }
        return self
      };
    }
  
    var commonjsGlobal = typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};
  
  
  
  
  
    function createCommonjsModule(fn, module) {
      return module = {
        exports: {}
      }, fn(module, module.exports), module.exports;
    }
  
    var base64 = createCommonjsModule(function(module, exports) {
      /*! http://mths.be/base64 v0.1.0 by @mathias | MIT license */
      (function(root) {
  
        // Detect free variables `exports`.
        var freeExports = 'object' == 'object' && exports;
  
        // Detect free variable `module`.
        var freeModule = 'object' == 'object' && module &&
          module.exports == freeExports && module;
  
        // Detect free variable `global`, from Node.js or Browserified code, and use
        // it as `root`.
        var freeGlobal = typeof commonjsGlobal == 'object' && commonjsGlobal;
        if (freeGlobal.global === freeGlobal || freeGlobal.window === freeGlobal) {
          root = freeGlobal;
        }
  
        /*--------------------------------------------------------------------------*/
  
        var InvalidCharacterError = function(message) {
          this.message = message;
        };
        InvalidCharacterError.prototype = new Error;
        InvalidCharacterError.prototype.name = 'InvalidCharacterError';
  
        var error = function(message) {
          // Note: the error messages used throughout this file match those used by
          // the native `atob`/`btoa` implementation in Chromium.
          throw new InvalidCharacterError(message);
        };
  
        var TABLE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
        // http://whatwg.org/html/common-microsyntaxes.html#space-character
        var REGEX_SPACE_CHARACTERS = /[\t\n\f\r ]/g;
  
        // `decode` is designed to be fully compatible with `atob` as described in the
        // HTML Standard. http://whatwg.org/html/webappapis.html#dom-windowbase64-atob
        // The optimized base64-decoding algorithm used is based on @atk’s excellent
        // implementation. https://gist.github.com/atk/1020396
        var decode = function(input) {
          input = String(input)
            .replace(REGEX_SPACE_CHARACTERS, '');
          var length = input.length;
          if (length % 4 == 0) {
            input = input.replace(/==?$/, '');
            length = input.length;
          }
          if (
            length % 4 == 1 ||
            // http://whatwg.org/C#alphanumeric-ascii-characters
            /[^+a-zA-Z0-9/]/.test(input)
          ) {
            error(
              'Invalid character: the string to be decoded is not correctly encoded.'
            );
          }
          var bitCounter = 0;
          var bitStorage;
          var buffer;
          var output = '';
          var position = -1;
          while (++position < length) {
            buffer = TABLE.indexOf(input.charAt(position));
            bitStorage = bitCounter % 4 ? bitStorage * 64 + buffer : buffer;
            // Unless this is the first of a group of 4 characters…
            if (bitCounter++ % 4) {
              // …convert the first 8 bits to a single ASCII character.
              output += String.fromCharCode(
                0xFF & bitStorage >> (-2 * bitCounter & 6)
              );
            }
          }
          return output;
        };
  
        // `encode` is designed to be fully compatible with `btoa` as described in the
        // HTML Standard: http://whatwg.org/html/webappapis.html#dom-windowbase64-btoa
        var encode = function(input) {
          input = String(input);
          if (/[^\0-\xFF]/.test(input)) {
            // Note: no need to special-case astral symbols here, as surrogates are
            // matched, and the input is supposed to only contain ASCII anyway.
            error(
              'The string to be encoded contains characters outside of the ' +
              'Latin1 range.'
            );
          }
          var padding = input.length % 3;
          var output = '';
          var position = -1;
          var a;
          var b;
          var c;
          var buffer;
          // Make sure any padding is handled outside of the loop.
          var length = input.length - padding;
  
          while (++position < length) {
            // Read three bytes, i.e. 24 bits.
            a = input.charCodeAt(position) << 16;
            b = input.charCodeAt(++position) << 8;
            c = input.charCodeAt(++position);
            buffer = a + b + c;
            // Turn the 24 bits into four chunks of 6 bits each, and append the
            // matching character for each of them to the output.
            output += (
              TABLE.charAt(buffer >> 18 & 0x3F) +
              TABLE.charAt(buffer >> 12 & 0x3F) +
              TABLE.charAt(buffer >> 6 & 0x3F) +
              TABLE.charAt(buffer & 0x3F)
            );
          }
  
          if (padding == 2) {
            a = input.charCodeAt(position) << 8;
            b = input.charCodeAt(++position);
            buffer = a + b;
            output += (
              TABLE.charAt(buffer >> 10) +
              TABLE.charAt((buffer >> 4) & 0x3F) +
              TABLE.charAt((buffer << 2) & 0x3F) +
              '='
            );
          } else if (padding == 1) {
            buffer = input.charCodeAt(position);
            output += (
              TABLE.charAt(buffer >> 2) +
              TABLE.charAt((buffer << 4) & 0x3F) +
              '=='
            );
          }
  
          return output;
        };
  
        var base64 = {
          'encode': encode,
          'decode': decode,
          'version': '0.1.0'
        };
  
        // Some AMD build optimizers, like r.js, check for specific condition patterns
        // like the following:
        if (
          typeof undefined == 'function' &&
          typeof undefined.amd == 'object' &&
          undefined.amd
        ) {
          undefined(function() {
            return base64;
          });
        } else if (freeExports && !freeExports.nodeType) {
          if (freeModule) { // in Node.js or RingoJS v0.8.0+
            freeModule.exports = base64;
          } else { // in Narwhal or RingoJS v0.7.0-
            for (var key in base64) {
              base64.hasOwnProperty(key) && (freeExports[key] = base64[key]);
            }
          }
        } else { // in Rhino or a web browser
          root.base64 = base64;
        }
  
      }(commonjsGlobal));
    });
  
    function makeURI(strData, type) {
      return 'data:' + type + ';base64,' + strData
    }
  
    function fixType(type) {
      type = type.toLowerCase().replace(/jpg/i, 'jpeg');
      var r = type.match(/png|jpeg|bmp|gif/)[0];
      return 'image/' + r
    }
  
    function encodeData(data) {
      var str = '';
      if (typeof data === 'string') {
        str = data;
      } else {
        for (var i = 0; i < data.length; i++) {
          str += String.fromCharCode(data[i]);
        }
      }
      return base64.encode(str)
    }
  
    /**
     * 获取图像区域隐含的像素数据
     * @param canvasId canvas标识
     * @param x 将要被提取的图像数据矩形区域的左上角 x 坐标
     * @param y 将要被提取的图像数据矩形区域的左上角 y 坐标
     * @param width 将要被提取的图像数据矩形区域的宽度
     * @param height 将要被提取的图像数据矩形区域的高度
     * @param done 完成回调
     */
    function getImageData(canvasId, x, y, width, height, done) {
      wx.canvasGetImageData({
        canvasId: canvasId,
        x: x,
        y: y,
        width: width,
        height: height,
        success: function success(res) {
          done(res);
        },
        fail: function fail(res) {
          done(null);
          console.error('canvasGetImageData error: ' + res);
        }
      });
    }
  
    /**
     * 生成bmp格式图片
     * 按照规则生成图片响应头和响应体
     * @param oData 用来描述 canvas 区域隐含的像素数据 { data, width, height } = oData
     * @returns {*} base64字符串
     */
    function genBitmapImage(oData) {
      //
      // BITMAPFILEHEADER: http://msdn.microsoft.com/en-us/library/windows/desktop/dd183374(v=vs.85).aspx
      // BITMAPINFOHEADER: http://msdn.microsoft.com/en-us/library/dd183376.aspx
      //
      var biWidth = oData.width;
      var biHeight = oData.height;
      var biSizeImage = biWidth * biHeight * 3;
      var bfSize = biSizeImage + 54; // total header size = 54 bytes
  
      //
      //  typedef struct tagBITMAPFILEHEADER {
      //  	WORD bfType;
      //  	DWORD bfSize;
      //  	WORD bfReserved1;
      //  	WORD bfReserved2;
      //  	DWORD bfOffBits;
      //  } BITMAPFILEHEADER;
      //
      var BITMAPFILEHEADER = [
        // WORD bfType -- The file type signature; must be "BM"
        0x42, 0x4D,
        // DWORD bfSize -- The size, in bytes, of the bitmap file
        bfSize & 0xff, bfSize >> 8 & 0xff, bfSize >> 16 & 0xff, bfSize >> 24 & 0xff,
        // WORD bfReserved1 -- Reserved; must be zero
        0, 0,
        // WORD bfReserved2 -- Reserved; must be zero
        0, 0,
        // DWORD bfOffBits -- The offset, in bytes, from the beginning of the BITMAPFILEHEADER structure to the bitmap bits.
        54, 0, 0, 0
      ];
  
      //
      //  typedef struct tagBITMAPINFOHEADER {
      //  	DWORD biSize;
      //  	LONG  biWidth;
      //  	LONG  biHeight;
      //  	WORD  biPlanes;
      //  	WORD  biBitCount;
      //  	DWORD biCompression;
      //  	DWORD biSizeImage;
      //  	LONG  biXPelsPerMeter;
      //  	LONG  biYPelsPerMeter;
      //  	DWORD biClrUsed;
      //  	DWORD biClrImportant;
      //  } BITMAPINFOHEADER, *PBITMAPINFOHEADER;
      //
      var BITMAPINFOHEADER = [
        // DWORD biSize -- The number of bytes required by the structure
        40, 0, 0, 0,
        // LONG biWidth -- The width of the bitmap, in pixels
        biWidth & 0xff, biWidth >> 8 & 0xff, biWidth >> 16 & 0xff, biWidth >> 24 & 0xff,
        // LONG biHeight -- The height of the bitmap, in pixels
        biHeight & 0xff, biHeight >> 8 & 0xff, biHeight >> 16 & 0xff, biHeight >> 24 & 0xff,
        // WORD biPlanes -- The number of planes for the target device. This value must be set to 1
        1, 0,
        // WORD biBitCount -- The number of bits-per-pixel, 24 bits-per-pixel -- the bitmap
        // has a maximum of 2^24 colors (16777216, Truecolor)
        24, 0,
        // DWORD biCompression -- The type of compression, BI_RGB (code 0) -- uncompressed
        0, 0, 0, 0,
        // DWORD biSizeImage -- The size, in bytes, of the image. This may be set to zero for BI_RGB bitmaps
        biSizeImage & 0xff, biSizeImage >> 8 & 0xff, biSizeImage >> 16 & 0xff, biSizeImage >> 24 & 0xff,
        // LONG biXPelsPerMeter, unused
        0, 0, 0, 0,
        // LONG biYPelsPerMeter, unused
        0, 0, 0, 0,
        // DWORD biClrUsed, the number of color indexes of palette, unused
        0, 0, 0, 0,
        // DWORD biClrImportant, unused
        0, 0, 0, 0
      ];
  
      var iPadding = (4 - ((biWidth * 3) % 4)) % 4;
  
      var aImgData = oData.data;
  
      var strPixelData = '';
      var biWidth4 = biWidth << 2;
      var y = biHeight;
      var fromCharCode = String.fromCharCode;
  
      do {
        var iOffsetY = biWidth4 * (y - 1);
        var strPixelRow = '';
        for (var x = 0; x < biWidth; x++) {
          var iOffsetX = x << 2;
          strPixelRow += fromCharCode(aImgData[iOffsetY + iOffsetX + 2]) +
            fromCharCode(aImgData[iOffsetY + iOffsetX + 1]) +
            fromCharCode(aImgData[iOffsetY + iOffsetX]);
        }
  
        for (var c = 0; c < iPadding; c++) {
          strPixelRow += String.fromCharCode(0);
        }
  
        strPixelData += strPixelRow;
      } while (--y)
  
      var strEncoded = encodeData(BITMAPFILEHEADER.concat(BITMAPINFOHEADER)) + encodeData(strPixelData);
  
      return strEncoded
    }
  
    /**
     * 转换为图片base64
     * @param canvasId canvas标识
     * @param x 将要被提取的图像数据矩形区域的左上角 x 坐标
     * @param y 将要被提取的图像数据矩形区域的左上角 y 坐标
     * @param width 将要被提取的图像数据矩形区域的宽度
     * @param height 将要被提取的图像数据矩形区域的高度
     * @param type 转换图片类型
     * @param done 完成回调
     */
    function convertToImage(canvasId, x, y, width, height, type, done) {
      if (done === void 0) done = function() {};
  
      if (type === undefined) {
        type = 'png';
      }
      type = fixType(type);
      if (/bmp/.test(type)) {
        getImageData(canvasId, x, y, width, height, function(data) {
          var strData = genBitmapImage(data);
          isFunction(done) && done(makeURI(strData, 'image/' + type));
        });
      } else {
        console.error('暂不支持生成\'' + type + '\'类型的base64图片');
      }
    }
  
    var CanvasToBase64 = {
      convertToImage: convertToImage,
      // convertToPNG: function (width, height, done) {
      //   return convertToImage(width, height, 'png', done)
      // },
      // convertToJPEG: function (width, height, done) {
      //   return convertToImage(width, height, 'jpeg', done)
      // },
      // convertToGIF: function (width, height, done) {
      //   return convertToImage(width, height, 'gif', done)
      // },
      convertToBMP: function(ref, done) {
        if (ref === void 0) ref = {};
        var canvasId = ref.canvasId;
        var x = ref.x;
        var y = ref.y;
        var width = ref.width;
        var height = ref.height;
        if (done === void 0) done = function() {};
  
        return convertToImage(canvasId, x, y, width, height, 'bmp', done)
      }
    };
  
    function methods() {
      var self = this;
  
      var id = self.id;
      var deviceRadio = self.deviceRadio;
      var boundWidth = self.width; // 裁剪框默认宽度，即整个画布宽度
      var boundHeight = self.height; // 裁剪框默认高度，即整个画布高度
      var ref = self.cut;
      var x = ref.x;
      if (x === void 0) x = 0;
      var y = ref.y;
      if (y === void 0) y = 0;
      var width = ref.width;
      if (width === void 0) width = boundWidth;
      var height = ref.height;
      if (height === void 0) height = boundHeight;
  
      self.updateCanvas = function(rotate) {
        if (self.croperTarget) {
          //  画布绘制图片
          if (rotate) {
            self.ctx.rotate(rotate * Math.PI / 180);
          }
          self.ctx.drawImage(self.croperTarget, self.imgLeft, self.imgTop, self.scaleWidth, self.scaleHeight);
        }
        isFunction(self.onBeforeDraw) && self.onBeforeDraw(self.ctx, self);
        self.setBoundStyle(); //	设置边界样式
        self.ctx.draw();
        return self
      };
  
      self.pushOrign = function(src) {
        self.src = src;
  
        isFunction(self.onBeforeImageLoad) && self.onBeforeImageLoad(self.ctx, self);
  
        wx.getImageInfo({
          src: src,
          success: function success(res) {
            var innerAspectRadio = res.width / res.height;
  
            self.croperTarget = res.path;
  
            if (innerAspectRadio < width / height) {
              self.rectX = x;
              self.baseWidth = width;
              self.baseHeight = width / innerAspectRadio;
              self.rectY = y - Math.abs((height - self.baseHeight) / 2);
            } else {
              self.rectY = y;
              self.baseWidth = height * innerAspectRadio;
              self.baseHeight = height;
              self.rectX = x - Math.abs((width - self.baseWidth) / 2);
            }
  
            self.imgLeft = self.rectX;
            self.imgTop = self.rectY;
            self.scaleWidth = self.baseWidth;
            self.scaleHeight = self.baseHeight;
  
            self.updateCanvas();
  
            isFunction(self.onImageLoad) && self.onImageLoad(self.ctx, self);
          }
        });
  
        self.update();
        return self
      };
  
      self.getCropperBase64 = function(done) {
        if (done === void 0) done = function() {};
  
        CanvasToBase64.convertToBMP({
          canvasId: id,
          x: x,
          y: y,
          width: width,
          height: height
        }, done);
      };
  
      self.getCropperImage = function() {
        var args = [],
          len = arguments.length;
        while (len--) args[len] = arguments[len];
  
        var ARG_TYPE = toString.call(args[0]);
        var fn = args[args.length - 1];
  
        switch (ARG_TYPE) {
          case '[object Object]':
            var ref = args[0];
            var quality = ref.quality;
            if (quality === void 0) quality = 10;
  
            if (typeof(quality) !== 'number') {
              console.error(("quality：" + quality + " is invalid"));
            } else if (quality < 0 || quality > 10) {
              console.error("quality should be ranged in 0 ~ 10");
            }
            wx.canvasToTempFilePath({
              canvasId: id,
              x: x,
              y: y,
              width: width,
              height: height,
              destWidth: width * quality / (deviceRadio * 10),
              destHeight: height * quality / (deviceRadio * 10),
              success: function success(res) {
                isFunction(fn) && fn.call(self, res.tempFilePath);
              },
              fail: function fail(res) {
                isFunction(fn) && fn.call(self, null);
              }
            });
            break
          case '[object Function]':
            wx.canvasToTempFilePath({
              canvasId: id,
              x: x,
              y: y,
              width: width,
              height: height,
              destWidth: width / deviceRadio,
              destHeight: height / deviceRadio,
              success: function success(res) {
                isFunction(fn) && fn.call(self, res.tempFilePath);
              },
              fail: function fail(res) {
                isFunction(fn) && fn.call(self, null);
              }
            });
            break
        }
  
        return self
      };
    }
  
    /**
     * 获取最新缩放值
     * @param oldScale 上一次触摸结束后的缩放值
     * @param oldDistance 上一次触摸结束后的双指距离
     * @param zoom 缩放系数
     * @param touch0 第一指touch对象
     * @param touch1 第二指touch对象
     * @returns {*}
     */
    var getNewScale = function(oldScale, oldDistance, zoom, touch0, touch1) {
      var xMove, yMove, newDistance;
      // 计算二指最新距离
      xMove = Math.round(touch1.x - touch0.x);
      yMove = Math.round(touch1.y - touch0.y);
      newDistance = Math.round(Math.sqrt(xMove * xMove + yMove * yMove));
  
      return oldScale + 0.001 * zoom * (newDistance - oldDistance)
    };
  
    function update() {
      var self = this;
  
      if (!self.src) {
        return
      }
  
      self.__oneTouchStart = function(touch) {
        self.touchX0 = Math.round(touch.x);
        self.touchY0 = Math.round(touch.y);
      };
  
      self.__oneTouchMove = function(touch) {
        var xMove, yMove;
        // 计算单指移动的距离
        if (self.touchended) {
          return self.updateCanvas()
        }
        xMove = Math.round(touch.x - self.touchX0);
        yMove = Math.round(touch.y - self.touchY0);
  
        var imgLeft = Math.round(self.rectX + xMove);
        var imgTop = Math.round(self.rectY + yMove);
  
        self.outsideBound(imgLeft, imgTop);
  
        self.updateCanvas();
      };
  
      self.__twoTouchStart = function(touch0, touch1) {
        var xMove, yMove, oldDistance;
  
        self.touchX1 = Math.round(self.rectX + self.scaleWidth / 2);
        self.touchY1 = Math.round(self.rectY + self.scaleHeight / 2);
  
        // 计算两指距离
        xMove = Math.round(touch1.x - touch0.x);
        yMove = Math.round(touch1.y - touch0.y);
        oldDistance = Math.round(Math.sqrt(xMove * xMove + yMove * yMove));
  
        self.oldDistance = oldDistance;
      };
  
      self.__twoTouchMove = function(touch0, touch1) {
        var oldScale = self.oldScale;
        var oldDistance = self.oldDistance;
        var scale = self.scale;
        var zoom = self.zoom;
  
        self.newScale = getNewScale(oldScale, oldDistance, zoom, touch0, touch1);
  
        //  设定缩放范围
        self.newScale <= 1 && (self.newScale = 1);
        self.newScale >= scale && (self.newScale = scale);
  
        self.scaleWidth = Math.round(self.newScale * self.baseWidth);
        self.scaleHeight = Math.round(self.newScale * self.baseHeight);
        var imgLeft = Math.round(self.touchX1 - self.scaleWidth / 2);
        var imgTop = Math.round(self.touchY1 - self.scaleHeight / 2);
  
        self.outsideBound(imgLeft, imgTop);
  
        self.updateCanvas();
      };
  
      self.__xtouchEnd = function() {
        self.oldScale = self.newScale;
        self.rectX = self.imgLeft;
        self.rectY = self.imgTop;
      };
    }
  
    var handle = {
      //  图片手势初始监测
      touchStart: function touchStart(e) {
        var self = this;
        var ref = e.touches;
        var touch0 = ref[0];
        var touch1 = ref[1];
  
        setTouchState(self, true, null, null);
  
        // 计算第一个触摸点的位置，并参照改点进行缩放
        self.__oneTouchStart(touch0);
  
        // 两指手势触发
        if (e.touches.length >= 2) {
          self.__twoTouchStart(touch0, touch1);
        }
      },
  
      //  图片手势动态缩放
      touchMove: function touchMove(e) {
        var self = this;
        var ref = e.touches;
        var touch0 = ref[0];
        var touch1 = ref[1];
  
        setTouchState(self, null, true);
  
        // 单指手势时触发
        if (e.touches.length === 1) {
          self.__oneTouchMove(touch0);
        }
        // 两指手势触发
        if (e.touches.length >= 2) {
          self.__twoTouchMove(touch0, touch1);
        }
      },
  
      touchEnd: function touchEnd(e) {
        var self = this;
  
        setTouchState(self, false, false, true);
        self.__xtouchEnd();
      },
  
      touchRouter: function touchRouter(e) {
        router += 2;
        var self = this;
        self.updateCanvas(router);
        isFunction(self.onBeforeDraw) && self.onBeforeDraw(self.ctx, self);
  
        self.setBoundStyle(); //	设置边界样式
        self.ctx.draw();
      }
    };
  
    function cut() {
      var self = this;
      var boundWidth = self.width; // 裁剪框默认宽度，即整个画布宽度
      var boundHeight = self.height;
      // 裁剪框默认高度，即整个画布高度
      var ref = self.cut;
      var x = ref.x;
      if (x === void 0) x = 0;
      var y = ref.y;
      if (y === void 0) y = 0;
      var width = ref.width;
      if (width === void 0) width = boundWidth;
      var height = ref.height;
      if (height === void 0) height = boundHeight;
  
      /**
       * 设置边界
       * @param imgLeft 图片左上角横坐标值
       * @param imgTop 图片左上角纵坐标值
       */
      self.outsideBound = function(imgLeft, imgTop) {
        self.imgLeft = imgLeft >= x ?
          x :
          self.scaleWidth + imgLeft - x <= width ?
          x + width - self.scaleWidth :
          imgLeft;
  
        self.imgTop = imgTop >= y ?
          y :
          self.scaleHeight + imgTop - y <= height ?
          y + height - self.scaleHeight :
          imgTop;
      };
  
      /**
       * 设置边界样式
       * @param color	边界颜色
       */
      self.setBoundStyle = function(ref) {
        if (ref === void 0) ref = {};
        var color = ref.color;
        if (color === void 0) color = '#04b00f';
        var mask = ref.mask;
        if (mask === void 0) mask = 'rgba(0, 0, 0, 0.7)';
        var lineWidth = ref.lineWidth;
        if (lineWidth === void 0) lineWidth = 1;
  
        var boundOption = [{
            start: {
              x: x - lineWidth,
              y: y + 10 - lineWidth
            },
            step1: {
              x: x - lineWidth,
              y: y - lineWidth
            },
            step2: {
              x: x + 10 - lineWidth,
              y: y - lineWidth
            }
          },
          {
            start: {
              x: x - lineWidth,
              y: y + height - 10 + lineWidth
            },
            step1: {
              x: x - lineWidth,
              y: y + height + lineWidth
            },
            step2: {
              x: x + 10 - lineWidth,
              y: y + height + lineWidth
            }
          },
          {
            start: {
              x: x + width - 10 + lineWidth,
              y: y - lineWidth
            },
            step1: {
              x: x + width + lineWidth,
              y: y - lineWidth
            },
            step2: {
              x: x + width + lineWidth,
              y: y + 10 - lineWidth
            }
          },
          {
            start: {
              x: x + width + lineWidth,
              y: y + height - 10 + lineWidth
            },
            step1: {
              x: x + width + lineWidth,
              y: y + height + lineWidth
            },
            step2: {
              x: x + width - 10 + lineWidth,
              y: y + height + lineWidth
            }
          }
        ];
  
        // 绘制半透明层
        self.ctx.beginPath();
        self.ctx.setFillStyle(mask);
        self.ctx.fillRect(0, 0, x, boundHeight);
        self.ctx.fillRect(x, 0, width, y);
        self.ctx.fillRect(x, y + height, width, boundHeight - y - height);
        self.ctx.fillRect(x + width, 0, boundWidth - x - width, boundHeight);
        self.ctx.fill();
  
        boundOption.forEach(function(op) {
          self.ctx.beginPath();
          self.ctx.setStrokeStyle(color);
          self.ctx.setLineWidth(lineWidth);
          self.ctx.moveTo(op.start.x, op.start.y);
          self.ctx.lineTo(op.step1.x, op.step1.y);
          self.ctx.lineTo(op.step2.x, op.step2.y);
          self.ctx.stroke();
        });
      };
    }
  
    var version = "1.2.0";
    var router = 0;
  
    var weCropper = function weCropper(params) {
      var self = this;
      var _default = {};
  
      validator(self, DEFAULT);
  
      Object.keys(DEFAULT).forEach(function(key) {
        _default[key] = DEFAULT[key].default;
      });
      Object.assign(self, _default, params);
  
      self.prepare();
      self.attachPage();
      self.createCtx();
      self.observer();
      self.cutt();
      self.methods();
      self.init();
      self.update();
  
      return self
    };
  
    weCropper.prototype.init = function init() {
      var self = this;
      var src = self.src;
  
      self.version = version;
  
      typeof self.onReady === 'function' && self.onReady(self.ctx, self);
  
      if (src) {
        self.pushOrign(src);
      }
      setTouchState(self, false, false, false);
  
      self.oldScale = 1;
      self.newScale = 1;
  
      return self
    };
  
    Object.assign(weCropper.prototype, handle);
  
    weCropper.prototype.prepare = prepare;
    weCropper.prototype.observer = observer;
    weCropper.prototype.methods = methods;
    weCropper.prototype.cutt = cut;
    weCropper.prototype.update = update;
  
    return weCropper;
  
  })));
  
  
  /**
   * we-cropper v1.2.0
   * (c) 2018 dlhandsome
   * @license MIT
   */
  ! function(t, e) {
    "object" == typeof exports && "undefined" != typeof module ? module.exports = e() : "function" == typeof define && define.amd ? define(e) : t.WeCropper = e()
  }(this, function() {
    "use strict";
    var o = void 0,
      e = ["touchstarted", "touchmoved", "touchended"];
  
    function l(t) {
      return "function" == typeof t
    }
  
    function a(o) {
      for (var n = [], t = arguments.length - 1; 0 < t--;) n[t] = arguments[t + 1];
      e.forEach(function(t, e) {
        void 0 !== n[e] && (o[t] = n[e])
      })
    }
    var i = function() {
      this._hooks = {}
    };
    i.prototype.register = function(t, e) {
      this._hooks[t] || (this._hooks[t] = []), this._hooks[t].push(e)
    }, i.prototype.hook = function(t) {
      for (var e = this, o = [], n = arguments.length - 1; 0 < n--;) o[n] = arguments[n + 1];
      var r = [];
      return (this._hooks[t] || []).forEach(function(t) {
        "function" == typeof t && r.push(t.apply(e, o))
      }), r
    }, i.prototype.hookSequence = function(t, e) {
      var o = this,
        n = e;
      return (this._hooks[t] || []).forEach(function(t) {
        "function" == typeof t && (n = t.apply(o, n))
      }), n
    }, i.prototype.hookReturnOrigin = function(t) {
      for (var e = this, o = [], n = arguments.length - 1; 0 < n--;) o[n] = arguments[n + 1];
      return (this._hooks[t] || []).forEach(function(t) {
        "function" == typeof t && t.apply(e, o)
      }), o
    };
    var n = {},
      c = {
        id: {
          default: "cropper",
          get: function() {
            return n.id
          },
          set: function(t) {
            "string" != typeof t && console.error("id\uff1a" + t + " is invalid"), n.id = t
          }
        },
        width: {
          default: 750,
          get: function() {
            return n.width
          },
          set: function(t) {
            "number" != typeof t && console.error("width\uff1a" + t + " is invalid"), n.width = t
          }
        },
        height: {
          default: 750,
          get: function() {
            return n.height
          },
          set: function(t) {
            "number" != typeof t && console.error("height\uff1a" + t + " is invalid"), n.height = t
          }
        },
        scale: {
          default: 2.5,
          get: function() {
            return n.scale
          },
          set: function(t) {
            "number" != typeof t && console.error("scale\uff1a" + t + " is invalid"), n.scale = t
          }
        },
        zoom: {
          default: 5,
          get: function() {
            return n.zoom
          },
          set: function(t) {
            "number" != typeof t ? console.error("zoom\uff1a" + t + " is invalid") : (t < 0 || 10 < t) && console.error("zoom should be ranged in 0 ~ 10"), n.zoom = t
          }
        },
        src: {
          default: "cropper",
          get: function() {
            return n.src
          },
          set: function(t) {
            "string" != typeof t && console.error("id\uff1a" + t + " is invalid"), n.src = t
          }
        },
        cut: {
          default: {},
          get: function() {
            return n.cut
          },
          set: function(t) {
            "object" != typeof t && console.error("id\uff1a" + t + " is invalid"), n.cut = t
          }
        },
        onReady: {
          default: null,
          get: function() {
            return n.ready
          },
          set: function(t) {
            n.ready = t
          }
        },
        onBeforeImageLoad: {
          default: null,
          get: function() {
            return n.beforeImageLoad
          },
          set: function(t) {
            n.beforeImageLoad = t
          }
        },
        onImageLoad: {
          default: null,
          get: function() {
            return n.imageLoad
          },
          set: function(t) {
            n.imageLoad = t
          }
        },
        onBeforeDraw: {
          default: null,
          get: function() {
            return n.beforeDraw
          },
          set: function(t) {
            n.beforeDraw = t
          }
        }
      };
    var f = "undefined" != typeof window ? window : "undefined" != typeof global ? global : "undefined" != typeof self ? self : {};
    var t, r = (function(u, d) {
      ! function(t) {
        var e = d,
          o = u && u.exports == e && u,
          n = "object" == typeof f && f;
        n.global !== n && n.window !== n || (t = n);
        var r = function(t) {
          this.message = t
        };
        (r.prototype = new Error).name = "InvalidCharacterError";
        var h = function(t) {
            throw new r(t)
          },
          s = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",
          c = /[\t\n\f\r ]/g,
          a = {
            encode: function(t) {
              t = String(t), /[^\0-\xFF]/.test(t) && h("The string to be encoded contains characters outside of the Latin1 range.");
              for (var e, o, n, r, a = t.length % 3, i = "", c = -1, u = t.length - a; ++c < u;) e = t.charCodeAt(c) << 16, o = t.charCodeAt(++c) << 8, n = t.charCodeAt(++c), i += s.charAt((r = e + o + n) >> 18 & 63) + s.charAt(r >> 12 & 63) + s.charAt(r >> 6 & 63) + s.charAt(63 & r);
              return 2 == a ? (e = t.charCodeAt(c) << 8, o = t.charCodeAt(++c), i += s.charAt((r = e + o) >> 10) + s.charAt(r >> 4 & 63) + s.charAt(r << 2 & 63) + "=") : 1 == a && (r = t.charCodeAt(c), i += s.charAt(r >> 2) + s.charAt(r << 4 & 63) + "=="), i
            },
            decode: function(t) {
              var e = (t = String(t).replace(c, "")).length;
              e % 4 == 0 && (e = (t = t.replace(/==?$/, "")).length), (e % 4 == 1 || /[^+a-zA-Z0-9/]/.test(t)) && h("Invalid character: the string to be decoded is not correctly encoded.");
              for (var o, n, r = 0, a = "", i = -1; ++i < e;) n = s.indexOf(t.charAt(i)), o = r % 4 ? 64 * o + n : n, r++ % 4 && (a += String.fromCharCode(255 & o >> (-2 * r & 6)));
              return a
            },
            version: "0.1.0"
          };
        if (e && !e.nodeType)
          if (o) o.exports = a;
          else
            for (var i in a) a.hasOwnProperty(i) && (e[i] = a[i]);
        else t.base64 = a
      }(f)
    }(t = {
      exports: {}
    }, t.exports), t.exports);
  
    function x(t) {
      var e = "";
      if ("string" == typeof t) e = t;
      else
        for (var o = 0; o < t.length; o++) e += String.fromCharCode(t[o]);
      return r.encode(e)
    }
  
    function u(t, e, o, n, r, a, i) {
      var c, u, h, s, d, f;
      void 0 === i && (i = function() {}), void 0 === a && (a = "png"), a = "image/" + a.toLowerCase().replace(/jpg/i, "jpeg").match(/png|jpeg|bmp|gif/)[0], /bmp/.test(a) ? (c = t, u = e, h = o, s = n, d = r, f = function(t) {
        var e = function(t) {
          var e = t.width,
            o = t.height,
            n = e * o * 3,
            r = n + 54,
            a = [66, 77, 255 & r, r >> 8 & 255, r >> 16 & 255, r >> 24 & 255, 0, 0, 0, 0, 54, 0, 0, 0],
            i = [40, 0, 0, 0, 255 & e, e >> 8 & 255, e >> 16 & 255, e >> 24 & 255, 255 & o, o >> 8 & 255, o >> 16 & 255, o >> 24 & 255, 1, 0, 24, 0, 0, 0, 0, 0, 255 & n, n >> 8 & 255, n >> 16 & 255, n >> 24 & 255, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            c = (4 - 3 * e % 4) % 4,
            u = t.data,
            h = "",
            s = e << 2,
            d = o,
            f = String.fromCharCode;
          do {
            for (var l = s * (d - 1), g = "", p = 0; p < e; p++) {
              var v = p << 2;
              g += f(u[l + v + 2]) + f(u[l + v + 1]) + f(u[l + v])
            }
            for (var y = 0; y < c; y++) g += String.fromCharCode(0);
            h += g
          } while (--d);
          return x(a.concat(i)) + x(h)
        }(t);
        l(i) && i("data:" + ("image/" + a) + ";base64," + e)
      }, wx.canvasGetImageData({
        canvasId: c,
        x: u,
        y: h,
        width: s,
        height: d,
        success: f,
        fail: function(t) {
          f(null), console.error("canvasGetImageData error: " + t)
        }
      })) : console.error("\u6682\u4e0d\u652f\u6301\u751f\u6210'" + a + "'\u7c7b\u578b\u7684base64\u56fe\u7247")
    }
    var g = {
      convertToImage: u,
      convertToBMP: function(t, e) {
        return void 0 === t && (t = {}), void 0 === e && (e = function() {}), u(t.canvasId, t.x, t.y, t.width, t.height, "bmp", e)
      }
    };
    var h = function(t, e, o, n, r) {
      var a, i;
      return a = Math.round(r.x - n.x), i = Math.round(r.y - n.y), t + .001 * o * (Math.round(Math.sqrt(a * a + i * i)) - e)
    };
    var s = "touchstart",
      d = "touchmove",
      p = "touchend",
      v = {
        touchStart: function(t) {
          var e = this,
            o = t.touches,
            n = o[0],
            r = o[1];
          e._hook.hook(s, t, e), a(e, !0, null, null), e.__oneTouchStart(n), 2 <= t.touches.length && e.__twoTouchStart(n, r)
        },
        touchMove: function(t) {
          var e = this,
            o = t.touches,
            n = o[0],
            r = o[1];
          e._hook.hook(d, t, e), a(e, null, !0), 1 === t.touches.length && e.__oneTouchMove(n), 2 <= t.touches.length && e.__twoTouchMove(n, r)
        },
        touchEnd: function(t) {
          this._hook.hook(p, t, this), a(this, !1, !1, !0), this.__xtouchEnd()
        }
      };
    var y = function(t) {
      var e, o, n = this,
        r = {};
      return e = n, o = c, Object.defineProperties(e, o), Object.keys(c).forEach(function(t) {
        r[t] = c[t].default
      }), Object.assign(n, r, t), n._hook = new i, n.prepare(), n.attachPage(), n.createCtx(), n.observer(), n.cutt(), n.methods(), n.init(), n.update(), n
    };
    return y.prototype.init = function() {
      var t = this,
        e = t.src;
      return t.version = "1.2.0", "function" == typeof t.onReady && t.onReady(t.ctx, t), e && t.pushOrign(e), a(t, !1, !1, !1), t.oldScale = 1, t.newScale = 1, t
    }, Object.assign(y.prototype, v), y.prototype.prepare = function() {
      var e = this,
        t = (o || (o = wx.getSystemInfoSync()), o).windowWidth;
      e.attachPage = function() {
        var t = getCurrentPages();
        t[t.length - 1].wecropper = e
      }, e.createCtx = function() {
        var t = e.id;
        t ? e.ctx = wx.createCanvasContext(t) : console.error("constructor: create canvas context failed, 'id' must be valuable")
      }, e.deviceRadio = t / 750
    }, y.prototype.observer = function() {
      var o = this;
      o.on = function(t, e) {
        return o._hook.register(t, e), o
      }
    }, y.prototype.methods = function() {
      var a = this,
        i = a.id,
        c = a.deviceRadio,
        t = a.width,
        e = a.height,
        o = a.cut,
        u = o.x;
      void 0 === u && (u = 0);
      var h = o.y;
      void 0 === h && (h = 0);
      var s = o.width;
      void 0 === s && (s = t);
      var d = o.height;
      void 0 === d && (d = e), a.updateCanvas = function() {
        return a.croperTarget && a.ctx.drawImage(a.croperTarget, a.imgLeft, a.imgTop, a.scaleWidth, a.scaleHeight), l(a.onBeforeDraw) && a.onBeforeDraw(a.ctx, a), a.setBoundStyle(), a.ctx.draw(), a
      }, a.pushOrign = function(t) {
        return a.src = t, l(a.onBeforeImageLoad) && a.onBeforeImageLoad(a.ctx, a), wx.getImageInfo({
          src: t,
          success: function(t) {
            var e = t.width / t.height;
            a.croperTarget = t.path, e < s / d ? (a.rectX = u, a.baseWidth = s, a.baseHeight = s / e, a.rectY = h - Math.abs((d - a.baseHeight) / 2)) : (a.rectY = h, a.baseWidth = d * e, a.baseHeight = d, a.rectX = u - Math.abs((s - a.baseWidth) / 2)), a.imgLeft = a.rectX, a.imgTop = a.rectY, a.scaleWidth = a.baseWidth, a.scaleHeight = a.baseHeight, a.updateCanvas(), l(a.onImageLoad) && a.onImageLoad(a.ctx, a)
          }
        }), a.update(), a
      }, a.getCropperBase64 = function(t) {
        void 0 === t && (t = function() {}), g.convertToBMP({
          canvasId: i,
          x: u,
          y: h,
          width: s,
          height: d
        }, t)
      }, a.getCropperImage = function() {
        for (var t = [], e = arguments.length; e--;) t[e] = arguments[e];
        var o = toString.call(t[0]),
          n = t[t.length - 1];
        switch (o) {
          case "[object Object]":
            var r = t[0].quality;
            void 0 === r && (r = 10), "number" != typeof r ? console.error("quality\uff1a" + r + " is invalid") : (r < 0 || 10 < r) && console.error("quality should be ranged in 0 ~ 10"), wx.canvasToTempFilePath({
              canvasId: i,
              x: u,
              y: h,
              width: s,
              height: d,
              destWidth: s * r / (10 * c),
              destHeight: d * r / (10 * c),
              success: function(t) {
                l(n) && n.call(a, t.tempFilePath)
              },
              fail: function(t) {
                l(n) && n.call(a, null)
              }
            });
            break;
          case "[object Function]":
            wx.canvasToTempFilePath({
              canvasId: i,
              x: u,
              y: h,
              width: s,
              height: d,
              destWidth: s / c,
              destHeight: d / c,
              success: function(t) {
                l(n) && n.call(a, t.tempFilePath)
              },
              fail: function(t) {
                l(n) && n.call(a, null)
              }
            })
        }
        return a
      }
    }, y.prototype.cutt = function() {
      var a = this,
        i = a.width,
        c = a.height,
        t = a.cut,
        u = t.x;
      void 0 === u && (u = 0);
      var h = t.y;
      void 0 === h && (h = 0);
      var s = t.width;
      void 0 === s && (s = i);
      var d = t.height;
      void 0 === d && (d = c), a.outsideBound = function(t, e) {
        a.imgLeft = u <= t ? u : a.scaleWidth + t - u <= s ? u + s - a.scaleWidth : t, a.imgTop = h <= e ? h : a.scaleHeight + e - h <= d ? h + d - a.scaleHeight : e
      }, a.setBoundStyle = function(t) {
        void 0 === t && (t = {});
        var e = t.color;
        void 0 === e && (e = "#04b00f");
        var o = t.mask;
        void 0 === o && (o = "rgba(0, 0, 0, 0.3)");
        var n = t.lineWidth;
        void 0 === n && (n = 1);
        var r = [{
          start: {
            x: u - n,
            y: h + 10 - n
          },
          step1: {
            x: u - n,
            y: h - n
          },
          step2: {
            x: u + 10 - n,
            y: h - n
          }
        }, {
          start: {
            x: u - n,
            y: h + d - 10 + n
          },
          step1: {
            x: u - n,
            y: h + d + n
          },
          step2: {
            x: u + 10 - n,
            y: h + d + n
          }
        }, {
          start: {
            x: u + s - 10 + n,
            y: h - n
          },
          step1: {
            x: u + s + n,
            y: h - n
          },
          step2: {
            x: u + s + n,
            y: h + 10 - n
          }
        }, {
          start: {
            x: u + s + n,
            y: h + d - 10 + n
          },
          step1: {
            x: u + s + n,
            y: h + d + n
          },
          step2: {
            x: u + s - 10 + n,
            y: h + d + n
          }
        }];
        a.ctx.beginPath(), a.ctx.setFillStyle(o), a.ctx.fillRect(0, 0, u, c), a.ctx.fillRect(u, 0, s, h), a.ctx.fillRect(u, h + d, s, c - h - d), a.ctx.fillRect(u + s, 0, i - u - s, c), a.ctx.fill(), r.forEach(function(t) {
          a.ctx.beginPath(), a.ctx.setStrokeStyle(e), a.ctx.setLineWidth(n), a.ctx.moveTo(t.start.x, t.start.y), a.ctx.lineTo(t.step1.x, t.step1.y), a.ctx.lineTo(t.step2.x, t.step2.y), a.ctx.stroke()
        })
      }
    }, y.prototype.update = function() {
      var u = this;
      u.src && (u.__oneTouchStart = function(t) {
        u.touchX0 = Math.round(t.x), u.touchY0 = Math.round(t.y)
      }, u.__oneTouchMove = function(t) {
        var e, o;
        if (u.touchended) return u.updateCanvas();
        e = Math.round(t.x - u.touchX0), o = Math.round(t.y - u.touchY0);
        var n = Math.round(u.rectX + e),
          r = Math.round(u.rectY + o);
        u.outsideBound(n, r), u.updateCanvas()
      }, u.__twoTouchStart = function(t, e) {
        var o, n, r;
        u.touchX1 = Math.round(u.rectX + u.scaleWidth / 2), u.touchY1 = Math.round(u.rectY + u.scaleHeight / 2), o = Math.round(e.x - t.x), n = Math.round(e.y - t.y), r = Math.round(Math.sqrt(o * o + n * n)), u.oldDistance = r
      }, u.__twoTouchMove = function(t, e) {
        var o = u.oldScale,
          n = u.oldDistance,
          r = u.scale,
          a = u.zoom;
        u.newScale = h(o, n, a, t, e), u.newScale <= 1 && (u.newScale = 1), u.newScale >= r && (u.newScale = r), u.scaleWidth = Math.round(u.newScale * u.baseWidth), u.scaleHeight = Math.round(u.newScale * u.baseHeight);
        var i = Math.round(u.touchX1 - u.scaleWidth / 2),
          c = Math.round(u.touchY1 - u.scaleHeight / 2);
        u.outsideBound(i, c), u.updateCanvas()
      }, u.__xtouchEnd = function() {
        u.oldScale = u.newScale, u.rectX = u.imgLeft, u.rectY = u.imgTop
      })
    }, y
  })
  