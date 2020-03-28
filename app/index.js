const PORT = process.env.PORT || 3000
const express = require('express')
const bootable = require('bootable')
require('dotenv').config()
global.basedir = __dirname

const app = bootable(express())

app.phase(bootable.initializers(__dirname + '/configurations'))
app.phase(bootable.initializers(__dirname + '/models'))
app.phase(bootable.initializers(__dirname + '/services'))
app.phase(bootable.initializers(__dirname + '/api/v1'))

app.boot((err) => {
    if(err) {
        console.log(err)
    }
    app.get('/healthcheck', (req, res) => {
        res.status(200).json('This is healthy.')
    })
    app.listen(PORT, () => {
        console.log('Supply angels api is up on port: ' + PORT)
    })
})
