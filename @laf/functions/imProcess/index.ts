

// import cloud from '@/cloud-sdk';
// const db = cloud.database();
// const _ = db.command;

// const sharp = require('sharp');
// const { registerFont } = require('canvas');
// const text2png = require('text2png');
// var assert = require('assert');
// // TODO 字体怎么访问
// registerFont('./方正黑体-GBK.TTF', {family: 'FZHei'});

exports.main = async function (ctx: FunctionContext) {
  // body, query 为请求参数, auth 是授权对象
  // const { auth, body, query } = ctx;

  // // 数据库操作
  // const app_name = body.app_name || process.env.app_name;
  // assert(app_name != undefined, "empty app_name!");
  // if (body.deploy_test === true) {
  //   // 进行部署检查
  //   return;
  // }
  // const limit_num = body.limit_num || 30;
  // const qf = { photo_compressed: _.in([undefined, '']), verified: true, photo_id: /^((?!\.heic$).)*$/i };
  // var photos = (await db.collection('photo').where(qf).limit(limit_num).get()).data;
  // var total_count = (await db.collection('photo').where(qf).count()).total;
  // console.log(`本次处理图片有${photos.length}张，共有${total_count}张`);

  // for (let i = 0; i < photos.length; i++) {
  //   const photo = photos[i];
  //   // 获取原图
  //   let originRes;
  //   try {
  //     // TODO downoadFile
  //     originRes = await cloud.downloadFile({
  //       fileID: photo.photo_id
  //     });
  //   } catch {
  //     console.error(`[${i}] fail photo: ${photo.photo_id}`)
  //     continue;
  //   }
  //   console.log(`[${i}] photo id: ${photo.photo_id}`);
  //   let origin = sharp(originRes.fileContent);
  //   let metadata = await origin.metadata();

  //   // 创建缩略图和水印图
  //   let [compressFileId, watermarkFileId] = await Promise.all([
  //     getCompressPhoto(origin, metadata),
  //     getWatermarkPhoto(origin, metadata, photo, app_name)
  //   ]);
  //   console.log(`[${i}] compress photo file id: ${compressFileId}`);
  //   console.log(`[${i}] watermark photo file id: ${watermarkFileId}`)

  //   // 更新数据库
  //   db.collection('photo').doc(photo._id).update({
  //     data: {
  //       photo_compressed: compressFileId,
  //       photo_watermark: watermarkFileId
  //     }
  //   }).then(dbOpRes => {
  //     console.log(`[${i}] database updated: ${JSON.stringify(dbOpRes)}`);
  //   });
  // }
  // return 'done';
}


// function generateUUID() {
//   var d = new Date().getTime();
//   var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
//     var r = (d + Math.random() * 16) % 16 | 0;
//     d = Math.floor(d / 16);
//     return (c == 'x' ? r : (r & 0x7 | 0x8)).toString(16);
//   });
//   return uuid;
// };

// 创建压缩图
// async function getCompressPhoto(origin, metadata) {
//   let ext = metadata.format;
//   let compressPhoto = await (
//     metadata.width > metadata.height ?
//     origin.clone().resize(Math.min(500, metadata.width)).withMetadata().toBuffer() :
//     origin.clone().resize(null, Math.min(500, metadata.height)).withMetadata().toBuffer()
//   )
//   // TODO uploadFile
//   let compressFileId = (await cloud.uploadFile({
//     fileContent: compressPhoto,
//     cloudPath:  'compressed/' + generateUUID() + '.' + ext
//   })).fileID;

//   return compressFileId;
// }

// 创建水印图
// async function getWatermarkPhoto(origin, metadata, photo, app_name) {
//   let ext = metadata.format;
//   let userInfo = photo.userInfo;
//   let text = app_name + '@' + (photo.photographer || userInfo.nickName);
//   let font_size = metadata.height * 0.03;
//   let try_times = 10;
//   while (try_times) {
//     try_times--;
//     try {
//       let watermark = text2png(text, {
//         font: `${Math.round(font_size)}px FZHei`,
//         color: 'white'
//       });
//       console.log(text);
//       // console.log(sizeOf(watermark));
//       var watermarkPhoto = await origin.composite([
//         {
//           input: watermark,
//           left: 30,
//           top: metadata.height - Math.round(metadata.height * 0.045)
//         }
//       ]).toBuffer();
//       break;
//     } catch {
//       font_size *= 0.9;
//     }
//   }
//   // 上传图片
//   // TODO uploadFile
//   let watermarkFileId = (await cloud.uploadFile({
//     fileContent: watermarkPhoto,
//     cloudPath: 'watermark/' + generateUUID() + '.' + ext
//   })).fileID;

//   return watermarkFileId
// }

