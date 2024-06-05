import clinicServices from "../services/clinicServices.js";

let postCreateNewClinic = async (req, res) => {
  try {
    let data = await clinicServices.postCreateNewClinicServices(req.body);
    return res.status(200).json(data);
  } catch (error) {
    return res.status(200).json({
      errCode: -1,
      errMessage: "Error form the server",
    });
  }
};

let getAllClinic = async (req, res) => {
  try {
    let data = await clinicServices.getAllClinicServices();
    return res.status(200).json(data);
  } catch (error) {
    return res.status(200).json({
      errCode: -1,
      errMessage: "Error form the server",
    });
  }
};
let getDetailclinicById = async (req, res) => {
  try {
    let data = await clinicServices.getDetailclinicByIdServices(req.query.id);
    return res.status(200).json(data);
  } catch (error) {
    return res.status(200).json({
      errCode: -1,
      errMessage: "Error form the server",
    });
  }
};

module.exports = { postCreateNewClinic, getAllClinic, getDetailclinicById };
