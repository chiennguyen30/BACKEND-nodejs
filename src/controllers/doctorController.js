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
module.exports = {
  getTopDoctorHome: getTopDoctorHome,
  getAllDoctor: getAllDoctor,
  postInforDoctor: postInforDoctor,
  getDetailDoctorById,
  bulkCreateSchedule,
};
