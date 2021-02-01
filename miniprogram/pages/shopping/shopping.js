// pages/shopping/shopping.js
const app = getApp()

Page({
 
  /**
   * 页面的初始数据
   */
  data: {
    // title: '加载中...', // 状态
    // list: [], // 数据列表
    // type: '', // 数据类型
    // loading: true, // 显示等待框
   list: []
  },
 
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) { // options 为 board页传来的参数
    var _this = this;
    // var _dic = app.shopping.getCache();
    // if (_dic) {
    //     this.setlist(_dic);
    // } else {
    //     this.initData();
    // }
      var list = [];
      var dic = [];
      var tmpImgDic = "";
      const db = wx.cloud.database()
      // 查询当前用户所有的 counters
      db.collection('goods').get({
        success: res => {
          dic = res.data;
          for (var i in dic) {
            wx.cloud.downloadFile({
              "fileID": res.data[i].imgID,
              success: res => {
                tmpImgDic = res.tempFilePath;
              },
              fail: err=> {
                console.log("img downloading failed")
                wx.showToast({
                  title: '图片加载失败',
                })
              }
            })
            console.log(tmpImgDic);
            list.push({
                name: dic[i].name,
                price: dic[i].price + ".00",
                des: dic[i].des,
                imgUrl: tmpImgDic
            })
        }
          this.setData({
            "list": dic,
          })
          console.log('[数据库] [查询记录] 成功: ', res.data[0].name)
        },
        fail: err => {
          wx.showToast({
            icon: 'none',
            title: '查询记录失败'
          })
          console.error('[数据库] [查询记录] 失败：', err)
        }
      })
    },
    goDetail: function (e) {
      var d = e.currentTarget.dataset.pname;
      var b = e.currentTarget.dataset.brand;
      if (d) {
          wx.navigateTo({
              url: '../cakeDetail/cakeDetail?pname=' + d + "&brand=" + b
          })
      }
  }
})