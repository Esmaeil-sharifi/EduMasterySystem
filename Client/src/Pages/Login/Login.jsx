import React, { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { adminLogin, studentLogin, tutorLogin } from "../../Redux/auth/action";

//css imports
import { message, Space, Spin } from "antd";
import "./Login.css";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const auth = useSelector((store) => store.auth);
  const emailError = document.getElementById('emailError');

  //alert api
  const [messageApi, contextHolder] = message.useMessage();

  //loading state
  const [loading, setLoading] = useState(false);

  //form state
  const [formData, setFormData] = useState({
    type: "",
    email: "",
    password: "",
  });
   // اطلاعات ورود کاربران
   const userLoginInfo = {
    admin: { email: "admin@gmail.com", password: "123456" },
    tutor: { email: "tutor@gmail.com", password: "123456" },
    student: { email: "student@gmail.com", password: "123456" },
  };

  const handleFormChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  function isValidEmail(email) {
    // Regular expression for validating email addresses
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // login function
  const handleFormSubmit = (e) => {
    e.preventDefault();
    let isValid = true;
    emailError.textContent = '';
    if (formData.type === "") {
      return messageApi.open({
        type: "error",
        content: "Please select user type.",
        duration: 3,
      });
    }
    // Email validation
    if (!isValidEmail(formData.email)) {
      isValid = false;
      emailError.textContent = 'Invalid email format.';
    }
    if (!isValid) {
      return;
    }
    setLoading(true);
    if (formData.type === "admin") {
      dispatch(adminLogin(formData)).then((res) => {
        if (res.message === "Wrong credentials") {
          setLoading(false);
          messageApi.open({
            type: "info",
            content: "Wrong credentials !",
            duration: 3,
          });
        } else if (res.message === "Access Denied") {
          setLoading(false);
          messageApi.open({
            type: "info",
            content: "Your access has been revoked by the admin !",
            duration: 3,
          });
        } else if (res.message === "Error") {
          setLoading(false);
          messageApi.open({
            type: "info",
            content: "Something went wrong, please try again",
            duration: 3,
          });
        } else {
          setLoading(false);
          return navigate("/home");
        }
      });
    }
    if (formData.type === "tutor") {
      dispatch(tutorLogin(formData)).then((res) => {
        if (res.message === "Wrong credentials") {
          setLoading(false);
          messageApi.open({
            type: "info",
            content: "Wrong credentials !",
            duration: 3,
          });
        } else if (res.message === "Access Denied") {
          setLoading(false);
          messageApi.open({
            type: "info",
            content: "Your access has been revoked by the admin !",
            duration: 3,
          });
        } else if (res.message === "error") {
          setLoading(false);
          messageApi.open({
            type: "info",
            content: "Something went wrong, please try again",
            duration: 3,
          });
        } else {
          setLoading(false);
          return navigate("/home");
        }
      });
    }
    if (formData.type === "student") {
      dispatch(studentLogin(formData)).then((res) => {
        if (res.message === "Wrong EmailID") {
          setLoading(false);
          messageApi.open({
            type: "info",
            content: "Wrong EmailID !",
            duration: 3,
          });
        } else if (res.message === "Wrong Password") {
          setLoading(false);
          messageApi.open({
            type: "info",
            content: "Wrong Password !",
            duration: 3,
          });
        } else if (res.message === "Access Denied") {
          setLoading(false);
          messageApi.open({
            type: "info",
            content: "Your access has been revoked by the admin !",
            duration: 3,
          });
        } else if (res.message === "error") {
          setLoading(false);
          messageApi.open({
            type: "info",
            content: "Something went wrong, please try again",
            duration: 3,
          });
        } else {
          setLoading(false);
          return navigate("/leaderboard");
        }
      });
    }
  };

  if (auth.data.isAuthenticated) {
    if (auth.data.isAuthenticated && auth.data.userType === "student") {
      return <Navigate to="/" />;
    }
    return <Navigate to="/home" />;
  }
  return (
    <div className="login">
      {/* اطلاعات ورود کاربران */}
      {formData.type && (
        <div className="user-login-info"
          style={{ 
            background: "#f1f1f1", 
            padding: "15px", 
            textAlign: "center", 
            borderBottom: "2px solid #ddd", 
            fontSize: "16px",
            marginBottom: "10px"
          }}>
          <h3>{formData.type.charAt(0).toUpperCase() + formData.type.slice(1)} Login Info</h3>
          <p><strong>Email:</strong> <code>{userLoginInfo[formData.type]?.email}</code></p>
          <p><strong>Password:</strong> <code>{userLoginInfo[formData.type]?.password}</code></p>
        </div>
      )}

      <div className="loginContainer">
        <div className="loginImage">
          <img
            src="https://img.freepik.com/free-photo/computer-security-with-login-password-padlock_107791-16191.jpg"
            alt=""
          />
        </div>
        <div className="loginDetail">
          <div>
            <h3>Login</h3>
          </div>

          <div>
            {/* login form */}
            <form onSubmit={handleFormSubmit}>
              <select value={formData.type} name="type" onChange={handleFormChange}>
                <option value="">Select user type</option>
                <option value="admin">Admin</option>
                <option value="tutor">Tutor</option>
                <option value="student">Student</option>
              </select>
              <input
                required
                name="email"
                value={formData.email}
                onChange={handleFormChange}
                type="email"
                placeholder="Enter email"
              />
              <span id="emailError" style={{ color: 'red' }}></span>
              <input
                required
                name="password"
                value={formData.password}
                onChange={handleFormChange}
                type="password"
                placeholder="Enter password"
              />
              <button type="submit">CONTINUE</button>
            </form>
          </div>
        </div>
      </div>

      {/* loading indicator */}
      {contextHolder}
      {loading ? (
        <Space
          style={{
            width: "100vw",
            height: "100vh",
            position: "absolute",
            backgroundColor: "rgba(0,0,0,0.2)",
            top: "0",
            left: "0",
            display: "flex",
            justifyContent: "center",
            alignItem: "center",
          }}
        >
          <Spin size="large"></Spin>
        </Space>
      ) : null}
    </div>
  );
};

export default Login;
