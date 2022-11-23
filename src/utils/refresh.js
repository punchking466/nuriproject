const { sign, verify, refreshVerify } = require('./jwt-util');
const jwt = require('jsonwebtoken');
const redisClient = require('./redis');

const refresh = async (req, res) => {
    
    if(req.headers.authorization && req.headers.refresh) {
        const authToken = req.headers.authorization.split('Bearer')[1];
        const refreshToken = req.headers.refresh;

        const authResult = verify(authToken);

        const decoded = jwt.decode(authToken);

        if(decoded === null) {
            res.status(401).send({
            ok : false,
            messages : 'no authorized!',
        });
        }

        const refreshResult = await refreshVerify(refreshToken, decoded.signname);

        // access token이 만료되어 있어야함
        if(authResult.ok === false && authResult.message === 'jwt expired'){
            // case 1) access token과 refresh token 모두 만료된 경우
            if(refreshResult === false){
                res.status(401).send({
                    ok : false,
                    message : 'No authorized!',
                });
            } else {
                // case 2) access token이 만료되고 refresh token은 만료되지 않은경우
                // => 새로운 access token 발급
                const newAccessToken = sign(decoded);
                
                res.status(200).send({
                    ok : true,
                    data : {
                        accessToken : newAccessToken,
                        refreshToken,
                    }
                });
            }
        } else {
            // case 3) access token이 만료되지 않은 경우
            res.status(400).send({
                ok : false,
                message : 'Acess token is not expired!',
            });
        }
    } else {
        // access token or refersh token이 헤더에 없는 경우
        res.status(400).send({
            ok : false,
            message : 'Acess token and refresh token are need for refresh!',
        });
    }
}

module.exports = refresh;