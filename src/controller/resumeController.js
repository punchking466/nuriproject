const db = require('../../models/index');
const { messages } = require('../utils/messages');
const Op = db.Sequelize.Op;
const models = db.models;
const { resperr, respok } = require('../utils/rest');
const jwt = require('jsonwebtoken');
const fs = require('fs'); 

const createResume = async (req, res) => {
    const authToken = req.headers.authorization.split('Bearer')[1];
    const decoded = jwt.decode(authToken);
    let career
    let license

    let { job_title_id, state, resume_name, gender, birth_day, phone,
        email, zip_code, address, detail_address, job1_depth1, job1_depth2, job2_depth1,
        job2_depth2, workday, start_time, end_time, education, school_name,
        graduation, major, military_service, disabled, self_introducation,
        graduation_category, bank, account_number, career_info,license_info} = req.body;


    let resume = {
        job_title_id, state, resume_name, gender, birth_day, phone,
        email, zip_code, address, detail_address, job1_depth1, job1_depth2, job2_depth1,
        job2_depth2, workday, start_time, end_time, education, school_name,
        graduation, major, military_service, disabled, self_introducation,
        graduation_category, bank, account_number
    }

    
    if(career_info){
        career = JSON.parse(career_info)
    }
    if(license_info){
        license = JSON.parse(license_info)
    }

    resume = { ...resume, user_id: decoded.id };

    let image

    if (req.file != undefined) {
        image = `/idPhoto/${req.file.filename}`;
        resume = { ...resume, image: image };
    }
    const transaction = await db.sequelize.transaction();

    try {
        let result = await models.resume.create(
            resume,
            {transaction}
        );
        const resume_id = result.dataValues.id;

        if(career){
            for(data of career){
                data = { resume_id: resume_id, ...data }
                await models.career.create(
                    data,
                    {transaction}
                )
            }
        }

        if(license){
            for(data of license){
                data = { resume_id: resume_id, ...data }
                await models.license.create(
                    data,
                    {transaction}
                )
            }
        }
        
        await transaction.commit();
        respok(res);
    } catch (err) {
        await transaction.ROLLBACK();
        resperr(res, null, err.message);
    }
}

const updateResume = async (req, res) => {
    const authToken = req.headers.authorization.split('Bearer')[1];
    const decoded = jwt.decode(authToken);
    let career
    let license
    let image

    let { id, job_title_id, state, resume_name, gender, birth_day, phone,
        email, zip_code, address, detail_address, job1_depth1, job1_depth2, job2_depth1,
        job2_depth2, workday, start_time, end_time, education, school_name,
        graduation, major, military_service, disabled, self_introducation,
        graduation_category, bank, account_number, license_info, career_info } = req.body;


    let resume = {
        id, job_title_id, state, resume_name, gender, birth_day, phone,
        email, zip_code, address, detail_address, job1_depth1, job1_depth2, job2_depth1,
        job2_depth2, workday, start_time, end_time, education, school_name,
        graduation, major, military_service, disabled, self_introducation,
        graduation_category, bank, account_number
    }

    if(career_info){
        career = JSON.parse(career_info)
    }
    if(license_info){
        license = JSON.parse(license_info)
    }


    resume = { ...resume, user_id: decoded.id };
    if (req.file = null) {
        image = `/idPhoto/${req.file.filename}`;
        resume = { ...resume, image: image };
    }

    if (req.file == undefined) {
        image = null;
        resume = { ...resume, image: image };
    }

    const transaction = await db.sequelize.transaction();

    try {
        // 기존 저장된 이미지가 있는지 확인
        let imagePath = await models.resume.findOne({
            attributes: ['image'],
            raw: true,
            where: { id: resume.id }
        })
        // if - image가 존재한다면 해당 경로의 이미지 삭제
        if (imagePath.image != null) {
            fs.unlinkSync('./uploads' + imagePath.image);
        }

        await models.resume.update(
            resume,
            { where: { id: resume.id }},
            {transaction}
        );
        
        await models.career.destroy(({
            where: {resume_id: resume.id}
        }))

        if(career){
            for(data of career){
                data = {resume_id: resume.id, ...data}
                await models.career.create(
                    data,
                    {transaction}
                )
            }
        }

        if(license){
            for(data of license){
                data = {resume_id: resume.id, ...data}
                await models.license.create(
                    data,
                    {transaction}
                )
            }
        }

        await transaction.commit();
        respok(res);
    } catch (err) {
        await transaction.ROLLBACK();
        resperr(res, null, err.message);
    }
}

const deleteResume = async (req, res) => {
    const { resume_id } = req.body;

    try {

        let imagePath = await models.resume.findOne({
            attributes: ['image'],
            raw: true,
            where: { id: resume_id }
        })

        // if - image가 존재한다면 해당 경로의 이미지 삭제
        if (imagePath.image != null) {
            fs.unlinkSync('./uploads' + imagePath.image);
        }

        let result = await models.resume.destroy({
            where: { id: resume_id }
        })

        if (result == 0) {
            return res.json({ status: 'error', msg: 'resume not found' });
        }

        respok(res);
    } catch (err) {
        resperr(res, null, err);
    }
};

module.exports = {
    createResume,
    updateResume,
    deleteResume,
}