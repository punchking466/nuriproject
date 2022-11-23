const db = require('../../models/index');
const { messages } = require('../utils/messages');
const Op = db.Sequelize.Op;
const models = db.models;
const { resperr, respok } = require('../utils/rest');
const fs = require('fs');
const path = require('path');
const { pagingServer } = require('../utils/paging');
const { sequelize } = require('../../models/index');
const jwt = require('jsonwebtoken');


//이벤트 리스트 호출
const selectEvent = async (req, res) => {
    let { curpage, pageSize, orderCol } = req.query;


    //페이징 처리
    //데이터 보다 많은 페이지 호출 시
    const cntAll = await models.event_posts.count();

    if (curpage - 1 > Math.round(cntAll / pageSize)) {
        return res.send('end of raw');
    }

    //offset limit 설정
    const paging = pagingServer(curpage, pageSize);

    //기간 컬럼 정의
    const period = db.Sequelize.fn(
        "concat", sequelize.col('start_date'), ' - ', sequelize.col('end_date')
    )

    let options = {
        attributes: ['id', 'title', [period, "period"], 'createdAt'],
        raw: true,
        offset: (await paging).offset,
        limit: (await paging).limit,
        order: [['createdAt', 'DESC']]
    }

    //정렬
    if (orderCol !== undefined) {
        let order = [[orderCol, 'DESC']];
        options.order = order;
    }

    let result = await models.event_posts.findAll(options)

    if (result[0] == null) {
        return res.send('No Data')
    }

    const cnt = Object.keys(result).length;

    //전체 데이터 개수 및 호출된 값
    res.json({ countAll: cntAll, count: cnt, list: result });
}

const findEvent = async (req, res) => {
    const { eventId } = req.query;

    try {
        const result = await models.event_posts.findOne({
            attributes: ['title', 'start_date', 'web_site','end_date', 'image', 'content', 'writer'],
            raw: true,
            where: { id: eventId }
        })
        if (result == null) {
            return res.send('data not found');
        }

        res.json(result);
    } catch (err) {
        res.send(err);
    }
}

const createEvent = async (req, res) => {
    const { title, start_date, web_site,end_date, content } = req.body;
    const authToken = req.headers.authorization.split('Bearer')[1];
    const decoded = jwt.decode(authToken);

    if (req.file != undefined) {
        image  = `/eventImg/${req.file.filename}`;
    }

    if (req.file == undefined) {
        image = null
    }
    
    try {
        await models.event_posts.create({
            title: title,
            start_date: start_date,
            end_date: end_date,
            content: content,
            web_site: web_site,
            writer: decoded.id,
            image: image,
        });
        return respok(res);
    } catch (err) {
        resperr(res, null, err);
    }
}

const updateEvent = async (req, res) => {
    const authToken = req.headers.authorization.split('Bearer')[1];
    const decoded = jwt.decode(authToken);
    const { id, title, start_date, end_date, content } = req.body;
    let image

    // request에 이미지가 있는지 확인
    if (req.file != undefined) {
        image = `/eventImg/${req.file.filename}`;
    }

    if (req.file == undefined) {
        image = null
    }

    try {
        // 기존 저장된 이미지가 있는지 확인
        let imagePath = await models.event_posts.findOne({
            attributes: ['id', 'image'],
            raw: true,
            where: { id: id }
        })

        // if - image가 존재한다면 해당 경로의 이미지 삭제
        if (imagePath.image != null) {
            fs.unlinkSync('./uploads' + imagePath.image);
        }

        await models.event_posts.update({
            title: title,
            start_date: start_date,
            end_date: end_date,
            content: content,
            image: image,
        },
            { where: { id: id } });
        return respok(res);
    } catch (err) {
        resperr(res, null, err);
    }
}

const deleteEvent = async (req, res) => {
    const { eventId } = req.body;

    try {
        // 삭제할 이벤트 image 존재 여부 확인
        let imagePath = await models.event_posts.findOne({
            attributes: ['image'],
            raw: true,
            where: { id: eventId }
        })

        // if - image가 존재한다면 해당 경로의 이미지 삭제
        if (imagePath.image != null) {
            fs.unlinkSync('./uploads' + imagePath.image);
        }

        // 해당 이벤트 삭제
        let result = await models.event_posts.destroy({
            where: { id: eventId }
        })

        // if - 삭제한 데이터가 없다면 에러메세지 리턴
        if (result == 0) {
            return res.json({ status: 'error', msg: 'event-post not found' });
        }

        respok(res);
    } catch (err) {
        resperr(res, null, err);
    }
}

module.exports = {
    createEvent,
    updateEvent,
    deleteEvent,
    selectEvent,
    findEvent,
}