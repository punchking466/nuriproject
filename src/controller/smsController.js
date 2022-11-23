const axios = require("axios");
const cache = require("memory-cache");
const cryptojs = require("crypto-js");
const { respok, resperr } = require("../utils/rest");
const { messages } = require("../utils/messages");
const {smsConfig, smtpConfig} = require("../config")

const smsSend = async (req, res) => {
  const date = Date.now().toString();
  const uri = smsConfig.serviceId;
  const secretKey = smsConfig.secretKey;
  const accessKey = smsConfig.accessKey;

  const method = "POST";
  const space = " ";
  const newLine = "\n";
  const url = `https://sens.apigw.ntruss.com/sms/v2/services/${uri}/messages`;
  const url2 = `/sms/v2/services/${uri}/messages`;
  const hmac = cryptojs.algo.HMAC.create(cryptojs.algo.SHA256, secretKey);

  hmac.update(method);
  hmac.update(space);
  hmac.update(url2);
  hmac.update(newLine);
  hmac.update(date);
  hmac.update(newLine);
  hmac.update(accessKey);

  const hash = hmac.finalize();
  const signature = hash.toString(cryptojs.enc.Base64);
  const { phone } = req.body;
  const verifyCode = Math.floor(Math.random() * (99999 - 10000)) + 100000;
  cache.put(phone, verifyCode.toString());

  try {
    await axios({
      method: method,
      json: true,
      url: url,
      headers: {
        "Content-Type": "application/json",
        "x-ncp-iam-access-key": accessKey,
        "x-ncp-apigw-timestamp": date,
        "x-ncp-apigw-signature-v2": signature,
      },
      data: {
        type: "SMS",
        contentType: "COMM",
        contryCode: "82",
        from: "0232100930",
        content: `[본인 확인] 인증번호 [${verifyCode}]를 입력해주세요.`,
        messages: [
          {
            to: `${phone}`,
          },
        ],
      },
    });
    respok(res);
  } catch (err) {
    resperr(res, null, err);
  }
};

const verify = async (req, res) => {
  const { phone, verifyCode } = req.query;

  const cacheData = cache.get(phone);

  if (!cacheData) {
    return resperr(res, messages.MSG_DATA_FOUND);
  }

  if (cacheData !== verifyCode) {
    return resperr(res, messages.MSG_VERIFYFAIL);
  }

  cache.del(phone);
  respok(res);
};

module.exports = {
  smsSend,
  verify,
};
