const { verify } = require('../src/utils/jwt-util');

const authJWT = (req, res, next) => {

    if ( req.headers.authorization){
        const token = req.headers.authorization.split('Bearer') [1];
        const result = verify(token);
        
        if(result.ok) {
            req.id = result.id;
            req.signname = result.signname;
            req.user_type = result.user_type;
            next();
        } else { 
            res.status(401).send({
                ok : false,
                message : result.message,
            });
        }
    }else {
        console.log('token null');
    }
}

module.exports = authJWT;