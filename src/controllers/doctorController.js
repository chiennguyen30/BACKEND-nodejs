import doctorServices from "../services/doctorServices";

let getTopDoctorHome = async (req, res) => {
  let limit = req.query.limit;
  if (!limit) limit = 10; //default value is 10
  try {
    let response = await doctorServices.getTopDoctorHome(+limit);
    return res.status(200).json(response);
  } catch (error) {
    console.log(error);
    return res.status(200).json({
      errCode: -1,
      errMessage: "Error from server!!!",
    });
  }
};
let getAllDoctor = async (req, res) => {
  try {
    let doctors = await doctorServices.getAllDoctorsServices();
    return res.status(200).json(doctors);
  } catch (error) {
    console.log(error);
    return res.status(200).json({
      errCode: -1,
      errMessage: "Error form the server",
    });
  }
};
let postInforDoctor = async (req, res) => {
  try {
    let response = await doctorServices.saveDetailInforDoctor(req.body);
    return res.status(200).json(response);
  } catch (error) {
    console.log(error);
    return res.status(200).json({
      errCode: -1,
      errMessage: "Error form the server",
    });
  }
};
let getDetailDoctorById = async (req, res) => {
  try {
    let infor = await doctorServices.getDetailDoctorByIdServices(req.query.id);
    return res.status(200).json(infor);
  } catch (error) {
    return res.status(200).json({
      errCode: -1,
      errMessage: "Error form the server",
    });
  }
};
let bulkCreateSchedule = async (req, res) => {
  try {
    let infor = await doctorServices.bulkCreateScheduleServices(req.body);
    return res.status(200).json(infor);
  } catch (error) {
    return res.status(200).json({
      errCode: -1,
      errMessage: "Error form the server",
    });
  }
};
let getScheduleByDate = async (req, res) => {
  try {
    let infor = await doctorServices.getScheduleByDateServices(req.query.doctorId, req.query.date);
    return res.status(200).json(infor);
  } catch (error) {
    return res.status(200).json({
      errCode: -1,
      errMessage: "Error form the server",
    });
  }
};

let getExtraInforDoctorById = async (req, res) => {
  try {
    let infor = await doctorServices.getExtraInforDoctorByIdServices(req.query.doctorId);
    return res.status(200).json(infor);
  } catch (error) {
    return res.status(200).json({
      errCode: -1,
      errMessage: "Error form the server",
    });
  }
};
let getProfileDoctorById = async (req, res) => {
  try {
    let infor = await doctorServices.getProfileDoctorByIdServices(req.query.doctorId);
    return res.status(200).json(infor);
  } catch (error) {
    return res.status(200).json({
      errCode: -1,
      errMessage: "Error form the server",
    });
  }
};

let getListPatientForDoctor = async (req, res) => {
  try {
    let infor = await doctorServices.getListPatientForDoctorServices(
      req.query.doctorId,
      req.query.date
    );
    return res.status(200).json(infor);
  } catch (error) {
    return res.status(200).json({
      errCode: -1,
      errMessage: "Error form the server",
    });
  }
};

let sendRemedy = async (req, res) => {
  try {
    let infor = await doctorServices.sendRemedyServices(req.body);
    return res.status(200).json(infor);
  } catch (error) {
    return res.status(200).json({
      errCode: -1,
      errMessage: "Error form the server",
    });
  }
};

module.exports = {
  getTopDoctorHome,
  getAllDoctor,
  postInforDoctor,
  getDetailDoctorById,
  bulkCreateSchedule,
  getScheduleByDate,
  getExtraInforDoctorById,
  getProfileDoctorById,
  getListPatientForDoctor,
  sendRemedy,
};
