import React from 'react';
import { ListGroup } from 'react-bootstrap';

const SubtaskList = ({ subtasks }) => {
  return (
    <div>
      <h5>Subtasks</h5>
      <ListGroup>
        {subtasks.map((subtask) => (
          <ListGroup.Item key={subtask.id}>{subtask.title}</ListGroup.Item>
        ))}
      </ListGroup>
    </div>
  );
};

export default SubtaskList;
