import React from 'react';
import { render, screen, waitFor, fireEvent, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import Teams from '../components/AuthenticatedPages/Teams';
import { AuthProvider } from '../context/AuthContext';
import ApiService from '../services/api';
import { MemoryRouter } from 'react-router-dom';

jest.mock('../services/api');

const mockUser = { id: 1, user: { id: 1, name: 'Test User' } };
const friends = [{ id: 2, display_name: 'Friend 1' }, { id: 3, display_name: 'Friend 2' }];
const teams = [{ id: 1, name: 'Team 1', owner_id: 1, user_ids: [2, 3], team_members: [{ user: { id: 1, profile_picture_url: '/profile1.png', display_name: 'User 1' } }] }, { id: 2, name: 'Team 2', owner_id: 2, user_ids: [2], team_members: [{ user: { id: 2, profile_picture_url: '/profile2.png', display_name: 'User 2' } }] }];

beforeEach(() => {
  ApiService.getCurrentUser.mockReturnValue(mockUser);
  ApiService.getFriends.mockResolvedValue(friends);
  ApiService.fetchTeams.mockResolvedValue(teams);
  ApiService.createTeam = jest.fn().mockResolvedValue({ id: 3, name: 'Team 3', user_ids: [] });
  ApiService.updateTeam = jest.fn().mockResolvedValue({ id: 1, name: 'Updated Team 1', user_ids: [2, 3] });
  ApiService.deleteTeam = jest.fn().mockResolvedValue({});
});

describe('Teams Component', () => {
  it('renders the Teams component', async () => {
    await act(async () => {
      render(
        <AuthProvider>
          <MemoryRouter>
            <Teams />
          </MemoryRouter>
        </AuthProvider>
      );
    });

    await waitFor(() => expect(ApiService.getFriends).toHaveBeenCalledTimes(1));
    expect(screen.getByTestId('teams-container')).toBeInTheDocument();
  });

  it('displays a list of teams', async () => {
    await act(async () => {
      render(
        <AuthProvider>
          <MemoryRouter>
            <Teams />
          </MemoryRouter>
        </AuthProvider>
      );
    });

    await waitFor(() => expect(ApiService.fetchTeams).toHaveBeenCalledTimes(1));
    expect(screen.getByTestId('team-1')).toBeInTheDocument();
    expect(screen.getByTestId('team-2')).toBeInTheDocument();
  });

  it('opens the new team form modal', async () => {
    await act(async () => {
      render(
        <AuthProvider>
          <MemoryRouter>
            <Teams />
          </MemoryRouter>
        </AuthProvider>
      );
    });

    const addButton = screen.getByTestId('add-team-button');
    fireEvent.click(addButton);

    expect(screen.getByTestId('team-modal')).toBeInTheDocument();
  });

  it('creates a new team', async () => {
    await act(async () => {
      render(
        <AuthProvider>
          <MemoryRouter>
            <Teams />
          </MemoryRouter>
        </AuthProvider>
      );
    });

    const addButton = screen.getByTestId('add-team-button');
    fireEvent.click(addButton);

    const input = screen.getByTestId('team-name-input');
    fireEvent.change(input, { target: { value: 'Team 3' } });

    const saveButton = screen.getByTestId('save-team-button');
    fireEvent.click(saveButton);

    await waitFor(() => expect(ApiService.createTeam).toHaveBeenCalledWith({ team: { name: 'Team 3', user_ids: [] } }));
    await waitFor(() => expect(screen.getByText('Team 3')).toBeInTheDocument());
  });

  it('edits an existing team', async () => {
    await act(async () => {
      render(
        <AuthProvider>
          <MemoryRouter>
            <Teams />
          </MemoryRouter>
        </AuthProvider>
      );
    });

    const editButton = screen.getByTestId('edit-team-1');
    fireEvent.click(editButton);

    const input = screen.getByTestId('team-name-input');
    fireEvent.change(input, { target: { value: 'Updated Team 1' } });

    const saveButton = screen.getByTestId('save-team-button');
    fireEvent.click(saveButton);

    await waitFor(() => expect(ApiService.updateTeam).toHaveBeenCalledWith(1, { team: { name: 'Updated Team 1', user_ids: [2, 3] } }));
    await waitFor(() => expect(screen.getByText('Updated Team 1')).toBeInTheDocument());
  });

  it('deletes a team', async () => {
    await act(async () => {
      render(
        <AuthProvider>
          <MemoryRouter>
            <Teams />
          </MemoryRouter>
        </AuthProvider>
      );
    });

    const deleteButton = screen.getByTestId('delete-team-1');
    fireEvent.click(deleteButton);

    const confirmDeleteButton = screen.getByTestId('confirm-delete-button');
    fireEvent.click(confirmDeleteButton);

    await waitFor(() => expect(ApiService.deleteTeam).toHaveBeenCalledWith(1));
    await waitFor(() => expect(screen.queryByTestId('team-name-1')).not.toBeInTheDocument());
  });

  it('displays error message when fetching teams fails', async () => {
    ApiService.fetchTeams.mockRejectedValue(new Error('Failed to fetch teams'));

    await act(async () => {
      render(
        <AuthProvider>
          <MemoryRouter>
            <Teams />
          </MemoryRouter>
        </AuthProvider>
      );
    });

    await waitFor(() => expect(ApiService.fetchTeams).toHaveBeenCalledTimes(1));
    expect(screen.getByText('Failed to fetch teams')).toBeInTheDocument();
  });
});