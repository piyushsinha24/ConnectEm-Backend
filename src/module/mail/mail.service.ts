import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { google } from 'calendar-link';
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

    private _getAttendeeBookHTML(
        name: string,
        hostLastName: string,
        date: string,
        from: string,
        to: string,
        meetlink: string,
        calLink: string,
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
                                <td style="border: 1px solid #fff;">
                                    <a style="width: 80px; height: 40px; text-decoration: none; color: #FFFFFF; border-radius: 5px;" href="${meetlink}" target="_blank">Join</a>
                                </td>
                                <td style="border: 1px solid #fff;">
                                    <a style="width: 80px; height: 40px; text-decoration: none; color: #FFFFFF; border-radius: 5px;" href="${calLink}" target="_blank">Add to Calendar</a>
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

    private _getHostBookHTML(
        hostFirstName: string,
        hostLastName: string,
        name: string,
        date: string,
        from: string,
        to: string,
        calLink: string,
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
                            <p>Hi ${hostFirstName} ${hostLastName},</p>
                            <p>You have a new attendee ${name} for <b>${date}</b>.</p>
                            <p>Time slot: <b>${from} - ${to}</b>.</p>
                            <table style="font-family: sans-serif; background-color: #26D07C; border-radius: 5px;" cellpadding="8">
                                <td>
                                    <a style="width: 80px; height: 40px; text-decoration: none; color: #FFFFFF; border-radius: 5px;" href="${calLink}" target="_blank">Add To Calendar</a>
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

    private _getHostEventCreatedHTML(
        hostFirstName: string,
        hostLastName: string,
        eventTitle: string,
        eventID: string
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
                            <p>Hi ${hostFirstName} ${hostLastName},</p>
                            <p>Your event <b>${eventTitle}</b> is live with us.</p>
                            <table style="font-family: sans-serif; background-color: #26D07C; border-radius: 5px;" cellpadding="8">
                                <td style="border: 1px solid #fff;">
                                    <a style="width: 80px; height: 40px; text-decoration: none; color: #FFFFFF; border-radius: 5px;" href="https://connectem.netlify.app/event/${eventID}" target="_blank">Event Info</a>
                                </td>
                                <td style="border: 1px solid #fff;">
                                    <a style="width: 80px; height: 40px; text-decoration: none; color: #FFFFFF; border-radius: 5px;" href="https://connectem.netlify.app/book/${eventID}" target="_blank">Booking Link</a>
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

    async sendBookEventMail(
        event: Event,
        bookDTO: BookDTO,
        attendeeIndex: number
    ): Promise<boolean> {
        let transporter = this._getTransporter()

        let timing = event.timings.find(t => t.id === bookDTO.dateID)
        let slot = timing.slots.find(s => s.id === bookDTO.slotID)

        //* generate add to calendar

        const calEventLink = google({
            title: event.title,
            description: event.description,
            start: slot.from,
            end: slot.to,
        })

        let attendeeMail = this._getAttendeeBookHTML(
            slot.name[attendeeIndex],
            event.host.lastName,
            formatDate(timing.date, bookDTO.timezone),
            formatTime(slot.from, bookDTO.timezone),
            formatTime(slot.to, bookDTO.timezone),
            event.eventLink,
            calEventLink,
        )

        let hostMail = this._getHostBookHTML(
            event.host.firstName,
            event.host.lastName,
            slot.name[attendeeIndex],
            formatDate(timing.date, event.timezone),
            formatTime(slot.from, event.timezone),
            formatTime(slot.to, event.timezone),
            calEventLink,
        )

        let attendeeMailOptions = {
            from: this.commonConfig.get<string>('GMAIL_USER'),
            to: bookDTO.email,
            subject: 'Booking Successful',
            html: attendeeMail,
        }

        let hostMailOptions = {
            from: this.commonConfig.get<string>('GMAIL_USER'),
            to: event.host.email,
            subject: 'New Booking',
            html: hostMail,
        }

        transporter.sendMail(attendeeMailOptions, function (error, _) {
            if (error) {
                console.log(error);
            } else {
                console.log('Attendee Email sent.')
            }
        })

        transporter.sendMail(hostMailOptions, function (error, _) {
            if (error) {
                console.log(error);
            } else {
                console.log('Host Email sent.')
            }
        })

        return true
    }

    async sendEventCreatedMail(event: Event): Promise<boolean> {

        let transporter = this._getTransporter()

        let html = this._getHostEventCreatedHTML(
            event.host.firstName,
            event.host.lastName,
            event.title,
            event.id
        )

        let eventCreatedOptions = {
            from: this.commonConfig.get<string>('GMAIL_USER'),
            to: event.host.email,
            subject: 'New Event Created',
            html: html,
        }

        transporter.sendMail(eventCreatedOptions, function (error, _) {
            if (error) {
                console.log(error);
            } else {
                console.log('Event Created Email sent.')
            }
        })

        return true
    }
}