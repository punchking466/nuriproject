const db = require('../../models/index');
const {messages} = require('../utils/messages');
const Op = db.Sequelize.Op;
const models = db.models;
const { resperr, respok } = require('../utils/rest');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

// 인력등록 페이지 저장된 User 정보 자동 입력
const showUserInfo = async (req, res) => {
    const authToken = req.headers.authorization.split('Bearer')[1];
    const decoded = jwt.decode(authToken);

    try{
        const userInfo = await models.users.findOne({
            attributes : [
                'user_name', 'user_phone', 'signname'
            ],
            raw : true,
            where : {id : decoded.id}
        })

        if(userInfo == undefined){
            return res.send({status : 'error', msg : 'user not found'});
        }

        res.json(userInfo);
    } catch(err) {
        res.json(err);
    }
}

const checkInfo = async (req, res) => {
    const {signname, password} = req.query;
    
    try{
        //입력받은 확인
        const user = await models.users.findOne({
            raw: true,
            where: { signname: signname }
        }
        );

        if(!user){
            return res.json({status: "Err", message: 'user not found'})
        }

        const checkPwd = await bcrypt.compare(password, user.password);
    
        checkPwd == true ? res.json({status: "ok"})
                        : res.json({status: "Err", message: 'password incorrect'});

    }catch (err){
        resperr(res,null, err);
    }
}
module.exports = {
    showUserInfo,
    checkInfo
}