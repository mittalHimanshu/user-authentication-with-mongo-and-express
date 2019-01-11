var mongoose = require('mongoose')
var bcrypt = require('bcrypt')

var UserSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    favBook: {
        type: String,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    }
})

UserSchema.statics.authenticate = (email, password, callback) => {
    UserSchema.findOne({email})
        .exec((err, user) => {
            if(err) return callback(err)
            else if (!user){
                var err = new Error('User not found')
                err.status = 401
                return callback(err)
            }
            bcrypt.compare(password, user.password, (err, result) => {
                if(result === true) return callback(null, user)
                return callback()
            })
        })
}

UserSchema.pre('save', next => {
    var user = this
    bcrypt.hash(user.password, 10, (err, hash) => {
        if(err) return next(err)
        user.password = hash
        next()
    })
})

module.exports = mongoose.model('User', UserSchema)