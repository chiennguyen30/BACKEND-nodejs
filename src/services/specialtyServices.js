import db from "../models";
import _, { includes, reject } from "lodash"; //

let postCreateNewSpecialtyServices = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!data.name || !data.imageBase64 || !data.descriptionHTML || !data.descriptionMarkdown) {
        resolve({ errCode: 1, errMessage: "Missing parameter" });
      } else {
        await db.Specialty.create({
          name: data.name,
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

let getSpecialtyServices = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let data = await db.Specialty.findAll();
      if (data && data.length > 0) {
        data.map((item) => {
          item.image = new Buffer(item.image, "base64").toString("binary");
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

module.exports = { postCreateNewSpecialtyServices, getSpecialtyServices };
