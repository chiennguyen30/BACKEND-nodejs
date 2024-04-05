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
  console.log(data);
  return res.render("displayCRUD.ejs", {
    dataTable: data,
  });
};
let postCRUD = async (req, res) => {
  let message = await CRUDservices.createNewUser(req.body);
  console.log(message);
  return res.send("post crud form server");
};

module.exports = {
  getHomePage: getHomePage,
  getAboutPage: getAboutPage,
  getCRUD: getCRUD,
  postCRUD: postCRUD,
  displayGetCRUD: displayGetCRUD,
};
