const jwt = require('jsonwebtoken')
const secret = "ChristmasGameFromAradi"

function generateToken(data) {
    const token = jwt.sign({
        name: data.name,
        password: data.password
    },
    secret)
    return token
}

function checkToken(data) {
    const token = data.split(" ")
    const decoded = jwt.decode(token[1], secret)
    return decoded
}

module.exports = {
    checkToken,
    generateToken
}