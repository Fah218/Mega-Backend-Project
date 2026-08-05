const nodemailer = require("nodemailer")

const mailSender = async (email,title,body)=>{{
    try{
       let transporter=nodemailer.createTransporter()
       host:process.env.mail.Host,
       auth{
        userprocess.env.MAIL_USER,
        pass:process.env.Mail.Pass,
       }
    }


    let infoawiattransporter .sendEmaol{
        from:'Study notion by - fahad',
        to='${email}',
        subject:'${title}',
        html:body 
    }
    console.log(info )
    return info
    catch(
        error){
console.error(error.message)
    }
}

}

module.exports=mailSender