const bcrypt = require('bcryptjs')
const regex = require(basedir + '/helpers/regex')
const jwt = require('jsonwebtoken')
const uuid = require('uuid')

encryptPassword = (password) => {
    return new Promise((resolve, reject) => {
        bcrypt.genSalt(10)
            .then(salt => { return bcrypt.hash(password, salt) })
            .then(encrypted => resolve(encrypted))
    })
}

comparePassword = (password, user) => {
    return new Promise((resolve, reject) => {
        bcrypt.compare(password, user.password)
            .then(res => {
                if(res)
                    resolve(user)
                else
                    reject('Email/Password is incorrect.')
            }).catch(err => {
                reject(err)
            })
    })
}

generateToken = (user) => {
    return new Promise((resolve, reject) => {
        jwt.sign({ email: user.email }, Configuration.JWT_KEY, { expiresIn: '1d' }, (error, token) => {
            if(error)
                reject(error)
            resolve(token)
        })
    })
}

verifyUser = (user) => {
    return new Promise((resolve, reject) => {
        UserModel.updateOne({ _id: user._id }, {
            $set: {
                isVerified: true,
                metadata: {
                    ...user.metadata,
                    dateUpdated: new Date()
                }
            }
        })
        .then(result => resolve(user))
        .catch(error => reject({ message: error.message }))
    })
}

module.exports = UserService = {
    signup: (data) => {
        return new Promise((resolve, reject) => {
            const { email, password, confirmPassword, userName } = data

            if(!regex.email.test(email)) reject('Email is not valid')
            if(password != confirmPassword)
                reject(`Password and Confirm Password doesn't match.`)

            encryptPassword(password)
                .then(encryptedPassword => { return UserModel.create({ email, userName, password: encryptedPassword, metadata: { verificationToken: uuid.v4(), dateCreated: new Date() } })})
                .then(data =>{

                    EmailHelper.sendEmail('email.verification.template', { link: Configuration.CLIENT_URL + `/auth/verify/${data.metadata.verificationToken}`},{
                        to: data.email,
                        subject: 'Email Verification'
                    });

                    resolve("You have successfully signed up. Please verify your email.")
                })
                .catch(error => { reject(error.message) })

        })
    },
    login: (data) => {
        return new Promise((resolve, reject) => {
            try {
                const { userName, password } = data


                UserModel.findOne({ $or: [ { email: userName }, { userName: userName }]})
                    .then(data => {
                        if (!data) reject('User name or Password is incorrect.')
                        if (!data.isVerified) reject('Your email is still unverified.')
                        return comparePassword(password, data)
                    })
                    .then(user => { return generateToken(user) })
                    .then(token => resolve(token))
                    .catch(error => reject(error))
            }
            catch(err) {
                reject(err)
            }
        })
    },
    verify: (code) => {
        return new Promise((resolve, reject) => {
            UserModel.findOne({ 'metadata.verificationToken': code })
                .then(user => {
                    if(!user) reject({ message: 'code is invalid.'})
                    return verifyUser(user)
                })
                .then(user => {
                    return generateToken(user)
                })
                .then(token => {
                    resolve(token)
                })
                .catch(error => reject({ message: error.message }))
        })
    },
    getUserById: (id) => {
        return new Promise((resolve, reject) => {
            UserModel.findById(id)
                .then(user => {
                    if(!user) reject({ message: 'user not found.'})
                    resolve(user)
                })
                .catch(error => reject({ message: error.message }))
        })
    }
}
