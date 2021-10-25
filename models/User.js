const mongoose = require('mongoose');

const bcrypt = require('bcrypt');
const saltRounds = 10;
const jwt = require('jsonwebtoken');

const userSchema = mongoose.Schema({
    name: {
        type: String,
        maxlength: 50
    },
    email: {
        type: String,
        trim: true, // trim 은 스페이스 없애주는..
        unique: 1
    },
    password: {
        type: String,
        minlength: 5
    },
    lastname: {
        type: String,
        maxlength: 50
    },
    role: {
        type: Number,
        default: 0
    },
    image: String,
    token: {
        type: String
    },
    tokenExp: {
        type: Number
    }
})


userSchema.pre('save', function( next ) {
    // user모델에 user정보를 저장하기 전에 무엇을 한다는것

    var user = this;

    if(user.isModified('password')){
        // 비밀번호를 암호화 시킨다.
        bcrypt.genSalt(saltRounds, function(err, salt) {
            if(err) return next(err);

            bcrypt.hash(user.password, salt, function(err, hash) {
                if(err) return next(err);
                user.password = hash;
                next();
            });
        });
    } else {
        next();
    }
    
})

userSchema.methods.comparePassword = function (plainPassword, cb) {
    // plainPassword   <- 같은지 체크 ->   DB 암호화된 비밀번호
    // 후자를 복호화 하기는 힘들어서 전자를 암호화
    bcrypt.compare(plainPassword, this.password, function(err, isMatch) {
        if(err) return cb(err)
            cb(null, isMatch)
    })
}

userSchema.methods.generateToken = function (cb) {
    var user = this;
    //jsonwebtoken을 이용해서 token을 생성
    var token = jwt.sign(user._id.toHexString(), 'secretToken');

    user.token = token;
    user.save(function(err, user){
        if(err) return cb(err)
        cb(null, user);
    })
}

const User = mongoose.model('User', userSchema)

module.exports = { User }