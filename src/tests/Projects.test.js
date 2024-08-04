import React from 'react';
import { render, screen, waitFor, fireEvent, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import Projects from '../components/AuthenticatedPages/Projects';
import { AuthProvider } from '../context/AuthContext';
import ApiService from '../services/api';
import { MemoryRouter, Route, Routes } from 'react-router-dom';

jest.mock('../services/api');

const mockProjects = [
  { id: 1, name: 'Project 1', given_date: '2024-01-01', due_date: '2024-01-10', description: 'Description 1', grade_weight: 20, module_id: 1 },
  { id: 2, name: 'Project 2', given_date: '2024-02-01', due_date: '2024-02-10', description: 'Description 2', grade_weight: 30, module_id: 2 }
];
const mockModules = [
  { id: 1, name: 'Module 1' },
  { id: 2, name: 'Module 2' }
];

beforeEach(() => {
  ApiService.fetchProjects.mockResolvedValue(mockProjects);
  ApiService.fetchModules.mockResolvedValue(mockModules);
  ApiService.createProject = jest.fn().mockResolvedValue({ id: 3, name: 'Project 3', given_date: '2024-03-01', due_date: '2024-03-10', description: 'Description 3', grade_weight: 40, module_id: 1 });
  ApiService.updateProject = jest.fn().mockResolvedValue({ id: 1, name: 'Updated Project 1', given_date: '2024-01-01', due_date: '2024-01-10', description: 'Description 1', grade_weight: 20, module_id: 1 });
  ApiService.deleteProject = jest.fn().mockResolvedValue({});
});

describe('Projects Component', () => {
  it('renders the Projects component', async () => {
    await act(async () => {
      render(
        <AuthProvider>
          <MemoryRouter initialEntries={['/teams/1/projects']}>
            <Routes>
              <Route path="/teams/:teamId/projects" element={<Projects />} />
              <Route path="/teams/:teamId/projects/:projectId" element={<div>Project Details</div>} />
            </Routes>
          </MemoryRouter>
        </AuthProvider>
      );
    });

    await waitFor(() => expect(ApiService.fetchProjects).toHaveBeenCalledTimes(1));
    expect(screen.getByTestId('projects-container')).toBeInTheDocument();
  });

  it('displays a list of projects', async () => {
    await act(async () => {
      render(
        <AuthProvider>
          <MemoryRouter initialEntries={['/teams/1/projects']}>
            <Routes>
              <Route path="/teams/:teamId/projects" element={<Projects />} />
              <Route path="/teams/:teamId/projects/:projectId" element={<div>Project Details</div>} />
            </Routes>
          </MemoryRouter>
        </AuthProvider>
      );
    });

    await waitFor(() => expect(ApiService.fetchProjects).toHaveBeenCalledTimes(1));
    expect(screen.getByTestId('project-1')).toBeInTheDocument();
    expect(screen.getByTestId('project-2')).toBeInTheDocument();
  });

  it('opens the new project form modal', async () => {
    await act(async () => {
      render(
        <AuthProvider>
          <MemoryRouter initialEntries={['/teams/1/projects']}>
            <Routes>
              <Route path="/teams/:teamId/projects" element={<Projects />} />
              <Route path="/teams/:teamId/projects/:projectId" element={<div>Project Details</div>} />
            </Routes>
          </MemoryRouter>
        </AuthProvider>
      );
    });

    const addButton = screen.getByTestId('add-project-button');
    fireEvent.click(addButton);

    expect(screen.getByTestId('project-modal')).toBeInTheDocument();
  });

  it('creates a new project', async () => {
    await act(async () => {
      render(
        <AuthProvider>
          <MemoryRouter initialEntries={['/teams/1/projects']}>
            <Routes>
              <Route path="/teams/:teamId/projects" element={<Projects />} />
              <Route path="/teams/:teamId/projects/:projectId" element={<div>Project Details</div>} />
            </Routes>
          </MemoryRouter>
        </AuthProvider>
      );
    });

    const addButton = screen.getByTestId('add-project-button');
    fireEvent.click(addButton);

    fireEvent.change(screen.getByTestId('project-name-input'), { target: { value: 'Project 3' } });
    fireEvent.change(screen.getByTestId('given-date-input'), { target: { value: '2024-03-01' } });
    fireEvent.change(screen.getByTestId('due-date-input'), { target: { value: '2024-03-10' } });
    fireEvent.change(screen.getByTestId('description-input'), { target: { value: 'Description 3' } });
    fireEvent.change(screen.getByTestId('grade-weight-input'), { target: { value: '40' } });
    fireEvent.change(screen.getByTestId('course-module-select'), { target: { value: '1' } });

    const saveButton = screen.getByTestId('save-project-button');
    fireEvent.click(saveButton);

    await waitFor(() => expect(ApiService.createProject).toHaveBeenCalledWith('1', {
      name: 'Project 3',
      given_date: '2024-03-01',
      due_date: '2024-03-10',
      description: 'Description 3',
      grade_weight: 40,
      module_id: 1
    }));

    // Ensure the Projects component has updated
    await waitFor(() => expect(screen.queryByTestId('project-modal')).not.toBeInTheDocument());

    // Mock fetchProjects to return the new project list
    ApiService.fetchProjects.mockResolvedValue([...mockProjects, { id: 3, name: 'Project 3', given_date: '2024-03-01', due_date: '2024-03-10', description: 'Description 3', grade_weight: 40, module_id: 1 }]);

    // Trigger useEffect to re-fetch projects
    await act(async () => {
      render(
        <AuthProvider>
          <MemoryRouter initialEntries={['/teams/1/projects']}>
            <Routes>
              <Route path="/teams/:teamId/projects" element={<Projects />} />
              <Route path="/teams/:teamId/projects/:projectId" element={<div>Project Details</div>} />
            </Routes>
          </MemoryRouter>
        </AuthProvider>
      );
    });

    await waitFor(() => expect(screen.getByText('Project 3')).toBeInTheDocument());
  });

  it('edits an existing project', async () => {
    await act(async () => {
      render(
        <AuthProvider>
          <MemoryRouter initialEntries={['/teams/1/projects']}>
            <Routes>
              <Route path="/teams/:teamId/projects" element={<Projects />} />
              <Route path="/teams/:teamId/projects/:projectId" element={<div>Project Details</div>} />
            </Routes>
          </MemoryRouter>
        </AuthProvider>
      );
    });

    const editButton = screen.getByTestId('edit-project-1');
    fireEvent.click(editButton);

    fireEvent.change(screen.getByTestId('project-name-input'), { target: { value: 'Updated Project 1' } });

    const saveButton = screen.getByTestId('save-project-button');
    fireEvent.click(saveButton);

    await waitFor(() => expect(ApiService.updateProject).toHaveBeenCalledWith('1', 1, {
      name: 'Updated Project 1',
      given_date: '2024-01-01',
      due_date: '2024-01-10',
      description: 'Description 1',
      grade_weight: 20,
      module_id: 1
    }));

    await waitFor(() => expect(screen.getByText('Updated Project 1')).toBeInTheDocument());
  });

  it('deletes a project', async () => {
    await act(async () => {
      render(
        <AuthProvider>
          <MemoryRouter initialEntries={['/teams/1/projects']}>
            <Routes>
              <Route path="/teams/:teamId/projects" element={<Projects />} />
              <Route path="/teams/:teamId/projects/:projectId" element={<div>Project Details</div>} />
            </Routes>
          </MemoryRouter>
        </AuthProvider>
      );
    });

    const deleteButton = screen.getByTestId('delete-project-1');
    fireEvent.click(deleteButton);

    await waitFor(() => expect(ApiService.deleteProject).toHaveBeenCalledWith('1', 1));
    await waitFor(() => expect(screen.queryByText('Project 1')).not.toBeInTheDocument());
  });

  it('displays error message when fetching projects fails', async () => {
    ApiService.fetchProjects.mockRejectedValue(new Error('Failed to fetch projects'));

    await act(async () => {
      render(
        <AuthProvider>
          <MemoryRouter initialEntries={['/teams/1/projects']}>
            <Routes>
              <Route path="/teams/:teamId/projects" element={<Projects />} />
              <Route path="/teams/:teamId/projects/:projectId" element={<div>Project Details</div>} />
            </Routes>
          </MemoryRouter>
        </AuthProvider>
      );
    });

    await waitFor(() => expect(ApiService.fetchProjects).toHaveBeenCalledTimes(1));
    expect(screen.getByText('Failed to fetch projects')).toBeInTheDocument();
  });
});
