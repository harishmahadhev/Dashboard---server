import { google } from "googleapis";
import nodemailer from "nodemailer";
import {
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI,
  REFRESH_TOKEN,
} from "./env.js";

const oAuth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
);
oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });
export async function senderMail(email, token) {
  try {
    const accessToken = await oAuth2Client.getAccessToken();
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: "harish.vinesh@gmail.com",
        clientId: CLIENT_ID,
        clientSecret: CLIENT_SECRET,
        refreshToken: REFRESH_TOKEN,
        accessToken: accessToken,
      },
    });

    const mailOptions = {
      from: "harish.vinesh@gmail.com",
      to: email,
      subject: "Password Reset Link",
      html: `
          <h2>Forgetting is human, don't worry</h2>
          <h5>You requested to reset the password for account</h5>
          <p>Click <a href ="${process.env.BASEURL}/reset/${token}"> here </a> to reset your password</p>
          `,
      text: "Hello from Harish",
    };
    const result = await transporter.sendMail(mailOptions);
    return result;
  } catch (error) {
    return error;
  }
}
