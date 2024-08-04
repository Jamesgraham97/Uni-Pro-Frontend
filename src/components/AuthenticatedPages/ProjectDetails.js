import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Form, Button, Modal, Container, Row, Col, ListGroup, Image } from 'react-bootstrap';
import { FaEdit } from 'react-icons/fa';
import { MdDelete } from 'react-icons/md';
import { LuGrab } from 'react-icons/lu';
import ApiService from '../../services/api';
import API_URL from '../../config/config';

const ProjectDetails = () => {
  const { teamId, projectId } = useParams();
  const [project, setProject] = useState(null);
  const [assignments, setAssignments] = useState([]);
  const [modules, setModules] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('');
  const [status, setStatus] = useState('');

  useEffect(() => {
    const fetchProjectDetails = async () => {
      try {
        const projectData = await ApiService.fetchProject(teamId, projectId);
        setProject(projectData);
      } catch (error) {
        console.error('Error fetching project details:', error);
      }
    };

    const fetchProjectAssignments = async () => {
      try {
        const assignmentsData = await ApiService.fetchProjectAssignments(teamId, projectId);
        setAssignments(assignmentsData);
      } catch (error) {
        console.error('Error fetching assignments:', error);
      }
    };

    const fetchModules = async () => {
      try {
        const modulesData = await ApiService.fetchModules();
        setModules(modulesData);
      } catch (error) {
        console.error('Error fetching modules:', error);
      }
    };

    fetchProjectDetails();
    fetchProjectAssignments();
    fetchModules();
  }, [teamId, projectId]);

  const getModuleColor = (moduleId) => {
    const module = modules.find(m => m.id === moduleId);
    return module ? module.color : '#ffffff';
  };

  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => {
    setShowModal(false);
    setIsEditing(false);
    setSelectedAssignment(null);
    setTitle('');
    setDescription('');
    setPriority('');
    setStatus('');
  };

  const handleCreateProjectAssignment = async (event) => {
    event.preventDefault();
    try {
      const newAssignment = await ApiService.createProjectAssignment(teamId, projectId, {
        title,
        description,
        priority,
        status,
        user_id: null,
      });
      setAssignments([...assignments, newAssignment]);
      handleCloseModal();
    } catch (error) {
      console.error('Error creating assignment:', error);
    }
  };

  const handleUpdateProjectAssignment = async (event) => {
    event.preventDefault();
    try {
      const updatedAssignment = await ApiService.updateProjectAssignment(teamId, projectId, selectedAssignment.id, {
        title,
        description,
        priority,
        status,
        user_id: selectedAssignment.user_id,
      });
      setAssignments(assignments.map(assignment =>
        assignment.id === updatedAssignment.id ? updatedAssignment : assignment
      ));
      handleCloseModal();
    } catch (error) {
      console.error('Error updating assignment:', error);
    }
  };

  const handleDeleteProjectAssignment = async (projectAssignmentId) => {
    try {
      await ApiService.deleteProjectAssignment(teamId, projectId, projectAssignmentId);
      setAssignments(assignments.filter(assignment => assignment.id !== projectAssignmentId));
    } catch (error) {
      console.error('Error deleting assignment:', error);
    }
  };

  const handleEditClick = (assignment) => {
    setIsEditing(true);
    setSelectedAssignment(assignment);
    setTitle(assignment.title);
    setDescription(assignment.description);
    setPriority(assignment.priority);
    setStatus(assignment.status);
    handleShowModal();
  };

  const handleClaimProjectAssignment = async (projectAssignmentId) => {
    try {
      const claimedAssignment = await ApiService.claimProjectAssignment(teamId, projectId, projectAssignmentId);
      setAssignments(assignments.map(assignment =>
        assignment.id === projectAssignmentId ? claimedAssignment : assignment
      ));
    } catch (error) {
      console.error('Error claiming project assignment:', error);
    }
  };

  return (
    <Container data-testid="project-details-container">
      <h1 className="my-4">Project: {project?.name}</h1>
      <p>{project?.description}</p>
      <p>Given Date: {project?.given_date}</p>
      <p>Due Date: {project?.due_date}</p>
      <p>Grade: {project?.grade}</p>
      <Button variant="primary" onClick={handleShowModal} data-testid="new-assignment-button">+ New Assignment</Button>


      <Modal show={showModal} onHide={handleCloseModal} data-testid="assignment-modal">
        <Modal.Header closeButton>
          <Modal.Title>{isEditing ? 'Edit Assignment' : 'New Assignment'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={isEditing ? handleUpdateProjectAssignment : handleCreateProjectAssignment}>
            <Form.Group>
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Title"
                required
                data-testid="assignment-title-input"
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Description</Form.Label>
              <Form.Control
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Description"
                required
                data-testid="assignment-description-input"
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Priority</Form.Label>
              <Form.Control
                as="select"
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                required
                data-testid="assignment-priority-select"
              >
                <option value="">Select Priority</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </Form.Control>
            </Form.Group>
            <Form.Group>
              <Form.Label>Status</Form.Label>
              <Form.Control
                as="select"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                required
                data-testid="assignment-status-select"
              >
                <option value="">Select Status</option>
                <option value="To Do">To Do</option>
                <option value="In Progress">In Progress</option>
                <option value="Done">Done</option>
              </Form.Control>
            </Form.Group>
            <Button type="submit" variant="success" className="mt-3" data-testid="assignment-submit-button">
              {isEditing ? 'Update Assignment' : 'Create Assignment'}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      <ListGroup className="mt-4" data-testid="assignments-list">
        {assignments.map((projectAssignment) => (
          <ListGroup.Item key={projectAssignment.id} style={{ backgroundColor: getModuleColor(project?.module_id) }} data-testid={`assignment-${projectAssignment.id}`}>
            <Row>
              <Col md={8}>
                <h5>{projectAssignment.title}</h5>
                <p>{projectAssignment.description}</p>
                <p>Priority: {projectAssignment.priority}</p>
                <p>Status: {projectAssignment.status}</p>
                {projectAssignment.user && (
                  <div className="d-flex align-items-center">
                    {projectAssignment.user.profile_picture_url && (
                      <Image
                        src={`${API_URL}${projectAssignment.user.profile_picture_url}`}
                        roundedCircle
                        className="me-2"
                        style={{ width: '40px', height: '40px' }}
                      />
                    )}
                    <span>{projectAssignment.user.display_name}</span>
                  </div>
                )}
              </Col>
              <Col md={4} className="text-right">
                {!projectAssignment.user_id && (
                  <Button variant="link" className="icon-button" onClick={() => handleClaimProjectAssignment(projectAssignment.id)} data-testid={`claim-assignment-${projectAssignment.id}`}>
                    <LuGrab />
                  </Button>
                )}
                <Button variant="link" className="icon-button edit-button" onClick={(e) => { e.stopPropagation(); handleEditClick(projectAssignment); }} data-testid={`edit-assignment-${projectAssignment.id}`}>
                  <FaEdit />
                </Button>
                <Button variant="link" className="icon-button delete-button" onClick={(e) => { e.stopPropagation(); handleDeleteProjectAssignment(projectAssignment.id); }} data-testid={`delete-assignment-${projectAssignment.id}`}>
                  <MdDelete />
                </Button>
              </Col>
            </Row>
          </ListGroup.Item>
        ))}
      </ListGroup>
    </Container>
  );
};

export default ProjectDetails;
