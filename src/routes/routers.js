var express = require("express");
var router = express.Router();
const {
  createUser,
  login,
  logout,
  findId,
  findPw,
  createPartner,
  deleteUser,
} = require("../controller/loginController");
const { showUserInfo, checkInfo } = require("../controller/userInfo");
const dotenv = require("dotenv");
const refresh = require("../utils/refresh");
const {
  selectPosts,
  createPosts,
  updatePosts,
  deletePosts,
  findPost,
} = require("../controller/postsController");
const {
  uploadPost,
  uploadIdP,
  uploadEvent,
  uploadInquiry
} = require("../../middleware/multer");
const authJWT = require("../../middleware/authJWT");
const {
  createResume,
  deleteResume,
  updateResume,
} = require("../controller/resumeController");
const path = require("path");
const { 
    businessInquiry
 } = require("../controller/inquiryController");
const {
  createEvent,
  updateEvent,
  deleteEvent,
  selectEvent,
  findEvent,
} = require("../controller/eventController");
const {
  selectUser,
  updateUserInfo,
  findMyResume,
  findCompany,
  updateCompany,
  selectResume,
} = require("../controller/mypageController");
const {
    smsSend, 
    verify 
    } = require("../controller/smsController");

router.get('/', (req,res) => {
  res.send('express-running');
})

/* 일반 회원가입 */
router.post("/sign-up/user", createUser);

/* 기업 회원가입 */
router.post("/sign-up/partner", createPartner);

/* 문자인증 */
router.post('/sms-send', smsSend);

router.get('/verify', verify);

/* 로그인 */
router.post("/login", login);

/* 로그아웃 */
router.post("/logout", logout);

/* 아이디 찾기 */
router.get("/find-id", findId);

/* 비밀번호 찾기 */
router.put("/find-pw", findPw);

/* 탈퇴 */
router.delete("/secession", authJWT, deleteUser);

/* access token 재발급 */
router.get("/refresh", refresh);

/* 채용공고 */
router.get("/list/post", authJWT, selectPosts);

router.post("/posts", authJWT, uploadPost.single("postImg"), createPosts);

router.put("/edit/post", authJWT, uploadPost.single("postImg"), updatePosts);

router.delete("/post", authJWT, deletePosts);

router.get("/find/post", authJWT, findPost);

/* 인력등록 */
router.post("/resume", authJWT, uploadIdP.single("idPhoto"), createResume);

router.put("/resume", authJWT, uploadIdP.single("idPhoto"), updateResume);

router.get("/userinfo/resume", authJWT, showUserInfo);

router.delete("/resume", authJWT, deleteResume);

/* 제휴 문의*/
router.post("/business-inquiry", uploadInquiry.single("file"), businessInquiry);

/* 행사 공지*/
router.post("/event-post", authJWT, uploadEvent.single("eventImg"), createEvent);

router.delete("/event-post", authJWT, deleteEvent);

router.put( "/edit/event-post", authJWT,uploadEvent.single("eventImg"), updateEvent);

router.get("/find/event-post", authJWT, findEvent);

router.get("/list/event-post", authJWT, selectEvent);

/* 마이 페이지 */
router.get("/mypage", authJWT, selectUser);

router.put("/edit/mypage", authJWT, updateUserInfo);

router.get("/mypage/resume", authJWT, findMyResume);

router.get("/find/resume", authJWT, selectResume);

router.get("/mypage/company", authJWT, findCompany);

router.put("/mypage/company", authJWT, updateCompany);

router.get("/verify/user", authJWT, checkInfo);

module.exports = router;
