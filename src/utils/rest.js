const resperrwithstatus = (res, statuscode, msg, code) =>
  res.status(statuscode).send({ status: "ERR", message: msg, code: code });

const respok = (res, msg, code, jdata) =>
  res.status(200).send({ status: "OK", message: msg, ...jdata });
const resperr = (res, msg, list) =>
  res.status(200).send({ status: "ERR", message : msg, list : list});
const resplist = (res, msg, code, list) =>
  res.status(200).send({ status: "OK", message: msg, list: list });
module.exports = {
  respok,
  resperr,
  respreqinvalid: resperr,
  resplist,
  resperrwithstatus,
};
