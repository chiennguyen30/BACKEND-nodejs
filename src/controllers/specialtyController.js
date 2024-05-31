import specialtyServices from "../services/specialtyServices";

let postCreateNewSpecialty = async (req, res) => {
  try {
    let data = await specialtyServices.postCreateNewSpecialtyServices(req.body);
    return res.status(200).json(data);
  } catch (error) {
    return res.status(200).json({
      errCode: -1,
      errMessage: "Error form the server",
    });
  }
};

module.exports = { postCreateNewSpecialty };
