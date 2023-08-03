import React, { useState, useContext } from 'react';
import { Form, Button, Alert, Container } from 'react-bootstrap';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from './AuthProvider';
import api from '../api';

const LoginPage = () => {
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const { login } = useContext(AuthContext);

    const validationSchema = Yup.object({
        name: Yup.string().required('Name is required'),
        password: Yup.string().required('Password is required').min(8, 'Password must be at least 8 characters'),
    });

    const formik = useFormik({
        initialValues: {
            name: '',
            password: '',
        },
        validationSchema,
        onSubmit: (values) => {
            api.post('/users/login', values)
                .then((response) => {
                    console.log('Login successful!', response.data);
                    console.log('Token:', response.data.token);
                    login(response.data.token);
                    setError(null);
                    navigate('/');
                })
                .catch((error) => {
                    console.error('Login failed!', error);
                    setError('Invalid name or password. Please try again.' + (error.response?.data?.message || ''));
                });
        },
    });

    return (
        <Container>
            <div>
                <h1>Login</h1>
                {error && <Alert variant="danger" className='mb-3'>{error}</Alert>}
                <Form onSubmit={formik.handleSubmit}>
                    <Form.Group controlId="name" className='mb-3'>
                        <Form.Label>Name</Form.Label>
                        <Form.Control
                            type="text"
                            name="name"
                            placeholder="Enter your name"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.name}
                            isInvalid={formik.touched.name && formik.errors.name}
                        />
                        <Form.Control.Feedback type="invalid">{formik.errors.name}</Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group controlId="password" className='mb-3'>
                        <Form.Label>Password</Form.Label>
                        <Form.Control
                            type="password"
                            name="password"
                            placeholder="Enter your password"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.password}
                            isInvalid={formik.touched.password && formik.errors.password}
                        />
                        <Form.Control.Feedback type="invalid">{formik.errors.password}</Form.Control.Feedback>
                    </Form.Group>

                    <Button type="submit">Login</Button>
                </Form>
            </div>
        </Container>
    );
};

export default LoginPage;
