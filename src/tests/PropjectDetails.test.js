import React from 'react';
import { render, screen, waitFor, fireEvent, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import ProjectDetails from '../components/AuthenticatedPages/ProjectDetails';
import ApiService from '../services/api';
import { AuthProvider } from '../context/AuthContext';

jest.mock('../services/api');

const mockProject = {
  id: 1,
  name: 'Project 1',
  description: 'Project description',
  given_date: '2024-01-01',
  due_date: '2024-12-31',
  grade: 'A',
  module_id: 1,
};

const mockAssignments = [
  { id: 1, title: 'Assignment 1', description: 'Description 1', priority: 'high', status: 'To Do', user: { display_name: 'User 1', profile_picture_url: '/profile1.png' } },
  { id: 2, title: 'Assignment 2', description: 'Description 2', priority: 'medium', status: 'In Progress' },
];

const mockModules = [
  { id: 1, name: 'Module 1', description: 'Description 1', color: '#ff0000' },
];

beforeEach(() => {
  ApiService.fetchProject.mockResolvedValue(mockProject);
  ApiService.fetchProjectAssignments.mockResolvedValue(mockAssignments);
  ApiService.fetchModules.mockResolvedValue(mockModules);
  ApiService.createProjectAssignment = jest.fn().mockResolvedValue({
    id: 3,
    title: 'New Assignment',
    description: 'New Description',
    priority: 'low',
    status: 'To Do',
  });
  ApiService.updateProjectAssignment = jest.fn().mockResolvedValue({
    id: 1,
    title: 'Updated Assignment',
    description: 'Updated Description',
    priority: 'high',
    status: 'Done',
  });
  ApiService.deleteProjectAssignment = jest.fn().mockResolvedValue({});
  ApiService.claimProjectAssignment = jest.fn().mockResolvedValue({
    id: 2,
    title: 'Assignment 2',
    description: 'Description 2',
    priority: 'medium',
    status: 'In Progress',
    user: { display_name: 'Test User', profile_picture_url: '/profile2.png' },
  });
});

describe('ProjectDetails Component', () => {
  it('renders the ProjectDetails component', async () => {
    await act(async () => {
      render(
        <AuthProvider>
          <MemoryRouter initialEntries={['/teams/1/projects/1']}>
            <Routes>
              <Route path="/teams/:teamId/projects/:projectId" element={<ProjectDetails />} />
            </Routes>
          </MemoryRouter>
        </AuthProvider>
      );
    });

    await waitFor(() => expect(ApiService.fetchProject).toHaveBeenCalledTimes(1));
    expect(screen.getByTestId('project-details-container')).toBeInTheDocument();
    expect(screen.getByText((content, element) => content.includes('Project 1'))).toBeInTheDocument();
  });

  it('displays assignments', async () => {
    await act(async () => {
      render(
        <AuthProvider>
          <MemoryRouter initialEntries={['/teams/1/projects/1']}>
            <Routes>
              <Route path="/teams/:teamId/projects/:projectId" element={<ProjectDetails />} />
            </Routes>
          </MemoryRouter>
        </AuthProvider>
      );
    });

    await waitFor(() => expect(ApiService.fetchProjectAssignments).toHaveBeenCalledTimes(1));
    mockAssignments.forEach((assignment) => {
      expect(screen.getByTestId(`assignment-${assignment.id}`)).toBeInTheDocument();
    });
  });

  it('creates a new assignment', async () => {
    await act(async () => {
      render(
        <AuthProvider>
          <MemoryRouter initialEntries={['/teams/1/projects/1']}>
            <Routes>
              <Route path="/teams/:teamId/projects/:projectId" element={<ProjectDetails />} />
            </Routes>
          </MemoryRouter>
        </AuthProvider>
      );
    });

    fireEvent.click(screen.getByTestId('new-assignment-button'));

    fireEvent.change(screen.getByTestId('assignment-title-input'), { target: { value: 'New Assignment' } });
    fireEvent.change(screen.getByTestId('assignment-description-input'), { target: { value: 'New Description' } });
    fireEvent.change(screen.getByTestId('assignment-priority-select'), { target: { value: 'low' } });
    fireEvent.change(screen.getByTestId('assignment-status-select'), { target: { value: 'To Do' } });

    fireEvent.click(screen.getByTestId('assignment-submit-button'));

    await waitFor(() => expect(ApiService.createProjectAssignment).toHaveBeenCalledTimes(1));
    expect(screen.getByText('New Assignment')).toBeInTheDocument();
  });

  it('updates an existing assignment', async () => {
    await act(async () => {
      render(
        <AuthProvider>
          <MemoryRouter initialEntries={['/teams/1/projects/1']}>
            <Routes>
              <Route path="/teams/:teamId/projects/:projectId" element={<ProjectDetails />} />
            </Routes>
          </MemoryRouter>
        </AuthProvider>
      );
    });

    fireEvent.click(screen.getByTestId('edit-assignment-1'));

    fireEvent.change(screen.getByTestId('assignment-title-input'), { target: { value: 'Updated Assignment' } });
    fireEvent.change(screen.getByTestId('assignment-description-input'), { target: { value: 'Updated Description' } });
    fireEvent.change(screen.getByTestId('assignment-priority-select'), { target: { value: 'high' } });
    fireEvent.change(screen.getByTestId('assignment-status-select'), { target: { value: 'Done' } });

    fireEvent.click(screen.getByTestId('assignment-submit-button'));

    await waitFor(() => expect(ApiService.updateProjectAssignment).toHaveBeenCalledTimes(1));
    await waitFor(() => expect(screen.getByText('Updated Assignment')).toBeInTheDocument());
  });

  it('deletes an assignment', async () => {
    await act(async () => {
      render(
        <AuthProvider>
          <MemoryRouter initialEntries={['/teams/1/projects/1']}>
            <Routes>
              <Route path="/teams/:teamId/projects/:projectId" element={<ProjectDetails />} />
            </Routes>
          </MemoryRouter>
        </AuthProvider>
      );
    });

    fireEvent.click(screen.getByTestId('delete-assignment-1'));

    await waitFor(() => expect(ApiService.deleteProjectAssignment).toHaveBeenCalledTimes(1));

    await waitFor(() => {
      expect(screen.queryByTestId('assignment-1')).not.toBeInTheDocument();
    });
  });

  it('claims an assignment', async () => {
    await act(async () => {
      render(
        <AuthProvider>
          <MemoryRouter initialEntries={['/teams/1/projects/1']}>
            <Routes>
              <Route path="/teams/:teamId/projects/:projectId" element={<ProjectDetails />} />
            </Routes>
          </MemoryRouter>
        </AuthProvider>
      );
    });

    fireEvent.click(screen.getByTestId('claim-assignment-2'));

    await waitFor(() => expect(ApiService.claimProjectAssignment).toHaveBeenCalledTimes(1));

    await waitFor(() => {
      expect(screen.getByText((content, element) => content.includes('Test User'))).toBeInTheDocument();
    });
  });
});
