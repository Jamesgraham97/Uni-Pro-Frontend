import React, { useState, useEffect } from 'react';
import ApiService from '../../services/api';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Modal, Button, Form, Spinner, Alert, ListGroup, Container, Row, Col } from 'react-bootstrap';
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import './AuthenticatedCSS/Assignments.css';

const Assignments = () => {
  const [assignments, setAssignments] = useState([]);
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [newAssignment, setNewAssignment] = useState({
    title: '',
    description: '',
    due_date: new Date(),
    given_date: new Date(),
    status: 'To Do',
    priority: '',
    grade_weight: '',
    course_module_id: '',
    parent_id: null,
  });
  

  useEffect(() => {
    const loadAssignments = async () => {
      try {
        const data = await ApiService.fetchAssignments();
        setAssignments(data);
        const modulesData = await ApiService.fetchModules();
        setModules(modulesData);
      } catch (error) {
        setError('Error fetching assignments');
      } finally {
        setLoading(false);
      }
    };

    loadAssignments();
  }, []);

  const getModuleColor = (moduleId) => {
    const module = modules.find(m => m.id === moduleId);
    return module ? module.color : '#ffffff';
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewAssignment((prev) => ({ ...prev, [name]: value }));
  };


  const handleDateChange = (date, field) => {
    setNewAssignment((prev) => ({ ...prev, [field]: date }));
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const createdAssignment = await ApiService.createAssignment(newAssignment.course_module_id, newAssignment);
      setAssignments((prev) => [...prev, createdAssignment]);
      setNewAssignment({
        title: '',
        description: '',
        due_date: new Date(),
        given_date: new Date(),
        status: 'To Do',
        priority: '',
        grade_weight: '',
        course_module_id: '',
        parent_id: null,
      });
      setShowForm(false);
    } catch (error) {
      setError('Error creating assignment');
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const updatedAssignment = await ApiService.updateAssignment(selectedAssignment.id, newAssignment);
      setAssignments((prev) => prev.map((assignment) => assignment.id === updatedAssignment.id ? updatedAssignment : assignment));
      setNewAssignment({
        title: '',
        description: '',
        due_date: new Date(),
        given_date: new Date(),
        status: 'To Do',
        priority: '',
        grade_weight: '',
        course_module_id: '',
        parent_id: null,
      });
      setIsEditing(false);
      setShowForm(false);
    } catch (error) {
      setError('Error updating assignment');
    }
  };

  const handleDelete = async (id) => {
    setDeleting(id); // Set the deleting state to trigger animation
    setTimeout(async () => { // Wait for animation to complete
      try {
        await ApiService.deleteAssignment(id);
        setAssignments((prev) => prev.filter((assignment) => assignment.id !== id));
        setDeleting(null); // Reset deleting state
      } catch (error) {
        setError('Error deleting assignment');
        setDeleting(null); // Reset deleting state even if there's an error
      }
    }, 500); // Adjust time to match the animation duration
  };

  const handleAssignmentClick = (assignment) => {
    setSelectedAssignment({ ...assignment });
    setShowDetails(true);
  };

  const handleEditClick = (assignment) => {
    setSelectedAssignment(assignment);
    setNewAssignment({
      title: assignment.title,
      description: assignment.description,
      due_date: new Date(assignment.due_date),
      given_date: new Date(assignment.given_date),
      status: assignment.status,
      priority: assignment.priority,
      grade_weight: assignment.grade_weight,
      course_module_id: assignment.course_module_id,
      parent_id: assignment.parent_id,
    });
    setIsEditing(true);
    setShowForm(true);
  };

 

  if (loading) {
    return <div className="spinner"><Spinner animation="border" role="status"><span className="sr-only">Loading...</span></Spinner></div>;
  }

  if (error) {
    return <Alert variant="danger">{error}</Alert>;
  }

  return (
    <Container>
      <h1 className="my-4">Assignments</h1>
      <Button variant="primary" className="button-primary" onClick={() => setShowForm(true)}>+ New Assignment</Button>

      <Modal show={showForm} onHide={() => { setShowForm(false); setIsEditing(false); }}>
        <Modal.Header closeButton>
          <Modal.Title>{isEditing ? 'Edit Assignment' : 'New Assignment'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={isEditing ? handleUpdate : handleCreate}>
            <Form.Group>
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                name="title"
                value={newAssignment.title}
                onChange={handleChange}
                placeholder="Title"
                required
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Description</Form.Label>
              <Form.Control
                type="text"
                name="description"
                value={newAssignment.description}
                onChange={handleChange}
                placeholder="Description"
                required
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Due Date</Form.Label>
              <DatePicker
                selected={newAssignment.due_date}
                onChange={(date) => handleDateChange(date, 'due_date')}
                className="form-control"
                dateFormat="yyyy-MM-dd"
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Given Date</Form.Label>
              <DatePicker
                selected={newAssignment.given_date}
                onChange={(date) => handleDateChange(date, 'given_date')}
                className="form-control"
                dateFormat="yyyy-MM-dd"
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Status</Form.Label>
              <Form.Control
                as="select"
                name="status"
                value={newAssignment.status}
                onChange={handleChange}
                required
              >
                <option value="To Do">To Do</option>
                <option value="In Progress">In Progress</option>
                <option value="Done">Done</option>
              </Form.Control>
            </Form.Group>
            <Form.Group>
              <Form.Label>Priority</Form.Label>
              <Form.Control
                as="select"
                name="priority"
                value={newAssignment.priority}
                onChange={handleChange}
                required
              >
                <option value="" disabled>Select Priority</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </Form.Control>
            </Form.Group>
            <Form.Group>
              <Form.Label>Grade Weight</Form.Label>
              <Form.Control
                type="number"
                name="grade_weight"
                value={newAssignment.grade_weight}
                onChange={handleChange}
                placeholder="Grade Weight"
                required
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Course Module</Form.Label>
              <Form.Control
                as="select"
                name="course_module_id"
                value={newAssignment.course_module_id}
                onChange={handleChange}
                required
              >
                <option value="" disabled>Select Module</option>
                {modules && modules.map((module) => (
                  <option key={module.id} value={module.id}>
                    {module.name}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
            <Button type="submit" variant="success" className="mt-3">{isEditing ? 'Update Assignment' : 'Create Assignment'}</Button>
          </Form>
        </Modal.Body>
      </Modal>

      <ListGroup className="mt-4">
        {assignments && assignments.filter(a => !a.parent_id).map((assignment) => (
          <ListGroup.Item key={assignment.id} action onClick={() => handleAssignmentClick(assignment)} className={deleting === assignment.id ? 'deleting' : ''} style={{ backgroundColor: getModuleColor(assignment.course_module_id) }}>
          <Row>
            <Col md={8}>
              <h5>{assignment.title}</h5>
              <p>Due Date: {new Date(assignment.due_date).toLocaleDateString()}</p>
              <p>Priority: {assignment.priority}</p>
            </Col>
            <Col md={4} className="text-right">
              <Button variant="link" className="icon-button edit-button" onClick={(e) => { e.stopPropagation(); handleEditClick(assignment); }}>
                <FaEdit />
              </Button>
              <Button variant="link" className="icon-button delete-button" onClick={(e) => { e.stopPropagation(); handleDelete(assignment.id); }}>
                <MdDelete />
              </Button>
            </Col>
          </Row>
        </ListGroup.Item>
        ))}
      </ListGroup>

      <Modal show={showDetails} onHide={() => setShowDetails(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{selectedAssignment?.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedAssignment && (
            <>
              <p><strong>Description:</strong> {selectedAssignment.description}</p>
              <p><strong>Due Date:</strong> {new Date(selectedAssignment.due_date).toLocaleDateString()}</p>
              <p><strong>Given Date:</strong> {new Date(selectedAssignment.given_date).toLocaleDateString()}</p>
              <p><strong>Priority:</strong> {selectedAssignment.priority}</p>
              <p><strong>Status:</strong> {selectedAssignment.status}</p>
              <p><strong>Grade Weight:</strong> {selectedAssignment.grade_weight}</p>
            </>
          )}
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default Assignments;
