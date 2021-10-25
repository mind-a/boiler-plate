const express = require('express')
const app = express()
const port = 5000
const bodyParser = require('body-parser'); 
const cookieParser = require('cookie-parser');

const config = require('./config/key');

const { User } = require("./models/User");

//application/x-www-form-urlencoded 형식으로 된걸 분석해서 가져옴
app.use(bodyParser.urlencoded({extended: true}));

//application/json 형식으로 된걸 분석해서 가져 올 수 있다
app.use(bodyParser.json());
app.use(cookieParser());

const mongoose = require('mongoose')
mongoose.connect(config.mongoURI)
.then(() => console.log('MongoDB Connected ...'))
.catch((e) => console.log('MongoDB error: ', e))

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.post('/register', (req, res) => {
  //회원 가입 시 필요한 정보들을 client에서 가져오면
  //그것들을 데이터베이스에 넣어준다.

    const user = new User(req.body)

    user.save((err, userInfo) => {
      if(err) return res.json({success: false, err});
      // console.log(userInfo); 유저 정보 로그 찍기
      return res.status(200).json({ //200은 성공
        success: true
      })
    })//몽고디비에서 오는 메서드
})

app.post('/login', (req, res) => {

  //1. 이메일 디비에서 찾기
  User.findOne({ email: req.body.email }, (err, user) => {
    if(!user){
      return res. json({
        loginSuccess: false,
        massage: "제공된 이메일에 해당하는 유저가 없습니다."
      })
    }

    //2. 이메일이 디비에 있으면, 패스워드 매칭되는지 확인
    user.comparePassword( req.body.password, (err, isMatch ) => {
      if(!isMatch)
        return res.json({ loginSuccess: false, message: "비밀번호가 틀렸습니다."});
      
        //3. 비밀번호 까지 맞으면 토큰 생성
      user.generateToken((err, user) => {
        if(err) return res.status(400).send(err);
        
        // 토큰 저장 / where 로컬 스토리지 or 쿠키
        // cookies
        res.cookie("x_auth", user.token)
        .status(200)
        .json({loginSuccess: true, userId: user._id})

      })

    })
    
  })



})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})