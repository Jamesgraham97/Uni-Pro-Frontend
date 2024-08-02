import React, { useState, useEffect } from 'react';
import AuthService from '../../services/api';
import { Modal, Button } from 'react-bootstrap';
import API_URL from '../../config/config';

const SearchButton = () => {
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [isFriend, setIsFriend] = useState(false);
  const [friendRequestSent, setFriendRequestSent] = useState(false);
  const [friendRequestReceived, setFriendRequestReceived] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      const user = AuthService.getCurrentUser();
      setCurrentUser(user);
    };
    fetchCurrentUser();
  }, []);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSearch = async (event) => {
    event.preventDefault();
    if (searchTerm.trim() === '') return;
    try {
      const results = await AuthService.searchUsers(searchTerm);
      setSearchResults(results);
    } catch (error) {
      console.error('Error searching for users:', error);
    }
  };

  const handleUserClick = async (user) => {
    setSelectedUser(user);
    setShowProfileModal(true);
    await checkFriendStatus(user.id);
    setShowSearchModal(false);
  };

  const checkFriendStatus = async (userId) => {
    try {
      const status = await AuthService.getFriendshipStatus(userId);
      setIsFriend(status === 'friends');
      setFriendRequestSent(status === 'request_sent');
      setFriendRequestReceived(status === 'request_received');
    } catch (error) {
      console.error('Error checking friend status:', error.message);
    }
  };

  const handleAddFriend = async (userId) => {
    try {
      await AuthService.sendFriendRequest(userId);
      alert('Friend request sent!');
      setFriendRequestSent(true);
    } catch (error) {
      console.error('Error sending friend request:', error.message);
      if (error.message === 'Friend request already sent or received.') {
        alert('Friend request already sent or received.');
      } else {
        alert(`Failed to send friend request: ${error.message}`);
      }
    }
  };

  const handleCloseProfileModal = () => {
    setShowProfileModal(false);
    setSelectedUser(null);
    setIsFriend(false);
    setFriendRequestSent(false);
    setFriendRequestReceived(false);
  };

  return (
    <>
      <li className="nav-item">
        <button onClick={() => setShowSearchModal(true)} className="nav-link py-3 px-2 link-light" title="Search" data-bs-toggle="tooltip" data-bs-placement="right">
          <i className="bi bi-search fs-1"></i>
        </button>
      </li>
      {showSearchModal && (
        <div className="modal show d-block" tabIndex="-1" role="dialog">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Search Users</h5>
                <button type="button" className="btn-close" aria-label="Close" onClick={() => setShowSearchModal(false)}></button>
              </div>
              <div className="modal-body">
                <form onSubmit={handleSearch}>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                  />
                  <button type="submit" className="btn btn-primary mt-2">Search</button>
                </form>
                <ul className="list-group mt-3">
                  {searchResults.map(user => (
                    <li 
                      key={user.id} 
                      className="list-group-item"
                      onClick={() => handleUserClick(user)}
                      style={{ cursor: 'pointer' }}
                    >
                      {user.display_name}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
      <Modal show={showProfileModal} onHide={handleCloseProfileModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>{selectedUser?.display_name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="d-flex flex-column align-items-center">
            {selectedUser?.profile_picture_url ? (
              <img
                src={`${API_URL}${selectedUser.profile_picture_url}`}
                alt="Profile"
                className="img-fluid img-thumbnail mb-3 profile-picture"
              />
            ) : (
              <div className="img-placeholder img-fluid img-thumbnail mb-3 profile-picture" />
            )}
            {currentUser && selectedUser?.id !== currentUser.user.id && !isFriend && !friendRequestSent && !friendRequestReceived && (
              <Button
                variant="outline-dark"
                className="mb-3"
                onClick={() => handleAddFriend(selectedUser.id)}
              >
                <i className="bi bi-person-plus-fill"></i> Add Friend
              </Button>
            )}
            {friendRequestReceived && (
              <p className="text-warning">Friend request received. Please respond in notifications.</p>
            )}
            <div className="text-center">
              <p className="font-italic mb-1">{selectedUser?.location}</p>
              <div className="p-3 bg-body-tertiary">
                <p className="font-italic mb-1">{selectedUser?.bio}</p>
                <p className="font-italic mb-1">{selectedUser?.university}</p>
                {selectedUser?.github && (
                  <a href={selectedUser.github} className="btn btn-primary me-2">GitHub</a>
                )}
                {selectedUser?.linkedin && (
                  <a href={selectedUser.linkedin} className="btn btn-primary">LinkedIn</a>
                )}
              </div>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default SearchButton;
