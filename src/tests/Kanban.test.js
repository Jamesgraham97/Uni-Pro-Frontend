import React from 'react';
import { render, screen, waitFor, within } from '@testing-library/react';
import '@testing-library/jest-dom';
import Kanban from '../components/AuthenticatedPages/Kanban';
import ApiService from '../services/api';

// Mock the ApiService
jest.mock('../services/api', () => ({
  fetchKanbanAssignments: jest.fn(),
  fetchModules: jest.fn(),
}));

const assignmentsData = {
  todo_assignments: [{ id: 1, title: 'Task 1', description: 'Description 1', due_date: '2024-08-10', user: 'User1' }],
  in_progress_assignments: [{ id: 2, title: 'Task 2', description: 'Description 2', due_date: '2024-08-11', user: 'User2' }],
  done_assignments: [{ id: 3, title: 'Task 3', description: 'Description 3', due_date: '2024-08-12', user: 'User3' }],
  todo_project_assignments: [],
  in_progress_project_assignments: [],
  done_project_assignments: [],
};

const modulesData = [{ id: 1, color: '#FF0000' }];

beforeEach(() => {
  ApiService.fetchKanbanAssignments.mockResolvedValue(assignmentsData);
  ApiService.fetchModules.mockResolvedValue(modulesData);
});

const renderKanban = () => render(<Kanban />);

describe('Kanban board', () => {
  test('renders the Kanban board and assignments correctly', async () => {
    renderKanban();

    // Wait for Kanban to fetch and render data
    await waitFor(() => {
      expect(screen.getByText('To Do')).toBeInTheDocument();
      expect(screen.getByText('In Progress')).toBeInTheDocument();
      expect(screen.getByText('Done')).toBeInTheDocument();
    });

    // Check To Do column
    const todoColumn = screen.getByTestId('column-1');
    const todoTasks = within(todoColumn).getByText('Task 1');
    expect(todoTasks).toBeInTheDocument();

    // Check In Progress column
    const inProgressColumn = screen.getByTestId('column-2');
    const inProgressTasks = within(inProgressColumn).getByText('Task 2');
    expect(inProgressTasks).toBeInTheDocument();

    // Check Done column
    const doneColumn = screen.getByTestId('column-3');
    const doneTasks = within(doneColumn).getByText('Task 3');
    expect(doneTasks).toBeInTheDocument();
  });
});
