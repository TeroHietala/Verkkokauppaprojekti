import axios from "axios";
import React from "react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function Discount({ url, discount, addToCart }) {
    const [discounts, setDiscounts] = useState([]);

    useEffect(() => {
        if (discount !== null) {
            const discountti = url + "products/getdiscount.php/";

            axios.get(discountti)
                .then((response) => {
                    const json = response.data;
                    setDiscounts(json);
                }).catch(error => {
                    if (error.response === undefined) {
                        alert(error);
                    } else {
                        alert(error.response.data.error);
                    }
                })
        }
    }, [discount, url])

    return (
        <div className="container">
            <h3>Tarjous tuotteet</h3>
            {discounts.map(discount => (
                <div key={discount.id}>
                    <Link
                        to={{
                            pathname: '/inc/Tuote',
                            state: {
                                id: discount.id,
                                name: discount.name,
                                price: discount.price,
                                image: discount.image
                            }
                        }}
                    >
                        <p>{discount.name}</p>
                        <img src={url + 'images/' + discount.image} alt={discount.name} className="pikkukuva" />
                    </Link>
                    <p>{discount.price} €</p>
                    <button className="btn btn-primary" type="button" onClick={e => addToCart(discount)}>Lisää ostoskoriin</button>
                </div>
            ))}
        </div>
    );
}