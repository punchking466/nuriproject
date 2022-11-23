const nodemailer = require('nodemailer');
const smtpPool = require('nodemailer-smtp-pool');
const { smtpConfig } = require('../config');
const { respok, resperr } = require("../utils/rest");
const ejs = require('ejs');
const moment = require("moment");
const { messages } = require('./messages');
require('moment-timezone');
const date = moment();
const now = date.format("YYYY-MM-DD hh:mm:ss")

const signUpMail = async (user) => {
    let emailForm;
    try {
        ejs.renderFile("views/signUp.ejs", { user, now }, (err, data) => {
            if (err) console.log(err);
    
            emailForm = data;
        })

        const from = `누리글로벌 <${smtpConfig.mailer.user}>`;
        const to = `${user.signname}`;
        const subject = '누리글로벌서비스 회원가입을 축하합니다!';
        const html = emailForm;
    
        const mailOptions = {
            from,
            to,
            subject,
            html,
            attachments: [
                {
                    filename : "signUpImage.png",
                    path : process.env.PWD + "/image/signUpImage.png",
                    cid : "signUpImage",
                }
            ]
        };
    
        const transporter = nodemailer.createTransport(smtpPool({
            service: smtpConfig.mailer.service,
            host: smtpConfig.mailer.host,
            port: smtpConfig.mailer.port,
            auth: {
                user: smtpConfig.mailer.user,
                pass: smtpConfig.mailer.password,
            },
            tls: {
                rejectUnauthorized: false,
            },
            maxConnections: 5,
            maxMessages: 10,
        }));

        // 메일 발송        
        transporter.sendMail(mailOptions, (error) => {
            if (error) {
                console.log(error);
            }
        })
    } catch (error) {
        console.log(error);
    }

}

const resetPwMail = (user, password) => {
    let emailForm;

    ejs.renderFile("views/resetPwd.ejs", { user, password }, (err, data) => {
        if (err) console.log(err);

        emailForm = data;
    })

    const from = `누리글로벌 <${smtpConfig.mailer.user}>`;
    const to = `${user.signname}`;
    const subject = '임시 비밀번호 전달';
    const html = emailForm;

    const mailOptions = {
        from,
        to,
        subject,
        html,
        attachments: [
            {
                filename : "resetImage.png",
                path : process.env.PWD + "/image/resetImage.png",
                cid : "resetImage",
            }
        ]
    };

    const transporter = nodemailer.createTransport(smtpPool({
        service: smtpConfig.mailer.service,
        host: smtpConfig.mailer.host,
        port: smtpConfig.mailer.port,
        auth: {
            user: smtpConfig.mailer.user,
            pass: smtpConfig.mailer.password,
        },
        tls: {
            rejectUnauthorized: false,
        },
        maxConnections: 5,
        maxMessages: 10,
    }));

    //메일 발송
    transporter.sendMail(mailOptions, (err) => {
        if (err) {
            return console.log(err);
        }
        transporter.close();
    });
}

const businessMail = (content, file) => {
    let emailForm;
    let mailOptions;
    ejs.renderFile("views/inquiry.ejs", { content, file }, (err, data) => {
        if (err) console.log(err);

        emailForm = data;
    })

    const from = `누리글로벌 <${smtpConfig.mailer.user}>`;
    const to = `admin@nuri-gs.com`;
    const subject = '제휴 문의';
    const html = emailForm;

    mailOptions = {
        from,
        to,
        subject,
        html,
        attachments: [
            {
                filename : "inquiryImage.png",
                path : process.env.PWD + "/image/inquiryImage.png",
                cid : "inquiryImage",
            },
            {
                filename : "icon_down.png",
                path : process.env.PWD + "/image/icon_down.png",
                cid : "icon_down",
            }
        ]
    };

    if(file){
        mailOptions.attachments.push(
            {
                filename : `${file}`,
                path : process.env.PWD + `/uploads/inquiryFile/${file}`,
                cid : "attachment",
            });
    }
    
    const transporter = nodemailer.createTransport(smtpPool({
        service: smtpConfig.mailer.service,
        host: smtpConfig.mailer.host,
        port: smtpConfig.mailer.port,
        auth: {
            user: smtpConfig.mailer.user,
            pass: smtpConfig.mailer.password,
        },
        tls: {
            rejectUnauthorized: false,
        },
        maxConnections: 5,
        maxMessages: 10,
    }));

    //메일 발송
    transporter.sendMail(mailOptions, (err) => {
        if (err) {
            return console.log(err);
        }
        transporter.close();
    });
}

module.exports = {
    signUpMail,
    resetPwMail,
    businessMail,
}