const {promisify} = require('util');
const jwt = require('jsonwebtoken');
const redisClient = require('./redis');
const messages = require('../utils/messages');
const dotenv = require('dotenv');
dotenv.config();

const secret = '8c8938740c3d650b20e6d54ba0b1672b';

module.exports = {
    sign : (user) => {
        const payload = {
            id : user.id,
            signname : user.signname,
            user_role : user.user_role,
        }
        
        return jwt.sign(payload, secret, {
            algorithm : 'HS256',
            expiresIn : '2h',
        });
    },

    verify : (token) =>{
        let decoded = null;
        try{
            decoded = jwt.verify(token, secret);
            return {
                ok : true,
                id : decoded.id,
                signname : decoded.signname,
                user_type : decoded.user_type,
            };
        } catch (err) {
            return{
                ok : false,
                message : err.message,
            };
        }
    },

    refresh : () => {
        return jwt.sign({}, secret, {
            algorithm : 'HS256',
            expiresIn : '14d',
        });
    },

    refreshVerify : async (token, signname) => {
        try {
            const data = await redisClient.get(signname);
            if (token === data) {
                try {
                    jwt.verify(token, secret);
                    return true;
                } catch (err) {
                    return false;
                }
            } else { 
                return false;
            }
        } catch (err) {
            return false;
        }
    },
};
