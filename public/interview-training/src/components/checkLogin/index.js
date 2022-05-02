import { useHistory, useLocation } from "react-router-dom";

const Login = () => {
  const history = useHistory();
  const { state: { from = "/dashboard" } = {} } = useLocation();

  const onSuccess = (res) => {
    console.log("Login successfully", res.profileObj);
    const email = res.profileObj.email;
    // setUserEmail(email);
    window.localStorage.setItem("loginEmail", email);
    // refreshToken(res);
    history.replace(from);
  };
};
