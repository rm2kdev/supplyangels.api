const Metadata = require(basedir + '/helpers/metadata.js');

module.exports = RequestService = {

  create: (user, requestData) => {
      return new Promise((resolve, reject) => {
        const { title, message, tos } = requestData

        RequestModel.findOne({"metadata.owner": user._id, "metadata.isActive": true})
          .then((existingRequest) => {
            if(!existingRequest){
              RequestModel.create({
                title: title,
                body: message,
                postcode: user.profile.addressDetails.postcode,
                location: user.profile.location,
                metadata: {
                  owner: user._id,
                  dateCreated: new Date(),
                  isActive: true
                }
              }).then(result => resolve(result))
                .catch(error => reject(error))

            }else{
              reject("Sorry, Cant have more than one active request.")
            }
          })
          .catch(error => reject(error))
      })
  },

  getmyrequests: (user) => {
    return new Promise((resolve, reject) => {
      RequestModel.findOne({"metadata.owner": user._id, "metadata.isActive" : true})
        .then((existingRequest) => {
          if(existingRequest){
            resolve(existingRequest)
          }else{
            reject("Couldn't find any active requests.")
          }
        })
        .catch(error => reject(error))
    })
  }

}
