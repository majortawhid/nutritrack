import React from 'react';

const UserProfile = () => {
          return (
                    <div className="user-profile">
                              <h1>User Profile</h1>
                              <div className="profile-details">
                                        <p><strong>Name:</strong> John Doe</p>
                                        <p><strong>Email:</strong> john.doe@example.com</p>
                                        <p><strong>Age:</strong> 30</p>
                                        <p><strong>Weight:</strong> 70kg</p>
                                        <p><strong>Height:</strong> 175cm</p>
                              </div>
                              <button className="edit-profile-btn">Edit Profile</button>
                    </div>
          );
};

export default UserProfile;