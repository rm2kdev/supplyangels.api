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
                  isActive: true,
                  inProgress: false
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
            if(!existingRequest.metadata.inProgress){
              resolve(existingRequest)
            }else{
              reject("Someone else has committed to help this person.")
            }
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
        "metadata.inProgress" : false,
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
  },

  committorequest: function (user, request) {
    return new Promise((resolve, reject) => {

      RequestModel.count({"metadata.commitmentBy": user._id, "metadata.isActive" : true, "metadata.inProgress" : true})
        .then(numberOfCommitments => {

          if (numberOfCommitments < 3){

            RequestModel.findOne({"_id": request._id})
              .then((foundRequest) => {
                if(foundRequest){

                  if(foundRequest.metadata.isActive){
                    if(!foundRequest.metadata.inProgress){

                      foundRequest.metadata.inProgress = true;
                      foundRequest.metadata.commitmentBy = user._id;
                      foundRequest.metadata.commitmentDate = new Date();
                      foundRequest.save()
                        .then(result => {
                          resolve("You have committed to help this request.")
                        })
                        .catch(err => reject(err))

                    }else{
                      reject("Someone else has already committed to help this request")
                    }
                  }else{
                    reject("This request is no longer active it may have been solved already.")
                  }
                }else{
                  reject("Couldn't find this request, it may have been deleted.")
                }
              })
              .catch(error => reject(error))

          }else{
            reject("You cant commit to more than 3 requests")
          }

        })
        .catch(error => reject(error))

    })
  },

  getmycommitments: function(user){
    return new Promise((resolve, reject) => {
      RequestModel.find({"metadata.commitmentBy": user._id, "metadata.isActive" : true, "metadata.inProgress" : true})
        .populate('metadata.owner', 'profile.enteredAddress')
        .then((committedRequests) => {
          if(committedRequests.length > 0){
            resolve(committedRequests)
          }else{
            reject("Doesn't look like you've committed to anyone yet.")
          }
        })
        .catch(error => reject(error))
    })
  },

  completecommitment: function(user, request){
    return new Promise((resolve, reject) => {
      RequestModel.findOne({"_id":request._id, "metadata.commitmentBy": user._id})
        .populate('metadata.owner')
        .populate('metadata.commitmentBy')
        .then((completedRequest) => {

          completedRequest.metadata.isActive = false;
          completedRequest.metadata.inProgress = false;
          completedRequest.metadata.competedDate = new Date();
          completedRequest.save()
            .then(() => {

              //send the email
              resolve("We've let the requester known an angel has completed their request.")
              EmailHelper.sendEmail('request.complete', { angelPaypal: completedRequest.metadata.commitmentBy.profile.tipPaypalAddress || "Did Not Specify"},{
                to: completedRequest.metadata.owner.email,
                subject: 'An angel has completed your request'
              });

            })
            .catch(err => reject(err))

        })
        .catch(error => reject(error))
    })
  }

}
