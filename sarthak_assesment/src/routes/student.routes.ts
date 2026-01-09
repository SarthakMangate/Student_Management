import { Router } from "express";
import {
  getStudents,
  addStudent,
  deleteStudent,
  editStudent   // include editStudent here
} from "../controllers/student.controller";

const router = Router();

router.get("/", getStudents);
router.post("/", addStudent);
router.delete("/:id", deleteStudent);
router.put("/:id", editStudent); // update student

export default router;
