require("dotenv").config();
import nodemailer from "nodemailer";

let sendSimpleEmail = async (dataSend) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // Use `true` for port 465, `false` for all other ports
    auth: {
      user: process.env.EMAIL_APP,
      pass: process.env.EMAIL_APP_PASSWORD,
    },
  });
  const info = await transporter.sendMail({
    from: '"nguyen van chien 👻" <nguyenchien30102001@gmail.com>', // sender address
    to: dataSend.receivers, // list of receivers
    subject: "Thông tin đặt lịch khám bệnh", // Subject line
    html: `
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
    `,
  });
};

module.exports = { sendSimpleEmail };
