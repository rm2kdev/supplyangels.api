// const bcrypt = require('bcryptjs')
// const regex = require(basedir + '/helpers/regex')
// const jwt = require('jsonwebtoken')
// const uuid = require('uuid')
const axios = require('axios');


module.exports = AddressService = {
    find: (inputAddress) => {
        return new Promise((resolve, reject) => {
            try {
              let requestUrl = 'https://us1.locationiq.com/v1/search.php?key=814275a4586c07&q=' + inputAddress + '&format=json&addressdetails=1&limit=3'
              axios.get(requestUrl)
                .then(response => {
                  console.log(response)
                  resolve(response.data);
                })
                .catch(error => {
                  console.log(error);
                  reject(error);
                })}
            catch(err) {
                reject(err)
            }
        })
    },
}
