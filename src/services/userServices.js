import bcrypt, { hash } from "bcryptjs";
import db from "../models";
const salt = bcrypt.genSaltSync(10);

let hashUserPassword = (password) => {
  return new Promise(async (resolve, reject) => {
    try {
      let hashPassword = await bcrypt.hashSync(password, salt);
      resolve(hashPassword);
    } catch (e) {
      reject(e);
    }
  });
};

let handleUserLogin = (email, password) => {
  return new Promise(async (resolve, reject) => {
    try {
      let userData = {};
      let isExist = await checkUserEmail(email);
      if (isExist) {
        // user already exists
        let user = await db.User.findOne({
          attributes: ["email", "roleId", "password"],
          where: { email: email },
          raw: true,
        });
        if (user) {
          // compare passwordsss
          let check = await bcrypt.compareSync(password, user.password);
          if (check) {
            userData.errCode = 0;
            userData.errMessage = "ok";
            delete user.password;
            userData.user = user;
          } else {
            userData.errCode = 3;
            userData.errMessage = "worng password";
          }
        } else {
          userData.errCode = 2;
          userData.errMessage = "User's not found";
        }
      } else {
        userData.errCode = 1;
        userData.errMessage = "Your's Email isn't exist in your system. please try again";
      }
      resolve(userData);
    } catch (error) {
      reject(error);
    }
  });
};

let checkUserEmail = (email) => {
  return new Promise(async (resolve, reject) => {
    try {
      let user = await db.User.findOne({ where: { email: email } });
      if (user) {
        resolve(true);
      } else {
        resolve(false);
      }
    } catch (error) {
      reject(error);
    }
  });
};

let getAllUsers = (userId) => {
  return new Promise(async (resolve, reject) => {
    try {
      let users = "";
      if (userId === "ALL") {
        users = await db.User.findAll({
          attributes: {
            exclude: ["password"],
          },
        });
      }
      if (userId && userId !== "ALL") {
        users = await db.User.findOne({
          attributes: {
            exclude: ["password"],
          },
          where: { id: userId },
        });
      }
      resolve(users);
    } catch (error) {
      reject(error);
    }
  });
};

let createNewUser = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      // Kiểm tra xem email đã tồn tại chưa
      let checkEmail = await checkUserEmail(data.email);
      if (checkEmail === true) {
        resolve({
          errCode: 1,
          message: "Email already exists, please try again",
        });
        return; // Dừng thực thi của hàm nếu email đã tồn tại
      }

      // Nếu email chưa tồn tại, tiếp tục tạo mới user
      let hashPasswordFromBcrypt = await hashUserPassword(data.password);
      await db.User.create({
        email: data.email,
        password: hashPasswordFromBcrypt,
        firstName: data.firstName,
        lastName: data.lastName,
        address: data.address,
        phoneNumber: data.phoneNumber,
        gender: data.gender === "1" ? true : false,
        roleId: data.roleId,
      });
      resolve({
        errCode: 0,
        message: "ok",
      });
    } catch (error) {
      reject(error);
    }
  });
};
let deleteUser = (userId) => {
  // Trả về một promise để xử lý việc xóa người dùng
  return new Promise(async (resolve, reject) => {
    try {
      // Tìm kiếm người dùng theo userId trong cơ sở dữ liệu
      let user = await db.User.findOne({ where: { id: userId }, raw: false });

      // Kiểm tra xem người dùng có tồn tại không
      if (!user) {
        // Nếu không tìm thấy người dùng, trả về một đối tượng với mã lỗi 2 và thông báo tương ứng
        resolve({
          errCode: 2,
          errMessage: "The user doesn't exist",
        });
        return; // Kết thúc thực thi của hàm nếu không tìm thấy người dùng
      }

      // Nếu người dùng tồn tại, tiến hành xóa người dùng
      await user.destroy();

      // Trả về một đối tượng với mã lỗi 0 và thông báo xóa thành công
      resolve({
        errCode: 0,
        message: "The user is successfully deleted",
      });
    } catch (error) {
      // Nếu có lỗi xảy ra trong quá trình xóa người dùng, reject promise và trả về lỗi
      reject(error);
    }
  });
};

let updateUserData = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!data.id) {
        resolve({
          errCode: 2,
          errMessage: "Missing required parameters",
        });
      }
      let user = await db.User.findOne({
        where: { id: data.id },
        raw: false,
      });
      if (user) {
        user.firstName = data.firstName;
        user.lastName = data.lastName;
        user.address = data.address;
        user.phoneNumber = data.phoneNumber;
        await user.save();
        resolve({
          errCode: 0,
          message: "update user data success!!",
        });
      } else {
        resolve({
          errCode: 1,
          errMessage: "update user data failure!",
        });
      }
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = {
  handleUserLogin: handleUserLogin,
  getAllUsers: getAllUsers,
  createNewUser: createNewUser,
  deleteUser: deleteUser,
  updateUserData: updateUserData,
};
