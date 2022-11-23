const db = require('../../models/index');
const { messages } = require('../utils/messages');
const Op = db.Sequelize.Op;
const models = db.models;
const { resperr, respok } = require('../utils/rest');
const { pagingServer } = require('../utils/paging');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { captureRejectionSymbol } = require('nodemailer/lib/xoauth2');

const selectUser = async (req, res) => {
    const authToken = req.headers.authorization.split('Bearer')[1];
    const decoded = jwt.decode(authToken);

    try {

        if (decoded.user_role == 1 || decoded.user_role == 3) {
            const userInfo = await models.users.findOne({
                attributes: ['signname', 'user_phone', 'zip_code', 'address', 
                                'detail_address', 'user_name'],
                where: { id: decoded.id }
            })

            if (userInfo == null) {
                return res.send(`user(${decoded.id}) not found`)
            }

            return res.json(userInfo);
        }

        if (decoded.user_role == 2) {
            const managerInfo = await models.users.findOne({
                where: { id: decoded.id },
                attributes: ['signname', 'user_phone', 'user_name', 'department', 'position']
            })

            if (managerInfo == null) {
                return res.send(`user(${decoded.id}) not found`)
            }

            return res.json(managerInfo);
        }

    } catch (err) {
        res.send(err);
    }
}

const updateUserInfo = async (req, res) => {
    const userInfo = {password, user_name, user_phone, zip_code, address
                        ,detail_address } = req.body;

    if (userInfo.password) {
        userInfo.password = await bcrypt.hash(userInfo.password, 10);
    }

    const authToken = req.headers.authorization.split('Bearer')[1];

    const decoded = jwt.decode(authToken);

    try {
        await models.users.update(
            userInfo,
            { where: { id: decoded.id } });

        return respok(res);
    } catch (err) {
        resperr(res, null, err);
    }
}

const findMyResume = async (req, res) => {
    const authToken = req.headers.authorization.split('Bearer')[1];
    const decoded = jwt.decode(authToken);
    let { curpage, pageSize} = req.query;
    const paging = pagingServer(curpage, pageSize);


    try {
        const cntAll = await models.resume.count({
            where: {user_id: decoded.id}
        }
        );

        const userInfo = await models.resume.findAll({
            where: { user_id: decoded.id },
            attributes: ['id', 'job_title_id', 'state','createdAt'],
            order : [['createdAt','desc']],
            offset: (await paging).offset,
            limit: (await paging).limit,
            include: [{
                model: models.job_posts,
                as: 'job_title',
                attributes: ['title']
            }]
        })
        if (userInfo[0] == null) {
            return res.send('The data does not exist');
        }
        res.json({cntAll: cntAll, userInfo});

    } catch (err) {
        res.json({ err: err });
    }
}

const findCompany = async (req, res) => {
    const authToken = req.headers.authorization.split('Bearer')[1];
    const decoded = jwt.decode(authToken);

    try {
        const company = await models.users.findOne({
            where: { id: decoded.id },
            attributes: [],
            include: [{
                model: models.companies,
                as: 'company',
                attributes: [
                    'company_name',
                    'company_phone',
                    'zip_code',
                    'address',
                    'detail_address',
                    'fax',
                    'business_num',
                    'ceo',
                    'bank',
                    'account_number'],
            }]
        })
        res.json(company);
    } catch (err) {
        res.send(err);
    }
}

const updateCompany = async (req, res) => {
    const companyInfo = {company_name, company_phone,zip_code, address, detail_address, fax, business_num, ceo, 
                        bank, account_number} = req.body;
    const authToken = req.headers.authorization.split('Bearer')[1];
    const decoded = jwt.decode(authToken);
    
    try {
        const companyId = await models.users.findOne(
            {
                raw : true,
                attributes: ['company_id'],
                where: { id: decoded.id }
            });
        
        await models.companies.update(
            companyInfo,
            {where : {id : companyId.company_id}}
        );

        return respok(res);
    } catch (err) {
        resperr(res, null, err);
    }
}

const selectResume = async (req, res) => {
    const { resume_id } = req.query;

    let setAttributes = ['id', 'resume_name', 'gender', 'birth_day', 'phone',
        'email', 'image', 'zip_code', 'address', 'detail_address','job1_depth1',
        'job1_depth2', 'job2_depth1', 'job2_depth2', 'workday',
        'start_time', 'end_time', 'education', 'school_name', 'graduation',
        'military_service', 'major','disabled', 'self_introducation',
        'graduation_category', 'bank', 'account_number', 'updatedAt']

    try {
        const resume = await models.resume.findOne({
            attributes: setAttributes,
            where: { id: resume_id },
            raw: true
        });

        const career = await models.career.findAll({
            attributes: [
                'career_name',
                'type',
                'start_date',
                'end_date',
                'salary',
                'job',
                'job_summary'
            ],
            where: {resume_id: resume_id}
        });

        const license = await models.license.findAll({
            attributes: [
                'license_name',
                'publisher',
                'pass_date'
            ],
            where: {resume_id: resume_id}
        });

        if (resume) {
            res.send({resume, career, license})
        } else {
            resperr(res, messages.MSG_DATANOTFOUND)
        }
    } catch (err) {
        resperr(res, null, err.message);
    }
}

module.exports = {
    selectUser,
    updateUserInfo,
    findMyResume,
    findCompany,
    updateCompany,
    selectResume
}