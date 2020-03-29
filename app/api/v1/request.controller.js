const { basePath } = require('./apiConfig')
const Response = require(basedir + '/helpers/responseMiddleware')
const authorization = require(basedir + '/helpers/authorization')

module.exports = function(){
  const baseRoute = basePath + 'request'

  this.post(baseRoute + '/create', authorization.secure('request'), (req, res) => {
    RequestService.create(req.user, req.body)
      .then(request => res.json(Response.Success.Custom('successfully created request.', request)))
      .catch(error => Response.Error.Custom(res, error))
  });

  this.post(baseRoute + '/deletemy', authorization.secure('request'), (req, res) => {
    RequestService.deletemy(req.user, req.body)
      .then(request => res.json(Response.Success.Custom('successfully deleted request.', request)))
      .catch(error => Response.Error.Custom(res, error))
  });

  this.get(baseRoute + '/myrequests', authorization.secure('request'), (req, res) => {
    RequestService.getmyrequests(req.user)
      .then(request => res.json(Response.Success.Custom('successfully got your request.', request)))
      .catch(error => Response.Error.Custom(res, error))
  });

  this.post(baseRoute + '/getspecific', authorization.secure('request'), (req, res) => {
    RequestService.getspecificrequest(req.body)
      .then(request => res.json(Response.Success.Custom('successfully got request.', request)))
      .catch(error => Response.Error.Custom(res, error))
  });

  this.get(baseRoute + '/listnearby', authorization.open('request'), (req, res) => {
    RequestService.listnearbyrequests(req.user)
      .then(request => res.json(Response.Success.Custom('successfully got nearby requests.', request)))
      .catch(error => Response.Error.Custom(res, error))
  });
}
