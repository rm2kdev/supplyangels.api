const EventEmitter = require('events')
const EmailHelper = require(basedir + '/helpers/emailer')

module.exports = MyEventEmitter = new EventEmitter()

module.exports = () => {
    // MyEventEmitter.on('NewUserCreated', (user) => {
    //     EmailHelper.sendEmail('email.verification.template', { link: Configuration.CLIENT_URL + `/auth/verify/${user.metadata.verificationToken}`},{
    //        to: user.email,
    //        subject: 'Email Verification'
    //    })
    // })
}
