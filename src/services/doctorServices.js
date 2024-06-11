// Import thư viện db từ thư mục models
import db from "../models";
import _, { includes, reject } from "lodash";
import emailServices from "./emailServices";
require("dotenv").config();

const MAX_NUMBER_SCHEDULE = process.env.MAX_NUMBER_SCHEDULE;

// Khai báo hàm getTopDoctorHome nhận tham số limitInput
let getTopDoctorHome = (limitInput) => {
  return new Promise(async (resolve, reject) => {
    try {
      // Lấy tất cả người dùng có roleId là "R2" từ bảng User
      let users = await db.User.findAll({
        // Giới hạn số lượng kết quả trả về
        limit: limitInput,
        // Điều kiện lọc: roleId phải là "R2"
        where: { roleId: "R2" },
        // Sắp xếp kết quả theo createdAt (ngày tạo) theo thứ tự giảm dần
        order: [["createdAt", "DESC"]],
        // Lựa chọn các thuộc tính để trả về, loại bỏ mật khẩu và hình ảnh
        attributes: {
          exclude: ["password"],
        },
        // Bao gồm các bảng liên quan và chỉ lựa chọn một số thuộc tính cụ thể
        include: [
          { model: db.Allcode, as: "positionData", attributes: ["valueEn", "valueVi"] },
          { model: db.Allcode, as: "genderData", attributes: ["valueEn", "valueVi"] },
        ],
        // Trả về kết quả dưới dạng mảng các đối tượng JSON
        raw: true,
        // Đặt nest: true để phân cấp dữ liệu theo quan hệ giữa các bảng
        nest: true,
      });
      // Giải quyết Promise với dữ liệu trả về và mã lỗi 0
      resolve({
        errCode: 0,
        data: users,
      });
    } catch (error) {
      // Bắt lỗi và reject Promise nếu có lỗi xảy ra
      reject(error);
    }
  });
};
// Hàm lấy tất cả dịch vụ của bác sĩ
let getAllDoctorsServices = () => {
  return new Promise(async (resolve, reject) => {
    try {
      // Tìm tất cả người dùng có vai trò là bác sĩ (roleId: "R2") và loại bỏ các trường "password", "image", "phoneNumber"
      let doctors = await db.User.findAll({
        where: { roleId: "R2" },
        attributes: {
          exclude: ["password", "image", "phoneNumber"],
        },
      });
      // Trả về danh sách bác sĩ với mã lỗi 0 (thành công)
      resolve({
        errCode: 0,
        data: doctors,
      });
    } catch (error) {
      // Bắt lỗi và từ chối Promise nếu có lỗi xảy ra
      reject(error);
    }
  });
};

// Hàm kiểm tra các trường bắt buộc
let checkRequiredFields = (inputData) => {
  // Danh sách các trường bắt buộc
  let arrFields = [
    "doctorId",
    "contentHTML",
    "contentMarkdown",
    "action",
    "selectPrice",
    "selectPayment",
    "selectProvince",
    "nameClinic",
    "addressClinic",
    "note",
    "specialtyId",
  ];
  let isValid = true; // Biến xác định dữ liệu hợp lệ
  let element = ""; // Biến lưu trữ tên trường thiếu
  // Duyệt qua danh sách các trường bắt buộc
  for (let i = 0; i < arrFields.length; i++) {
    // Kiểm tra nếu trường bắt buộc không có trong dữ liệu đầu vào
    if (!inputData[arrFields[i]]) {
      // Gán isValid là false và gán tên trường thiếu cho biến element
      isValid = false;
      element = arrFields[i];
      break;
    }
  }
  // Trả về kết quả kiểm tra
  return {
    isValid,
    element,
  };
};

// Hàm lưu thông tin chi tiết của bác sĩ
let saveDetailInforDoctor = (inputData) => {
  return new Promise(async (resolve, reject) => {
    try {
      // Kiểm tra các trường bắt buộc
      let checkObj = checkRequiredFields(inputData);
      if (checkObj.isValid === false) {
        resolve({ errCode: 1, errMessage: `Missing parameter : ${checkObj.element}` });
      } else {
        // Thêm hoặc cập nhật vào bảng Markdown
        if (inputData.action === "CREATE") {
          await db.Markdown.create({
            contentHTML: inputData.contentHTML,
            contentMarkdown: inputData.contentMarkdown,
            description: inputData.description,
            doctorId: inputData.doctorId,
          });
        } else if (inputData.action === "EDIT") {
          let doctorMarkdown = await db.Markdown.findOne({
            where: { doctorId: inputData.doctorId },
            raw: false,
          });
          if (doctorMarkdown) {
            doctorMarkdown.contentHTML = inputData.contentHTML;
            doctorMarkdown.contentMarkdown = inputData.contentMarkdown;
            doctorMarkdown.description = inputData.description;
            doctorMarkdown.updateAt = new Date();
            await doctorMarkdown.save();
          }
        }

        // Thêm hoặc cập nhật vào bảng Doctor_Infor
        let doctorInfor = await db.Doctor_Infor.findOne({
          where: { doctorId: inputData.doctorId },
          raw: false,
        });

        if (doctorInfor) {
          // Cập nhật thông tin bác sĩ
          doctorInfor.doctorId = inputData.doctorId;
          doctorInfor.priceId = inputData.selectPrice;
          doctorInfor.paymentId = inputData.selectPayment;
          doctorInfor.provinceId = inputData.selectProvince;
          doctorInfor.nameClinic = inputData.nameClinic;
          doctorInfor.addressClinic = inputData.addressClinic;
          doctorInfor.note = inputData.note;
          doctorInfor.specialtyId = inputData.specialtyId;
          doctorInfor.clinicId = inputData.clinicId;
          await doctorInfor.save();
        } else {
          // Tạo mới thông tin bác sĩ
          await db.Doctor_Infor.create({
            doctorId: inputData.doctorId,
            priceId: inputData.selectPrice,
            paymentId: inputData.selectPayment,
            provinceId: inputData.selectProvince,
            nameClinic: inputData.nameClinic,
            addressClinic: inputData.addressClinic,
            note: inputData.note,
            specialtyId: inputData.specialtyId,
            clinicId: inputData.clinicId,
          });
        }

        resolve({
          errCode: 0,
          errMessage: "Save info doctor succeed!!",
        });
      }
    } catch (error) {
      reject(error);
    }
  });
};

let getDetailDoctorByIdServices = (inputId) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!inputId) {
        resolve({ errCode: 1, errMessage: "Missing required parameter!!" });
      } else {
        let data = await db.User.findOne({
          where: { id: inputId },
          attributes: { exclude: ["password"] },
          include: [
            { model: db.Markdown, attributes: ["description", "contentHTML", "contentMarkdown"] },
            { model: db.Allcode, as: "positionData", attributes: ["valueEn", "valueVi"] },
            {
              model: db.Doctor_Infor,
              attributes: { exclude: ["id", "doctorId"] },
              include: [
                { model: db.Allcode, as: "priceTypeData", attributes: ["valueEn", "valueVi"] },
                { model: db.Allcode, as: "provinceTypeData", attributes: ["valueEn", "valueVi"] },
                { model: db.Allcode, as: "paymentTypeData", attributes: ["valueEn", "valueVi"] },
              ],
            },
          ],
          raw: false,
          nest: true,
        });
        if (data && data.image) {
          data.image = new Buffer.from(data.image, "base64").toString("binary");
        }
        if (!data) data = {};
        resolve({
          errCode: 0,
          data: data,
        });
      }
    } catch (error) {
      reject(error);
    }
  });
};
let bulkCreateScheduleServices = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!data.arrSchedule || !data.doctorId || !data.formateDate) {
        resolve({
          errCode: -1,
          errMessage: "Missing required parameter!!!",
        });
      } else {
        let schedule = data.arrSchedule;
        if (schedule && schedule.length > 0) {
          schedule = schedule.map((item) => {
            item.maxNumber = MAX_NUMBER_SCHEDULE;
            return item;
          });
        }
        // get all existing data
        let existing = await db.Schedule.findAll({
          where: { doctorId: data.doctorId, date: data.formateDate },
          attributes: ["timeType", "date", "doctorId", "maxNumber"],
          raw: true,
        });
        // compare different
        let toCreate = _.differenceWith(schedule, existing, (a, b) => {
          return a.timeType === b.timeType && +a.date === +b.date;
        });
        //create data
        if (toCreate && toCreate.length > 0) {
          await db.Schedule.bulkCreate(toCreate);
        }
        resolve({
          errCode: 0,
          errMessage: "Success",
        });
      }
    } catch (error) {
      reject(error);
    }
  });
};
let getScheduleByDateServices = (doctorId, date) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!doctorId || !date) {
        resolve({
          errCode: 1,
          errMessage: "Missing requied parameter!!!",
        });
      } else {
        let data = await db.Schedule.findAll({
          where: { doctorId, date },
          include: [
            { model: db.Allcode, as: "timeTypeData", attributes: ["valueEn", "valueVi"] },
            { model: db.User, as: "doctorData", attributes: ["firstName", "LastName"] },
          ],
          raw: false,
          nest: true,
        });
        if (!data) data = [];
        resolve({
          errCode: 0,
          data,
        });
      }
    } catch (error) {
      reject(error);
    }
  });
};
let getExtraInforDoctorByIdServices = (doctorId) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!doctorId) {
        resolve({
          errCode: 1,
          errMessage: "Missing requied parameter!!!",
        });
      } else {
        let data = await db.Doctor_Infor.findOne({
          where: { doctorId },
          attributes: { exclude: ["id", "doctorId"] },
          include: [
            { model: db.Allcode, as: "priceTypeData", attributes: ["valueEn", "valueVi"] },
            { model: db.Allcode, as: "provinceTypeData", attributes: ["valueEn", "valueVi"] },
            { model: db.Allcode, as: "paymentTypeData", attributes: ["valueEn", "valueVi"] },
          ],
          raw: false,
          nest: true,
        });
        if (!data) data = {};
        resolve({
          errCode: 0,
          data: data,
        });
      }
    } catch (error) {
      reject(error);
    }
  });
};
let getProfileDoctorByIdServices = (inputId) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!inputId) {
        resolve({
          errCode: 1,
          errMessage: "Missing requied parameter!!!",
        });
      } else {
        let data = await db.User.findOne({
          where: { id: inputId },
          attributes: { exclude: ["password"] },
          include: [
            { model: db.Markdown, attributes: ["description", "contentHTML", "contentMarkdown"] },
            { model: db.Allcode, as: "positionData", attributes: ["valueEn", "valueVi"] },
            {
              model: db.Doctor_Infor,
              attributes: { exclude: ["id", "doctorId"] },
              include: [
                { model: db.Allcode, as: "priceTypeData", attributes: ["valueEn", "valueVi"] },
                { model: db.Allcode, as: "provinceTypeData", attributes: ["valueEn", "valueVi"] },
                { model: db.Allcode, as: "paymentTypeData", attributes: ["valueEn", "valueVi"] },
              ],
            },
          ],
          raw: false,
          nest: true,
        });
        if (data && data.image) {
          data.image = new Buffer.from(data.image, "base64").toString("binary");
        }
        if (!data) data = {};
        resolve({
          errCode: 0,
          data: data,
        });
      }
    } catch (error) {
      reject(error);
    }
  });
};

let getListPatientForDoctorServices = (doctorId, date) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!doctorId || !date) {
        resolve({
          errCode: 1,
          errMessage: "Missing requied parameter!!!",
        });
      } else {
        let data = await db.Booking.findAll({
          where: { statusId: "S2", doctorId, date },
          include: [
            {
              model: db.User,
              as: "patientData",
              attributes: ["email", "address", "firstName", "gender"],
              include: [
                {
                  model: db.Allcode,
                  as: "genderData",
                  attributes: ["valueEn", "valueVi"],
                },
              ],
            },
            {
              model: db.Allcode,
              as: "timeTypeDataPatient",
              attributes: ["valueEn", "valueVi"],
            },
          ],
          raw: false,
          nest: true,
        });
        resolve({
          errCode: 0,
          errMessage: "ok",
          data: data,
        });
      }
    } catch (error) {
      reject(error);
    }
  });
};

let sendRemedyServices = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!data.email || !data.doctorId || !data.patientId || !data.timeType) {
        resolve({
          errCode: 1,
          errMessage: "Missing required parameter!!!",
        });
      } else {
        // update patient status
        let appointment = await db.Booking.findOne({
          where: {
            doctorId: data.doctorId,
            patientId: data.patientId,
            timeType: data.timeType,
            statusId: "S2",
          },
          raw: false,
        });

        if (appointment) {
          appointment.statusId = "S3";
          await appointment.save();
        }

        // send email remedy
        await emailServices.sendAttachment(data);

        resolve({
          errCode: 0,
          errMessage: "Success",
        });
      }
    } catch (error) {
      reject(error);
    }
  });
};
module.exports = {
  getTopDoctorHome,
  getAllDoctorsServices,
  saveDetailInforDoctor,
  getDetailDoctorByIdServices,
  bulkCreateScheduleServices,
  getScheduleByDateServices,
  getExtraInforDoctorByIdServices,
  getProfileDoctorByIdServices,
  getListPatientForDoctorServices,
  sendRemedyServices,
};
