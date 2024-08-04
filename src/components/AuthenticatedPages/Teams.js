import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Modal, Button, Form } from 'react-bootstrap';
import Select from 'react-select';
import { useAuth } from '../../context/AuthContext';
import ApiService from '../../services/api';
import { FaEdit } from 'react-icons/fa';
import { MdDelete } from 'react-icons/md';
import API_URL from '../../config/config';

const Teams = () => {
  const { user } = useAuth();
  const [teams, setTeams] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [teamName, setTeamName] = useState('');
  const [friends, setFriends] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTeamsAndFriends = async () => {
      try {
        const teamsData = await ApiService.fetchTeams();
        console.log('Fetched Teams Data:', teamsData);
        setTeams(teamsData);
        const friendsData = await ApiService.getFriends();
        setFriends(friendsData.map(friend => ({ value: friend.id, label: friend.display_name })));
      } catch (error) {
        console.error('Error fetching teams or friends:', error);
        setError('Failed to fetch teams');
      }
    };

    fetchTeamsAndFriends();
  }, []);

  const handleShowModal = (team = null) => {
    if (team) {
      setEditMode(true);
      setSelectedTeam(team);
      setTeamName(team.name);
      setSelectedUsers(friends.filter(friend => team.user_ids.includes(friend.value)));
    } else {
      setEditMode(false);
      setTeamName('');
      setSelectedUsers([]);
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setSelectedTeam(null);
    setShowModal(false);
  };

  const handleCreateOrUpdateTeam = async (event) => {
    event.preventDefault();
    try {
      const user_ids = selectedUsers.map(user => user.value);
      const teamData = { name: teamName, user_ids };
      if (editMode) {
        const updatedTeam = await ApiService.updateTeam(selectedTeam.id, { team: teamData });
        setTeams(teams.map(team => (team.id === updatedTeam.id ? updatedTeam : team)));
      } else {
        const newTeam = await ApiService.createTeam({ team: teamData });
        setTeams([...teams, newTeam]);
      }
      setTeamName('');
      setSelectedUsers([]);
      handleCloseModal();
    } catch (error) {
      console.error('Error creating or updating team:', error);
    }
  };

  const handleShowDeleteModal = (team) => {
    setSelectedTeam(team);
    setShowDeleteModal(true);
  };

  const handleCloseDeleteModal = () => setShowDeleteModal(false);

  const handleDeleteTeam = async () => {
    try {
      await ApiService.deleteTeam(selectedTeam.id);
      setTeams(teams.filter(team => team.id !== selectedTeam.id));
      handleCloseDeleteModal();
    } catch (error) {
      console.error('Error deleting team:', error);
    }
  };

  const handleTeamClick = (teamId) => {
    navigate(`/teams/${teamId}/projects`);
  };

  if (!user) {
    console.log("No current user");
    return <div>Please log in to see your teams.</div>;
  }

  return (
    <div className="container mt-5" data-testid="teams-container">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h1>Teams</h1>
        <Button variant="primary" onClick={() => handleShowModal()} data-testid="add-team-button">
          Add Team
        </Button>
      </div>
      {error && <div data-testid="error-message">{error}</div>}
      <ul className="list-group">
        {teams.map((team) => (
          <li key={team.id} className="list-group-item d-flex flex-column" data-testid={`team-${team.id}`}>
            <div className="d-flex justify-content-between align-items-center">
              <span onClick={() => handleTeamClick(team.id)} style={{ cursor: 'pointer', flexGrow: 1 }} data-testid={`team-name-${team.id}`}>
                {team.name}
              </span>
              {team.owner_id === user.user.id && (
                <div>
                  <Button variant="link" className="icon-button edit-button" onClick={() => handleShowModal(team)} data-testid={`edit-team-${team.id}`}>
                    <FaEdit />
                  </Button>
                  <Button variant="link" className="icon-button delete-button" onClick={() => handleShowDeleteModal(team)} data-testid={`delete-team-${team.id}`}>
                    <MdDelete />
                  </Button>
                </div>
              )}
            </div>
            <div className="d-flex mt-2">
              {team.team_members && team.team_members.map(team_member => (
                <img
                  key={team_member.user.id}
                  src={`${API_URL}${team_member.user.profile_picture_url}`}
                  alt={team_member.user.display_name}
                  title={team_member.user.display_name}
                  className="rounded-circle"
                  style={{ width: '30px', height: '30px', marginRight: '5px' }}
                />
              ))}
            </div>
          </li>
        ))}
      </ul>

      <Modal show={showModal} onHide={handleCloseModal} data-testid="team-modal">
        <Modal.Header closeButton>
          <Modal.Title>{editMode ? 'Edit Team' : 'Create New Team'}</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleCreateOrUpdateTeam}>
          <Modal.Body>
            <Form.Group>
              <Form.Label htmlFor="team-name">Team Name</Form.Label>
              <Form.Control
                id="team-name"
                type="text"
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                required
                data-testid="team-name-input"
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Add Users</Form.Label>
              <Select
                isMulti
                options={friends}
                value={selectedUsers}
                onChange={setSelectedUsers}
                data-testid="add-users-select"
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>
              Close
            </Button>
            <Button variant="primary" type="submit" data-testid="save-team-button">
              {editMode ? 'Update' : 'Create'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      <Modal show={showDeleteModal} onHide={handleCloseDeleteModal} data-testid="delete-modal">
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete the team "{selectedTeam?.name}"? This action will also delete all associated projects and assignments.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseDeleteModal}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDeleteTeam} data-testid="confirm-delete-button">
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Teams;
