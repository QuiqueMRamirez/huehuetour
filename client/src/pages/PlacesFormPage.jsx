import React, { useState, useEffect } from "react";
import Perks from "../Perks";
import PhotosUploader from "../PhotosUploader";
import axios from "axios";
import AccountNavigation from "../AccountNavigation";
import { Navigate, useParams } from "react-router-dom";
import RadioPlaceType from "../RadioPlaceType";

const PlacesFormPage = () => {
  const { id } = useParams();
  const [title, setTitle] = useState("");
  const [address, setAddress] = useState("");
  const [addedPhotos, setAddedPhotos] = useState([]);
  const [description, setDescription] = useState("");
  const [perks, setPerks] = useState([]);
  const [extraInfo, setExtraInfo] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [maxGuests, setMaxGuests] = useState(1);
  const [placeType, setPlaceType] = useState("");
  const [redirect, setRedirect] = useState(false);
  const [price, setPrice] = useState(0);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!id) {
      return;
    }
    axios.get(`/places/${id}`).then((response) => {
      const { placeById } = response.data;
      setTitle(placeById.title);
      setAddress(placeById.address);
      setAddedPhotos(placeById.photos);
      setDescription(placeById.description);
      setPlaceType(placeById.placeType);
      setPerks(placeById.perks);
      setExtraInfo(placeById.extraInfo);
      setCheckIn(placeById.checkIn);
      setCheckOut(placeById.checkOut);
      setMaxGuests(placeById.maxGuests);
      setPrice(placeById.price);
    });
  }, [id]);

  function preInput(header, description) {
    return (
      <>
        {inputHeader(header)}
        {inputDescription(description)}
      </>
    );
  }

  async function savePlace(ev) {
    if (addedPhotos && addedPhotos.length >= 3) {
      const placeData = {
        title,
        address,
        addedPhotos,
        description,
        placeType,
        perks,
        extraInfo,
        checkIn,
        checkOut,
        maxGuests,
        price,
      };
      ev.preventDefault();
      if (id) {
        const updateData = { id, ...placeData };
        await axios.put("/places", updateData);
        setRedirect(true);
      } else {
        await axios.post("/places", placeData);
        setRedirect(true);
      }
    } else {
      setError(true);
    }
  }

  function inputHeader(text) {
    return <h2 className="text-xl mt-4">{text}</h2>;
  }

  function inputDescription(text) {
    return <p className="text-gray-500 text-sm">{text}</p>;
  }

  if (redirect) {
    return <Navigate to={"/account/places"} />;
  }
  return (
    <div>
      <AccountNavigation />
      {preInput("Título", "Ingrese un título para su lugar")}
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="titulo, por ejemplo: Mi casa"
      ></input>
      {preInput("Dirección", "Dirección del lugar")}
      <input
        type="text"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        placeholder="Dirección exacta del establecimiento/atracción"
      ></input>
      {preInput("Fotos", "Entre más fotos mejor")}
      <PhotosUploader addedPhotos={addedPhotos} onChange={setAddedPhotos} />
      {error ? (
        <div
          className="flex p-4 mb-4 mt-4 text-sm text-red-800 rounded-lg bg-red-50 dark:text-red-400"
          role="alert"
        >
          <svg
            className="flex-shrink-0 inline w-4 h-4 mr-3 mt-[2px]"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
          </svg>
          <span className="sr-only">Danger</span>
          <div>
            <span className="font-medium">
              Debes cargar al menos 3 fotos para poder registrar tu lugar.
            </span>
          </div>
        </div>
      ) : null}
      {preInput("Descripción", "Descripción del lugar")}
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      {!id ? (
        <>
          {preInput(
            "Tipo de establecimiento",
            "¿Qué tipo de establecimiento quieres registrar?"
          )}
          <div className="mt-2">
            <RadioPlaceType onChange={setPlaceType} />
          </div>
        </>
      ) : null}
      {placeType === "H" || placeType === "C" ? (
        <>
          {preInput("Beneficios", "Seleccione todos los beneficios del lugar")}
          <div className="grid mt-2 gap-2 grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
            <Perks selected={perks} onChange={setPerks} />
          </div>
        </>
      ) : null}
      {preInput("Información extra", "Indique información extra del lugar")}
      <textarea
        value={extraInfo}
        onChange={(e) => setExtraInfo(e.target.value)}
      />
      {placeType === "H" || placeType === "C" ? (
        <>
          {preInput("Check in, check out y capacidad máxima de huéspedes")}
          <div className="grid gap-2 grid-cols-2 md:grid-cols-4">
            <div>
              <h3 className="mt-2 -mb-1">Check in</h3>
              <input
                type="text"
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
                placeholder="hora de llegada"
              />
            </div>
            <div>
              <h3 className="mt-2 -mb-1">Check out</h3>
              <input
                type="text"
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
                placeholder="hora de salida"
              />
            </div>
            <div>
              <h3 className="mt-2 -mb-1">Capacidad de huéspedes</h3>
              <input
                type="number"
                min={1}
                value={maxGuests}
                onChange={(e) => setMaxGuests(e.target.value)}
                placeholder="huespedes maximo"
              />
            </div>
            <div>
              <h3 className="mt-2 -mb-1">Precio por noche</h3>
              <input
                type="number"
                min={1}
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="huespedes maximo"
              />
            </div>
          </div>
        </>
      ) : null}
      <div>
        <button className="primary my-4" onClick={savePlace}>
          Guardar
        </button>
      </div>
    </div>
  );
};

export default PlacesFormPage;
