var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs');
const moment = require('moment');

var UserSchema = new Schema({
    first_name: {
        type: String,
        required: true
    },
    last_name: {
        type: String,
        required: true
    },
    username: {
        type: String,
        unique: true,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    phone: {
        type: String,
        required: false
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        default: 'user',
        enum: ['user', 'admin']
    },
    user_ref: {
        type: String,
        required: false
    },
    register_date: {
        type: Date,
        required: true,
        default: () => Date.now()
    }
});

UserSchema.pre('save', function (next) {
    var user = this;
    if (this.isNew) {
        var ref = "";
        ref += user.username.slice(0, 3) + '/';
        ref += moment().format("YYYY-MM-DD") + '/';
        let low = 100000,
            high = 1000000,
            rand = Math.floor(Math.random() * (high - low) + low);
        ref += rand;

        user.user_ref = ref;
    }

    if (this.isModified('password') || this.isNew) {
        bcrypt.genSalt(10, function (err, salt) {
            if (err) {
                return next(err);
            }
            bcrypt.hash(user.password, salt, null, function (err, hash) {
                if (err) {
                    return next(err);
                }
                user.password = hash;
                next();
            });
        });
    } else {
        return next();
    }
});

UserSchema.methods.comparePassword = function (passw, cb) {
    bcrypt.compare(passw, this.password, function (err, isMatch) {
        if (err) {
            return cb(err);
        }
        cb(null, isMatch);
    });
};


module.exports = mongoose.model('User', UserSchema);
