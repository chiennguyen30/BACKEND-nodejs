require("dotenv").config();
import nodemailer from "nodemailer";

let sendSimpleEmail = async (dataSend) => {
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // Use `true` for port 465, `false` for all other ports
    auth: {
      user: process.env.EMAIL_APP,
      pass: process.env.EMAIL_APP_PASSWORD,
    },
  });
  let info = await transporter.sendMail({
    from: '"nguyen van chien 👻" <nguyenchien30102001@gmail.com>', // sender address
    to: dataSend.receivers, // list of receivers
    subject: "Thông tin đặt lịch khám bệnh", // Subject line
    html: getBodyHTMLEmail(dataSend),
  });
};

let getBodyHTMLEmail = (dataSend) => {
  let resutl = "";
  if (dataSend.language === "vi") {
    resutl = `
    <h3> Xin chào ${dataSend.patientName}</h3>
    <p>Bạn đã nhận được thư phản hồi đặt lịch khám bệnh online trên NVC BookingCare</p>
    <p>Thông tin đặt lịch khám bệnh</p>
    <div><b>Thời gian : ${dataSend.time}</b></div>
    <div><b>Bác sĩ : ${dataSend.doctorName}</b></div>

    <p>Nếu các thông tin trên là đúng sự thật, vui lòng click vào đường dẫn bên dưới để xác nhận và hoàn tất thủ tục đặt lịch khám bệnh</p>
    <div>
      <a href=${dataSend.redirectLink} target=""_blank>Click here</a>
    </div>
    <p>Xin chân thành cảm ơn</p>
  `;
  }
  if (dataSend.language === "en") {
    resutl = `
    <h3> Dear ${dataSend.patientName}</h3>
    <p>You have received a response letter for online medical appointment booking on NVC BookingCare</p>
    <p>Medical appointment booking information</p>
    <div><b>Time: ${dataSend.time}</b></div>
    <div><b>Doctor: ${dataSend.doctorName}</b></div>

    <p>If the above information is correct, please click on the link below to confirm and complete the medical appointment booking procedure</p>
    <div>
      <a href=${dataSend.redirectLink} target="_blank">Click here</a>
    </div>
    <p>Thank you very much</p>
   
  `;
  }
  return resutl;
};

let sendAttachment = async (dataSend) => {
  return new Promise(async (resolve, reject) => {
    try {
      let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false, // Use `true` for port 465, `false` for all other ports
        auth: {
          user: process.env.EMAIL_APP,
          pass: process.env.EMAIL_APP_PASSWORD,
        },
      });
      let info = await transporter.sendMail({
        from: '"nguyen van chien 👻" <nguyenchien30102001@gmail.com>', // sender address
        to: dataSend.email,
        subject: "Thông tin đặt lịch khám bệnh", // Subject line
        html: getBodyHTMLEmailRemedy(dataSend),
        attachments: [
          {
            // encoded string as an attachment
            filename: `remedy-${dataSend.patientId} - ${new Date().getTime()}.png`,
            content: dataSend.imgBase64.split("base64,")[1],
            encoding: "base64",
          },
        ],
      });

      resolve();
    } catch (error) {
      reject(error);
    }
  });
};
let getBodyHTMLEmailRemedy = (dataSend) => {
  let resutl = "";
  if (dataSend.language === "vi") {
    resutl = `
    <h3> Xin chào ${dataSend.patientName}</h3>
    <p>Bạn đã nhận được thư phản hồi đặt lịch khám bệnh online trên NVC BookingCare thành công</p>
    <p>Thông tin đơn thuốc/hóa đơn được gửi trong file đính kèm</p>
    <p>Xin chân thành cảm ơn</p>
  `;
  }
  if (dataSend.language === "en") {
    resutl = `
    <h3> Dear ${dataSend.patientName}</h3>
    <p>You have received a response letter for online medical appointment booking on NVC BookingCare</p>
    <p>Medical appointment booking information</p>
    <p>If the above information is correct, please click on the link below to confirm and complete the medical appointment booking procedure</p>
    <p>Thank you very much</p>
  `;
  }
  return resutl;
};

module.exports = { sendSimpleEmail, sendAttachment };
