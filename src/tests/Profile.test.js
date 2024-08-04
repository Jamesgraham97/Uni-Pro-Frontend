import React from 'react';
import { render, screen, waitFor, fireEvent, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import Profile from '../components/AuthenticatedPages/Profile';
import ApiService from '../services/api';
import { AuthProvider } from '../context/AuthContext';
import { MemoryRouter } from 'react-router-dom';
import API_URL from '../config/config';  // Import the API_URL

jest.mock('../services/api');
jest.mock('../components/AuthenticatedPages/CropperComponent', () => (props) => (
  <div data-testid="cropper-component">
    <button onClick={() => props.onCropComplete('croppedImageSrc')}>Crop</button>
  </div>
));

// Mock the window alert function
window.alert = jest.fn();

const mockUser = {
  id: 1,
  display_name: 'Test User',
  bio: 'Test bio',
  location: 'Test location',
  profile_picture_url: '/profile.png',
  university: 'Test University',
  github: 'https://github.com/testuser',
  linkedin: 'https://linkedin.com/in/testuser'
};

beforeEach(() => {
  ApiService.getCurrentUserProfile.mockResolvedValue(mockUser);
  ApiService.updateUserProfile = jest.fn().mockResolvedValue(mockUser);
});

describe('Profile Component', () => {
  it('renders the Profile component', async () => {
    await act(async () => {
      render(
        <AuthProvider>
          <MemoryRouter>
            <Profile />
          </MemoryRouter>
        </AuthProvider>
      );
    });

    await waitFor(() => expect(ApiService.getCurrentUserProfile).toHaveBeenCalledTimes(1));
    expect(screen.getByTestId('profile-container')).toBeInTheDocument();
  });

  it('displays user profile data', async () => {
    await act(async () => {
      render(
        <AuthProvider>
          <MemoryRouter>
            <Profile />
          </MemoryRouter>
        </AuthProvider>
      );
    });

    expect(screen.getByTestId('display-name-input')).toHaveValue(mockUser.display_name);
    expect(screen.getByTestId('bio-input')).toHaveValue(mockUser.bio);
    expect(screen.getByTestId('location-input')).toHaveValue(mockUser.location);
    expect(screen.getByTestId('university-input')).toHaveValue(mockUser.university);
    expect(screen.getByTestId('github-input')).toHaveValue(mockUser.github);
    expect(screen.getByTestId('linkedin-input')).toHaveValue(mockUser.linkedin);
    expect(screen.getByTestId('current-profile-picture')).toHaveAttribute('src', `${API_URL}${mockUser.profile_picture_url}`);
  });

  it('updates the user profile', async () => {
    await act(async () => {
      render(
        <AuthProvider>
          <MemoryRouter>
            <Profile />
          </MemoryRouter>
        </AuthProvider>
      );
    });

    fireEvent.change(screen.getByTestId('display-name-input'), { target: { value: 'Updated User' } });
    fireEvent.change(screen.getByTestId('bio-input'), { target: { value: 'Updated bio' } });
    fireEvent.change(screen.getByTestId('location-input'), { target: { value: 'Updated location' } });
    fireEvent.change(screen.getByTestId('university-input'), { target: { value: 'Updated University' } });
    fireEvent.change(screen.getByTestId('github-input'), { target: { value: 'https://github.com/updateduser' } });
    fireEvent.change(screen.getByTestId('linkedin-input'), { target: { value: 'https://linkedin.com/in/updateduser' } });

    fireEvent.click(screen.getByTestId('update-profile-button'));

    await waitFor(() => expect(ApiService.updateUserProfile).toHaveBeenCalledTimes(1));
    expect(ApiService.updateUserProfile).toHaveBeenCalledWith(expect.any(FormData));
  });

  it('handles image cropping', async () => {
    await act(async () => {
      render(
        <AuthProvider>
          <MemoryRouter>
            <Profile />
          </MemoryRouter>
        </AuthProvider>
      );
    });

    const file = new Blob(['image content'], { type: 'image/png' });
    const fileInput = screen.getByTestId('profile-picture-input');
    await act(async () => {
      fireEvent.change(fileInput, { target: { files: [file] } });
    });

    await waitFor(() => expect(screen.getByTestId('cropper-component')).toBeInTheDocument());

    fireEvent.click(screen.getByText('Crop'));

    await waitFor(() => expect(screen.queryByTestId('cropper-component')).not.toBeInTheDocument());
  });
});
