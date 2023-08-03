// Navbar.js
import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar, Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { AuthContext } from './AuthProvider';

import { NavDropdown } from 'react-bootstrap';

const NavigationBar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  async function handleLogout() {
    logout();
    navigate('/')
  }

  return (
    <Navbar bg="light" expand="lg" style={{padding: '10px'}}>
      <Navbar.Brand as={Link} to="/">Profile App</Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="ml-auto">
          {!user ? (
            <>
              <Nav.Link as={Link} to="/login">Login</Nav.Link>
              <Nav.Link as={Link} to="/register">Register</Nav.Link>
            </>
          ) : (
            <>
              <Nav.Link as={Link} to="/home">Home</Nav.Link>
              <NavDropdown title={`Welcome, ${user.name}`} id="basic-nav-dropdown">
                <NavDropdown.Item onClick={handleLogout}>Logout</NavDropdown.Item>
              </NavDropdown>
            </>
          )}
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default NavigationBar;
