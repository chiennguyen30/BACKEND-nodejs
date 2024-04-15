import express from "express";
import homeController from "../controllers/homeController";
import userController from "../controllers/userController";
let router = express.Router();

let initWebRoutes = (app) => {
  router.get("/", homeController.getHomePage);
  router.get("/about", homeController.getAboutPage);
  router.get("/add-user", homeController.getCRUD);
  router.post("/post", homeController.postCRUD);
  router.get("/get-crud", homeController.displayGetCRUD);
  router.get("/edit", homeController.editCRUD);
  router.post("/edit-user", homeController.editUserCRUD);
  router.get("/delete", homeController.deleteUserCRUD);

  // user controller
  router.post("/api/login", userController.handleLogin);
  router.get("/api/get-all-users", userController.handleGetAllUsers);

  return app.use("/", router);
};

module.exports = initWebRoutes;
