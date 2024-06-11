import express from "express";
import homeController from "../controllers/homeController";
import userController from "../controllers/userController";
import doctorController from "../controllers/doctorController";
import patientController from "../controllers/patientController";
import specialtyController from "../controllers/specialtyController";
import clinicController from "../controllers/clinicController";
let router = express.Router();

let initWebRoutes = (app) => {
  // home controller
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
  router.get("/api/allcode", userController.GetAllCode);

  //  doctorController
  router.get("/api/top-doctor-home", doctorController.getTopDoctorHome);
  router.get("/api/get-all-doctors", doctorController.getAllDoctor);
  router.post("/api/save-infor-doctors", doctorController.postInforDoctor);
  router.get("/api/get-detail-doctor-by-id", doctorController.getDetailDoctorById);
  router.post("/api/bulk-create-schedule", doctorController.bulkCreateSchedule);
  router.get("/api/get-schedule-doctor-by-date", doctorController.getScheduleByDate);
  router.get("/api/get-extra-infor-doctor-by-id", doctorController.getExtraInforDoctorById);
  router.get("/api/get-profile-doctor-by-id", doctorController.getProfileDoctorById);
  router.get("/api/get-list-patient-for-doctor", doctorController.getListPatientForDoctor);
  router.post("/api/send-remedy", doctorController.sendRemedy);

  //  patientController
  router.post("/api/patient-book-appointment", patientController.patientBookAppointment);
  router.post("/api/verify-book-appointment", patientController.postVerifyBookAppointment);

  //  specialtyController
  router.post("/api/create-new-specialty", specialtyController.postCreateNewSpecialty);
  router.get("/api/get-specialty", specialtyController.getSpecialty);
  router.get("/api/get-detail-specialty-by-id", specialtyController.getDetailSpecialtyById);

  // clinicController
  router.post("/api/create-new-clinic", clinicController.postCreateNewClinic);
  router.get("/api/get-all-clinic", clinicController.getAllClinic);
  router.get("/api/get-detail-clinic-by-id", clinicController.getDetailclinicById);

  return app.use("/", router);
};

module.exports = initWebRoutes;
