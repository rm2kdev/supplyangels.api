const { Schema, model } = require('mongoose')

const userSchema = new Schema({
    email: {
        type: String,
        required: (true, 'Email is required.'),
        unique: (true, 'Email already exists.')
    },
    password: {
        type: String,
        required: (true, 'Password is required.')
    },

    profile: {
        tipPaypalAddress: String,
        enteredAddress: String,

        addressDetails: {},
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
        }

    },
    metadata: {
        verificationToken: {
            type: String
        },
        isVerified: {
          type: Boolean,
          default: false
        },
        isBanned: {
          type: Boolean,
          default: false
        },
        dateCreated: Date,
        dateUpdated: Date
    }
})

module.exports = UserModel = supdb.model('user', userSchema);

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
