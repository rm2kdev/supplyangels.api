const { basePath } = require('./apiConfig')
const Response = require(basedir + '/helpers/responseMiddleware')

module.exports = function(){
    const baseRoute = basePath + 'address'

    this.post(baseRoute + '/find', (req, res) => {
          const { searchAddress } = req.body
          AddressService.find(searchAddress)
                .then(data => {
                  res.json(Response.Success.Custom('successfully found matching address.', data))
                })
                .catch(error => Response.Error.Custom(res, error))
    })


}
