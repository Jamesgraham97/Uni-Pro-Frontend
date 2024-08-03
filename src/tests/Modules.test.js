import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Modules from '../components/AuthenticatedPages/Modules';
import ApiService from '../services/api';

// Mock the ApiService methods
jest.mock('../services/api', () => ({
  fetchModules: jest.fn(),
  createModule: jest.fn(),
  updateModule: jest.fn(),
  deleteModule: jest.fn(),
}));

describe('Modules Component', () => {
  const modules = [
    {
      id: 1,
      name: 'Module 1',
      description: 'Description 1',
      color: '#FFB3BA',
    },
    {
      id: 2,
      name: 'Module 2',
      description: 'Description 2',
      color: '#FFDFBA',
    },
  ];

  beforeEach(async () => {
    ApiService.fetchModules.mockResolvedValue(modules);
    render(<Modules />);
    await waitFor(() => screen.getByText('Modules'));
  });

  it('renders the Modules component', () => {
    expect(screen.getByText('Modules')).toBeInTheDocument();
  });

  it('displays a list of modules', () => {
    expect(screen.getByText('Module 1')).toBeInTheDocument();
    expect(screen.getByText('Module 2')).toBeInTheDocument();
  });

  it('opens the new module form modal', async () => {
    const createButton = screen.getByRole('button', { name: /Create New Module/i });
    fireEvent.click(createButton);
    await waitFor(() => expect(screen.getByTestId('modal')).toBeInTheDocument());
    expect(screen.getByTestId('modal')).toHaveTextContent('Create New Module');
  });

  it('creates a new module', async () => {
    ApiService.createModule.mockResolvedValue({
      id: 3,
      name: 'Module 3',
      description: 'Description 3',
      color: '#FFFFBA',
    });

    const createButton = screen.getByRole('button', { name: /Create New Module/i });
    fireEvent.click(createButton);
    await waitFor(() => screen.getByLabelText('Module Name'));

    fireEvent.change(screen.getByLabelText('Module Name'), { target: { value: 'Module 3' } });
    fireEvent.change(screen.getByLabelText('Description'), { target: { value: 'Description 3' } });
    fireEvent.change(screen.getByLabelText('Color'), { target: { value: '#FFFFBA' } });

    fireEvent.click(screen.getByText('Create Module'));

    await waitFor(() => screen.getByText('Module 3'));
    expect(screen.getByText('Module 3')).toBeInTheDocument();
  });

  it('edits an existing module', async () => {
    ApiService.updateModule.mockResolvedValue({
      id: 1,
      name: 'Updated Module 1',
      description: 'Updated Description 1',
      color: '#BAFFC9',
    });

    const dropdownButton = await waitFor(() => screen.getByTestId(`dropdown-button-1`));
    fireEvent.click(dropdownButton);

    const editButton = await waitFor(() => screen.getByRole('button', { name: /Edit Module 1/i }));
    fireEvent.click(editButton);

    await waitFor(() => screen.getByLabelText('Module Name'));

    fireEvent.change(screen.getByLabelText('Module Name'), { target: { value: 'Updated Module 1' } });
    fireEvent.change(screen.getByLabelText('Description'), { target: { value: 'Updated Description 1' } });
    fireEvent.change(screen.getByLabelText('Color'), { target: { value: '#BAFFC9' } });

    fireEvent.click(screen.getByText('Update Module'));

    await waitFor(() => screen.getByText('Updated Module 1'));
    expect(screen.getByText('Updated Module 1')).toBeInTheDocument();
  });

  it('deletes a module', async () => {
    ApiService.deleteModule.mockResolvedValue({});

    const dropdownButton = await waitFor(() => screen.getByTestId(`dropdown-button-1`));
    fireEvent.click(dropdownButton);

    const deleteButton = await waitFor(() => screen.getByRole('button', { name: /Delete Module 1/i }));
    fireEvent.click(deleteButton);

    await waitFor(() => expect(screen.queryByText('Module 1')).not.toBeInTheDocument());
    expect(screen.queryByText('Module 1')).not.toBeInTheDocument();
  });
});
