## 누리글로벌 백엔드 api

## Description

- node.js express 프레임워크를 사용하였습니다.
- api 명세는 swagger를 통하여 진행하였습니다.

## 실행 방법

프로젝트 클론 후 프로젝트 root 경로에서

```
yarn
```

패키지 설치 후
-tip. 패키지 설치 후 프로젝트 최상단에 .env 파일 생헝 하여야 합니다.

dev (개발환경 실행) :

```js
yarn dev
```

start (운영환경 실행) :
```js
yarn start
```

## 라이브러리

의존성 라이브러리

- axios
- bcrypt
- cookie-parser
- cors
- crypto-js
- dayjs
- debug
- dotenv
- ejs
- express
- express-generator
- fs
- http-errors
- axios
- dotenv
- jsonwebtoken
- memory-cache
- moment
- morgan
- multer
- mysql2
- nodemailer
- nodemailer-smtp-pool
- nodemon
- redis
- sequelize
- sequelize-cli
- swagger-cli
- swagger-jsdoc
- swagger-ui
- swagger-ui-express

## 폴더 구조 (src/)

- config.js : DB, smtp 등 config
- server.js : router impot 및 app setup
- utils : jwt인증, pagination 등 각종 메소드 모음
- routes/router.js : router cjfl
- controller 

