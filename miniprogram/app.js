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
