import { createTransport } from 'nodemailer'

const sendMail = async (email: string, title: string, html: string) => {
    try {
        const configEmail = {
            host: process.env.EMAIL_HOST,
            port: Number(process.env.EMAIL_PORT),
            secure: process.env.EMAIL_SECURE == 'true',
            auth: {
                user: process.env.EMAIL_AUTH_USER,
                pass: process.env.EMAIL_AUTH_PASS,
            },
            tls: {
                rejectUnauthorized:
                    process.env.EMAIL_TLS_REJECT_UNAUTHORIZED == 'true',
            },
        }
        const settingsEmail = createTransport(configEmail)

        const informationMail = {
            from: `<${process.env.EMAIL_AUTH_USER}>`,
            to: email,
            subject: title,
            html: html,
        }

        await settingsEmail.sendMail(informationMail)
    } catch (err) {
        console.log('❌ Failed send email')
        console.log(err)
    }
}

export { sendMail }
