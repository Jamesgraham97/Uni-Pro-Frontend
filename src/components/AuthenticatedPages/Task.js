import React from 'react';
import { Draggable } from 'react-beautiful-dnd';
import styled from 'styled-components';

const Container = styled.div`
  border: 2px solid ${props => props.modulecolor || 'transparent'};
  border-radius: 10px;
  padding: 10px;
  margin-bottom: 10px;
  background-color: white;
  color: black;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  min-height: 50px;
  transition: transform 0.2s ease;

  &:hover {
    transform: scale(1.05);
  }

  &.dragging {
    background-color: lightgreen;
  }
`;

const TaskContent = styled.div`
  width: 100%;
  h5 {
    margin: 0;
    padding: 5px;
    border-radius: 5px;
    background-color: ${props => props.modulecolor || 'transparent'};
    color: white;
  }

  p {
    margin: 5px 0;
  }

  small {
    color: gray;
  }
`;

const Task = ({ task, index }) => (
  <Draggable draggableId={task.id} index={index}>
    {(provided, snapshot) => (
      <Container
        ref={provided.innerRef}
        {...provided.draggableProps}
        {...provided.dragHandleProps}
        className={snapshot.isDragging ? 'dragging' : ''}
        modulecolor={task.moduleColor || undefined}
        data-testid={`task-${task.id}`} // Add this line
      >
        <TaskContent modulecolor={task.moduleColor}>
          <h5>{task.content}</h5>
          <p>{task.description}</p>
          <small>Due: {task.dueDate}</small>
        </TaskContent>
      </Container>
    )}
  </Draggable>
);

export default Task;
