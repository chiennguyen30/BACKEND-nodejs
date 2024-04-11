import userService from "../services/userServices";
let handleLogin = async (req, res) => {
  let email = req.body.email;
  let password = req.body.password;

  if (!email || !password) {
    return res.status(500).json({
      errCode: 1,
      message: "Invalid email or password",
    });
  }
  let userData = await userService.handleUserLogin(email, password);
  //check email cua nguoi co ton tai trong he thong khong
  //kiem tra password co hop le hay khong
  //return userInfor
  //return access_token: JSON Web Token

  return res.status(200).json({
    errCode: userData.errCode,
    message: userData.errMessage,
    user: userData.user ? userData.user : {},
  });
};

module.exports = { handleLogin: handleLogin };
