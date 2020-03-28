const bodyParser = require('body-parser')

module.exports  = function(){
    this.use(bodyParser.json())
    this.use(bodyParser.urlencoded({ extended: true }))

    this.use((req, res, next) => {
        res.header("Access-Control-Allow-Origin", "*")
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization")
        res.header("Access-Control-Allow-Methods", "GET,POST,OPTIONS,DELETE,PUT")
        next()
    })
}
