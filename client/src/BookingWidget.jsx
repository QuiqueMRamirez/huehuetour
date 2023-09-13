import { useContext, useEffect, useState } from "react";
import { addDays, differenceInCalendarDays, subDays } from "date-fns";
import axios from "axios";
import { Navigate, Link } from "react-router-dom";
import { UserContext } from "./UserContext.jsx";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function BookingWidget({ place, disabledDates }) {
  const [checkIn, setCheckIn] = useState(new Date());
  const [checkOut, setCheckOut] = useState(new Date());
  const [numberOfGuests, setNumberOfGuests] = useState(1);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [redirect, setRedirect] = useState("");
  const { user } = useContext(UserContext);


  useEffect(() => {
    if (user) {
      setName(user.name);
    }
  }, [user]);

  let numberOfNights = 0;
  if (checkIn && checkOut) {
    numberOfNights = differenceInCalendarDays(
      new Date(checkOut),
      new Date(checkIn)
    );
  }

  async function bookThisPlace() {
    const response = await axios.post("/bookings", {
      checkIn,
      checkOut,
      numberOfGuests,
      name,
      phone,
      place: place._id,
      price: numberOfNights * place.price,
    });
    const bookingId = response.data._id;
    setRedirect(`/account/bookings/${bookingId}`);
  }

  if (redirect) {
    return <Navigate to={redirect} />;
  }

  return (
    <div className="bg-white shadow p-4 rounded-2xl">
      <div className="text-2xl text-center">
        Precio: Q{place.price} / por noche
      </div>
      <div className="border rounded-2xl mt-4">
        <div className="flex">
          <div className="py-3 px-4">
            <label>Check in:</label>
            <DatePicker
                selected={checkIn}
                onChange={(date) => setCheckIn(date)}
                excludeDateIntervals={disabledDates}
              />
          </div>
          <div className="py-3 px-4 border-l">
            <label>Check out:</label>
            <DatePicker
              selected={checkOut}
              onChange={(date) => setCheckOut(date)}
              excludeDateIntervals={disabledDates}
            />
          </div>
        </div>
        <div className="py-3 px-4 border-t">
          <label>Número de huéspedes:</label>
          <input
            type="number"
            max={place.maxGuests}
            min={1}
            value={numberOfGuests}
            onChange={(ev) => setNumberOfGuests(ev.target.value)}
          />
        </div>
        {numberOfNights > 0 && (
          <div className="py-3 px-4 border-t">
            <label>Tu nombre completo:</label>
            <input
              type="text"
              value={name}
              disabled
              onChange={(ev) => setName(ev.target.value)}
            />
            <label>Número telefónico:</label>
            <input
              type="tel"
              value={phone}
              onChange={(ev) => setPhone(ev.target.value)}
            />
          </div>
        )}
      </div>
      {user ? (
        <button onClick={bookThisPlace} className="primary mt-4">
          Reserva este lugar
          {numberOfNights > 0 && <span> Q{numberOfNights * place.price}</span>}
        </button>
      ) : (
        <div className="text-center py-2 text-gray-500">
          <Link to={"/login"} className="underline text-black">
            Inicia sesión
          </Link>{" "}
          para reservar este lugar
        </div>
      )}
    </div>
  );
}
