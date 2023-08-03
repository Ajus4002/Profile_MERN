import React, { useEffect, useState, useContext } from 'react';
import { Form, Button, Alert, Container } from 'react-bootstrap';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from './AuthProvider';
import api from '../api';

const UpdateProfile = () => {
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const { refreshUser } = useContext(AuthContext);

    useEffect(() => {
        api.get('/users/profile')
            .then((response) => {
                formik.setFieldValue('name', response.data.name);
                formik.setFieldValue('address', response.data.address);
            })
            .catch((error) => {
                console.error('Profile fetch failed!', error);
                setError('Failed to fetch profile. Please try again.' + (error.response?.data?.message || ''));
            });
    }, []);

    const validationSchema = Yup.object({
        name: Yup.string().optional(),
        password: Yup.string().required('Password is required').matches(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\da-zA-Z]).{8,15}$/,
            'Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and One Special Case Character'
        ),
        image: Yup.mixed().optional().notRequired(),
        address: Yup.string().optional(),
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

            if (!values.image) {
                formData.delete('image');
            }

            api.put('/users/profile', formData)
                .then((response) => {
                    console.log('Profile update successful!', response.data);
                    setError(null);
                    refreshUser();
                    navigate('/');
                })
                .catch((error) => {
                    console.error('Profile update failed!', error);
                    setError('Failed to update profile. Please try again.' + (error.response?.data?.message || ''));
                });
        },
    });

    return (
        <Container>
            <div>
                <h1>Update Profile</h1>
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

                    <Form.Group controlId="image" className='mb-3'>
                        <Form.Label>Image</Form.Label>
                        <Form.Control
                            type="file"
                            name="image"
                            onChange={(event) => formik.setFieldValue('image', event.currentTarget.files[0])}
                            isInvalid={formik.touched.image && formik.errors.image}
                        />
                        <Form.Control.Feedback type="invalid">{formik.errors.image}</Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group controlId="address" className='mb-3'>
                        <Form.Label>Address</Form.Label>
                        <Form.Control
                            as="textarea"
                            name="address"
                            placeholder="Enter your address"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.address}
                            isInvalid={formik.touched.address && formik.errors.address}
                        />
                        <Form.Control.Feedback type="invalid">{formik.errors.address}</Form.Control.Feedback>
                    </Form.Group>

                    <Button type="submit">Update</Button>

                </Form>
            </div>
        </Container>
    );
};

export default UpdateProfile;
const validationSchema = Yup.object({
    name: Yup.string().optional(),
    password: Yup.string()
        .optional()
        .matches(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/,
            'Password must contain 1 lowercase, 1 uppercase, 1 number, and be at least 8 characters long'
        ),
    image: Yup.mixed().notRequired(),
    address: Yup.string().optional(),
});
