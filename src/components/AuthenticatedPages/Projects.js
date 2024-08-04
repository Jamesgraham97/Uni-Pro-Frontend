import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Form, Button, Modal } from 'react-bootstrap';
import ApiService from '../../services/api';
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";

const Projects = () => {
  const { teamId } = useParams();
  const [projects, setProjects] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [projectName, setProjectName] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [givenDate, setGivenDate] = useState('');
  const [description, setDescription] = useState('');
  const [gradeWeight, setGradeWeight] = useState('');
  const [courseModules, setCourseModules] = useState([]);
  const [selectedCourseModule, setSelectedCourseModule] = useState('');
  const [editProjectId, setEditProjectId] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const projectsData = await ApiService.fetchProjects(teamId);
        setProjects(projectsData);
      } catch (error) {
        console.error('Error fetching projects:', error);
        setError('Failed to fetch projects');
      }
    };

    const fetchCourseModules = async () => {
      try {
        const modulesData = await ApiService.fetchModules();
        setCourseModules(modulesData);
      } catch (error) {
        console.error('Error fetching course modules:', error);
      }
    };

    fetchProjects();
    fetchCourseModules();
  }, [teamId]);

  const handleShowModal = (project = null) => {
    if (project) {
      setProjectName(project.name);
      setGivenDate(project.given_date);
      setDueDate(project.due_date);
      setDescription(project.description);
      setGradeWeight(project.grade_weight.toString());
      setSelectedCourseModule(project.module_id.toString());
      setEditProjectId(project.id);
    } else {
      setProjectName('');
      setGivenDate('');
      setDueDate('');
      setDescription('');
      setGradeWeight('');
      setSelectedCourseModule('');
      setEditProjectId(null);
    }
    setShowModal(true);
  };

  const handleCloseModal = () => setShowModal(false);

  const handleCreateOrUpdateProject = async (event) => {
    event.preventDefault();
    try {
      const projectData = {
        name: projectName,
        given_date: givenDate,
        due_date: dueDate,
        description,
        grade_weight: parseInt(gradeWeight),
        module_id: parseInt(selectedCourseModule)
      };

      if (editProjectId) {
        const updatedProject = await ApiService.updateProject(teamId, editProjectId, projectData);
        setProjects(projects.map(project => project.id === editProjectId ? updatedProject : project));
      } else {
        const newProject = await ApiService.createProject(teamId, projectData);
        setProjects([...projects, newProject]);
        navigate(`/teams/${teamId}/projects/${newProject.id}`);
      }
      handleCloseModal();
    } catch (error) {
      console.error('Error creating or updating project:', error.response?.data?.errors || error.message);
    }
  };

  const handleDeleteProject = async (projectId) => {
    try {
      await ApiService.deleteProject(teamId, projectId);
      setProjects(projects.filter(project => project.id !== projectId));
    } catch (error) {
      console.error('Error deleting project:', error);
    }
  };

  return (
    <div className="container mt-5" data-testid="projects-container">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h1>Projects</h1>
        <Button variant="primary" onClick={() => handleShowModal()} data-testid="add-project-button">
          Add Project
        </Button>
      </div>
      {error && <div data-testid="error-message">{error}</div>}
      <ul className="list-group">
        {projects.map((project) => (
          <li key={project.id} className="list-group-item d-flex justify-content-between align-items-center" data-testid={`project-${project.id}`}>
            <span onClick={() => navigate(`/teams/${teamId}/projects/${project.id}`)} style={{ cursor: 'pointer' }} data-testid={`project-name-${project.id}`}>
              {project.name}
            </span>
            <div>
              <Button variant="link" className="icon-button edit-button" onClick={() => handleShowModal(project)} data-testid={`edit-project-${project.id}`}>
                <FaEdit />
              </Button>
              <Button variant="link" className="icon-button delete-button" onClick={() => handleDeleteProject(project.id)} data-testid={`delete-project-${project.id}`}>
                <MdDelete />
              </Button>
            </div>
          </li>
        ))}
      </ul>

      <Modal show={showModal} onHide={handleCloseModal} data-testid="project-modal">
        <Modal.Header closeButton>
          <Modal.Title>{editProjectId ? 'Edit Project' : 'Create New Project'}</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleCreateOrUpdateProject}>
          <Modal.Body>
            <Form.Group>
              <Form.Label>Project Name</Form.Label>
              <Form.Control
                type="text"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                required
                data-testid="project-name-input"
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Given Date</Form.Label>
              <Form.Control
                type="date"
                value={givenDate}
                onChange={(e) => setGivenDate(e.target.value)}
                required
                data-testid="given-date-input"
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Due Date</Form.Label>
              <Form.Control
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                required
                data-testid="due-date-input"
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                data-testid="description-input"
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Grade Weight</Form.Label>
              <Form.Control
                type="number"
                value={gradeWeight}
                onChange={(e) => setGradeWeight(e.target.value)}
                required
                data-testid="grade-weight-input"
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Course Module</Form.Label>
              <Form.Control
                as="select"
                value={selectedCourseModule}
                onChange={(e) => setSelectedCourseModule(e.target.value)}
                required
                data-testid="course-module-select"
              >
                <option value="">Select Module</option>
                {courseModules.map((module) => (
                  <option key={module.id} value={module.id}>
                    {module.name}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>
              Close
            </Button>
            <Button variant="primary" type="submit" data-testid="save-project-button">
              {editProjectId ? 'Update' : 'Create'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
};

export default Projects;
