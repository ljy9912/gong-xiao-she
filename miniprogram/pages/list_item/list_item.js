var base = getApp();
var preview=require('../../utils/preview.js');
Page({
    data: {
        loaded: false,
        cartNum: 0,
    },
    onLoad: function (e) {
        // var _this = this;
        // var key = e.pname;
        // var obj = base.shopping.getByName(e.pname);
        this.initCake(e);
        this.setData({ loaded: true });
        // if (obj) {
        //     _this.setData({ loaded: true });
        //     this.initCake(obj);
        // } else {
        //     base.get({ c: "Product", m: "GetCakeByName", City: "上海", ProName: key }, function shopping(d) {
        //         _this.setData({ loaded: true });
        //         var data = d.data;
        //         if (data.Status == "ok") {
        //             _this.initCake(data.Tag);
        //         }
        //     });
        // } 
    },
    initCake: function (d) {
        var _this = this;
        var tempdic = "";
        var type = [];
        var _list = [];
        wx.setNavigationBarTitle({ title: d.pname });
        const db = wx.cloud.database()
        // 查询当前用户所有的 counters
        db.collection('goods').where({
            _id: d.id
        })
        .get({
            success: res => {
                type = res.data[0].type;
                console.log(res);
            },
            fail: err => {
                console.log("请求失败");
            },
            complete: res => {
                wx.cloud.getTempFileURL({
                    fileList: [d.imgID],
                    success: res => {
                    console.log(res);
                    tempdic = res.fileList[0].tempFileURL;
                    console.log(list);
                    },
                    fail: err => {
                    console.log("图片加载失败");
                    wx.showToast({
                        title: '图片加载失败',
                    })
                    },
                    complete: res => {
                        _list.push(tempdic);
                        console.log(_list);
                        this.setData({
                            imgMinList: _list
                        })
                    }
                })
                this.setData({
                    name: d.pname,
                    num: 1,
                    des: d.des,
                    // resource: d.Resourse,
                    // fresh: d.KeepFresh,
                    current: {
                        size: type[0].size,
                        price: type[0].price,
                        supplyno: type[0].num,
                        des: type[0].des
                    },
                    type: type
                });
            }
        })
    },
    onShow: function (e) {
        // this.setData({ cartNum: base.cart.getNum() });
    },
    previewImg: function (e) {
        preview.show(this.data.name,this.data.brand,e.currentTarget.dataset.index)
    },
    changeCurrent: function (e) {
        var s = e.currentTarget.dataset.size;
        var p = e.currentTarget.dataset.price;
        var sno = e.currentTarget.dataset.supplyno;
        var imgid = e.currentTarget.dataset.imgid;
        var tempdic = "";
        var _list = [];
        wx.cloud.getTempFileURL({
            fileList: [imgid],
            success: res => {
                tempdic = res.fileList[0].tempFileURL;
            },
            fail: err => {
                console.log("图片加载失败");
                wx.showToast({
                    title: '图片加载失败',
                })
            },
            complete: res => {
                _list.push(tempdic);
                console.log(_list);
                this.setData({
                    imgMinList: _list
                })
            }
        })
        if (s && p && this.data.current.size != s) {
            this.setData({ "current.size": s, "current.price": p, "current.supplyno": sno })
        }
    },
    addCart: function () {
        var _this = this;
        console.log(this.data.name);
        if (base.cart.add({
            name: this.data.name,
            size: this.data.current.size,
            price: this.data.current.price,
            num: this.data.num,
            supplyno: this.data.current.supplyno,
            id: this.data.id,
            img: this.data.imgMinList[0]
        })) {
            // this.setData({ cartNum: base.cart.getNum() })
            base.modal({
                title: '加入成功！',
                content: "跳转到购物车或留在当前页",
                showCancel: true,
                cancelText: "留在此页",
                confirmText: "去购物车",
                success: function (res) {
                    if (res.confirm) {
                        _this.goc();
                    }
                }
            })
            // base.toast({
            //     title: '加入成功',
            //     icon: 'success',
            //     duration: 1500
            // })
        }
    },
    goCart: function () {
        if (!base.cart.exist(this.data.current.supplyno)) {
            base.cart.add({
                supplyno: this.data.current.supplyno,
                name: this.data.name,
                size: this.data.current.size,
                price: this.data.current.price,
                num: this.data.num
            })
        }
        this.goc();
    },
    goc: function () {
        var _this = this;
        base.cart.ref = "../cakeDetail/cakeDetail?pname=" + _this.data.name + "&brand=" + _this.data.brand;
        wx.switchTab({
            url: "../cart/cart"
        })
    },
    _go: function () {
        var _this = this;
        wx.navigateTo({
            url: "../buy/buy?type="+_this.data.brand+"&price=" + _this.data.current.price
        })
    }
});