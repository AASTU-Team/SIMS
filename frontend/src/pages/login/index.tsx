import React from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import type { FormProps } from "antd";
import { LoginForm } from "../../type/user";
import { Form,Input,notification } from "antd";
import Phone from "../../assets/login/phone";
import LockIcon from "../../assets/login/LockIcon";
import MailIcon from "../../assets/login/MailIcon";
import { Login } from "../../api/userApi";
import { useMutation } from "@tanstack/react-query";
import Loader from "../../components/Loader";
import setCookie from "../../hooks/setCookie";


const SignIn: React.FC = () => {
  const router = useNavigate()

  const loginMutation= useMutation({
    mutationKey: ['login'],
    mutationFn: (values:LoginForm)=>Login(values)
  });

  const OnFinish: FormProps<LoginForm>["onFinish"] = (values) => {
    loginMutation.mutate(values)
    loginMutation.isError && notification.error({message:"Invalid Username or Password"})
    // console.log(loginMutation)
    if(loginMutation.isSuccess || loginMutation.isIdle){
      setCookie("access_token", loginMutation.data?.data?.accessToken || "", 7)
      setCookie("refresh_token", loginMutation.data?.data?.refreshToken || "", 7);
      router("/")
    }
  };

  const onFinishFailed: FormProps<LoginForm>["onFinishFailed"] = (
    errorInfo
  ) => {
    console.log("Failed:", errorInfo);
  };
  return (
    <div suppressHydrationWarning={true}>

      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="flex flex-wrap items-center">
          <div className="hidden w-full xl:block xl:w-1/2">
            <div className="px-26 py-17.5 text-center">
              <Link className="mb-5.5 inline-block" to="/">
                <img
                  className="dark:hidden"
                  src={"/images/logo.jpg"}
                  alt="Logo"
                  width={176}
                  height={32}
                />
              </Link>

              <p className=" 2xl:px-5 text-title-md font-bold">
                Student Information Management System
              </p>

              <Phone />
            </div>
          </div>

          <div className="w-full border-stroke dark:border-strokedark xl:w-1/2 xl:border-l-2">
            <div className="w-full p-4 sm:p-12.5 xl:p-17.5">
              <h2 className="mb-9 text-2xl font-bold text-black dark:text-white sm:text-title-xl2">
                Sign In to SIMS
              </h2>
{             loginMutation.isPending ? <Loader/>:
              <Form
                name="login_form"
                onFinish={OnFinish}
                onFinishFailed={onFinishFailed}
                autoComplete="off"
              >
                <Form.Item<LoginForm>
                  name="email"
                  rules={[
                    {
                      required: true,
                      message: "Please input your email",
                    },
                  ]}
                >
                  <div className="mb-4">
                    <label className="mb-2.5 block font-medium text-black dark:text-white">
                      Email
                    </label>
                    <div className="relative">
                      <Input
                        type="email"
                        placeholder="Enter your email"
                        className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                      />

                    <MailIcon/>
                    </div>
                  </div>
                </Form.Item>
                <Form.Item<LoginForm>
                  name="password"
                  rules={[
                    {
                      required: true,
                      message: "Please input your password",
                    },
                  ]}
                >
                  <div className="mb-6">
                    <label className="mb-2.5 block font-medium text-black dark:text-white">
                      Password
                    </label>
                    <div className="relative">
                      <Input
                        type="password"
                        placeholder="Enter your password"
                        className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                      />
                      
                    <LockIcon/>
                    </div>
                  </div>
                </Form.Item>

                <div className="mb-5">
                  <input
                    type="submit"
                    value="Sign In"
                    className="w-full cursor-pointer rounded-lg border border-primary bg-primary p-4 text-white transition hover:bg-opacity-90"
                  />
                </div>

                <div className="mt-6 text-center">
                  <p>
                    <Link to="/forgot_pass" className="text-primary">
                      Forgot Password?
                    </Link>
                  </p>
                </div>
              </Form>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
