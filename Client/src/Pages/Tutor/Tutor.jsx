import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getTutorData, tutorRegister } from "../../Redux/tutor/action";

// Component imports
import Navbar from "../../Components/Sidebar/Navbar";
import Header from "../../Components/Header/Header";
import AddIcon from "../../Components/AddIcon/AddIcon";
import TutorRow from "../../Components/Table/TutorRow";

// CSS imports
import { Button, Drawer, Space, Spin, message } from "antd";
import "./Tutor.css";

function saveAuthToken(token) {
  localStorage.setItem('authToken', token); // ذخیره توکن
}

function getAuthToken() {
  return localStorage.getItem('authToken'); // بازیابی توکن
}

const Tutor = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [filterTutor, setFilterTutor] = useState('');

  const { data: { isAuthenticated } } = useSelector((store) => store.auth);
  const { tutors, load } = useSelector((store) => store.tutor);

  const [loading, setLoading] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();

  const [open, setOpen] = useState(false);
  const showDrawer = () => setOpen(true);
  const onClose = () => setOpen(false);
  
  // Form states
  const initialFormData = {
    name: "",
    email: "",
    password: "",
    subject: "",
  };
  const [formData, setFormData] = useState(initialFormData);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.subject === "") {
      return messageApi.open({
        type: "info",
        content: "Please select Subject",
        duration: 3,
      });
    }

    setLoading(true);
  
    dispatch(tutorRegister(formData))
      .then((res) => {
        setLoading(false);
        if (res && res.token) {
          saveAuthToken(res.token); // ذخیره توکن در localStorage
          setFormData(initialFormData);
          onClose();
          messageApi.open({
            type: "success",
            content: "Tutor Registered Successfully",
            duration: 3,
          });
        } else if (res && res.msg) {
          if (res.msg === "User already registered") {
            messageApi.open({
              type: "info",
              content: "User already registered",
              duration: 3,
            });
          } else if (res.msg === "Tutor Registration failed") {
            messageApi.open({
              type: "error",
              content: "Tutor Registration failed",
              duration: 3,
            });
          } else {
            messageApi.open({
              type: "error",
              content: "Unexpected error occurred. Please try again later.",
              duration: 3,
            });
          }
        }
      })
      .catch((error) => {
        setLoading(false);
        console.error("Error:", error);
        messageApi.open({
          type: "error",
          content: "An error occurred. Please try again later.",
          duration: 3,
        });
      });
  };

  useEffect(() => {
    dispatch(getTutorData(filterTutor));
  }, [filterTutor, dispatch]);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  return (
    <Navbar>
      <div className="admin">
        <Header Title={"Tutor Data"} Address={"Tutor"} />

        {/* Filter by Subject */}
        <select
          style={{
            width: "200px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            margin: "auto",
            marginTop: "20px",
            marginBottom: "10px",
          }}
          value={filterTutor}
          onChange={(e) => setFilterTutor(e.target.value)}
        >
          <option value="">Filter by Subject</option>
          <option value="Maths">Maths</option>
          <option value="Physics">Physics</option>
          <option value="Chemistry">Chemistry</option>
          <option value="Biology">Biology</option>
          <option value="Political science">Political science</option>
          <option value="History">History</option>
        </select>
        <div className="adminData">
          <section className="tableBody">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Subject</th>
                  <th>Access</th>
                  <th>Edit</th>
                  <th>Delete</th>
                </tr>
              </thead>
              <tbody>
                {tutors?.map((data, i) => (
                  <TutorRow data={data} key={i} />
                ))}
              </tbody>
            </table>
          </section>
        </div>
        <div onClick={showDrawer}>
          <AddIcon />
        </div>
        <Drawer
          title="Create a new account"
          width={720}
          onClose={onClose}
          open={open}
          style={{ paddingBottom: 80 }}
          extra={
            <Space>
              <Button onClick={onClose}>Cancel</Button>
            </Space>
          }
        >
          {contextHolder}
          <form onSubmit={handleSubmit}>
            <input
              required
              name="name"
              type="text"
              value={formData.name}
              placeholder="Enter Name"
              onChange={handleInputChange}
            />
            <input
              required
              name="email"
              type="email"
              value={formData.email}
              placeholder="Enter Email"
              onChange={handleInputChange}
            />
            <input
              required
              name="password"
              type="password"
              value={formData.password}
              placeholder="Enter Password"
              onChange={handleInputChange}
            />
            <select
              name="subject"
              value={formData.subject}
              onChange={handleInputChange}
            >
              <option value="">Choose Subject</option>
              <option value="Maths">Maths</option>
              <option value="Physics">Physics</option>
              <option value="Chemistry">Chemistry</option>
              <option value="Biology">Biology</option>
              <option value="Political science">Political science</option>
              <option value="History">History</option>
            </select>
            <input type="submit" value="Add Tutor" />
          </form>
          {loading && (
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
                alignItems: "center",
              }}
            >
              <Spin size="large" />
            </Space>
          )}
        </Drawer>
      </div>
    </Navbar>
  );
};

export default Tutor;
