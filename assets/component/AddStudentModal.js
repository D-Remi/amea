import React, { useState } from 'react';
import axios from 'axios';
import { Modal, Button, Form } from 'react-bootstrap';

const AddStudentModal = ({ isOpen, onClose, coursId }) => {
    const [studentData, setStudentData] = useState({
        name: '',
        firstname: '',
        email: '',
        number: ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.post('/api/eleve/create', { eleve: studentData, cours: coursId })
            .then((response) => {
                if(response.data == 'ok'){
                    onClose();
                }
            })
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setStudentData({
            ...studentData,
            [name]: value
        });
    };

    return (
        <Modal show={isOpen} onHide={onClose}>
            <Modal.Header closeButton>
                <Modal.Title>Ajouter un élève</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit}>
                    <Form.Group controlId="studentName">
                        <Form.Label>Nom de l'élève</Form.Label>
                        <Form.Control
                            type="text"
                            name="name"
                            placeholder="Entrez le nom de l'élève"
                            value={studentData.name}
                            onChange={handleInputChange}
                        />
                    </Form.Group>
                    <Form.Group controlId="studentFirstName">
                        <Form.Label>Prénom de l'élève</Form.Label>
                        <Form.Control
                            type="text"
                            name="firstname"
                            placeholder="Entrez le prénom de l'élève"
                            value={studentData.firstname}
                            onChange={handleInputChange}
                        />
                    </Form.Group>
                    <Form.Group controlId="studentEmail">
                        <Form.Label>E-mail de l'élève</Form.Label>
                        <Form.Control
                            type="email"
                            name="email"
                            placeholder="Entrez l'e-mail de l'élève"
                            value={studentData.email}
                            onChange={handleInputChange}
                        />
                    </Form.Group>
                    <Form.Group controlId="studentNumber">
                        <Form.Label>Numéro de l'élève</Form.Label>
                        <Form.Control
                            type="text"
                            name="number"
                            placeholder="Entrez le numéro de l'élève"
                            value={studentData.number}
                            onChange={handleInputChange}
                        />
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onClose}>
                    Fermer
                </Button>
                <Button variant="primary" onClick={handleSubmit}>
                    Ajouter
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default AddStudentModal;