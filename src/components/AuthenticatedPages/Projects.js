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
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const projectsData = await ApiService.fetchProjects(teamId);
        setProjects(projectsData);
      } catch (error) {
        console.error('Error fetching projects:', error);
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
      setGradeWeight(project.grade_weight);
      setSelectedCourseModule(project.module_id);
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
      if (editProjectId) {
        const updatedProject = await ApiService.updateProject(teamId, editProjectId, {
          name: projectName,
          given_date: givenDate,
          due_date: dueDate,
          description,
          grade_weight: gradeWeight,
          module_id: selectedCourseModule
        });
        setProjects(projects.map(project => project.id === editProjectId ? updatedProject : project));
      } else {
        const newProject = await ApiService.createProject(teamId, {
          name: projectName,
          given_date: givenDate,
          due_date: dueDate,
          description,
          grade_weight: gradeWeight,
          module_id: selectedCourseModule
        });
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
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h1>Projects</h1>
        <Button variant="primary" onClick={() => handleShowModal()}>
          Add Project
        </Button>
      </div>
      <ul className="list-group">
        {projects.map((project) => (
          <li key={project.id} className="list-group-item d-flex justify-content-between align-items-center">
            <span onClick={() => navigate(`/teams/${teamId}/projects/${project.id}`)} style={{ cursor: 'pointer' }}>
              {project.name}
            </span>
            <div>
              <Button variant="link" className="icon-button edit-button" onClick={() => handleShowModal(project)}>
                <FaEdit />
              </Button>
              <Button variant="link" className="icon-button delete-button" onClick={() => handleDeleteProject(project.id)}>
                <MdDelete />
              </Button>
            </div>
          </li>
        ))}
      </ul>

      <Modal show={showModal} onHide={handleCloseModal}>
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
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Given Date</Form.Label>
              <Form.Control
                type="date"
                value={givenDate}
                onChange={(e) => setGivenDate(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Due Date</Form.Label>
              <Form.Control
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                required
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
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Grade Weight</Form.Label>
              <Form.Control
                type="number"
                value={gradeWeight}
                onChange={(e) => setGradeWeight(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Course Module</Form.Label>
              <Form.Control
                as="select"
                value={selectedCourseModule}
                onChange={(e) => setSelectedCourseModule(e.target.value)}
                required
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
            <Button variant="primary" type="submit">
              {editProjectId ? 'Update' : 'Create'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
};

export default Projects;
