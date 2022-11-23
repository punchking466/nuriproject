const db = require('../../models/index');
const Op = db.Sequelize.Op;
const models = db.models;
const { respok, resperr } = require("../utils/rest");
const { pagingServer } = require('../utils/paging');
const { messages } = require("../utils/messages");
const moment = require("moment");
const jwt = require('jsonwebtoken');
require('moment-timezone');
moment.tz.setDefault("Asia/seoul");
const fs = require('fs');
const path = require('path');
const date = moment();


//채용 공고 호출
const selectPosts = async (req, res) => {
    let { curpage, pageSize, orderCol, state} = req.query;
    let cntAll;
    let filter = { 'state': state };
    let today = date.format("YYYY-MM-DD")

    try{
        
    //현재일 기준 마감일이 지났을 경우 상태 업데이트
    await models.job_posts.update(
        { state: "마감" },
        { where: { end_date: { [Op.lt]: today } } }
    )

    //페이징 처리
    //데이터 보다 많은 페이지 호출 시

    state ? cntAll = await models.job_posts.count({
                     where: {state: state}
                        })
            : cntAll = await models.job_posts.count()

    if (curpage - 1 > Math.round(cntAll / pageSize)) {
        return res.send('end of raw');
    }

    //offset limit 설정
    const paging = pagingServer(curpage, pageSize);

    //D-day 컬럼 정의
    const dDay = db.Sequelize.fn(
        "concat", 'D',
        db.Sequelize.literal(`to_days('${today}') - to_days(end_date)`),
    )

    // 전체 조회 시 filter가 undefined 이기 때문에 undefined 시 where을 생성하지 않음
    let options = {
        where: {},
        attributes: ['id', 'state', 'title', 'createdAt', [dDay, "dDay"], 'writer'],
        raw: true,
        offset: (await paging).offset,
        limit: (await paging).limit,
        order: [['createdAt', 'DESC']]
    }

    if (filter.state !== undefined) {
        options.where = filter;
    }

    if (orderCol !== undefined) {
        let order = [[orderCol, 'desc']];
        options.order = order;
    }
    //데이터 호출
    let post = await models.job_posts.findAll(options);

    if (post[0] == null) {
        return res.send('No data');
    }

    const cnt = Object.keys(post).length;

    //전체 데이터 개수 및 호출된 값
    res.json({ countAll: cntAll, count: cnt, list: post });

    } catch(err){
        resperr(res, null, err)
    }

   
}

//채용 공고 생성
const createPosts = async (req, res) => {
    const { title, content, end_date } = req.body;
    const authToken = req.headers.authorization.split('Bearer')[1];
    const decoded = jwt.decode(authToken);
    let image
    if(req.file != undefined){
        image  = `/postImg/${req.file.filename}`;
    }
    

    try {
        await models.job_posts.create({
            state: "모집중",
            title: title,
            image: image,
            content: content,
            end_date: end_date,
            writer: decoded.id,
        });
        respok(res);
    } catch (err) {
        resperr(res, err.message);
    }
}

//채용 공고 수정
const findPost = async (req, res) => {
    const {post_id} = req.query;

    try {
        const post = await models.job_posts.findOne({
            attributes: [
                'state','title', 'end_date', 'image', 'content','createdAt'
            ],
            raw: true,
            where: { id: post_id }
        }
        )
        respok(res, null, null, { result: post });
    } catch (err) {
        resperr(res, messages.MSG_ARGMISSING, err)
    }

}

//채용 공고 수정
const updatePosts = async (req, res) => {
    const authToken = req.headers.authorization.split('Bearer')[1];
    const decoded = jwt.decode(authToken);
    let post = {id,title,  end_date, content} = req.body;

    if (req.file != undefined) {
        image = `/postImg/${req.file.filename}`;
        post = { ...post, image: image };
    }
    if (req.file == undefined) {
        post = { ...post, image : null};
    }
    console.log();
    try {
        
        // 기존 저장된 이미지가 있는지 확인
        let imagePath = await models.job_posts.findOne({
            attributes: ['image'],
            raw: true,
            where: { id: post.id }
        })

        // if - image가 존재한다면 해당 경로의 이미지 삭제
        if (imagePath.image != null) {
            fs.unlinkSync('./uploads' + imagePath.image);
        }

        // 1. 수정내용 업데이트
        await models.job_posts.update(
            post,
            { where: { id: post.id } }
        )

        // 2. 변경된 마감일자가 현재날짜보다 크다면 count 1
        const count = await models.job_posts.count({
            where: {
                id: post.id,
                end_date: { [Op.gte]: date.format("YYYY-MM-DD") }
            }
        })

        if (count >= 1) {
            await models.job_posts.update(
                { state: "모집중" },
                { where: { id: post.id } }
            )
        } else {
            await models.job_posts.update(
                { state: "마감" },
                { where: { id: post.id } }
            )
        }

        respok(res, null, null, post);
    } catch (err) {
        resperr(res, null, err);
    }
}

//채용 공고 삭제
const deletePosts = async (req, res) => {
    const {post_id} = req.body;

    try {
        
        // 기존 저장된 이미지가 있는지 확인
        let imagePath = await models.job_posts.findOne({
            attributes: ['image'],
            raw: true,
            where: { id: post_id }
        })

        console.log(imagePath);
        // if - image가 존재한다면 해당 경로의 이미지 삭제
        if (imagePath.image != null) {
            fs.unlinkSync('./uploads' + imagePath.image);
            console.log('1')
        }
        
        let result = await models.job_posts.destroy({
            where: { id: post_id }
        });

        if (result == 0) {
            return res.json({ status: 'error', msg: 'post not found' });
        }

        respok(res, null);
    } catch (err) {
        resperr(res, null, err);
    }
}


module.exports = {
    selectPosts,
    createPosts,
    updatePosts,
    deletePosts,
    findPost,
};