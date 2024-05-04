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

module.exports = { getTopDoctorHome: getTopDoctorHome };
