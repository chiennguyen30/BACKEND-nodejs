import userService from "../services/userServices";

let handleLogin = async (req, res) => {
  let email = req.body.email;
  let password = req.body.password;
  // neu sai thi` return cai nay
  if (!email || !password) {
    return res.status(500).json({
      errCode: 1,
      message: "Missing inputs parameter!",
    });
  }
  let userData = await userService.handleUserLogin(email, password);
  //check email cua nguoi co ton tai trong he thong khong
  //kiem tra password co hop le hay khong
  //return userInfor
  //return access_token: JSON Web Token

  // dung thi` return 200
  return res.status(200).json({
    errCode: userData.errCode,
    message: userData.errMessage,
    user: userData.user ? userData.user : {},
  });
};

let handleGetAllUsers = async (req, res) => {
  let id = req.query.id; //all , single
  if (!id) {
    return res.status(200).json({
      errCode: 1,
      errMessage: "Missing required parameter",
      users: [],
    });
  }
  let users = await userService.getAllUsers(id);

  return res.status(200).json({
    errCode: 0,
    errMessage: "ok",
    users,
  });
};

let handleCreateNewUser = async (req, res) => {
  let message = await userService.createNewUser(req.body);
  return res.status(200).json(message);
};

let handleDeleteUser = async (req, res) => {
  if (!req.body.id) {
    return res.status(200).json({
      errCode: 1,
      errMessage: " Missing required parameters!",
    });
  }
  let message = await userService.deleteUser(req.body.id);
  return res.status(200).json(message);
};

let handleEditUser = async (req, res) => {
  let data = req.body;
  let message = await userService.updateUserData(data);
  return res.status(200).json(message);
};

// table all codes
let GetAllCode = async (req, res) => {
  try {
    let data = await userService.getAllCodeService(req.query.type);
    return res.status(200).json(data);
  } catch (e) {
    console.log("getAllCode error", e);
    return res.status(200).json({
      errCode: -1,
      errMessage: "Error from server",
    });
  }
};

module.exports = {
  handleLogin: handleLogin,
  handleGetAllUsers: handleGetAllUsers,
  handleCreateNewUser: handleCreateNewUser,
  handleEditUser: handleEditUser,
  handleDeleteUser: handleDeleteUser,
  GetAllCode: GetAllCode,
};
