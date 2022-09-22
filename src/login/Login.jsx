import React from "react";
import { useState } from "react";

const Login = () => {
  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData({
      ...data,
      [name]: value,
    });
  };

  return (
    <div className="login">
      <form>
        <div className="wrapper">
          <input
            type="text"
            name="name"
            value={data.name}
            onChange={handleChange}
          />
        </div>
        <div className="wrapper">
          <input
            type="email"
            name="email"
            value={data.email}
            onChange={handleChange}
          />
        </div>
        <div className="wrapper">
          <input
            type="password"
            name="password"
            value={data.password}
            onChange={handleChange}
          />
        </div>
      </form>
    </div>
  );
};

export default Login;
