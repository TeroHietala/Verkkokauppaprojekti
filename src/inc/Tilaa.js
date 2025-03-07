import React from "react";
import { useState, useEffect } from "react";
import uuid from 'react-native-uuid';
import Swal from 'sweetalert2';
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import axios from "axios";

export default function Tilaa({ url, cart }) {

    const [fname, setFname] = useState('');
    const [lname, setLname] = useState('');
    const [mail, setMail] = useState('');
    const [address, setAddress] = useState('');
    const [zip, setZip] = useState('');
    const [city, setCity] = useState('');
    const [phone, setPhone] = useState('');
    const [finished, setFinished] = useState(false);
    const [user, setUser] = useState([])



    function order(e) {
        e.preventDefault();
        fetch(url + 'order/add.php', {
            method: 'POST',
            header: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                first_name: fname,
                last_name: lname,
                address: address,
                mail: mail,
                zip: zip,
                city: city,
                phone: phone,
                cart: cart,
            })
        })
            .then(res => {
                return res.json();
            })
            .then(
                (res) => {
                    setFinished(true);
                }, (error) => {
                    alert(error);
                }
            )
    }
    console.log(user)
    console.log(cart)
    useEffect(() => {
        if ('user' in sessionStorage) {
            setUser(JSON.parse(sessionStorage.getItem('user')))
        }
    }, [])
    // Tilaus kirjautuneena
    function orderLogin(e) {
        e.preventDefault();
        fetch(url + 'order/addLogin.php', {
            method: 'POST',
            header: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                user: user,
                cart: cart,
            })
        })
            .then(res => {
                return res.json();
            })
            .then(
                (res) => {
                    setFinished(true);
                }, (error) => {
                    alert(error);
                }
            )
    }

    function alertClicked() {
        let timerInterval
        Swal.fire({
            title: 'Kiitos tilauksesta !',
            html: 'Tilaustasi käsitellään, tämä ikkuna sammuu automaattisesti <b></b> ',
            timer: 3000,
            timerProgressBar: true,
            didOpen: () => {
                Swal.showLoading()
                const b = Swal.getHtmlContainer().querySelector('b')
                timerInterval = setInterval(() => {
                    b.textContent = Swal.getTimerLeft()
                }, 100)
            },
            willClose: () => {
                clearInterval(timerInterval)
            }
        }).then((result) => {
            if (result.dismiss === Swal.DismissReason.timer) {
                window.location.reload(false);
                localStorage.clear(cart);
            }
        })
    }

    let sum = 0;
    if (finished === false) {
        return (
            <div className="container">
                <div className="row">
                    <h3>Ostoskori</h3>
                    <hr></hr>
                    <div className="container-fluid">
                        <table>
                            <tbody>
                                {cart.map(product => {
                                    sum += parseFloat(product.price * product.amount);
                                    return (
                                        <tr key={uuid.v4()}>
                                            <td style={{ padding: 15 }} className="col-2">{product.name}</td>
                                            <td style={{ padding: 15 }} className="col-8">{product.price * product.amount} €</td>
                                            <td></td>
                                        </tr>

                                    )
                                })}

                                <tr key={uuid.v4()}>
                                    <td style={{ padding: 15 }} >Yhteensä: </td>
                                    <td>{sum.toFixed(2)} €</td>
                                </tr>
                            </tbody>
                        </table>
                        {cart.length > 0 &&
                            <>
                                <hr></hr>
                                <h3 style={{ marginBottom: 15 }}>Ostajan tiedot</h3>
                                <Form onSubmit={order}>
                                    <Button style={{ marginBottom: 15 }} id="btn" type='submit' onClick={orderLogin, alertClicked} >Tilaa Kirjautuneena</Button>
                                    <Form.Group className='mb-3' controlId='fname'>
                                        <Form.Label>Etunimi</Form.Label>
                                        <Form.Control
                                            type='text'
                                            placeholder='Etunimi'
                                            value={fname}
                                            onChange={e => setFname(e.target.value)} />
                                    </Form.Group>
                                    <Form.Group className='mb-3' controlId='lname'>
                                        <Form.Label>Sukunimi</Form.Label>
                                        <Form.Control
                                            type='text'
                                            placeholder='Sukunimi'
                                            value={lname}
                                            onChange={e => setLname(e.target.value)} />
                                    </Form.Group>
                                    <Form.Group className='mb-3' controlId='mail'>
                                        <Form.Label>Sähköposti</Form.Label>
                                        <Form.Control
                                            type='email'
                                            placeholder='mattimalli@esimerkki.fi'
                                            value={mail}
                                            onChange={e => setMail(e.target.value)} />
                                    </Form.Group>
                                    <Form.Group className='mb-3' controlId='address'>
                                        <Form.Label>Osoite</Form.Label>
                                        <Form.Control
                                            type='text'
                                            placeholder='Kadunnimi'
                                            value={address}
                                            onChange={e => setAddress(e.target.value)} />
                                    </Form.Group>
                                    <Form.Group className='mb-3' controlId='zip'>
                                        <Form.Label>Postinumero</Form.Label>
                                        <Form.Control
                                            type='number'
                                            placeholder='Postinro'
                                            value={zip}
                                            onChange={e => setZip(e.target.value)} />
                                    </Form.Group>
                                    <Form.Group className='mb-3' controlId='city'>
                                        <Form.Label>Postitoimipaikka</Form.Label>
                                        <Form.Control
                                            type='text'
                                            placeholder='Postitoimipaikka'
                                            value={city}
                                            onChange={e => setCity(e.target.value)} />
                                    </Form.Group>
                                    <Form.Group className='mb-3' controlId='phone'>
                                        <Form.Label>Puhelinnumero</Form.Label>
                                        <Form.Control
                                            type='number'
                                            placeholder='Puhelinnumero'
                                            value={phone}
                                            onChange={e => setPhone(e.target.value)} />
                                    </Form.Group>
                                    <Button id="btn" type='submit' onClick={alertClicked} >Tilaa</Button>
                                </Form>
                            </>
                        }
                    </div>
                </div>
            </div>
        )
    } else {
        return (<h3 style={{ 'padding-top': '100px' }} className="container"> </h3>);
    }
}