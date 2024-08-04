import React from 'react';
import { Droppable } from 'react-beautiful-dnd';
import styled from 'styled-components';
import Task from './Task';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  border: 1px solid lightgrey;
  border-radius: 10px;
  width: 30%;
  margin: 0 10px;
  background-color: #ffffff;
  padding: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h3`
  padding: 10px;
  font-family: 'Dangrek', cursive;
  text-align: center;
  background-color: #ececec;
  border-radius: 5px;
  width: 100%;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const TaskList = styled.div`
  padding: 10px;
  width: 100%;
  min-height: 400px;
  background-color: ${props => (props.isdraggingover ? 'skyblue' : '#f0f0f0')};
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const Column = ({ column, tasks }) => {
  if (!column) return null;

  return (
    <Container data-testid={column.id} className="column-container">
      <Title className="column-title">{column.title}</Title>
      <Droppable droppableId={column.id}>
        {(provided, snapshot) => (
          <TaskList
            ref={provided.innerRef}
            {...provided.droppableProps}
            isdraggingover={snapshot.isDraggingOver ? 'true' : undefined}
            className="task-list"
          >
            {tasks.map((task, index) => (
              <Task key={task.id} task={task} index={index} />
            ))}
            {provided.placeholder}
          </TaskList>
        )}
      </Droppable>
    </Container>
  );
};

export default Column;
