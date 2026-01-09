import { Request, Response } from "express";
import * as studentService from "../services/student.service";

export const getStudents = async (_: Request, res: Response) => {
  const students = await studentService.getAllStudents();
  res.json(students);
};

export const addStudent = async (req: Request, res: Response) => {
  try {
    const student = await studentService.createStudent(req.body);
    res.status(201).json(student);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

export const deleteStudent = async (req: Request, res: Response) => {
  try {
    await studentService.deleteStudent(Number(req.params.id));
    res.json({ message: "Student deleted" });
  } catch (err: any) {
    res.status(404).json({ error: err.message });
  }
};

export const editStudent = async (req: Request, res: Response) => {
  try {
    const updatedStudent = await studentService.updateStudent(
      Number(req.params.id),
      req.body
    );
    res.json(updatedStudent);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

