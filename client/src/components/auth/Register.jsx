import React, { useState } from 'react';

const Register = () => {
          const [formData, setFormData] = useState({
                    name: '',
                    email: '',
                    password: '',
                    confirmPassword: '',
          });

          const { name, email, password, confirmPassword } = formData;

          const handleChange = (e) => {
                    setFormData({ ...formData, [e.target.name]: e.target.value });
          };

          const handleSubmit = (e) => {
                    e.preventDefault();
                    if (password !== confirmPassword) {
                              alert('Passwords do not match');
                              return;
                    }
                    // Handle registration logic here
                    console.log('Form submitted:', formData);
          };

          return (
                    <div className="register">
                              <h2>Register</h2>
                              <form onSubmit={handleSubmit}>
                                        <div>
                                                  <label htmlFor="name">Name</label>
                                                  <input
                                                            type="text"
                                                            id="name"
                                                            name="name"
                                                            value={name}
                                                            onChange={handleChange}
                                                            required
                                                  />
                                        </div>
                                        <div>
                                                  <label htmlFor="email">Email</label>
                                                  <input
                                                            type="email"
                                                            id="email"
                                                            name="email"
                                                            value={email}
                                                            onChange={handleChange}
                                                            required
                                                  />
                                        </div>
                                        <div>
                                                  <label htmlFor="password">Password</label>
                                                  <input
                                                            type="password"
                                                            id="password"
                                                            name="password"
                                                            value={password}
                                                            onChange={handleChange}
                                                            required
                                                  />
                                        </div>
                                        <div>
                                                  <label htmlFor="confirmPassword">Confirm Password</label>
                                                  <input
                                                            type="password"
                                                            id="confirmPassword"
                                                            name="confirmPassword"
                                                            value={confirmPassword}
                                                            onChange={handleChange}
                                                            required
                                                  />
                                        </div>
                                        <button type="submit">Register</button>
                              </form>
                    </div>
          );
};

export default Register;