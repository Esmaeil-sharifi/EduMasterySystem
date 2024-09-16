import * as types from "./types";
import axios from "axios";
import BackendURL from "../../BackendURL.js";

// Register tutor
export const tutorRegister = (data) => async (dispatch) => {
  const token = localStorage.getItem("authToken"); // خواندن توکن از localStorage

  if (!token) {
    console.error("No token found");
    dispatch({
      type: types.REGISTER_TUTOR_ERROR,
      payload: {
        message: "No token found",
      },
    });
    return;
  }

  try {
    dispatch({ type: types.REGISTER_TUTOR_REQUEST });
    const res = await axios.post(
      `${BackendURL}/tutor/register`,
      data, // ارسال داده‌ها به سرور
      {
        headers: {
          Authorization: `Bearer ${token}`, // اضافه کردن توکن به هدر
        },
      }
    );
    if (res.data.tutor) {
      dispatch({
        type: types.REGISTER_TUTOR_SUCCESS,
        payload: { tutor: res.data.tutor },
      });
    }
    return res.data;
  } catch (error) {
    console.error("Registration error:", error.response?.data || error.message);
    dispatch({
      type: types.REGISTER_TUTOR_ERROR,
      payload: {
        message: error.response?.data?.message || "An error occurred during registration",
      },
    });
  }
};

// Get all tutors data
export const getTutorData = (filter) => async (dispatch) => {
  try {
    dispatch({ type: types.GET_TUTOR_REQUEST });
    const res = await axios.get(`${BackendURL}/tutor/all?filter=${filter}`);
    dispatch({
      type: types.GET_TUTOR_SUCCESS,
      payload: { tutors: res.data.tutors },
    });
  } catch (error) {
    dispatch({
      type: types.GET_TUTOR_ERROR,
      payload: {
        message: error.response?.data?.message || "An error occurred while fetching tutor data",
      },
    });
  }
};

// Delete tutor
export const deleteTutor = (tutorId) => async (dispatch) => {
  const token = localStorage.getItem("authToken"); // خواندن توکن از localStorage

  if (!token) {
    console.error("No token found");
    dispatch({
      type: types.DELETE_TUTOR_ERROR,
      payload: {
        message: "No token found",
      },
    });
    return;
  }

  try {
    dispatch({ type: types.DELETE_TUTOR_REQUEST });
    await axios.delete(`${BackendURL}/tutor/${tutorId}`, {
      headers: {
        Authorization: `Bearer ${token}`, // اضافه کردن توکن به هدر
      },
    });
    dispatch({
      type: types.DELETE_TUTOR_SUCCESS,
      payload: { tutorId },
    });
  } catch (error) {
    dispatch({
      type: types.DELETE_TUTOR_ERROR,
      payload: {
        message: error.response?.data?.message || "An error occurred while deleting tutor",
      },
    });
  }
};

// Edit tutor
export const editTutor = (tutorId, data) => async (dispatch) => {
  const token = localStorage.getItem("authToken"); // خواندن توکن از localStorage

  if (!token) {
    console.error("No token found");
    dispatch({
      type: types.EDIT_TUTOR_ERROR,
      payload: {
        message: "No token found",
      },
    });
    return;
  }

  try {
    dispatch({ type: types.EDIT_TUTOR_REQUEST });
    const res = await axios.patch(
      `${BackendURL}/tutor/${tutorId}`,
      data, // ارسال داده‌ها به سرور
      {
        headers: {
          Authorization: `Bearer ${token}`, // اضافه کردن توکن به هدر
        },
      }
    );
    dispatch({
      type: types.EDIT_TUTOR_SUCCESS,
      payload: { id: tutorId, tutor: res.data.tutor },
    });
  } catch (error) {
    dispatch({
      type: types.EDIT_TUTOR_ERROR,
      payload: {
        message: error.response?.data?.message || "An error occurred while editing tutor",
      },
    });
  }
};
