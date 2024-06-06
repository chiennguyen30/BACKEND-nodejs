import db from "../models";
import _ from "lodash"; //

let postCreateNewClinicServices = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (
        !data.name ||
        !data.imageBase64 ||
        !data.descriptionHTML ||
        !data.descriptionMarkdown ||
        !data.address
      ) {
        resolve({ errCode: 1, errMessage: "Missing parameter" });
      } else {
        await db.Clinic.create({
          name: data.name,
          address: data.address,
          image: data.imageBase64,
          descriptionHTML: data.descriptionHTML,
          descriptionMarkdown: data.descriptionMarkdown,
        });
        resolve({
          errCode: 0,
          errMessage: "ok",
        });
      }
    } catch (error) {
      reject(error); // Reject the promise if an error occurs
    }
  });
};

let getAllClinicServices = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let data = await db.Clinic.findAll();
      if (data && data.length > 0) {
        data.map((item) => {
          item.image = new Buffer.from(item.image, "base64").toString("binary");
          return item;
        });
      }
      resolve({
        errMessage: "ok",
        errCode: 0,
        data: data,
      });
    } catch (error) {
      reject(error);
    }
  });
};

let getDetailclinicByIdServices = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!id) {
        resolve({ errCode: 1, errMessage: "Missing parameter" });
      } else {
        let data = await db.Clinic.findOne({
          where: { id },
          attributes: ["name", "address", "descriptionHTML", "descriptionMarkdown", "image"],
        });
        if (data && data.length > 0) {
          data.map((item) => {
            item.image = new Buffer.from(item.image, "base64").toString("binary");
            return item;
          });
        }

        if (data) {
          let doctorClinic = [];

          doctorClinic = await db.Doctor_Infor.findAll({
            where: { clinicId: id },
            attributes: ["doctorId", "provinceId"],
          });
          data.doctorClinic = doctorClinic;
        } else data = {};
        resolve({
          errCode: 0,
          errMessage: "ok",
          data,
        });
      }
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = { postCreateNewClinicServices, getAllClinicServices, getDetailclinicByIdServices };
