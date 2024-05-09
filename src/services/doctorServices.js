// Import thư viện db từ thư mục models
import db from "../models";

// Khai báo hàm getTopDoctorHome nhận tham số limitInput
let getTopDoctorHome = (limitInput) => {
  // Trả về một Promise với logic async
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

let getAllDoctorsServices = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let doctors = await db.User.findAll({
        where: { roleId: "R2" },
        attributes: {
          exclude: ["password", "image", "phoneNumber"],
        },
      });
      resolve({
        errCode: 0,
        data: doctors,
      });
    } catch (error) {
      reject(error);
    }
  });
};
let saveDetailInforDoctor = (inputData) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!inputData.doctorId || !inputData.contentHTML || !inputData.contentMarkdown) {
        resolve({ errCode: 1, errMessage: "Missing parameter" });
      } else {
        await db.Markdown.create({
          contentHTML: inputData.contentHTML,
          contentMarkdown: inputData.contentMarkdown,
          description: inputData.description,
          doctorId: inputData.doctorId,
        });
        resolve({
          errCode: 0,
          errMessage: "Save infro doctor succeed!!",
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
          ],
          raw: false,
          nest: true,
        });
        if (data && data.image) {
          data.image = new Buffer(data.image, "base64").toString("binary");
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
// Xuất hàm getTopDoctorHome để có thể sử dụng ở nơi khác
module.exports = {
  getTopDoctorHome,
  getAllDoctorsServices,
  saveDetailInforDoctor,
  getDetailDoctorByIdServices,
};
