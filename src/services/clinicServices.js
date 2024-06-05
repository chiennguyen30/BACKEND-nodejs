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

module.exports = { postCreateNewClinicServices };
