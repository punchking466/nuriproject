const db = require('../../models/index');
const Op = db.Sequelize.Op;
const models = db.models;
const bcrypt = require('bcrypt');
const { respok, resperr } = require("../utils/rest");
const { messages } = require("../utils/messages")
const authJWT = require('../../middleware/authJWT');
const redisClient = require('../utils/redis');
const jwt = require('../utils/jwt-util');
const { decode } = require('jsonwebtoken');
const refresh = require('../utils/refresh');
const { signUpMail, resetPwMail } = require('../utils/email');
const fs = require("fs");
const EmailValidator = require('email-deep-validator');
const { Sequelize } = require('../../models/index');
const emailValidator = new EmailValidator();

//회원가입
const createUser = async (req, res) => {
    let user = { signname, password, user_name, user_phone, zip_code, address 
                ,detail_address} = req.body;

    // let result = await emailValidator.verify(user.signname)

    // if (result.validDomain === false) {
    //     return resperr(res, messages.MSG_EMAIL_INVALID)
    // }
    //비밀번호 해싱
    user.password = await bcrypt.hash(req.body.password, 10);

    //email 및 전화번호 중복 검증
    const cntId = await models.users.count({ where: { signname: user.signname } });
    const cntPhone = await models.users.count({ where: { user_phone: user.user_phone } });

    if (cntId != 0 && cntPhone != 0) {
        return resperr(res, 'signname and phonenum is duplicate');
    }

    if (cntId != 0) {
        return resperr(res, 'signname is duplicate');
    }

    if (cntPhone != 0) {
        return resperr(res, 'phonenum is duplicate')
    }

    //회원 등록
    try {

        if (user) {
            user = { ...user, user_role: "1" }
        } else {
            resperr(res, messages.MSG_ARGMISSING);
        }

        await models.users.create(user);

        //축하메일 발송
        await signUpMail(user);

        respok(res);
    } catch (err) {
        resperr(res, err.message);
    }
}

//파트너 회원가입
const createPartner = async (req, res) => {
    let { signname, password, user_name, department, position, user_phone,
        company_name, company_phone, zip_code, address, detail_address, fax, ceo, business_num,
        bank, account_number } = req.body;

    let user = { signname, password, user_name, department, position, user_phone }
    let company = {
        company_name, company_phone, zip_code, address, detail_address, fax, ceo, business_num,
        bank, account_number
    };

    // let result = await emailValidator.verify(user.signname)

    // if (result.validDomain === false) {
    //     return resperr(res, messages.MSG_EMAIL_INVALID)
    // }


    //비밀번호 해싱
    user.password = await bcrypt.hash(req.body.password, 10);

    //email 및 전화번호 중복 검증
    const cntId = await models.users.count({ where: { signname: user.signname } });
    const cntPhone = await models.users.count({ where: { user_phone: user.user_phone } });
    const cntCompany = await models.companies.count({ where: { business_num: company.business_num } });

    if (cntId != 0 && cntCompany != 0) {
        return resperr(res, 'signname and phonenum is duplicate');
    }

    if (cntCompany != 0){
        return resperr(res, 'business_num is duplicate')
    }

    if (cntId != 0) {
        return resperr(res, 'signname is duplicate');
    }

    if (cntPhone != 0) {
        return resperr(res, 'phonenum is duplicate')
    }

    //회원 등록
    try {
        //회사 정보가 있을 때
            if (company) {
                await models.companies.create(company);
                let company_id = await models.companies.findOne({
                    raw: true,
                    attributes: ['id'],
                    where: { business_num: company.business_num }
                });

            //유저 구분 협력사(2) 부여
            user = { ...user, user_role: "2", company_id: company_id.id };
        } else {
            return resperr(res, messages.MSG_ARGINVALID);
        }
            await models.users.create(user);

        //축하메일 발송
        signUpMail(user);

        respok(res);
    } catch (err) {
        resperr(res, err.message);
    }
}

//로그인
const login = async (req, res) => {
    const { signname, password } = req.body;

    //입력받은 확인
    const user = await models.users.findOne({
        raw: true,
        where: { signname: signname }
    }
    );

    if (user) {
        //비밀번호 검증
        const success = await bcrypt.compare(password, user.password);

        if (success) {
            //비밀번호 검증 이후 토큰 발급
            const accessToken = jwt.sign(user);
            const refreshToken = jwt.refresh();

            await redisClient.set(user.signname, refreshToken);

            res.status(200).json({
                ok: true,
                data: {
                    user_id: user.id,
                    user_role: user.user_role,
                    accessToken,
                    refreshToken,
                }
            })
        } else {
            resperr(res, 'signname or password incorrect');
        }
    } else {
        resperr(res, 'signname or password incorrect');
    }
}

//아이디 찾기
const findId = async (req, res) => {
    const { user_phone } = req.query;

    try {
        const user = await models.users.findOne({
            raw: true,
            attributes: ['signname'],
            where: { user_phone: user_phone }
        });

        if (user == null) {
            return respok(res, messages.MSG_EMAIL_NOTSET)
        }

        res.json(user);
    } catch (err) {
        resperr(res, MSG_ARGMISSING, err);
    }

}

//비밀번호 찾기
const findPw = async (req, res) => {
    const { signname } = req.body;

    const user = await models.users.findOne({
        raw:  true,
        where: { signname: signname }
    });

    if (user) {
        const ranPassword = Math.random().toString(36);
        const password = await bcrypt.hash(ranPassword, 10);

        try {
            await models.users.update(
                { password: password },
                { where: { signname: signname } }
            );
            resetPwMail(user, ranPassword);
            respok(res, null, null, { signname: signname, ranPassword: ranPassword });
        } catch (err) {
            resperr(res, err.message);
        }


    } else {
        resperr(res, messages.MSG_DATA_FOUND)
    }
}

//로그아웃 redis refersh token 삭제
const logout = async (req, res) => {
    const authToken = req.headers.authorization.split('Bearer')[1];
    const decoded = decode(authToken);

    try {
        await redisClient.del(decoded.signname);
        respok(res);
    } catch (err) {
        res.json(err);
    }
}

//회원 탈퇴
const deleteUser = async (req, res) => {
    const authToken = req.headers.authorization.split('Bearer')[1];
    const decoded = decode(authToken);

    try {
        const userInfo = await models.users.findOne({
            raw: true,
            where: { id: decoded.id }
        });

        //저장된 이미지가 있는지 조회
        const resumeImagePath = await models.resume.findAll({
            raw: true,
            attributes: ['image'],
            where: { user_id: decoded.id }
        });

        const postImagePath = await models.job_posts.findAll({
            raw: true,
            attributes: ['image'],
            where: { writer: decoded.id }
        });

        const eventImagePath = await models.event_posts.findAll({
            raw: true,
            attributes: ['image'],
            where: { writer: decoded.id }
        });

        //저장된 이미지가 존재한다면 삭제
        if (resumeImagePath[0] != undefined) {
            resumeImagePath.forEach(resumeImagePath => {
                if (resumeImagePath.image != null) {
                    fs.unlinkSync('./uploads' + resumeImagePath.image);
                }
            });
        }

        if (postImagePath[0] != undefined) {
            postImagePath.forEach(postImagePath => {
                if (postImagePath.image != null) {
                    fs.unlinkSync('./uploads' + postImagePath.image);
                }
            });
        }

        if (eventImagePath[0] != undefined) {
            eventImagePath.forEach(eventImagePath => {
                if (eventImagePath.image != null) {
                    fs.unlinkSync('./uploads' + eventImagePath.image);
                }
            });
        }

        // if - image가 존재한다면 해당 경로의 이미지 삭제


        if (userInfo.user_role == 1) {
            await models.users.destroy({
                where: { id: decoded.id }
            });
            respok(res);
        }



        if (userInfo.user_role == 2) {
            await models.companies.destroy({
                where: { id: userInfo.company_id }
            });

            respok(res);
        }
    } catch (err) {
        console.log(err);
        res.send(err);
    }
}



module.exports = {
    createUser,
    createPartner,
    login,
    logout,
    findId,
    findPw,
    deleteUser,
};