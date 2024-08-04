import React, { useEffect, useState } from 'react';
import ApiService from '../../services/api';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './AuthenticatedCSS/Dashboard.css';

const Dashboard = () => {
  const [assignments, setAssignments] = useState([]);
  const [date, setDate] = useState(new Date());
  const [markedDates, setMarkedDates] = useState({});
  const [featuredModules, setFeaturedModules] = useState([]);
  const [moduleColors, setModuleColors] = useState({});
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedAssignments, setSelectedAssignments] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const modulesData = await ApiService.fetchModules();

      // Create a map of module IDs to their colors
      const colors = modulesData.reduce((acc, module) => {
        acc[module.id] = module.color;
        return acc;
      }, {});
      setModuleColors(colors);

      const assignmentsData = await ApiService.fetchAssignments();
      const upcomingAssignments = assignmentsData.filter((assignment) =>
        new Date(assignment.due_date) >= new Date()
      );
      setAssignments(upcomingAssignments);

      const dates = upcomingAssignments.reduce((acc, assignment) => {
        const dueDate = new Date(assignment.due_date).toDateString();
        if (!acc[dueDate]) {
          acc[dueDate] = [];
        }
        acc[dueDate].push(assignment);
        return acc;
      }, {});

      setMarkedDates(dates);

      // Determine the modules with the most assignments
      const moduleAssignmentCounts = assignmentsData.reduce((acc, assignment) => {
        if (acc[assignment.course_module_id]) {
          acc[assignment.course_module_id]++;
        } else {
          acc[assignment.course_module_id] = 1;
        }
        return acc;
      }, {});

      const sortedModules = modulesData.sort((a, b) => {
        const countA = moduleAssignmentCounts[a.id] || 0;
        const countB = moduleAssignmentCounts[b.id] || 0;
        return countB - countA;
      });

      setFeaturedModules(sortedModules.slice(0, 4));
    };

    fetchData();
  }, []);

  const onDateChange = (date) => {
    setDate(date);
    const dateStr = date.toDateString();
    setSelectedDate(dateStr);
    setSelectedAssignments(markedDates[dateStr] || []);
  };

  const renderTileContent = ({ date, view }) => {
    if (view === 'month') {
      const dateStr = date.toDateString();
      if (markedDates[dateStr]) {
        return <div className="flashing-icon"></div>; // Display flashing icon for marked dates
      }
    }
    return null;
  };

  const tileClassName = ({ date, view }) => {
    const dateStr = date.toDateString();
    if (view === 'month' && markedDates[dateStr]) {
      return 'pastel-tile pastel-tile--marked';
    }
    if (view === 'month' && (date.getMonth() !== new Date().getMonth())) {
      return 'pastel-tile pastel-tile--other-month';
    }
    return 'pastel-tile';
  };

  return (
    <div className="dashboard-container container mt-5 pastel-bg" data-testid="dashboard-container">
      <h2>Dashboard</h2>
      <div className="modules-container" data-testid="modules-container">
        <h3>Featured Modules</h3>
        <div className="row">
          {featuredModules.map((module) => (
            <div key={module.id} className="col-md-3 mb-4" data-testid={`module-${module.id}`}>
              <div className="card module-card" style={{ backgroundColor: module.color }}>
                <div className="card-body">
                  <h5 className="card-title">{module.name}</h5>
                  <p className="card-text">{module.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="assignments-calendar-container" data-testid="assignments-calendar-container">
        <div className="assignments-container" data-testid="assignments-container">
          <h3>Upcoming Assignments</h3>
          <ul className="list-group">
            {assignments.map((assignment) => (
              <li key={assignment.id} className="list-group-item d-flex justify-content-between align-items-center" style={{ borderLeft: `10px solid ${moduleColors[assignment.course_module_id]}` }} data-testid={`assignment-${assignment.id}`}>
                <div>
                  <h5 className="mb-1">{assignment.title}</h5>
                  <p className="mb-1">{new Date(assignment.due_date).toLocaleDateString()}</p>
                </div>
                <span className="badge bg-primary rounded-pill">Due</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="calendar-container" data-testid="calendar-container">
          <h3>Calendar</h3>
          <Calendar
            onChange={onDateChange}
            value={date}
            tileContent={renderTileContent}
            tileClassName={tileClassName}
          />
        </div>
      </div>
      {selectedAssignments.length > 0 && (
        <div className="selected-assignments-container mt-4" data-testid="selected-assignments-container">
          <h4>Assignments due on {selectedDate}</h4>
          <ul className="list-group">
            {selectedAssignments.map((assignment) => (
              <li key={assignment.id} className="list-group-item" data-testid={`selected-assignment-${assignment.id}`}>
                <div>
                  <h5 className="mb-1">{assignment.title}</h5>
                  <p className="mb-1">{new Date(assignment.due_date).toLocaleTimeString()}</p>
                  <p>{assignment.description}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
