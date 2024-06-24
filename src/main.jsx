import ReactDOM from 'react-dom/client'
import React from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Login from './Login'
import Users from './Users.jsx'
import Subjects from './Subjects.jsx'
import Subject from './Subject.jsx'
import Activities from './Activities.jsx'
import Activity from './Activity.jsx'
import Home from './Home.jsx'
import Navbar from './components/navbar.jsx'
import Grades from './Grades.jsx'
import Logout from './Logout.jsx'
import User from './User.jsx'
import Enrollments from './Enrollments.jsx'
import Requests from './Requests.jsx'
import Request from './Request.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
      <main>
        <Navbar />
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/users" element={<Users />} />
            <Route path="/users/:id" element={<User />} />
            <Route path="/subjects" element={<Subjects />} />
            <Route path="/subjects/:id" element={<Subject />} />
            <Route path="/activities" element={<Activities />} />
            <Route path="/activities/:id" element={<Activity />} />
            <Route path="/grades" element={<Grades />} />
            <Route path="/enrollments" element={<Enrollments />} />
            <Route path="/requests" element={<Requests />} />
            <Route path="/requests/:id" element={<Request />} />
            <Route path="/logout" element={<Logout />} />
            <Route path="*" element={<h1>404 - Not Found</h1>} />
          </Routes>
        </Router>
      </main>
    </React.StrictMode>,
  );
