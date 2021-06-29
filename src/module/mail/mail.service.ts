import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createTransport, Transporter } from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import { CommonConfig } from 'src/config/common.config';
import { Event } from 'src/entity/event.entity';
import { formatDate, formatTime } from 'src/util/dateTime.util';
import { BookDTO } from 'src/validation/book.dto';

@Injectable()
export class MailService {

    constructor(
        private readonly commonConfig: ConfigService<CommonConfig>,
    ) { }

    private _getTransporter(): Transporter<SMTPTransport.SentMessageInfo> {
        let transporter = createTransport({
            service: 'gmail',
            auth: {
                user: this.commonConfig.get<string>('GMAIL_USER'),
                pass: this.commonConfig.get<string>('GMAIL_PASS'),
            }
        })

        return transporter
    }

    private _getEventCreatedHTML(firstName: string, lastName: string): string {
        return `
        <!DOCTYPE html>
        <html lang="en">

        <head>
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>ConnectEm Invite</title>
        </head>

        <body>
        <table style="font-family: sans-serif;" width="100%" height="100%" cellpadding="15">
            <tr>
                <td>
                        <img src="https://drive.google.com/uc?export=view&id=14iNy37P7dZs7EtNsEFTV57x6shIOKawf"
                            alt="ConnectEm"></img>
                </td>
            </tr>
            <tr>
                <td>
                        <p>Hi ${firstName} ${lastName},</p>
                        <p>Your meeting with Mr Singh is scheduled for <b>Monday, June 21, 2021</b>.</p>
                        <p>Time slot: <b>09:00 am - 11:30 am</b>.</p>
                        <table style="font-family: sans-serif; background-color: #26D07C; border-radius: 5px;" cellpadding="8">
                            <td>
                                <a style="width: 80px; height: 40px; text-decoration: none; color: #FFFFFF; border-radius: 5px;" href="https://meet.google.com/xxc-rrcq-ryn" target="_blank">Join</a>
                            </td>
                        </table>
                        <p>Thanks & Regards,</p>
                        <p style="font-style: italic;">ConnectEm Team</p>
                        <hr>
                        <p>Get started with <a style="color: #26D07C;" href="https://connectem.netlify.app/" target="_blank">ConnectEm</a> today.</p>
                </td>
            </tr>
        </table>
        </body>
        </html>
        `
    }

    private _getBookSuccessHTML(
        name: string,
        hostLastName: string,
        date: string,
        from: string,
        to: string,
        meetlink: string,
    ): string {
        return `
        <!DOCTYPE html>
        <html lang="en">

        <head>
            <meta charset="UTF-8">
            <meta http-equiv="X-UA-Compatible" content="IE=edge">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>ConnectEm Invite</title>
        </head>

        <body>
            <table style="font-family: sans-serif;" width="100%" height="100%" cellpadding="15">
                <tr>
                    <td>
                            <img src="https://drive.google.com/uc?export=view&id=14iNy37P7dZs7EtNsEFTV57x6shIOKawf"
                                alt="ConnectEm"></img>
                    </td>
                </tr>
                <tr>
                    <td>
                            <p>Hi ${name},</p>
                            <p>Your meeting with Mr ${hostLastName} is scheduled for <b>${date}</b>.</p>
                            <p>Time slot: <b>${from} - ${to}</b>.</p>
                            <table style="font-family: sans-serif; background-color: #26D07C; border-radius: 5px;" cellpadding="8">
                                <td>
                                    <a style="width: 80px; height: 40px; text-decoration: none; color: #FFFFFF; border-radius: 5px;" href="${meetlink}" target="_blank">Join</a>
                                </td>
                            </table>
                            <p>Thanks & Regards,</p>
                            <p style="font-style: italic;">ConnectEm Team</p>
                            <hr>
                            <p>Get started with <a style="color: #26D07C;" href="https://connectem.netlify.app/" target="_blank">ConnectEm</a> today.</p>
                    </td>
                </tr>
            </table>
        </body>
        </html>
        `
    }


    async sendEventCreatedMail(event: Event): Promise<boolean> {

        // let date = this._formatDate(event.)

        // let transporter = this._getTransporter()

        // let mailOptions = {
        //     from: this.commonConfig.get<string>('GMAIL_USER'),
        //     to: mail,
        //     subject: 'Test Email',
        //     html: this._getEventCreatedHTML(),
        // }

        // transporter.sendMail(mailOptions, function (error, info) {
        //     if (error) {
        //         console.log(error);
        //     } else {
        //         console.log('Email sent: ' + info.messageId);
        //     }
        // })

        return true
    }

    async sendBookEventMail(event: Event, bookDTO: BookDTO, attendeeIndex: number): Promise<boolean> {
        let transporter = this._getTransporter()

        let timing = event.timings.find(t => t.id === bookDTO.dateID)
        let slot = timing.slots.find(s => s.id === bookDTO.slotID)

        let d = new Date(slot.from)

        console.log(d)

        let html = this._getBookSuccessHTML(
            slot.name[attendeeIndex],
            event.host.lastName,
            formatDate(timing.date),
            formatTime(slot.from),
            formatTime(slot.to),
            event.eventLink,
        )

        let bookCompletedOptions = {
            from: this.commonConfig.get<string>('GMAIL_USER'),
            to: bookDTO.email,
            subject: 'Booking Successful',
            html: html,
        }

        transporter.sendMail(bookCompletedOptions, function (error, _) {
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent.')
            }
        })



        return true
    }
}