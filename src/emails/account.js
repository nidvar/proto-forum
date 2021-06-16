const sgMail = require('@sendgrid/mail')
const API_KEY = process.env.sendgrid_api
console.log('API KEY FROM PROCESS.ENV =========================== ', API_KEY)
sgMail.setApiKey(API_KEY)

// sgMail.send({
//     to: "nidvarcloud@gmail.com",
//     from: "djayshine87@hotmail.com",
//     subject: "Testing Sendgrid",
//     text: "Let's see if this works."
// })

const welcome_email = (email, username)=>{
    sgMail.send({
        to: email,
        from: "djayshine87@hotmail.com",
        subject: "Welcome from Task App",
        text: `Hello ${username}, this is from the FORUM, courtesy of SendGrid`
    }).then(a=>{
        console.log('IS IT WORKING ?',a)
    })
}

const cancel_email = (email, username)=>{
    sgMail.send({
        to: email,
        from: "djayshine87@hotmail.com",
        subject: "Forum cancellation",
        text: `Hello ${username}, this is from the FORUM. You have cancelled`
    })
}

module.exports = {welcome_email, cancel_email}