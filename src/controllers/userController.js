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

module.exports = { handleLogin: handleLogin };
