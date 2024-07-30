import React, { useEffect, useState } from 'react';
import ApiService from '../../services/api';
import './AuthenticatedCSS/Modules.css';

const pastelColors = [
  '#FFB3BA', // Pastel Red
  '#FFDFBA', // Pastel Orange
  '#FFFFBA', // Pastel Yellow
  '#BAFFC9', // Pastel Green
  '#BAE1FF', // Pastel Blue
  '#E2C2FF', // Pastel Purple
  '#FFCDF3', // Pastel Pink
  '#C2F0FF', // Pastel Cyan
];

const Modules = () => {
  const [modules, setModules] = useState([]);
  const [newModule, setNewModule] = useState({ name: '', description: '', color: pastelColors[0] });
  const [currentModule, setCurrentModule] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await ApiService.fetchModules();
        setModules(data);
      } catch (error) {
        console.error('Error fetching modules:', error);
      }
    };
    fetchData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewModule((prevModule) => ({ ...prevModule, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const createdModule = await ApiService.createModule({ course_module: newModule });
      setModules((prevModules) => [...prevModules, createdModule]);
      setNewModule({ name: '', description: '', color: pastelColors[0] });
    } catch (error) {
      console.error('Error creating module:', error);
    }
  };

  const handleDelete = async (moduleId) => {
    try {
      await ApiService.deleteModule(moduleId);
      setModules(modules.filter((module) => module.id !== moduleId));
    } catch (error) {
      console.error('Error deleting module:', error);
    }
  };

  const handleEdit = (module) => {
    setCurrentModule(module);
    setNewModule(module);
    const modal = new window.bootstrap.Modal(document.getElementById('createModuleModal'));
    modal.show();
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const updatedModule = await ApiService.updateModule(currentModule.id, { course_module: newModule });
      setModules(modules.map((module) => (module.id === updatedModule.id ? updatedModule : module)));
      setNewModule({ name: '', description: '', color: pastelColors[0] });
      setCurrentModule(null);
    } catch (error) {
      console.error('Error updating module:', error);
    }
  };

  return (
    <div className="container mt-5">
      <h2>Modules</h2>
      <div className="row">
        {modules.map((module) => (
          <div key={module.id} className="col-md-4 mb-4">
            <div className="card module-card" style={{ backgroundColor: module.color }}>
              <div className="card-body">
                <h5 className="card-title">{module.name}</h5>
                <p className="card-text">{module.description}</p>
              </div>
            </div>
            <div className="dropdown text-center mt-2">
              <button className="btn btn-secondary dropdown-toggle" type="button" id={`dropdownMenuButton-${module.id}`} data-bs-toggle="dropdown" aria-expanded="false">
                ...
              </button>
              <ul className="dropdown-menu" aria-labelledby={`dropdownMenuButton-${module.id}`}>
                <li>
                  <button className="dropdown-item" onClick={() => handleEdit(module)}>
                    Edit
                  </button>
                </li>
                <li>
                  <button className="dropdown-item" onClick={() => handleDelete(module.id)}>
                    Delete
                  </button>
                </li>
              </ul>
            </div>
          </div>
        ))}
        <div className="col-md-4 mb-4">
          <button 
            className="btn btn-primary module-card create-button" 
            data-bs-toggle="modal" 
            data-bs-target="#createModuleModal"
          >
            <i className="bi bi-plus-lg"></i>
          </button>
        </div>
      </div>

      <div className="modal fade" id="createModuleModal" tabIndex="-1" aria-labelledby="createModuleModalLabel" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="createModuleModalLabel">
                {currentModule ? 'Edit Module' : 'Create New Module'}
              </h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <form onSubmit={currentModule ? handleUpdate : handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="name" className="form-label">Module Name</label>
                  <input
                    type="text"
                    className="form-control"
                    id="name"
                    name="name"
                    value={newModule.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="description" className="form-label">Description</label>
                  <textarea
                    className="form-control"
                    id="description"
                    name="description"
                    value={newModule.description}
                    onChange={handleInputChange}
                    required
                  ></textarea>
                </div>
                <div className="mb-3">
                  <label htmlFor="color" className="form-label">Color</label>
                  <select
                    className="form-control"
                    id="color"
                    name="color"
                    value={newModule.color}
                    onChange={handleInputChange}
                    required
                  >
                    {pastelColors.map((color, index) => (
                      <option key={index} value={color} style={{ backgroundColor: color }}>
                        &nbsp;&nbsp;&nbsp;&nbsp;
                      </option>
                    ))}
                  </select>
                </div>
                <button type="submit" className="btn btn-primary" data-bs-dismiss="modal">
                  {currentModule ? 'Update Module' : 'Create Module'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modules;