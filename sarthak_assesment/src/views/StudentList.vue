<template>
  <div class="app-shell">
    <div class="bg-blob blob-1"></div>
    <div class="bg-blob blob-2"></div>

    <div class="page-container">
      <nav class="navbar">
        <div class="brand" @click="viewMode = 'home'">
          <div class="logo-icon">S</div>
          <span class="brand-text">Student<span class="accent">Sys</span></span>
        </div>
        <div class="navbar-buttons">
          <button class="nav-btn btn-add" :class="{ active: viewMode === 'form' }"
            @click="viewMode = 'form'; editingStudent = null">
            Add Student
          </button>
          <button class="nav-btn btn-view" :class="{ active: viewMode === 'list' }" @click="viewMode = 'list'">
            View Students
          </button>
        </div>
      </nav>

      <transition name="fade-slide">
        <div class="hero-section" v-if="viewMode === 'home'">
          <div class="hero-text">
            <h1 class="title">Manage Academic Records <br><span class="gradient-text">With Precision.</span></h1>
            <p class="subtitle">A premium, glass-inspired interface for modern student administration.</p>
            <button class="hero-cta" @click="viewMode = 'list'">Get Started</button>
          </div>
        </div>
      </transition>

      <transition name="fade-slide">
        <div v-if="viewMode === 'form'" class="modal-backdrop" @click.self="viewMode = 'home'">
          <div class="glass-modal-wide">
            <div class="modal-header-inline">
              <h2>{{ editingStudent ? 'Update Profile' : 'New Enrollment' }}</h2>
              <button class="close-x" @click="viewMode = 'home'">&times;</button>
            </div>
            <StudentForm :student="editingStudent" @add-student="addStudent" @edit-student="editStudent"
              @cancel-edit="viewMode = 'home'" />
          </div>
        </div>
      </transition>

      <div v-if="viewMode === 'list'">
        <div class="list-controls">
          <h2 class="section-title">Directory</h2>
          <div class="filters">

            <select v-model="filterCourse" class="premium-select">
              <option value="">All Courses</option>
              <option>BCA</option>
              <option>BSc</option>
              <option>BCom</option>
            </select>
          </div>
        </div>

        <p v-if="filteredStudents.length === 0" class="empty">
          No records found in the directory.
        </p>

        <div class="card-grid" v-else>
          <StudentCard v-for="student in filteredStudents" :key="student.id" :student="student"
            @delete-student="deleteStudent" @edit-student="openEditForm" />
        </div>
      </div>

      <footer class="footer">
        <div class="footer-top">
          <div class="footer-brand">
            <div class="logo-icon">S</div>
            <span class="brand-text">Student<span class="accent">Sys</span></span>
            <p class="brand-tagline">Advanced academic management for the modern era.</p>
          </div>

          <div class="footer-nav">
            <div class="footer-col">
              <h4>Platform</h4>
              <nav class="link-group">
                <a href="#">Dashboard</a>
                <a href="#">Directory</a>
                <a href="#">Enrollment</a>
              </nav>
            </div>
            <div class="footer-col">
              <h4>Support</h4>
              <nav class="link-group">
                <a href="#">Help Center</a>
                <a href="#">Documentation</a>
                <a href="#">API Status</a>
              </nav>
            </div>
            <div class="footer-col">
              <h4>Company</h4>
              <nav class="link-group">
                <a href="#">About Us</a>
                <a href="#">Privacy Policy</a>
                <a href="#">Terms of Use</a>
              </nav>
            </div>
          </div>
        </div>

        <div class="footer-bottom">
          <p>© 2026 StudentSys Premium. Designed for Excellence.</p>
          <div class="social-links">
            <span>Linked In</span>
            <span>Twitter</span>
            <span>GitHub</span>
          </div>
        </div>
      </footer>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import StudentForm from '../components/StudentForm.vue'
import StudentCard from '../components/StudentCard.vue'
import api from "../utils/api"

const students = ref([])
const filterCourse = ref('')
const editingStudent = ref(null)
const viewMode = ref('home')

onMounted(async () => {
  const res = await api.get("/students")
  students.value = res.data
})

const addStudent = async (student) => {
  const res = await api.post("/students", student)
  students.value.unshift(res.data)
  viewMode.value = 'list'
}

const editStudent = async (student) => {
  if (!student.id) return
  const res = await api.put(`/students/${student.id}`, student)
  const index = students.value.findIndex(s => s.id === student.id)
  if (index !== -1) students.value[index] = res.data
  viewMode.value = 'list'
  editingStudent.value = null
}

const deleteStudent = async (id) => {
  await api.delete(`/students/${id}`)
  students.value = students.value.filter(s => s.id !== id)
}

const openEditForm = (student) => {
  editingStudent.value = student
  viewMode.value = 'form'
}

const filteredStudents = computed(() => {
  if (!filterCourse.value) return students.value
  return students.value.filter(s => s.course === filterCourse.value)
})
</script>

<style scoped>
@import './StudentList.css';
</style>