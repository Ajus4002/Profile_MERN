import React, { useState } from 'react';
import { Form, Button, Container, Alert } from 'react-bootstrap';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import api from '../api';

const RegistrationForm = () => {
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const validationSchema = Yup.object({
        name: Yup.string().required('Name is required'),
        password: Yup.string().required('Password is required').matches(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\da-zA-Z]).{8,15}$/,
            'Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and One Special Case Character'
        ),
        image: Yup.mixed().required('Image is required'),
        address: Yup.string().required('Address is required'),
    });

    const formik = useFormik({
        initialValues: {
            name: '',
            password: '',
            image: null,
            address: '',
        },
        validationSchema,
        onSubmit: (values) => {
            const formData = new FormData();
            formData.append('name', values.name);
            formData.append('password', values.password);
            formData.append('image', values.image);
            formData.append('address', values.address);

            api.post('users/register', formData)
                .then((response) => {
                    console.log('Registration successful!', response.data);
                    setError(null); // Clear any previous error
                    navigate('/login');
                })
                .catch((error) => {
                    console.error('Registration failed!', error);
                    setError('Registration failed. Please try again. ' + (error.response?.data?.error || ''));
                });
        },
    });

    return (
        <Container>
            <Form onSubmit={formik.handleSubmit}>
                <h1>Register</h1>
                {error && <Alert variant="danger" className="mb-3">{error}</Alert>}
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

                <Form.Group controlId="image" className='mb-3'>
                    <Form.Label>Image</Form.Label>
                    <Form.Control
                        type="file"
                        name="image"
                        onChange={(event) => formik.setFieldValue('image', event.target.files[0])}
                        onBlur={formik.handleBlur}
                        isInvalid={formik.touched.image && formik.errors.image}
                    />
                    <Form.Control.Feedback type="invalid">{formik.errors.image}</Form.Control.Feedback>
                </Form.Group>

                <Form.Group controlId="address" className='mb-3'>
                    <Form.Label>Address</Form.Label>
                    <Form.Control
                        as="textarea"
                        rows={3}
                        name="address"
                        placeholder="Enter your address"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.address}
                        isInvalid={formik.touched.address && formik.errors.address}
                    />
                    <Form.Control.Feedback type="invalid">{formik.errors.address}</Form.Control.Feedback>
                </Form.Group>

                <Button type="submit">Register</Button>
            </Form>
        </Container>
    );
};

export default RegistrationForm;
