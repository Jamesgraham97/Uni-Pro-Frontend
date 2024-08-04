import React, { useState, useEffect } from 'react';
import { DragDropContext } from 'react-beautiful-dnd';
import styled from 'styled-components';
import Column from './Column';
import ApiService from '../../services/api';
import './AuthenticatedCSS/Kanban.css';

const Container = styled.div`
  display: flex;
  justify-content: space-around;
  width: 100%;
  padding: 20px;
  background-color: #FFFFFF; /* Pastel Blue */
`;

const Kanban = () => {
  const [state, setState] = useState({
    tasks: {},
    columns: {},
    columnOrder: [],
  });

  useEffect(() => {
    const fetchAssignments = async () => {
      const [assignmentData, moduleData] = await Promise.all([
        ApiService.fetchKanbanAssignments(),
        ApiService.fetchModules(),
      ]);
      console.log('Fetched Kanban Data:', assignmentData);
      console.log('Fetched Modules Data:', moduleData);

      const moduleMap = {};
      moduleData.forEach(module => {
        moduleMap[module.id] = module.color;
      });

      const tasks = {};

      const processAssignments = (assignments, type) => {
        assignments.forEach((assignment) => {
          console.log('Processing assignment:', assignment);
          tasks[`${type}-${assignment.id}`] = {
            id: `${type}-${assignment.id}`,
            content: assignment.title,
            description: assignment.description,
            dueDate: assignment.due_date,
            type,
            user: assignment.user,
            moduleColor: assignment.course_module ? assignment.course_module.color : (assignment.project && assignment.project.course_module ? assignment.project.course_module.color : '#FFFFFF'),
            teamId: assignment.team_id, // Assuming you have these fields available in assignment data
            projectId: assignment.project_id, // Assuming you have these fields available in assignment data
          };
          console.log('Processed task:', tasks[`${type}-${assignment.id}`]);
        });
      };

      processAssignments(assignmentData.todo_assignments, 'todo');
      processAssignments(assignmentData.in_progress_assignments, 'in_progress');
      processAssignments(assignmentData.done_assignments, 'done');
      processAssignments(assignmentData.todo_project_assignments, 'todo_project');
      processAssignments(assignmentData.in_progress_project_assignments, 'in_progress_project');
      processAssignments(assignmentData.done_project_assignments, 'done_project');

      setState({
        tasks,
        columns: {
          'column-1': {
            id: 'column-1',
            title: 'To Do',
            taskIds: [
              ...assignmentData.todo_assignments.map((assignment) => `todo-${assignment.id}`),
              ...assignmentData.todo_project_assignments.map((assignment) => `todo_project-${assignment.id}`)
            ],
          },
          'column-2': {
            id: 'column-2',
            title: 'In Progress',
            taskIds: [
              ...assignmentData.in_progress_assignments.map((assignment) => `in_progress-${assignment.id}`),
              ...assignmentData.in_progress_project_assignments.map((assignment) => `in_progress_project-${assignment.id}`)
            ],
          },
          'column-3': {
            id: 'column-3',
            title: 'Done',
            taskIds: [
              ...assignmentData.done_assignments.map((assignment) => `done-${assignment.id}`),
              ...assignmentData.done_project_assignments.map((assignment) => `done_project-${assignment.id}`)
            ],
          },
        },
        columnOrder: ['column-1', 'column-2', 'column-3'],
      });
    };

    fetchAssignments();
  }, []);

  const onDragEnd = async (result) => {
    const { destination, source, draggableId } = result;

    if (!destination) {
      return;
    }

    if (destination.droppableId === source.droppableId && destination.index === source.index) {
      return;
    }

    const start = state.columns[source.droppableId];
    const finish = state.columns[destination.droppableId];

    if (start === finish) {
      const newTaskIds = Array.from(start.taskIds);
      newTaskIds.splice(source.index, 1);
      newTaskIds.splice(destination.index, 0, draggableId);

      const newColumn = {
        ...start,
        taskIds: newTaskIds,
      };

      setState({
        ...state,
        columns: {
          ...state.columns,
          [newColumn.id]: newColumn,
        },
      });
      return;
    }

    const startTaskIds = Array.from(start.taskIds);
    startTaskIds.splice(source.index, 1);
    const newStart = {
      ...start,
      taskIds: startTaskIds,
    };

    const finishTaskIds = Array.from(finish.taskIds);
    finishTaskIds.splice(destination.index, 0, draggableId);
    const newFinish = {
      ...finish,
      taskIds: finishTaskIds,
    };

    setState({
      ...state,
      columns: {
        ...state.columns,
        [newStart.id]: newStart,
        [newFinish.id]: newFinish,
      },
    });

    const task = state.tasks[draggableId];
    const taskId = draggableId.split('-')[1];
    const newStatus = finish.title;
    const { teamId, projectId } = task;

    try {
      if (task.type.includes('project')) {
        await ApiService.updateProjectAssignmentStatus(teamId, projectId, taskId, newStatus);
      } else {
        await ApiService.updateAssignmentStatus(taskId, newStatus);
      }
    } catch (error) {
      console.error('Error updating assignment status:', error);
      // Revert state changes if there was an error
      setState((prevState) => ({
        ...prevState,
        columns: {
          ...prevState.columns,
          [newStart.id]: start,
          [newFinish.id]: finish,
        },
      }));
    }
  };

  return (
    <DragDropContext data-testid="drag-drop-context" onDragEnd={onDragEnd}>
      <Container className="kanban-container">
        {state.columnOrder.map((columnId) => {
          const column = state.columns[columnId];
          const tasks = column.taskIds.map((taskId) => state.tasks[taskId]);

          return <Column key={column.id} column={column} tasks={tasks} />;
        })}
      </Container>
    </DragDropContext>
  );
};

export default Kanban;
