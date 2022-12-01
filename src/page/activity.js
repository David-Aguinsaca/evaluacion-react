
import React, { useEffect, useState } from 'react';

import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Card from 'react-bootstrap/Card';
import axios from 'axios';
import Alert from 'react-bootstrap/Alert';

const Activity = () => {

    let valueInitial = {
        id: 0,
        description: "",
        status: 0,
        id_author: 23,
        finish_at: "2022-06-30T00:00:00.000Z",
        created_at: "2022-06-24T14:30:30.000Z"
    }

    const [formValue, setFormValue] = useState(valueInitial);
    const [countActivity, setCountActivity] = useState(0);

    const [data, setData] = useState([]);
    const [error, setError] = useState(null);

    const [show, setShow] = useState(false);
    const [showDescription, setShowDescription] = useState("");

    const handleChange = (event) => {
        setFormValue({ ...formValue, [event.target.name]: event.target.value });
    }

    let styles = {
        negrita: { fontWeight: 'bold' },
        cursiva: { fontStyle: 'italic' },
        subrayado: { textDecorationLine: 'underline' }
    }

    //mostrar
    useEffect(() => {
        axios
            .get("https://bp-todolist.herokuapp.com/?id_author=" + formValue.id_author)
            .then((response) => {
                console.log(response.data.data);
                setData(response.data.data);
            })
            .catch((error) => setError(error));
    }, []);

    //crear
    const createActivity = () => {

        if (formValue.description === '') {
            setShow(true);
            setShowDescription('No puede estar vacio');
            return;
        } else if (formValue.description.trim() === '') {
            setShowDescription('Debe ingresar un valor en el campo');
            setShow(true);
            return;
        }

        axios.post("https://bp-todolist.herokuapp.com/?id_author=" + formValue.id_author, formValue)
            .then((response) => {
                console.log(response.data);
                setData([...data, response.data.data]);
                setFormValue(valueInitial);
            });

    }

    //eliminar
    const deleteActivity = (event) => {
        event.preventDefault();
        let id = event.target.getAttribute("id");

        axios.delete('https://bp-todolist.herokuapp.com/' + id)
            .then(response => {
                const result = data.filter(data => data.id !== parseInt(id));
                console.log(result);
                setData(result);
            })
            .catch(error => {
                console.error('There was an error!', error);
            });
    }

    //contador de actividad

    const handleCheck = () => {

        setCountActivity([...countActivity, countActivity+1]);

    }


    return (<>
        {
            show ? <Alert variant="danger" onClose={() => setShow(false)} dismissible>
                <Alert.Heading>{showDescription}</Alert.Heading>
            </Alert> : null
        }

        <Card className='m-5'>
            <Card.Header>Lista de actividades</Card.Header>
            <Card.Body>
                <InputGroup className="mb-3">
                    <Form.Control
                        placeholder="Titulo"
                        aria-label="Recipient's username"
                        aria-describedby="basic-addon2"
                        value={formValue.description}
                        name="description"
                        onChange={handleChange}
                    />
                    <Button variant="outline-secondary" id="button-addon2" onClick={createActivity}>
                        Agregar
                    </Button>
                </InputGroup>
                {
                    data.length > 0 ?
                        data.map((item) =>
                            <InputGroup className="mb-3" key={item.id}>
                                <InputGroup.Checkbox
                                    aria-label="Checkbox for following text input"
                                    onChange={handleCheck}
                                />
                                {/* <Form.Text aria-label="Text input with checkbox" style={styles.subrayado} id="passwordHelpBlock" muted>
                                    Your password must be 8-20 characters long,
                                </Form.Text> */}
                                <Form.Control aria-label="Text input with checkbox" disabled value={item.description} />
                                <Button variant="primary" id={item.id} onClick={deleteActivity}>Eliminar</Button>{' '}
                            </InputGroup>
                        ) : <span>La lista se encuentra vacia</span>
                }
            </Card.Body>
            <Card.Footer>

                <span>{countActivity} de {data.length} Actividades Realizadas</span>

            </Card.Footer>
        </Card>
    </>);
}

export default Activity;