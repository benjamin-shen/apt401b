const nodemailer = require("nodemailer");
const request = require("request");

const env = require("../env.json");

const url = env.app.url;

const gmailAuth = env.gmail.auth;
const senderName = env.gmail.sender;
const recipients = env.gmail.recipients;

async function sendEmail(name, email, verified, time) {
  try {
    const info = name ? name : email && verified ? email : null;
    const detailedInfo =
      name && email && verified
        ? name + ` (${email})`
        : email && !verified
        ? email + `(unverified)`
        : info;

    let subject = "Ding Dong!";
    if (info) {
      subject += ` ${info} rang the doorbell.`;
    }

    let html = `<p>${
      detailedInfo ? detailedInfo : "Someone"
    } rang the doorbell${url && ` on <a href="${url}">${url}</a>`}.</p>${
      time && `<p>Time: <em>${time.format("LLLL")}</em></p>`
    }`;

    const sender = `"${senderName}" <${gmailAuth.user}>`;

    let mail = await nodemailer
      .createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: gmailAuth,
      })
      .sendMail({
        from: sender,
        to: recipients.join(", "),
        subject,
        html,
      });

    console.log("Email sent: %s", mail.messageId);
  } catch (err) {
    console.log(err);
  }
}

const groupmeAuthToken = env.groupme.auth_token;
const groupmeBotId = env.groupme.bot_id;

async function sendMessage(name, email, time) {
  try {
    const info = name ? name : email ? email : null;

    let text = "Ding Dong! ";
    if (info) {
      text += `${info} rang the doorbell. `;
    }
    text += `\nTime: ${time.calendar()}`;

    request.post(
      "https://api.groupme.com/v3/bots/post?token=" + groupmeAuthToken,
      {
        json: {
          text,
          bot_id: groupmeBotId,
        },
      },
      (error, response, body) => {
        if (!error && response.statusCode === 201) {
          // console.log(body);
        }
      }
    );

    console.log("Message sent.");
  } catch (err) {
    console.log(err);
  }
}

async function ring(name, email, verified, time) {
  await sendMessage(name, email, time);
  await sendEmail(name, email, verified, time);
}

exports.ring = ring;
