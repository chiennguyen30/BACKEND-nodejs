import patientServices from "../services/patientServices";

let patientBookAppointment = async (req, res) => {
  try {
    let data = await patientServices.patientBookAppointmentServices(req.body);
    return res.status(200).json(data);
  } catch (error) {
    return res.status(200).json({
      errCode: -1,
      errMessage: "Error form the server",
    });
  }
};

let postVerifyBookAppointment = async (req, res) => {
  try {
    let data = await patientServices.postVerifyBookAppointmentServices(req.body);
    return res.status(200).json(data);
  } catch (error) {
    return res.status(200).json({
      errCode: -1,
      errMessage: "Error form the server",
    });
  }
};

module.exports = { patientBookAppointment, postVerifyBookAppointment };
