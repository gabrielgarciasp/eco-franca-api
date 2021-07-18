import { createTransport } from 'nodemailer'
import ApiError from '../exceptions/ApiError';

const sendMail = async (email:string, title: string, html: string): Promise<void> => {
    try {
        
        const configEmail = {
            host: process.env.EMAIL_HOST,
            port: Number(process.env.EMAIL_PORT), 
            secure: process.env.EMAIL_SECURE == 'true',
            auth: {
                user: process.env.EMAIL_AUTH_USER,
                pass: process.env.EMAIL_AUTH_PASS,
            },
            tls: { rejectUnauthorized: process.env.EMAIL_TLS_REJECTUNAUTHORIZED == 'true' },
        };
        const configurateEmail = createTransport(configEmail);

        const informationMail = {
            from: `<${process.env.EMAIL_AUTH_USER}>`,
            to: email,
            subject: title,
            html: html,
        };
        configurateEmail.sendMail(informationMail)

        return;
    } catch(err){
        throw new ApiError(500, 'Error sending the e-mail')
    }
}

export { sendMail }