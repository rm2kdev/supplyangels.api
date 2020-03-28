const { basePath } = require('./apiConfig')
const Response = require(basedir + '/helpers/responseMiddleware')
const authorization = require(basedir + '/helpers/authorization')

module.exports = function(){
    const baseRoute = basePath + 'user'

    this.post(baseRoute + '/signup', (req, res) => {
        return new Promise((resolve, reject) => {
            UserService.signup(req.body)
                .then(data => resolve(
                    res.json(Response.Success.Custom('successfully signed up a user.', data
                    ))))
                .catch(error => reject(Response.Error.Custom(res, error)))
        })
    })

    this.post(baseRoute + '/login', (req, res) => {
        //return new Promise((resolve, reject) => {
            UserService.login(req.body)
                .then(data => res.json(Response.Success.Custom('successfully logged in user.', { token: data })))
                .catch(error => { Response.Error.Custom(res, error)} )
        //})
    })

    this.get(baseRoute + '/verify/:id', (req, res) => {
        return new Promise((resolve, reject) => {
            const code = req.params.id
            UserService.verify(code)
                .then(token => resolve(res.json(Response.Success.Custom('Successfully verified email.', token))))
                .catch(error => reject(Response.Error.Custom(res, error)))
        })
    })

    this.get(baseRoute + '/checktoken', authorization('user'), (req, res) => {
        const { _id } = req.user;
        res.json(Response.Success.Custom("token is valid"));
    })

    this.get(baseRoute, authorization('user'), (req, res) => {
        return new Promise((resolve, reject) => {
            const { _id } = req.user
            UserService.getUserById(_id)
                .then(result => resolve(res.json(Response.Success.Custom('Successfully retreive your user data.', result))))
                .catch(error => reject(Response.Error.Custom(res, error)))
        })
    })
}
