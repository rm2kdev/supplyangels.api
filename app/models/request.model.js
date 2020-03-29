const { Schema, model } = require('mongoose')

const requestSchema = new Schema({
    title: {
        type: String,
        required: (true, 'Title is required.'),
        maxlength: 40
    },
    body: {
        type: String,
        required: (true, 'Password is required.'),
        maxlength: 120
    },

    postcode : { type: String },

    location: {
      type: {
        type: String,
        enum: ['Point'],
        required: true
      },
      coordinates: {
        type: [Number],
        required: true
      }
    },

    metadata: {
      owner: {type: Schema.Types.ObjectId, ref: 'user'},
      isActive: Boolean,

      inProgress: Boolean,
      commitmentBy: {type: Schema.Types.ObjectId, ref: 'user'},
      commitmentDate: Date,
      competedDate: Date,

      dateCreated: Date,
      dateUpdated: Date
    }
})

module.exports = RequestModel = supdb.model('request', requestSchema);

// example geo query
// {
//   "profile.location" : {
//   "$near" : {
//     "$geometry" : {
//       "type" : "Point",
//         "coordinates" : [
//         115.8551746,
//         -31.863347
//
//
//       ]
//     },
//     "$minDistance" : 0,
//       "$maxDistance" : 5000.0
//   }
// }
// }
