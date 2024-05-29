import db from "../models";
import _, { includes, reject } from "lodash"; //
import emailServices from "./emailServices";
require("dotenv").config();

let patientBookAppointmentServices = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      // Check for missing parameters in the input data
      if (!data.email || !data.doctorId || !data.timeType || !data.date) {
        resolve({ errCode: 1, errMessage: "Missing parameter" }); // Resolve with an error message if any parameter is missing
      } else {
        await emailServices.sendSimpleEmail({
          receivers: data.email,
          patientName: "NVC BookingCare",
          time: "8:00 - 9:00 Thứ tư 29/5/2024",
          doctorName: "bác sĩ Chiến",
          redirectLink: "https://www.w3schools.com/html/",
        });
        // Find or create a user based on the email provided
        let user = await db.User.findOrCreate({
          where: { email: data.email },
          defaults: {
            email: data.email,
            roleId: "R3", // Set default role to "R3"
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

module.exports = { patientBookAppointmentServices };
