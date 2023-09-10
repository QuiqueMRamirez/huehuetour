import React, { useState, useEffect } from 'react'
import Perks from "../Perks";
import PhotosUploader from "../PhotosUploader";
import axios from 'axios'
import AccountNavigation from '../AccountNavigation';
import { Navigate, useParams } from "react-router-dom"

const PlacesFormPage = () => {
    const { id } = useParams()
    const [title, setTitle] = useState('')
    const [address, setAddress] = useState('')
    const [addedPhotos, setAddedPhotos] = useState([])
    const [description, setDescription] = useState('')
    const [perks, setPerks] = useState([])
    const [extraInfo, setExtraInfo] = useState('')
    const [checkIn, setCheckIn] = useState('')
    const [checkOut, setCheckOut] = useState('')
    const [maxGuests, setMaxGuests] = useState(1)
    const [redirect, setRedirect] = useState(false)
    const [price, setPrice] = useState(100)

    useEffect(() => {
        if (!id) {
            return;
        }
        axios.get(`/places/${id}`).then((response) => {
            const { data } = response;
            setTitle(data.title)
            setAddress(data.address)
            setAddedPhotos(data.photos)
            setDescription(data.description)
            setPerks(data.perks)
            setExtraInfo(data.extraInfo)
            setCheckIn(data.checkIn)
            setCheckOut(data.checkOut)
            setMaxGuests(data.maxGuests)
            setPrice(data.price)
        })
    }, [id])

    function preInput(header, description) {
        return (
            <>
                {inputHeader(header)}
                {inputDescription(description)}
            </>
        )
    }

    async function savePlace(ev) {
        
        const placeData = { title, address, addedPhotos, description, perks, extraInfo, checkIn, checkOut, maxGuests, price }
        ev.preventDefault();
        if (id) {
            const updateData = { id, ...placeData }
            await axios.put('/places', updateData)
            setRedirect(true)
        } else {
            await axios.post('/places', placeData)
            setRedirect(true)
        }

    }

    function inputHeader(text) {
        return (
            <h2 className="text-xl mt-4">{text}</h2>
        )
    }

    function inputDescription(text) {
        return (
            <p className="text-gray-500 text-sm">{text}</p>
        )
    }

    if (redirect) {
        return <Navigate to={'/account/places'} />
    }
    return (
        <div>
            <AccountNavigation />
            <form onSubmit={savePlace}>
                {preInput('Título', 'Ingrese un título para su hogar')}
                <input type='text' value={title} onChange={e => setTitle(e.target.value)} placeholder="titulo, por ejemplo: mi apartamento"></input>
                {preInput('Dirección', 'Dirección del lugar')}
                <input type='text' value={address} onChange={e => setAddress(e.target.value)} placeholder="dirección"></input>
                {preInput('Fotos', 'Entre más fotos mucho mejor')}
                <PhotosUploader addedPhotos={addedPhotos} onChange={setAddedPhotos} />
                {preInput('Descripción', 'Descripción del lugar')}
                <textarea value={description} onChange={e => setDescription(e.target.value)} />
                {preInput('Beneficios', 'Seleccione todos los beneficios del lugar')}
                <div className="grid mt-2 gap-2 grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
                    <Perks selected={perks} onChange={setPerks} />
                </div>
                {preInput('Información extra', 'Indique información extra del lugar')}
                <textarea value={extraInfo} onChange={e => setExtraInfo(e.target.value)} />
                {preInput('Check in, check out y capacidad máxima de huéspedes')}
                <div className="grid gap-2 grid-cols-2 md:grid-cols-4">
                    <div>
                        <h3 className="mt-2 -mb-1">Check in</h3>
                        <input type="text" value={checkIn} onChange={e => setCheckIn(e.target.value)} placeholder="hora de llegada" />
                    </div>
                    <div>
                        <h3 className="mt-2 -mb-1">Check out</h3>
                        <input type="text" value={checkOut} onChange={e => setCheckOut(e.target.value)} placeholder="hora de salida" />
                    </div>
                    <div>
                        <h3 className="mt-2 -mb-1">Capacidad de huéspedes</h3>
                        <input type="number" value={maxGuests} onChange={e => setMaxGuests(e.target.value)} placeholder="huespedes maximo" />
                    </div>
                    <div>
                        <h3 className="mt-2 -mb-1">Precio por noche</h3>
                        <input type="number" value={price} onChange={e => setPrice(e.target.value)} placeholder="huespedes maximo" />
                    </div>
                </div>
                <div>
                    <button className="primary my-4">
                        Guardar
                    </button>
                </div>
            </form>
        </div>
    )
}

export default PlacesFormPage