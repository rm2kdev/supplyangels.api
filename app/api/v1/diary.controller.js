const { basePath } = require('./apiConfig');
const Response = require(basedir + '/helpers/responseMiddleware');
const authorization = require(basedir + '/helpers/authorization');

module.exports = function() {

    //Route Constants
    const baseRoute = basePath + 'diary';
    const authorizationScope = 'AS.DIARY';

    //List All
    this.get(baseRoute + '/listall', authorization(authorizationScope), (req, res) => {
        return new Promise((resolve, reject) => {
            DiaryService.listall(req.user._id)
                .then(data => resolve(res.json(Response.Success.Custom('Successfully listed all diary entries.', data))))
        })
    });

    //Create
    this.post(baseRoute, authorization(authorizationScope), (req, res) => {
        return new Promise((resolve, reject) => {
            DiaryService.create(req.user, req.body)
                .then(data => resolve(res.json(Response.Success.Custom('Successfully added diary entry.', data))))
                .catch(error => reject(Response.Error.Custom(res, error.toString())));
        })
    })

};
