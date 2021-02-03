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
   list: [],
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
      var tempdic = "";
      var j = 0;
      const db = wx.cloud.database()
      // 查询当前用户所有的 counters
      db.collection('goods').get({
        success: res => {
          dic = res.data;
          var fileList = [];
          for (var i in dic){
            fileList.push(dic[i].imgID);
          }
          console.log(fileList);
          wx.cloud.getTempFileURL({
            fileList: fileList,
            success: res => {
              console.log(res);
              tempdic = res.fileList;
              console.log(list);
            },
            fail: err => {
              console.log("图片加载失败");
              wx.showToast({
                title: '图片加载失败',
              })
            },
            complete: res => {
              for (var i in dic){
                list.push({
                  name:dic[i].name,
                  des: dic[i].des,
                  price: dic[i].price,
                  imgUrl: tempdic[i].tempFileURL,
                  imgID: dic[i].imgID
                })
                console.log(list);
              }
              this.setData({
                "list": list
              })
            }
          })
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
      var pname = e.currentTarget.dataset.pname;
      var des = e.currentTarget.dataset.des;
      var price = e.currentTarget.dataset.price;
      var imgID = e.currentTarget.dataset.imgid;
      var imgUrl = e.currentTarget.dataset.imgurl;
      console.log(imgUrl);
      if (pname) {
          wx.navigateTo({
              url: '../list_item/list_item?pname=' + pname + "&des=" + des + "&price=" + price + "&imgID=" + imgID
          })
      }
  }
})