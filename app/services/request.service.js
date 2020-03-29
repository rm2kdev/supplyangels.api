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

  deletemy(user, request){
    const { _id } = request;

    return new Promise((resolve, reject) => {
      RequestModel.findOne({"metadata.owner": user._id, "metadata.isActive": true})
        .then((existingRequest) => {
          if(existingRequest){
            existingRequest.delete()
              .then(res => resolve('successfully deleted request'))
              .catch(error => reject(error))

          }else{
            reject("Couldn't find request to delete.")
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
  },

  getspecificrequest: (request) => {
    return new Promise((resolve, reject) => {
      RequestModel.findOne({"_id": request._id, "metadata.isActive" : true})
        // .populate('metadata.owner', 'profile.enteredAddress', 'profile.location')
        .populate('metadata.owner')
        .then((existingRequest) => {
          if(existingRequest){
            //if !existingrequest.isInProgress
            resolve(existingRequest)
            //else
            //reject("Someone else has offered to help this request")
          }else{
            reject("This request is no longer active.")
          }
        })
        .catch(error => reject(error))
    })
  },

  listnearbyrequests: (user) => {
    return new Promise((resolve, reject) => {
      let geoQuery = {
        "metadata.isActive" : true,
        "location" : {
          "$near" : {
            "$geometry" : {
              "type" : "Point",
              "coordinates" : []
            },
            "$minDistance" : 0,
            "$maxDistance" : 30000.0
          }
        }
      }

      if(user){
        geoQuery.location.$near.$geometry.coordinates = user.profile.location.coordinates
      }else{
        geoQuery.location.$near.$geometry.coordinates = [115.8605, -31.9505];
        geoQuery.location.$near.$maxDistance = 10000000.0
      }

      RequestModel.count(geoQuery).exec()
        .then((count) => {
          var random = Math.max(Math.floor(Math.random() * count) - 20, 0)
          RequestModel.find(geoQuery)
            .select({title:1, body:1, postcode:1, 'metadata.dateCreated' : 1 })
            .skip(random)
            .limit(20)
            .then((requests) => {
              if(requests.length > 0){
                resolve(requests)
              }else{
                reject("Couldn't find any active requests.")
              }
            })
            .catch(error => {
              reject(error)
            })
        })
        .catch(err => reject(err));

    })
  }

}
