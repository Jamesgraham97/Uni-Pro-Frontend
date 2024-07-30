import React, { useState, useEffect } from 'react';
import ApiService from '../../services/api';
import CropperComponent from './CropperComponent';
import './AuthenticatedCSS/Profile.css';


const Profile = () => {
  const [user, setUser] = useState({});
  const [formData, setFormData] = useState({
    bio: '',
    location: '',
    profile_picture: null,
    university: '',
    github: '',
    linkedin: ''
  });
  const [imageSrc, setImageSrc] = useState(null);
  const [croppedImage, setCroppedImage] = useState(null);
  const [showCropper, setShowCropper] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await ApiService.getCurrentUserProfile();
        setUser(response);
        setFormData({
          display_name:response.display_name || '',
          bio: response.bio || '',
          location: response.location || '',
          profile_picture: null,
          university: response.university || '',
          github: response.github || '',
          linkedin: response.linkedin || ''
        });
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
    fetchUserData();
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files && files.length > 0) {
      const reader = new FileReader();
      reader.readAsDataURL(files[0]);
      reader.onload = () => {
        setImageSrc(reader.result);
        setShowCropper(true); // Show the cropper when an image is selected
      };
    }
    setFormData({
      ...formData,
      [name]: files ? files[0] : value
    });
  };

  const handleCropComplete = (croppedImage) => {
    setCroppedImage(croppedImage);
    setShowCropper(false); // Close the cropper
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append('user[bio]', formData.bio);
    data.append('user[location]', formData.location);
    if (croppedImage) {
      const blob = await (await fetch(croppedImage)).blob();
      data.append('user[profile_picture]', blob, 'profile.png');
    }
    data.append('user[university]', formData.university);
    data.append('user[github]', formData.github);
    data.append('user[linkedin]', formData.linkedin);

    try {
      const updatedUser = await ApiService.updateUserProfile(data);
      setUser(updatedUser);
      alert('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile');
    }
  };

  return (
    <div className="container">
      <h2>Profile</h2>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
      <div className="mb-3">
          <label htmlFor="displayName" className="form-label">display name</label>
          <textarea
            id="bio"
            name="bio"
            className="form-control"
            value={formData.display_name
            }
            onChange={handleChange}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="bio" className="form-label">Bio</label>
          <textarea
            id="bio"
            name="bio"
            className="form-control"
            value={formData.bio}
            onChange={handleChange}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="location" className="form-label">Location</label>
          <input
            type="text"
            id="location"
            name="location"
            className="form-control"
            value={formData.location}
            onChange={handleChange}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="profile_picture" className="form-label">Profile Picture</label>
          <input
            type="file"
            id="profile_picture"
            name="profile_picture"
            className="form-control"
            onChange={handleChange}
          />
        </div>
        {showCropper && (
          <CropperComponent imageSrc={imageSrc} onCropComplete={handleCropComplete} />
        )}
        <div className="mb-3">
          <label htmlFor="university" className="form-label">University</label>
          <input
            type="text"
            id="university"
            name="university"
            className="form-control"
            value={formData.university}
            onChange={handleChange}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="github" className="form-label">GitHub Link</label>
          <input
            type="text"
            id="github"
            name="github"
            className="form-control"
            value={formData.github}
            onChange={handleChange}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="linkedin" className="form-label">LinkedIn Link</label>
          <input
            type="text"
            id="linkedin"
            name="linkedin"
            className="form-control"
            value={formData.linkedin}
            onChange={handleChange}
          />
        </div>
        <button type="submit" className="btn btn-primary">Update Profile</button>
      </form>
      <div className="mt-4">
        <h3>Current Profile Picture</h3>
        {user.profile_picture_url && (
          <img src={`http://localhost:3000${user.profile_picture_url}`} alt="Profile" className="profile-picture" />
        )}
      </div>
    </div>
  );
};

export default Profile;
