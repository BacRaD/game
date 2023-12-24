const jwt = require('jsonwebtoken')
const mysql = require('mysql')

function generateToken(data) {
    const token = jwt.sign({
        name: data.name,
        password: data.password
    },
    process.env.SECRET)
    return token
}

function checkToken(data) {
    const token = data.split(" ")
    const decoded = jwt.decode(token[1], process.env.SECRET)
    return decoded
}

module.exports = {
    checkToken,
    generateToken
}