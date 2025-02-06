import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getDashboardData } from "../../Redux/dashboard/action";

// Component imports
import Navbar from "../../Components/Sidebar/Navbar";
import SalesDiv from "../../Components/SalesDiv/SalesDiv";
import Header from "../../Components/Header/Header";

// Icons import
import { BsClipboardMinus } from "react-icons/bs";
import { AiOutlineTag } from "react-icons/ai";
import { BarChart, Bar, ReferenceLine, XAxis, YAxis, Legend, ResponsiveContainer, Tooltip } from "recharts";

// CSS imports
import "react-vertical-timeline-component/style.min.css";
import "./Home.css";

// Image imports
import demo from "../../Assets/cartoon.svg";

// Data imports
import { barData } from "../../data.js";

const Home = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { data: { isAuthenticated } } = useSelector((store) => store.auth);
  const { dashboard } = useSelector((store) => store.dashboard);

  // Overview data
  const overviewData = [
    {
      icon: <AiOutlineTag />, 
      title: "Contents", 
      number: dashboard?.contents?.length || 0,
    },
    {
      icon: <BsClipboardMinus />, 
      title: "Quizzes", 
      number: dashboard?.quizzes?.length || 0,
    },
    {
      icon: <img src="https://cdn-icons-png.freepik.com/256/10015/10015080.png" alt="system Icon" width={24} height={24} />,
      title: "Class questions",
      number: dashboard?.doubts?.length || 0,
    },
  ];

  useEffect(() => {
    dispatch(getDashboardData());
  }, []);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/");
    }
  }, []);

  return (
    <div>
      <Navbar>
        <div className="main">
          {/* Header */}
          <Header Title={"Overview"} Address={"Default"} />

          {/* Overview section */}
          <div className="overview">
            <div className="overview-left">
              <div>
              <h2>Welcome to LMS</h2>
              </div>
              <div>
              <button>What's New!</button>
              </div>
              <img src={demo} alt="" />
            </div>
            <div className="overview-right">
              {overviewData?.map(({ icon, title, number }, i) => (
                <SalesDiv Icon={icon} Title={title} Number={number} key={i} />
              ))}
            </div>
          </div>

          {/* Bar Chart */}
          <div className="charts">
            <div className="lineChart">
              <div className="chartHead">
                <p>Students' Scores</p>
              </div>
              <div className="chartBox">
                <div className="chartOne">
                  <ResponsiveContainer>
                    <BarChart width={400} height={300} data={barData}>
                      <XAxis dataKey="name" />
                      <YAxis tickCount={20} domain={[0,20]} />
                      <Tooltip />
                      <Legend verticalAlign="top" wrapperStyle={{ lineHeight: "40px" }} />
                      <ReferenceLine y={0} stroke="#000" />
                      <Bar dataKey="score" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>

          <div className="homeFooter">
            Copyright 2025 © LMS created by Esmaeil Sharifi
          </div>
        </div>
      </Navbar>
    </div>
  );
};

export default Home;



