import React from 'react';
import { render, screen, waitFor, fireEvent, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import Dashboard from '../components/AuthenticatedPages/Dashboard';
import ApiService from '../services/api';
import { AuthProvider } from '../context/AuthContext';
import { MemoryRouter } from 'react-router-dom';

jest.mock('../services/api');

const mockModules = [
  { id: 1, name: 'Module 1', description: 'Description 1', color: '#ff0000' },
  { id: 2, name: 'Module 2', description: 'Description 2', color: '#00ff00' },
  { id: 3, name: 'Module 3', description: 'Description 3', color: '#0000ff' },
  { id: 4, name: 'Module 4', description: 'Description 4', color: '#ffff00' },
  { id: 5, name: 'Module 5', description: 'Description 5', color: '#ff00ff' },
];

const mockAssignments = [
  { id: 1, title: 'Assignment 1', due_date: '2024-08-10', course_module_id: 1 },
  { id: 2, title: 'Assignment 2', due_date: '2024-08-12', course_module_id: 2 },
  { id: 3, title: 'Assignment 3', due_date: '2024-08-14', course_module_id: 3 },
];

beforeEach(() => {
  ApiService.fetchModules.mockResolvedValue(mockModules);
  ApiService.fetchAssignments.mockResolvedValue(mockAssignments);
});

describe('Dashboard Component', () => {
  it('renders the Dashboard component', async () => {
    await act(async () => {
      render(
        <AuthProvider>
          <MemoryRouter>
            <Dashboard />
          </MemoryRouter>
        </AuthProvider>
      );
    });

    await waitFor(() => expect(ApiService.fetchModules).toHaveBeenCalledTimes(1));
    expect(screen.getByTestId('dashboard-container')).toBeInTheDocument();
  });

  it('displays featured modules', async () => {
    await act(async () => {
      render(
        <AuthProvider>
          <MemoryRouter>
            <Dashboard />
          </MemoryRouter>
        </AuthProvider>
      );
    });

    await waitFor(() => expect(ApiService.fetchModules).toHaveBeenCalledTimes(1));
    expect(screen.getByTestId('modules-container')).toBeInTheDocument();
    mockModules.slice(0, 4).forEach((module) => {
      expect(screen.getByTestId(`module-${module.id}`)).toBeInTheDocument();
    });
  });

  it('displays upcoming assignments', async () => {
    await act(async () => {
      render(
        <AuthProvider>
          <MemoryRouter>
            <Dashboard />
          </MemoryRouter>
        </AuthProvider>
      );
    });

    await waitFor(() => expect(ApiService.fetchAssignments).toHaveBeenCalledTimes(1));
    expect(screen.getByTestId('assignments-container')).toBeInTheDocument();
    mockAssignments.forEach((assignment) => {
      expect(screen.getByTestId(`assignment-${assignment.id}`)).toBeInTheDocument();
    });
  });

  it('updates assignments list when a date with assignments is selected', async () => {
    await act(async () => {
      render(
        <AuthProvider>
          <MemoryRouter>
            <Dashboard />
          </MemoryRouter>
        </AuthProvider>
      );
    });

    await waitFor(() => expect(ApiService.fetchAssignments).toHaveBeenCalledTimes(1));

    const calendarTiles = screen.getAllByRole('button', { name: /10/ });
    fireEvent.click(calendarTiles[0]);

    await waitFor(() => expect(screen.getByTestId('selected-assignments-container')).toBeInTheDocument());
  });
});
