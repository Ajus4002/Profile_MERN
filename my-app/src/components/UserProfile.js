import React, { useContext, useState } from 'react';
import { Card, Button, Modal, Container } from 'react-bootstrap';
import { AuthContext } from './AuthProvider';
import { useNavigate } from 'react-router-dom';
import api, { BASE_URL } from '../api';

const UserProfile = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteError, setDeleteError] = useState(null);

    const handleUpdateProfile = () => {
        navigate('/update-profile');
    };

    const handleDeleteAccount = () => {
        api.delete('/users/profile')
            .then((response) => {
                console.log('Account deleted successfully!', response.data);
                setShowDeleteModal(false);
                logout();
                navigate('/login');
            })
            .catch((error) => {
                console.error('Account deletion failed!', error);
                setDeleteError('Failed to delete account. Please try again.' + (error.response?.data?.message || ''));
            });
    };

    return (
        <Container>
            <div>
                <h1>User Profile</h1>
                <Card>
                    <div className="card-image">
                        <Card.Img variant="top" src={BASE_URL + '/' + user.image} />
                    </div>
                    <Card.Body>
                        <div className="user-details">
                            <Card.Title className="user-name">{user.name}</Card.Title>
                            <Card.Text className="user-address">{user.address}</Card.Text>
                        </div>
                        <div className="user-actions">
                            <Button variant="primary" onClick={handleUpdateProfile}>Update Profile</Button>
                            <Button variant="danger" onClick={() => setShowDeleteModal(true)}>Delete Account</Button>
                        </div>
                    </Card.Body>
                </Card>

                <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
                    <Modal.Header closeButton>
                        <Modal.Title>Confirm Account Deletion</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {deleteError && <p className="text-danger">{deleteError}</p>}
                        <p>Are you sure you want to delete your account?</p>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>Cancel</Button>
                        <Button variant="danger" onClick={handleDeleteAccount}>Delete</Button>
                    </Modal.Footer>
                </Modal>
            </div>
        </Container>
    );
};

export default UserProfile;
