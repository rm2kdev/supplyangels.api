const jwt = require('jsonwebtoken')

module.exports = {
  //Routes that can ONLY be accessed when logged in
  secure: function(scope) {
    return (req, res, next) => {
      if(scope) {
        const authorization = req.headers.authorization
        if(authorization) {
          const token = authorization.split(' ')[1]
          if (!token) res.status(401).json({ message: 'Bearer not found', successful: false })
          else {
            jwt.verify(token, Configuration.JWT_KEY, (error, decoded) => {
              if (error)
                res.status(401).json({ message: error.message, successful: false })
              else {
                const { email } = decoded

                UserModel.findOne({ email }, (error, data) => {
                  if(error) res.status(401).json({ message: 'unauthorized access', successful: false })
                  else {
                    // const { _id } = data
                    req.user = data
                    next()
                  }
                })
              }
            })
          }
        } else
          res.status(401).json({ message: 'unauthorized access', successful: false })
      } else {
        next()
      }
    }
  },

  //Routes that can be accessed if logged in OR logged out
  open: function(scope) {
    return (req, res, next) => {
      if(scope) {
        const authorization = req.headers.authorization
        if(authorization) {
          const token = authorization.split(' ')[1]
          jwt.verify(token, Configuration.JWT_KEY, (error, decoded) => {
              if (error){
                req.user = null;
                next()
              } else {
                const { email } = decoded

                UserModel.findOne({ email }, (error, data) => {
                  if(error) {
                    req.user = null;
                    next()
                  }
                  else {
                    req.user = data
                    next()
                  }
                })
              }
            })

        } else {
          req.user = null;
          next()
        }
      } else {
        req.user = null;
        next()
      }
    }
  }
}
