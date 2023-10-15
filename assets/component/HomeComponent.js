import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AddStudentModal from './AddStudentModal';
import { Table, Button } from 'react-bootstrap';
import Switch from 'react-switch';

const HomeComponent = () => {
    const professors = ['Melanie', 'Lola', 'Justine'];
    const [selectedProfessor, setSelectedProfessor] = useState('');
    const [courses, setCourses] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState([]);
    const [eleves, setEleves] = useState([]);
    const [presences, setPresences] = useState([]);

    const [selectedDate, setSelectedDate] = useState('');

    const [date, setDate] = useState([]);

    const [isModalOpen, setIsModalOpen] = useState(false);
    
    const [isFetchingInscription, setIsFetchingInscription] = useState(false);
    const toggleModal = () => {
        setIsModalOpen(!isModalOpen);
    };

    useEffect(() => {
        if (isModalOpen == false && selectedCourse != null && eleves.length == 0) {
            handleCourseChange(selectedCourse)
        }
        if (date.length == 0) {
            handleDateChange()
        }
        
        if(selectedDate != ''  && !isFetchingInscription){
            setIsFetchingInscription(true);
            fetchInscription()
        }

    }, [selectedDate,presences, selectedCourse, isModalOpen, date,isFetchingInscription]);

    const clear = () => {
        setEleves([]);
        setPresences([]);
        setSelectedDate('')
    }

    const fetchCours = (professor) => {
        clear();
        axios.post('/api/cours', { prof: professor })
            .then((response) => {
                if (response.data != "Aucun cours trouvé pour ce professeur.") {
                    setCourses(response.data);
                    setSelectedProfessor(professor);
                } else {
                    setCourses([]);
                    setSelectedProfessor(professor);
                }
            })
    }

    const handleCourseChange = (event) => {
        if (selectedCourse == null) {
            setSelectedCourse(event.target.value);
        }
    };

    const handleDateChange = (event) => {
        axios.get('/api/date')
            .then((response) => {
                setDate(response.data);
            })
    };

    const fetchInscription = () => {
        axios.post('/api/inscription/cours', { cours: selectedCourse })
            .then((response) => {
                setEleves(response.data);
                fetchPresence();
            })
    }

    const handleChangeSelectedDate = (event) => {
        const newSelectedDate = event.target.value;
        setIsFetchingInscription(false);
        setSelectedDate(newSelectedDate);
    }

    const handlePresence = (isChecked, eleveId) => {
        axios.post('/api/presence/create', { eleve: eleveId, cours: selectedCourse, status: isChecked, date: selectedDate })
            .then((response) => {
                fetchPresence();
                if (response.data == 'absent') {
                    presences.splice(value => value == eleveId)
                    fetchPresence();
                }
            })
    };

    const fetchPresence = () => {
        setPresences([]);
        console.log('fetchPresence'+selectedDate)
        axios.post('/api/presence', { cours: selectedCourse, date: selectedDate })
            .then((response) => {
                const newIds = response.data.map((data) => data.eleve.id);
                setPresences((prevPresences) => [...prevPresences, ...newIds]);
            })
    };

    return (
        <div className='home' style={{
            backgroundImage: `url("/images/amea.webp")`
        }}>
            <div className='container'>
                <h2><img src='/images/logo.png' alt='logo-amea' /></h2>
                <div className="container d-flex justify-content-center align-items-center">
                    {professors.map((professor, index) => (
                        <div
                            key={index}
                            className={`col-xl-2 col-sm-2 ${selectedProfessor === professor ? 'selected' : ''}`}
                            onClick={() => fetchCours(professor)}
                        >
                            <div className="bg-white rounded shadow-sm p-1 d-flex flex-column justify-content-center align-items-center">
                                <img src="https://bootstrapious.com/i/snippets/sn-team/teacher-1.jpg" alt="" width="100" className="img-fluid rounded-circle mb-3 img-thumbnail shadow-sm" />
                                <h5 className="mb-0">{professor}</h5>
                                <span className="small text-uppercase text-muted">Yoga- Dance</span>
                                {selectedProfessor === professor && (
                                    <span>
                                        {courses.length > 0 ? (
                                            <select value={selectedCourse} onChange={e => setSelectedCourse(e.target.value)} multiple={false}>
                                                <option value="">Sélectionnez un cours</option>
                                                {courses.map((course, index) => (
                                                    <option key={index} value={course.id}>
                                                        {course.name}
                                                    </option>
                                                ))}
                                            </select>
                                        ) : (
                                            <div>Aucun cours disponible</div>
                                        )}
                                    </span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                <div>
                    <h2 className='text-center m-2'>Cours {selectedProfessor !== null ? 'de ' + selectedProfessor : 'du prof non selectionné'}</h2>
                </div>
                <div className='d-flex justify-content-start align-items-center'>
                    <h2>Date d'enregistrement des presence:</h2>
                    <select value={selectedDate} onChange={handleChangeSelectedDate}>
                        <option value="">Sélectionnez une date</option>
                        {date !== 0 &&
                            date.map((data, index) => {
                                const dateObj = new Date(data.date);
                                const formattedDate = `${dateObj.getDate()}/${dateObj.getMonth() + 1}/${dateObj.getFullYear()}`;

                                return (
                                    <option key={index} value={data.id}>
                                        {formattedDate}
                                    </option>
                                );
                            })}
                    </select>
                </div>
                <div>
                    <Table className='container' striped bordered>
                        <thead>
                            <tr>
                                <th className='text-center'>
                                    Élèves inscrits
                                    <button className='m-2'><i className="fa fa-plus"
                                        onClick={toggleModal}
                                        aria-hidden="true">
                                    </i></button>
                                    
                                </th>
                            </tr>
                        </thead>
                        {Array.isArray(eleves) && eleves.length > 0 && (
                            <tbody>
                            {eleves.map((eleve, index) => (
                                <tr key={index}>
                                    <td className='d-flex justify-content-between align-items-center'>
                                        <span>{eleve.eleve.name} {' '} {eleve.eleve.firstname}</span>
                                        <span style={{ float: 'right' }}>
                                            <span>
                                                <label>{presences.find(value => value == eleve.eleve.id) ? 'Présent' : 'Absent'}</label>
                                                <Switch
                                                    onChange={(checked) => handlePresence(checked, eleve.eleve.id)}
                                                    checked={presences.find(value => value == eleve.eleve.id) ? true : false}
                                                    onColor="#007bff" // Couleur lorsque le switch est activé
                                                    offColor="#ccc"    // Couleur lorsque le switch est désactivé
                                                />
                                            </span>
                                        </span>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        )}
                    </Table>
                </div>
                <AddStudentModal
                    isOpen={isModalOpen}
                    onClose={toggleModal}
                    coursId={selectedCourse}
                    dateId={selectedDate}
                    fetchInscription={fetchInscription}
                />
            </div>
        </div>
    );
};

export default HomeComponent;