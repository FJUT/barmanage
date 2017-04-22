/**
 * Created by Administrator on 2017/4/15.
 */
const ALY = require('aliyun-sdk')
const co = require('co')
/*
 * 参考 https://help.aliyun.com/document_detail/28428.html?spm=5176.doc50199.6.553.Dg1qil 创建key和secret
 * */
const accessKeyId = 'LTAIBnvDolNCwnuw'
const AccessKeySevcret = 'lAvBOp5JoFeb5NjhxVshbrOC3xXXlg'

const green = new ALY.GREEN({
  accessKeyId: accessKeyId,
  secretAccessKey: AccessKeySevcret,
  endpoint: 'http://green.cn-hangzhou.aliyuncs.com',
  apiVersion: '2016-12-16'
})

const DETECION_FAILED = '图片检测失败'

const HOST = 'https://jufoinfo.com/'

const imageDetection = (urls) => {
  const scenes = ['porn', 'illegal']

  return new Promise((resolve, reject) => {
    green.imageDetection({
      Async: false,
      ImageUrl: JSON.stringify(urls),
      Scene: JSON.stringify(scenes)
    }, function(err, data) {
      if(err) {
        console.log('error:', err);
        return;
      }
      console.log('success:', JSON.stringify(data));
      //判断是否成功
      if(data.Code === 'Success' && data.ImageResults.ImageResult.length > 0) {
        var imageResult = data.ImageResults.ImageResult[0];
        var imageUrl = imageResult.ImageName;
        var taskId = imageResult.TaskId;
        //获取结果
        var pornResult = imageResult.PornResult;
        var ocrResult = imageResult.OcrResult;
        var illegalResult = imageResult.IllegalResult;
        var sensitiveFaceResult = imageResult.SensitiveFaceResult;
        var adResult = imageResult.AdResult;
        var qrcodeResult = imageResult.QrcodeResult;
        /**
         * 黄图检测结果
         */
        /**
         * 绿网给出的建议值, 0表示正常，1表示色情，2表示需要review
         */
        console.log(pornResult.Label);


        /**
         * 暴恐敏感识别结果
         */
        /**
         * 绿网给出的建议值, 0表示正常，1表示命中暴恐渉政，2表示需要review
         */
        console.log(illegalResult.Label);

        if (pornResult.Label != 1 && illegalResult.Label != 1) {
          resolve(true)
        } else {
          reject(new Error('图片违规'))
        }
      }else{
        //出错情况下打印出结果
        console.log(data.Code);
        console.log(data.Msg);
        reject(new Error(data.Msg))
      }
    })
  })
}

module.exports = (req, res, next) => {
  co(function*() {
    var url = HOST + req.file.filename
    var urls = [url]
    var result = yield imageDetection(urls)

    if (result) {
      next()
    } else {
      res.json({
        iRet: -1
      })
    }
  })
    .catch(err => {
      res.json({
        iRet: -1
      })
    })
}
