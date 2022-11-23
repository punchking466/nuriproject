const db = require('../../models/index');
const {messages} = require('../utils/messages');
const Op = db.Sequelize.Op;
const models = db.models;
const { resperr, respok } = require('../utils/rest');
const { businessMail } = require('../utils/email');
const moment = require("moment");
require('moment-timezone');
moment.tz.setDefault("Asia/seoul");
const date = moment();

const businessInquiry = async (req,res) => {
    let content = {company, type, business_num, ceo, address, web_site, manager, phone, email, message} = req.body;

    let file

    if (req.file != undefined) {
        file  = req.file.filename;
    }

    content = {...content, date : date.format("YYYY-MM-DD hh:mm:ss")}

    businessMail(content, file);

    respok(res);
}

module.exports = {
    businessInquiry,
}