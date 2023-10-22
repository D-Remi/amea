import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AddStudentModal from './AddStudentModal';
import { Table, Button, Row, Col, Container } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import Switch from 'react-switch';
import Select from 'react-select';

const HomeComponent = () => {
    const professors = ['Mel', 'Lola', 'Justine'];
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

    // constante du select ajout un eleve a un cours
    const [isClearable, setIsClearable] = useState(true);
    const [isSearchable, setIsSearchable] = useState(true);
    const [isDisabled, setIsDisabled] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const defaultOption = { value: '', label: 'Ajouter un eleves existant au cours' };
    const [allEleves, setAllEleves] = useState({});
    const [AddEleveInCours, setAddEleveInCours] = useState('');

    const fetchAllEleves = () => {
        axios.get('/api/all/eleves')
            .then((response) => {
                const formattedEleves = response.data.map(eleve => ({
                    value: eleve.id,
                    label: eleve.firstname + ' ' + eleve.name
                }));
                setAllEleves(formattedEleves);
            })
            .catch((e) => {
                console.log(e)
            })
    };

    const addEleves = () => {
        axios.post('/api/add/eleve', { cours: selectedCourse, eleve: AddEleveInCours, date: selectedDate })
            .then((response) => {
                fetchInscription()
            })
    }

    const readyTobeAdded = (e) => {
        setAddEleveInCours(e.value)
    }

    useEffect(() => {

        if (isModalOpen == false && selectedCourse != null && eleves.length == 0) {
            handleCourseChange(selectedCourse)
        }
        if (date.length == 0) {
            handleDateChange()
            fetchAllEleves()
        }

        if (selectedDate != '' && !isFetchingInscription) {
            setIsFetchingInscription(true);
            fetchInscription()
        }

    }, [selectedDate, presences, selectedCourse, isModalOpen, date, isFetchingInscription, allEleves]);

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
                const data = response.data.sort((a, b) => a.eleve.firstname.localeCompare(b.eleve.firstname));
                setEleves(data);
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
        axios.post('/api/presence', { cours: selectedCourse, date: selectedDate })
            .then((response) => {
                const newIds = response.data.map((data) => data.eleve.id);
                setPresences((prevPresences) => [...prevPresences, ...newIds]);
            })
    };

    return (
        <div className="home" style={{ backgroundImage: `url("/images/amea.webp")` }}>
            <div className="container">
                <h2 className="h2center h2 text-center"><img src="/images/logo.png" alt="logo-amea" /></h2>
                <div className="container d-flex justify-content-center align-items-center">
                    {professors.map((professor, index) => (
                        <div
                            key={index}
                            className={`col-xl-3 col-sm-4 ${selectedProfessor === professor ? 'selected' : ''}`}
                            onClick={() => fetchCours(professor)}
                        >
                            <div className="bg-white rounded shadow-sm p-1 d-flex flex-column justify-content-center align-items-center">
                                <img src="https://bootstrapious.com/i/snippets/sn-team/teacher-1.jpg" alt="" width="100" className="img-fluid rounded-circle mb-3 img-thumbnail shadow-sm h2" />
                                <h1 className="h1 mb-0">{professor}</h1>
                                <span className="h2">Yoga- Dance</span>
                                {selectedProfessor === professor && (
                                    <div>
                                        {courses.length > 0 ? (
                                            <Form.Control as="select" className="h2" style={{ fontSize: '1.5em' }} value={selectedCourse} onChange={e => setSelectedCourse(e.target.value)}>
                                                <option className="h2" value="">Sélectionnez un cours</option>
                                                {courses.map((course, index) => (
                                                    <option className="h2" key={index} value={course.id}>
                                                        {course.name}
                                                    </option>
                                                ))}
                                            </Form.Control>
                                        ) : (
                                            <div>Aucun cours disponible</div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                <div>
                    <h2 className="text-center m-2">Cours {selectedProfessor !== null ? 'de ' + selectedProfessor : 'du prof non sélectionné'}</h2>
                </div>
                <div className="d-flex justify-content-start align-items-center">
                    <h2>Date:</h2>
                    <Form.Control className="h2" style={{ fontSize: '1.5em' }} as="select" value={selectedDate} onChange={handleChangeSelectedDate}>
                        <option className="h2" value="">Sélectionnez une date</option>
                        {date !== 0 &&
                            date.map((data, index) => {
                                const dateObj = new Date(data.date);
                                const formattedDate = `${dateObj.getDate()}/${dateObj.getMonth() + 1}/${dateObj.getFullYear()}`;

                                return (
                                    <option className="h2" key={index} value={data.id}>
                                        {formattedDate}
                                    </option>
                                );
                            })}
                    </Form.Control>
                </div>
                <div className='m-2'>
                    <Table className="container" striped bordered responsive>
                        <thead>
                            <tr>
                                <th className="text-center h2">
                                    Nouvelle élève
                                    <Button className="m-2" onClick={toggleModal}>
                                        <i className="fa fa-plus" aria-hidden="true"></i>
                                    </Button>
                                </th>
                            </tr>
                        </thead>
                        {Array.isArray(eleves) && eleves.length > 0 && (
                            <tbody>
                                <tr>
                                    <td className='d-flex justify-content-start align-items-center h1 p-1 m-0' style={{ width: '100%' }}>
                                        <Select
                                            style={{ width: '100%' }}
                                            className="basic-single"
                                            classNamePrefix="select"
                                            defaultValue={defaultOption}
                                            isDisabled={isDisabled}
                                            isLoading={isLoading}
                                            isClearable={isClearable}
                                            isSearchable={isSearchable}
                                            name="add-eleve"
                                            options={allEleves}
                                            onChange={readyTobeAdded}
                                        />
                                        <Button variant="success" className="m-2" onClick={addEleves}>
                                            <i className="fa fa-plus" aria-hidden="true"></i>
                                        </Button>
                                    </td>
                                </tr>
                                {eleves.map((eleve, index) => (
                                    <tr key={index}>
                                        <td className="d-flex justify-content-between align-items-center p-1">
                                            <span className='h3' style={{ display: 'block' }}>{eleve.eleve.firstname} {' '} {eleve.eleve.name}</span>
                                            <span className='ml-3' style={{ float: "right", display: 'block' }}>
                                                {/* <Switch
                                                        width={56}
                                                        onChange={(checked) => handlePresence(checked, eleve.eleve.id)}
                                                        checked={presences.find(value => value == eleve.eleve.id) ? true : false}
                                                        onColor="#007bff"
                                                        offColor="#ccc"
                                                    /> */}
                                                {/* <Form>
                                                        <Form.Check
                                                            type="switch"
                                                            className='h2'
                                                            id={`custom-switch-${index}`}
                                                            onChange={(checked) => handlePresence(checked, eleve.eleve.id)}
                                                            checked={presences.find(value => value == eleve.eleve.id) ? true : false}
                                                        />
                                                    </Form> */}
                                                <input
                                                    type="checkbox"
                                                    id={`custom-switch-${index}`}
                                                    onChange={(event) => handlePresence(event.target.checked, eleve.eleve.id)}
                                                    checked={presences.find(value => value == eleve.eleve.id) ? true : false}
                                                /><label htmlFor={`custom-switch-${index}`}>Toggle</label>
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