const nodemailer = require('nodemailer');
const pug = require('pug');
const { htmlToText } = require('html-to-text');
const Mailjet = require('node-mailjet');
const mailjet = new Mailjet({
  apiKey: process.env.MJ_APIKEY_PUBLIC,
  apiSecret: process.env.MJ_APIKEY_PRIVATE,
});

module.exports = class Email {
  constructor(user, url) {
    this.to = user.email;
    this.firstName = user.name.split(' ')[0];
    this.url = url;
    this.from = `Mjay Humilde <${process.env.EMAIL_FROM}>`;
  }

  newTransport() {
    if (process.env.NODE_ENV === 'production') {
      // Mailjet transport
      return {
        sendMail: async (mailOptions) => {
          try {
            const request = mailjet.post('send', { version: 'v3.1' }).request({
              Messages: [
                {
                  From: {
                    Email: process.env.MJ_SENDER_EMAIL, // Use your verified Mailjet sender email
                    Name: this.from.split('<')[0].trim(),
                  },
                  To: [
                    {
                      Email: mailOptions.to,
                      Name: this.firstName, // Adjust as needed
                    },
                  ],
                  Subject: mailOptions.subject,
                  HTMLPart: mailOptions.html,
                  TextPart: mailOptions.text,
                },
              ],
            });

            const result = await request;
            console.log('Email sent successfully via Mailjet:', result.body);
            return { success: true }; // Simulate Nodemailer response
          } catch (error) {
            console.error(
              'Error sending email via Mailjet:',
              error.statusCode,
              error.message,
              error.response ? error.response.body : error
            );
            return { success: false, error }; // Simulate Nodemailer error
          }
        },
      };
    }

    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      secure: false,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }

  async send(template, subject) {
    const html = pug.renderFile(`${__dirname}/../views/email/${template}.pug`, {
      firstName: this.firstName,
      url: this.url,
      subject,
    });

    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      html,
      text: htmlToText(html),
    };

    await this.newTransport().sendMail(mailOptions);
  }

  async sendWelcome() {
    await this.send('welcome', 'Welcome to the Natours Family!');
  }
  async sendPasswordReset() {
    await this.send(
      'passwordReset',
      'Your password reset token (valid for 10mins)'
    );
  }
};
