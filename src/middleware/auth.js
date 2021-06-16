const jwt = require('jsonwebtoken')
const {User} = require('../../db/mongoose')

const authentication = async (req, res, next)=>{
    const token = req.header('autho')

    //this verifies who created the token, NOT WHO HAS IT.
    const creator_of_token = jwt.verify(token, process.env.jwt_secret)

    console.log('TOKEN', token)
    console.log('CHECK VARIABLE', creator_of_token)

    //must have both 'id & token' fields because if you only have 'id', it will return the user even if all token fields are deleted.
    //this will make 'logging out of all', useless as the authentication will keep returning the user.
    //both 'id & token' fields indicates whether the user still HAS that token.
    const user = await User.findOne({_id: creator_of_token._id, 'tokens.token': token})
    
    console.log('AUTHENTICATION - USER', user)

    req.user_data = user
    req.user_token = token

    if(!user){
        
        res.send('user not found')

        return console.log('NO USER FOUND from auth.js')
    }
    next()
}

module.exports = authentication