import _ from 'lodash';
import nodemailer from 'nodemailer';
import { AppError } from '../app-error';
import { config } from '../config';

class EmailManager {
    sendMail(options: { to: string; html: string; subject?: string; from?: string }) {
        return new Promise((resolve, reject) => {
            if (!_.get(options, 'to')) {
                reject(new AppError('to is a required parameter'));
                return;
            }
            const { smtpConfig } = config;
            if (!smtpConfig || !smtpConfig.host) {
                resolve({});
                return;
            }
            const transporter = nodemailer.createTransport(smtpConfig);
            const sendEmailAddress = smtpConfig.auth.user;
            const defaultMailOptions = {
                from: `"CodePush Server" <${sendEmailAddress}>`, // sender address
                to: '', // list of receivers required parameter
                subject: 'CodePush Server', // Subject line
                html: '', // html body
            };
            const mailOptions = _.assign(defaultMailOptions, options);
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    reject(error);
                    return;
                }
                resolve(info);
            });
        });
    }

    sendRegisterCodeMail(email: string, code: string) {
        return this.sendMail({
            to: email,
            html: `<div>Your verification code is: <em style="color:red;">${code}</em> valid for 20 minutes</div>`,
        });
    }
}

export const emailManager = new EmailManager();
