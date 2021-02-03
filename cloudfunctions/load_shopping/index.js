// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  var list=[];
  // console.log(event.dic)
  var fileList = [];
  for (var i in event.dic){
    fileList.push(event.dic[i].imgID);
  }
  const result = await cloud.getTempFileURL({
    fileList: fileList,
  })
  return result.fileList
}