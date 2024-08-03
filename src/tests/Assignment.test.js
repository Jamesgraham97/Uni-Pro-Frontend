// src/tests/Assignments.test.js

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Assignments from '../components/AuthenticatedPages/Assignments';
import ApiService from '../services/api';

// Mock the ApiService methods
jest.mock('../services/api', () => ({
  fetchAssignments: jest.fn(),
  fetchModules: jest.fn(),
  createAssignment: jest.fn(),
  updateAssignment: jest.fn(),
  deleteAssignment: jest.fn(),
}));

describe('Assignments Component', () => {
  const assignments = [
    {
      id: 1,
      title: 'Assignment 1',
      description: 'Description 1',
      due_date: '2024-08-15',
      given_date: '2024-08-01',
      status: 'To Do',
      priority: 'high',
      grade_weight: 20,
      course_module_id: 1,
      parent_id: null,
    },
  ];

  const modules = [
    {
      id: 1,
      name: 'Module 1',
      color: '#ff0000',
    },
  ];

  beforeEach(async () => {
    ApiService.fetchAssignments.mockResolvedValue(assignments);
    ApiService.fetchModules.mockResolvedValue(modules);
    render(<Assignments />);
    await waitFor(() => screen.getByText('Assignments'));
  });

  it('renders the Assignments component', () => {
    expect(screen.getByText('Assignments')).toBeInTheDocument();
  });

  it('displays a list of assignments', () => {
    expect(screen.getByText('Assignment 1')).toBeInTheDocument();
    expect(screen.getByText(/Due Date:/)).toBeInTheDocument();
    expect(screen.getByText(/15\/8\/2024/)).toBeInTheDocument();  // Adjust the regex pattern as needed
  });

  it('opens the new assignment form modal', async () => {
    fireEvent.click(screen.getByText('+ New Assignment'));
    expect(screen.getByText('New Assignment')).toBeInTheDocument();
  });

  it('creates a new assignment', async () => {
    ApiService.createAssignment.mockResolvedValue({
      id: 2,
      title: 'Assignment 2',
      description: 'Description 2',
      due_date: '2024-09-01',
      given_date: '2024-08-10',
      status: 'To Do',
      priority: 'medium',
      grade_weight: 10,
      course_module_id: 1,
      parent_id: null,
    });

    fireEvent.click(screen.getByText('+ New Assignment'));
    fireEvent.change(screen.getByPlaceholderText('Title'), { target: { value: 'Assignment 2' } });
    fireEvent.change(screen.getByPlaceholderText('Description'), { target: { value: 'Description 2' } });
    fireEvent.change(screen.getByLabelText('Course Module'), { target: { value: '1' } });

    fireEvent.click(screen.getByText('Create Assignment'));

    await waitFor(() => screen.getByText('Assignment 2'));
    expect(screen.getByText('Assignment 2')).toBeInTheDocument();
  });

  it('edits an existing assignment', async () => {
    ApiService.updateAssignment.mockResolvedValue({
      id: 1,
      title: 'Updated Assignment 1',
      description: 'Updated Description 1',
      due_date: '2024-08-20',
      given_date: '2024-08-01',
      status: 'To Do',
      priority: 'low',
      grade_weight: 25,
      course_module_id: 1,
      parent_id: null,
    });

    fireEvent.click(screen.getByText('Assignment 1'));
    fireEvent.click(screen.getByLabelText('edit'));
    fireEvent.change(screen.getByPlaceholderText('Title'), { target: { value: 'Updated Assignment 1' } });
    fireEvent.change(screen.getByPlaceholderText('Description'), { target: { value: 'Updated Description 1' } });

    fireEvent.click(screen.getByText('Update Assignment'));

    await waitFor(() => screen.getByText('Updated Assignment 1'));
    expect(screen.getByText('Updated Assignment 1')).toBeInTheDocument();
  });

  it('deletes an assignment', async () => {
    ApiService.deleteAssignment.mockResolvedValue({});

    fireEvent.click(screen.getByText('Assignment 1'));
    fireEvent.click(screen.getByLabelText('delete'));

    await waitFor(() => expect(screen.queryByText('Assignment 1')).not.toBeInTheDocument());
    expect(screen.queryByText('Assignment 1')).not.toBeInTheDocument();  // Ensure the assignment is removed from the list
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument(); // Ensure the modal is closed
  });

  it('displays error message when fetching assignments fails', async () => {
    ApiService.fetchAssignments.mockRejectedValue(new Error('Error fetching assignments'));

    render(<Assignments />);
    await waitFor(() => expect(screen.getByText('Error fetching assignments')).toBeInTheDocument());
  });
});
