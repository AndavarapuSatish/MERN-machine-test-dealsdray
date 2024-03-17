import React, { useState } from 'react';
import './Login.css';
import { useFormik } from 'formik';
import axios from 'axios';
import Dashboard from './dashboard';
import { useNavigate } from 'react-router-dom';
export function Login() {
  const [username, setUsername] = useState('');
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: { username: '', password: '' },
    validate: (values) => {
      const errors = {};
      if (!values.username) {
        errors.username = 'Username is required';
      }
      if (!values.password) {
        errors.password = 'Password is required';
      }
      return errors;
    },
    onSubmit: (values) => {
      axios.get('http://127.0.0.1:3030/users')
        .then((res) => {
          const user = res.data.find(
            (user) =>
              user.f_userName === values.username &&
              user.f_Pwd === values.password
          );
          if (!user) {
            alert('Invalid Username or Password');
          } else {
            setUsername(user.f_userName);
            // window.location.href = '/dashboard';
            // navigate("/dashboard");
            return <Dashboard username={user.f_userName} />;
          }
        })
        .catch((error) => {
          console.error('Error:', error);
        });
    },
  });
  if (username){
    console.log("username",username)
    return <Dashboard username={username} />;
  }

  return (
    <>
      <div className='logo'>Logo</div>
      <div className='login-container'>
        <form onSubmit={formik.handleSubmit}>
          <label htmlFor='username'>Username</label>
          <input
            type='text'
            id='username'
            name='username'
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.username}
          />
          {formik.touched.username && formik.errors.username ? (
            <div className='error'>{formik.errors.username}</div>
          ) : null}

          <label htmlFor='password'>Password</label>
          <input
            type='password'
            id='password'
            name='password'
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.password}
          />
          {formik.touched.password && formik.errors.password ? (
            <div className='error'>{formik.errors.password}</div>
          ) : null}

          <button type='submit'>Login</button>
        </form>
      </div>
    </>
  );
}
