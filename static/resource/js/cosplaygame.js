(function(global){

  var log = console.log.bind(console)
  var emmit = new YCWebViewBridge('cosplay')
  var o = function () {}
  var FROM_RN_KEY = 'rn'
  var FROM_MY_KEY = 'my'
  var FROM_COMPLETE_KEY = 'complete'
  var isLoad = false
  var userDress = null

  /** TS: 资源加载完成 */
  var $assetsOnLoaded = function () {
    var urlObject = getUrlParameter()
    isLoad = true
    // rn 中调不需要注册监听事件
    if (urlObject.from === 'rn') {
      var rnBridge = window.YCPostMessage || window.postMessage
      rnBridge('onLoad')
    } else {
      setUserDress(isLoad, userDress);
      var data = { ok: true, data: { message: 'assets is onloaded!' } }
      // 注册播放动画事件
      emmit.on('playAnimation', function (res, responseCallback) {
        var animationName = res.data.name
        window.COSPLAY_STAGE.playBoneAnimation(animationName)
        responseCallback({ ok: true, data: { message: 'play success!' } })
      })
      // 注册停止播放动画事件
      emmit.on('stopAnimation', function (res, responseCallback) {
        var animationName = res.data.name
        window.COSPLAY_STAGE.stopBoneAnimation(animationName)
        responseCallback({ ok: true, data: { message: 'stop success!' } })
      })
      // 重新装载服装
      emmit.on('reloadUserDress', function (res, responseCallback) {
        fetchUserDress()
        responseCallback({ ok: true, data: { message: 'reload get!' } })
      })
      // 检测 ios 分享页面提供的数据
      emmit.on('shareDress', function (res, responseCallback) {
        console.log('shareDress', res.data)
        setUserDress(true, res.data)
        responseCallback({ ok: true, data: { message: 'dress get!' } })
      })
      // 通知 native 加载完成
      emmit.callNative('onLoad', data, o)
    }
  }

  /**
   * 比较两个版本号的大小
   * if left > right return -1
   * if left < right return 1
   * if left = right return 0
   */
  var compareVersion = function (left, right) {
    var regex = /^(\d+)\.*(\d*)\.*(\d*)/
    if (regex.test(left) && regex.test(right)) {
      var leftMatch = left.match(regex)
      var rightMatch = right.match(regex)
      var x = [leftMatch[1], rightMatch[1]]
      var y = [leftMatch[2], rightMatch[2]]
      var z = [leftMatch[3], rightMatch[3]]
      if (x[1] !== x[0]) return x[1] > x[0] ? 1 : -1
      if (y[1] !== y[0]) return y[1] > y[0] ? 1 : -1
      if (z[1] !== z[0]) return z[1] > z[0] ? 1 : -1
      return 0
    }
  }

  /**
   * 获取用户 URL 参数
   */
  var getUrlParameter = (function () {
    var result
    return function () {
      if (result) return result
      var search = window.location.search
      if (!search) return {}
      return search
              .replace('?', '')
              .split('&')
              .reduce(function (prev, next) {
        var kv = next.split('=')
        var key = decodeURIComponent(kv[0])
        var val = decodeURIComponent(kv[1])
        prev[key] = val
        return prev
      }, {})
    }
  })()

  /**
   * 获取用户装扮数据
   */
  var fetchUserDress = function () {
    var urlObject = getUrlParameter()
    var loadRemoteJson = urlObject.loadRemoteJson && urlObject.loadRemoteJson.toString() // ios专属： 0-不需要加载远程服装 1-需要加载远程服装
    if (urlObject.from === 'rn' || loadRemoteJson === '0') return
    var token = urlObject.token
    var appVersion = urlObject.appVersion
    var otherUserId = urlObject.otherUserId
    var userId = urlObject.userId
    var env = urlObject.env // iOS 本地化会用到
    var ua = navigator.userAgent.toLowerCase()
    var isAndroid = ua.indexOf("android") != -1 ? 1 : 0
    var url, urlUserId, path;
    // env 兼容 ios 本地情况
    if (env === 'prod') {
      url = isAndroid ? 'https://android-api-v5-0.yangcong345.com' : 'https://ios-api-v5-0.yangcong345.com'
    } else if (env === 'dev') {
      url = 'https://api-test.yangcong345.com'
    } else {
      // ios android 非本地情况
      url = isAndroid ? 'https://android-api-v5-0.yangcong345.com' : 'https://ios-api-v5-0.yangcong345.com'
      // url = 'https://api-test.yangcong345.com'
    }
    if (otherUserId) {
      urlUserId = otherUserId
    } else if (userId) {
      urlUserId = userId
    }

    // 版本兼容
    if (appVersion && compareVersion('4.3.0', appVersion) > -1) {
      // 新版本
      path = '/cosplay/dressed/' + urlUserId
    } else {
      // 旧版本
      path = '/cosplay/my/clothes?isDressed=1'
    }
    var promise = new Promise(function (resolve, reject) {
      fetch(url + path, {
        method: 'get',
        headers: {
          "Authorization": token
        }
      })
      .then(function (res) {
        return res.json()
      })
      .then(function (json) {
        resolve(json)
      })
      .catch(function (ex) {
        reject(ex)
      })
    })

    var getBuffs = function (dress) {
      var dressed = dress.filter(function (x) { return x.isDressed && x.bufferType })
      return dressed.map(function (x) { 
        return { 
          bufferName: x.bufferName,
          bufferType: x.bufferType,
          bufferProbability: x.bufferProbability,
          bufferClothLevel: x.bufferClothLevel,
          bufferDescription: x.bufferDescription,
          level: x.level,
          name: x.name,
          part: x.part,
          clothId: x.clothId
        }
      })
    }

    promise.then(function (data){
      var urlObject = getUrlParameter()
      var rows = data && data.rows || []
      
      userDress = rows
      // 先换装
      setUserDress(isLoad, rows);
      // 给 native 推送 buffs 数据
      var buffs = getBuffs(rows)
      emmit.callNative('buffs', { ok: true, data: { buffs: buffs } }, o)
    }, function(ex) {
      emmit.callNative('buffs', { ok: true, data: { buffs: [] } }, o)
      log('user dress get error', ex)
    })
  }

  var setUserDress = function (isLoaded, resources) {
    var urlObject = getUrlParameter()
    if (isLoaded && resources) {
      // 筛选出默认的装扮
      var parts = ['head', 'body', 'leg', 'foot', 'background', 'bonusDecorate', 'frame'];
      var defaultParts = parts.filter(function (n, index) {
        return !resources.some(function (res, idx) {
          return res.part === n
        })
      })
      defaultParts.forEach(function (part) {
        if (part === 'background' && urlObject.from !== FROM_COMPLETE_KEY) {
          setBackground();
        }
        window.COSPLAY_STAGE.setDefaultSlot(part)
      })
      // 处理需要更换的装扮
      var resArray = resources.reduce(function (p, n, index) {
        if (n.part === 'background' && urlObject.from !== FROM_COMPLETE_KEY) {
          setBackground(n.resources);
        }
        if (n.part === 'bonusDecorate' && urlObject.from === FROM_COMPLETE_KEY) {
          return p;
        }
        if (n.part !== 'background' && n.part !== 'frame' && n.part) {
          return p.concat(n.resources);
        }
        return p;
      }, []);
      window.COSPLAY_STAGE.setSlotDisplayByResources(resArray)
    }
  }

  /** 换装API */
  var setSlotDisplay = function (slotName, skeData, texData, texture) {
    Main.__setSlot(slotName, skeData, texData, texture)
  }

  /** 更换背景API */
  var setBackground = function (url) {
    var $body = document.getElementById('body')
    var bgImg = new Image()
    var defaultBgImg = '/static/resource/art/clothes_background_default.png'
    var androidBgImg = '/cosplay' + defaultBgImg
    var iosBgImg = defaultBgImg
    var ua = navigator.userAgent.toLowerCase()
    var isAndroid = ua.indexOf("android") != -1 ? 1 : 0
    bgImg.onload = function () {
      emmit.callNative('bgImgLoaded', { ok: true, data: { message: 'bgImgLoaded' } }, o)
    }
    if (!url) {
      var bgImgSrc = isAndroid ? androidBgImg : iosBgImg
      bgImg.src = bgImgSrc
      $body.style.backgroundImage = 'url(' + bgImgSrc + ')'
    } else if (url.indexOf('http') > -1) {
      bgImg.src = url
      $body.style.backgroundImage = 'url(' + url + ')'
    } else if (url.indexOf('#') > -1) {
      bgImg.src = url
      $body.style.backgroundColor = url
    }
  }

  /**
   * 页面初始化方法
   */
  function initPage () {
    var urlObject = getUrlParameter()
    var from = urlObject.from || ''
    if (from === FROM_MY_KEY) {
      setBackground()
    } else if (from === FROM_COMPLETE_KEY) {
      setBackground('#fff')
    } else if (from === FROM_RN_KEY) {
      setBackground()
    }
  }

  window.COSPLAY = {
    setSlotDisplay: setSlotDisplay,
    setBackground: setBackground,
    $assetsOnLoaded: $assetsOnLoaded
  }

  //设置默认数据
  initPage()
  // 获取数据
  fetchUserDress()

})(window, undefined)

