import db from "../models";
import _, { includes, reject } from "lodash"; //
import emailServices from "./emailServices";
import { v4 as uuidv4 } from "uuid";

require("dotenv").config();

let builUrlEmail = (doctorId, token) => {
  let result = `${process.env.URL_REACT}/verify-booking?token=${token}&doctorId=${doctorId}`;

  return result;
};

let patientBookAppointmentServices = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      // Check for missing parameters in the input data
      if (
        !data.email ||
        !data.doctorId ||
        !data.timeType ||
        !data.date ||
        !data.fullName ||
        !data.selectedGender ||
        !data.address
      ) {
        resolve({ errCode: 1, errMessage: "Missing parameter" }); // Resolve with an error message if any parameter is missing
      } else {
        let token = uuidv4();
        await emailServices.sendSimpleEmail({
          receivers: data.email,
          patientName: data.fullName,
          time: data.timeString,
          doctorName: data.doctorName,
          language: data.language,
          redirectLink: builUrlEmail(data.doctorId, token),
        });
        // Find or create a user based on the email provided
        let user = await db.User.findOrCreate({
          where: { email: data.email },
          defaults: {
            email: data.email,
            roleId: "R3", // Set default role to "R3"
            address: data.address,
            gender: data.selectedGender,
            firstName: data.fullName,
          },
        });

        // Create a booking record if the user was found or created successfully
        if (user && user[0]) {
          await db.Booking.findOrCreate({
            where: { patientId: user[0].id }, // Check if a booking already exists for this patient
            defaults: {
              statusId: "S1", // Set the booking status to "S1"
              doctorId: data.doctorId, // Set the doctor ID
              patientId: user[0].id, // Set the patient ID
              date: data.date, // Set the appointment date
              timeType: data.timeType, // Set the time type for the appointment
              token: token,
            },
          });
        }
        // Resolve the promise with a success message
        resolve({
          errCode: 0,
          errMessage: "Save infro patientId succeed!!",
        });
      }
    } catch (error) {
      reject(error); // Reject the promise if an error occurs
    }
  });
};

let postVerifyBookAppointmentServices = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      // Kiểm tra tham số đầu vào
      if (!data.token || !data.doctorId) {
        resolve({ errCode: 1, errMessage: "Missing parameter" });
      } else {
        // Tìm kiếm cuộc hẹn dựa trên doctorId, token, và statusId
        let appointment = await db.Booking.findOne({
          where: {
            token: data.token,
            doctorId: data.doctorId,
            statusId: "S1", // Trạng thái ban đầu là S1
          },
          raw: false,
        });
        if (appointment) {
          // Cập nhật trạng thái của cuộc hẹn
          appointment.statusId = "S2"; // Thay đổi trạng thái thành S2
          await appointment.save(); // Lưu thay đổi vào cơ sở dữ liệu
          resolve({
            errCode: 0,
            errMessage: "Update the appointment succeeded!!!",
          });
        } else {
          resolve({
            errCode: 2,
            errMessage: "Appointment has been activated or does not exist!!!",
          });
        }
      }
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = { patientBookAppointmentServices, postVerifyBookAppointmentServices };
