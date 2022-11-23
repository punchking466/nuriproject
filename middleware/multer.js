const multer = require('multer');
const path = require('path');
const jwt = require('jsonwebtoken');
const dayjs = require("dayjs")


const postStorage = multer.diskStorage({
    destination : (req, file, cb) =>{
        cb(null, process.env.PWD+ "/uploads/postImg");
    },
    filename : function (req, file, cb) {
        let now = dayjs();
        let today =now.format("YYYY-MM-DD HH:mm:ss")
        if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
            return cb(new Error("Only image files are allowed!"));
          }
        file.originalname = Buffer.from(file.originalname, 'latin1').toString('utf-8')
        const authToken = req.headers.authorization.split('Bearer')[1];
        const decoded = jwt.decode(authToken);
        const ext = path.extname(file.originalname);
        cb(null, path.basename(decoded.id+"-"+file.originalname,ext)+"-"+today+ext);
    }
})

const idStorage = multer.diskStorage({
    destination : (req, file, cb) =>{
        cb(null, "uploads/idPhoto");
    },
    filename : function (req, file, cb) {
        let now = dayjs();
        let today =now.format("YYYY-MM-DD HH:mm:ss")
        if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
            return cb(new Error("Only image files are allowed!"));
          }
        file.originalname = Buffer.from(file.originalname, 'latin1').toString('utf-8')
        const authToken = req.headers.authorization.split('Bearer')[1];
        const decoded = jwt.decode(authToken);
        const ext = path.extname(file.originalname);
        cb(null, path.basename(decoded.id+"-"+file.originalname,ext)+"-"+today+ext);
    }
})

const eventStorage = multer.diskStorage({
    destination : (req, file, cb) =>{
        cb(null, "uploads/eventImg");
    },
    filename : function (req, file, cb) {
        let now = dayjs();
        let today =now.format("YYYY-MM-DD HH:mm:ss")
        if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
            return cb(new Error("Only image files are allowed!"));
          }
        file.originalname = Buffer.from(file.originalname, 'latin1').toString('utf-8')
        const authToken = req.headers.authorization.split('Bearer')[1];
        const decoded = jwt.decode(authToken);
        const ext = path.extname(file.originalname);
        cb(null, path.basename(decoded.id+"-"+file.originalname,ext)+"-"+today+ext);
    }
})

const inquiryStorage = multer.diskStorage({
    destination : (req, file, cb) =>{
        cb(null, "uploads/inquiryFile");
    },
    filename : function (req, file, cb) {
        let now = dayjs();
        let today =now.format("YYYY-MM-DD HH:mm:ss")
        file.originalname = Buffer.from(file.originalname, 'latin1').toString('utf-8')
        const ext = path.extname(file.originalname);
        cb(null, path.basename(file.originalname, ext)+"-"+today+ext);
    }
})

const uploadPost = multer({storage : postStorage});
const uploadIdP = multer({storage : idStorage});
const uploadEvent = multer({storage : eventStorage});
const uploadInquiry = multer({storage : inquiryStorage})

module.exports = {
    uploadPost,
    uploadIdP,
    uploadEvent,
    uploadInquiry
};