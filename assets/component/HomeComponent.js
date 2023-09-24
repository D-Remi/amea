import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AddStudentModal from './AddStudentModal';

const HomeComponent = () => {
    const professors = ['Melanie', 'Lola', 'Justine'];
    const [selectedProfessor, setSelectedProfessor] = useState(null);
    const [courses, setCourses] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [eleves, setEleves] = useState([]);
    const [presences, setPresences] = useState([]);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const toggleModal = () => {
        setIsModalOpen(!isModalOpen);
    };

    useEffect(() => {
        if(isModalOpen == false && selectedCourse != null) {
            handleCourseChange(selectedCourse)

        }
        console.log(presences);
    }, [presences,selectedCourse,isModalOpen]);

    const fetchCours = (professor) => {

        axios.post('/api/cours', { prof: professor })
            .then((response) => {
                setCourses(response.data);
                setSelectedProfessor(professor);
            })
    }

    const handleCourseChange = (event) => {
        
        if(selectedCourse == null){
            setSelectedCourse(event.target.value);
        }
        axios.post('/api/inscription/cours', { cours: selectedCourse })
            .then((response) => {
                setEleves(response.data);
            })
    };

    const handlePresence = (eleveId) => {
        axios.post('/api/presence/create', { eleve: eleveId, cours: selectedCourse })
            .then((response) => {
                fetchPresence();
            })
    };

    const fetchPresence = () => {
        axios.post('/api/presence', { cours: selectedCourse })
            .then((response) => {
                const newIds = response.data.map((data) => data.eleve.id);
                setPresences((prevPresences) => [...prevPresences, ...newIds]);
            })
    };

    return (
        <div className='home' style={{
            backgroundImage: `url("/images/amea.webp")`
        }}>
            <div className='container m-2 p-2'>
                <h2><img src='/images/logo.png' alt='logo-amea' /></h2>
                <div className="container d-flex">
                    {professors.map((professor, index) => (
                        <div
                            key={index}
                            className={`col-xl-2 col-sm-2 mb-5 ${selectedProfessor === professor ? 'selected' : ''}`}
                            onClick={() => fetchCours(professor)}
                        >
                            <div className="bg-white rounded shadow-sm py-5 px-4">
                                <img src="https://bootstrapious.com/i/snippets/sn-team/teacher-1.jpg" alt="" width="100" className="img-fluid rounded-circle mb-3 img-thumbnail shadow-sm" />
                                <h5 className="mb-0">{professor}</h5>
                                <span className="small text-uppercase text-muted">Yoga- Dance</span>
                            </div>
                        </div>
                    ))}
                </div>

                <div>
                    <h2>Cours {selectedProfessor !== null ? 'de ' + selectedProfessor : 'du prof non selectionné'}</h2>
                    <select value={selectedCourse || ''} onChange={handleCourseChange}>
                        <option value="">Sélectionnez un cours</option>
                        {courses.length === 0 ? (
                            <option value="none">Aucun cours</option>
                        ) : (
                            courses.map((course, index) => (
                                <option key={index} value={course.id}>
                                    {course.name}
                                </option>
                            ))
                        )}
                    </select>
                </div>
                <div>
                    {selectedCourse && (
                    <h2>
                        Élèves inscrits
                        <button onClick={toggleModal}>Ajouter un élève</button>     
                    </h2>    
                    )}            
                    <AddStudentModal
                        isOpen={isModalOpen}
                        onClose={toggleModal}
                        coursId={selectedCourse}
                    />
                    { Array.isArray(eleves) && eleves.length > 0 && (
                        <ul>
                            {eleves.map((eleve, index) => (
                                <li key={index}>
                                    {eleve.eleve.name} {' '} {eleve.eleve.firstname} {eleve.eleve.id}
                                    <span>
                                        <button onClick={() => handlePresence(eleve.eleve.id)}>
                                            {presences.find(value => value == eleve.eleve.id) ? 'Présent' : 'Absent'}
                                        </button>
                                    </span>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </div>
    );
};

export default HomeComponent;