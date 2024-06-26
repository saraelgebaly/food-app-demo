import React, { useContext, useRef, useState } from "react";
import logo from "../../../.../../../assets/images/74297541930ad229a0eda19379889be7.png";
import { useForm } from "react-hook-form";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../../../Context/AuthContext";
import { ToastContext } from "../../../../Context/ToastContext";

export default function ResetPass() {
  let {baseUrl} = useContext(AuthContext)
  let {getToastValue} = useContext(ToastContext)

  const [visible, setVisible] = useState(false);

  const navigate = useNavigate();
  let {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm();
  const password = useRef({});
  password.current = watch("password", "");
  const onSubmit = async (data) => {
    try {
      const res = await axios.post(
        `${baseUrl}/Users/Reset`,
        data
      );
      console.log(res);
      getToastValue("success",res.data.message);
      navigate("/login");
    } catch (error) {
      getToastValue("error",error.response.data.message);
    }
  };
  return (
    <>
      <div className="authContainer">
        <div className="container-fluid vh-100 bg-overlay">
          <div className="row vh-100 justify-content-center align-items-center">
            <div className="col-md-6 bg-white p-4  border border-3 ">
              <div className="text-center logo-div">
                <img className="logo" src={logo} />
              </div>
              <div className="form-content">
                <h3>Reset Password</h3>
                <p className="text-muted">
                  Please Enter Your Otp or Check Your Inbox
                </p>
              </div>
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="input-group mb-3">
                  <span className="input-group-text" id="basic-addon1">
                    <i className="fa-solid fa-mobile-screen"></i>
                  </span>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter your Email"
                    {...register("email", {
                      required: "Email is required",
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: "Invalid email",
                      },
                    })}
                  />
                </div>
                {errors.email && (
                  <p className="alert alert-danger">{errors.email.message} </p>
                )}

                <div className="input-group mb-3">
                  <span className="input-group-text" id="basic-addon1">
                    <i className="fa-solid fa-lock"></i>
                  </span>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="OTP"
                    {...register("seed", {
                      required: "Code is required",
                    })}
                  />
                </div>
                {errors.seed && (
                  <p className="alert alert-danger">{errors.seed.message} </p>
                )}

                <div className="input-group mb-3">
                  <span className="input-group-text" id="basic-addon1">
                    <i className="fa-solid fa-lock"></i>
                  </span>
                  <input
                    type={visible ? "text" : "password"}
                    className="form-control z-0"
                    placeholder="New Password"
                    {...register("password", {
                      required: "New Password is required",
                    })}
                  />

                  <span
                    onClick={() => setVisible(!visible)}
                    className="pass-eye  position-absolute"
                  >
                    {visible ? (
                      <i className="fa-regular fa-eye  "></i>
                    ) : (
                      <i className="fa-regular fa-eye-slash "></i>
                    )}
                  </span>
                </div>
                {errors.password && (
                  <p className="alert alert-danger">
                    {errors.password.message}
                  </p>
                )}

                <div className="input-group mb-3">
                  <span className="input-group-text" id="basic-addon1">
                    <i className="fa-solid fa-lock"></i>
                  </span>
                  <input
                    type={visible ? "text" : "password"}
                    className="form-control z-0"
                    placeholder="Confirm new password"
                    {...register("confirmPassword", {
                      required: "Confirm New Password is required",
                      validate: (value) =>
                        value === password.current ||
                        "The passwords do not match",
                    })}
                  />
                  <span
                    onClick={() => setVisible(!visible)}
                    className="pass-eye  position-absolute"
                  >
                    {visible ? (
                      <i className="fa-regular fa-eye  "></i>
                    ) : (
                      <i className="fa-regular fa-eye-slash "></i>
                    )}
                  </span>
                </div>
                {errors.confirmPassword && (
                  <p className="alert alert-danger">
                    {errors.confirmPassword.message}
                  </p>
                )}

                <button className="btn btn-success w-100">
                  Reset Password
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
