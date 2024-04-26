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
  router.post("/api/create-new-user", userController.handleCreateNewUser);
  router.put("/api/edit-user", userController.handleEditUser);
  router.delete("/api/delete-user", userController.handleDeleteUser);

  //database table allcodes
  router.get("/api/allcode", userController.GetAllCode);

  return app.use("/", router);
};

module.exports = initWebRoutes;
