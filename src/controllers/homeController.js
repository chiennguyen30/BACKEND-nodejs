import db from "../models/index";
import CRUDservices from "../services/CRUDservices";

let getHomePage = async (req, res) => {
  try {
    let data = await db.User.findAll();
    return res.render("homePage.ejs", { data: JSON.stringify(data) });
  } catch (error) {
    console.log(error);
  }
};
let getAboutPage = (req, res) => {
  return res.render("test/aboutPage.ejs");
};
let getCRUD = (req, res) => {
  return res.render("crud.ejs");
};

let displayGetCRUD = async (req, res) => {
  let data = await CRUDservices.getAllUser();
  return res.render("displayCRUD.ejs", {
    dataTable: data,
  });
};

let postCRUD = async (req, res) => {
  let message = await CRUDservices.createNewUser(req.body);
  console.log(message);
  return res.redirect("/get-crud");
};

let editCRUD = async (req, res) => {
  console.log(req.params.id);
  let id = req.query.id;
  if (id) {
    let data = await CRUDservices.getUserInfoById(id);
    //check user data not found
    return res.render("editView.ejs", { data: data });
  } else {
    return res.send("not found");
  }
};
let editUserCRUD = async (req, res) => {
  let data = req.body;
  await CRUDservices.updateUserData(data);
  return res.redirect("/get-crud");
};

let deleteUserCRUD = async (req, res) => {
  let id = req.query.id;
  if (id) {
    await CRUDservices.deleteUser(id);
    return res.redirect("/get-crud");
  } else {
    return res.send("not found");
  }
};
module.exports = {
  getHomePage: getHomePage,
  getAboutPage: getAboutPage,
  getCRUD: getCRUD,
  postCRUD: postCRUD,
  displayGetCRUD: displayGetCRUD,
  editCRUD: editCRUD,
  editUserCRUD: editUserCRUD,
  deleteUserCRUD: deleteUserCRUD,
};
