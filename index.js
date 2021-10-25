const express = require('express')
const app = express()
const port = 5000
const bodyParser = require('body-parser'); 
//express 버전 4.16 이후부터는 express 내부에 body parser가 포함되므로
//아래와 같이 사용하면 됨
// const express = require('express');

const config = require('./config/key');

const { User } = require("./models/User");

//application/x-www-form-urlencoded 형식으로 된걸 분석해서 가져옴
app.use(bodyParser.urlencoded({extended: true}));
// app.use(express.urlencoded({extended: true}));

//application/json 형식으로 된걸 분석해서 가져 올 수 있다
app.use(bodyParser.json());
// app.use(express.json());

const mongoose = require('mongoose')
mongoose.connect(config.mongoURI)
.then(() => console.log('MongoDB Connected ...'))
.catch((e) => console.log('MongoDB error: ', e))

app.get('/', (req, res) => {
  res.send('Hello World!~ 안녕하세요 반갑습니다~~')
})

app.post('/register', (req, res) => {
  //회원 가입 시 필요한 정보들을 client에서 가져오면
  //그것들을 데이터베이스에 넣어준다.

    const user = new User(req.body)

    user.save((err, userInfo) => {
      if(err) return res.json({success: false, err});
      console.log(userInfo);
      return res.status(200).json({ //200은 성공했다는 뜻
        success: true
      })
    })//몽고디비에서 오는 메서드
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})