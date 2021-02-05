//app.js
App({
  onLaunch: function () {
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        // env 参数说明：
        //   env 参数决定接下来小程序发起的云开发调用（wx.cloud.xxx）会默认请求到哪个云环境的资源
        //   此处请填入环境 ID, 环境 ID 可打开云控制台查看
        //   如不填则使用默认环境（第一个创建的环境）
        env: 'gongxiaoshe-9ghjzfqca26e0254',
        traceUser: true,
      })
    }

    this.globalData = {}
  },
  user: {
    userid: 0,//用户ID
    sessionid: "",//秘钥
    jzb: 0,
    exp: 0,
    phone: "",
    levels: 0,
    headimg: "",
    islogin: function (tp) {
        var re = false;
        if (this.userid > 0) {
            re = true;
        } else {
            if (tp == true) {
                wx.navigateTo({
                    url: '../phone/phone'
                })
            }
        }
        return re;
    },
    key: "userkey",
    setCache: function (obj) {
        wx.setStorageSync(this.key, obj);
    },
    getCache: function () {
        return wx.getStorageSync(this.key);
    },        
    clear: function () {
        wx.removeStorageSync(this.key);
    }
  },
  getUserInfo: function (cb) {
    var that = this
    if (this.globalData.userInfo) {
        typeof cb == "function" && cb(this.globalData.userInfo)
    } else {
        //调用登录接口
        wx.login({
            success: function (v) {
                console.log(v);
                wx.getUserInfo({
                    success: function (res) {
                        console.log(res);
                        that.globalData.userInfo = res.userInfo
                        typeof cb == "function" && cb(that.globalData.userInfo)
                    }
                })
            }
        })
    }
    },
  get: function (p, suc, tit) {
    var _this = this;
    //var loaded = false;//请求状态
    _this.loading.show({ title: tit });
    // setTimeout(function () {
    //     if (!loaded) {
    //         _this.loading.show();
    //     }
    // }, 500);
    if (_this.user.islogin()) {
        p.userid = _this.user.userid;
        p.sessionid = _this.user.sessionid;
    }
    wx.request({
        url: this.path.www + 'client.ashx?v=' + Math.random(),
        data: p,
        header: {
            'Content-Type': 'application/json'
        },
        method: "GET",
        success: function (res) {
            suc(res);
        },
        fail: function (e) {
            _this.toast({ title: "请求出错！" })
        },
        complete: function () {
            //loaded = true;//完成
            _this.loading.hide();
        }
    })
  },
  cart: {
    key: "cart",
    ref: "",
    add: function (p) {
        var re = false;
        if (p.price && p.size && p.name && p.num) {
            var dic = wx.getStorageSync(this.key) || {};
            console.log(p.supplyno);
            if (p.supplyno in dic) {
                dic[p.supplyno].num += p.num;
            } else {
                dic[p.supplyno] = { name: p.name, price: p.price, size: p.size, num: p.num, img:p.img, id: p.id }
            }
            wx.setStorageSync(this.key, dic);
            re = true;
        }
        return re;
    },
    exist: function (sno) {
        var re = false;
        var dic = wx.getStorageSync(this.key) || {};
        if (sno in dic) {
            re = true;
        }
        return re;
    },
    remove: function (sno) {
        var dic = wx.getStorageSync(this.key) || {};
        if (sno in dic) {
            delete dic[sno];
            wx.setStorageSync(this.key, dic);
        }
    },
    getNum: function () {
        var n = 0;
        var dic = wx.getStorageSync(this.key) || {}
        for (var i in dic) {
            n += dic[i].num;
        }
        return n;
    },
    num: function (sno, n) {
        var dic = wx.getStorageSync(this.key) || {};
        if (sno in dic) {
            if (n > 0) {
                dic[sno].num = n;
            } else {
                delete dic[sno];
            }
            wx.setStorageSync(this.key, dic);
        }
    },
    getList: function () {
        var list = [];
        var dic = wx.getStorageSync(this.key);
        for (var p in dic) {
            list.push({ supplyno: p, name: dic[p].name, price: dic[p].price, size: dic[p].size, num: dic[p].num, id: dic[p].id, img: dic[p].img });
        }
        return list;
    },
    clear: function () {
        wx.removeStorageSync(this.key);
    }
  },
  modal: function (p) {
    wx.showModal(p);
  },
})
