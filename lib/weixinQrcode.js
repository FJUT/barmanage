const fs = require("fs");
const fetch = require("node-fetch");
const APP_ID = "wx06a1ff0e6eb6505a";
const APP_SECRET = "70603dba83c47f0700b9107a630f49cb";

module.exports = id => {
  const url = `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${APP_ID}&secret=${APP_SECRET}`;

  return new Promise((resolve, reject) => {
    fetch(url)
      .then(res => res.json())
      .then(json => {
        let { access_token, expires_in } = json;
        let url = `https://api.weixin.qq.com/wxa/getwxacode?access_token=${access_token}`;
        let query = JSON.stringify({
          path: "pages/index/index?barId=" + id,
          width: 344
        });

        return fetch(url, {
          method: "POST",
          body: query
        });
      })
      .then(res => res.buffer())
      .then(buff => {
        fs.writeFile(`./uploads/qrs/qrcode_${id}.jpg`, buff, err => {
          if (err) {
            reject();
          } else {
            resolve();
          }
        });
      })
      .catch(err => {
        reject(err);
      });
  });
};
