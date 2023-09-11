import { useContext, useEffect, useState } from "react";
import { addDays, differenceInCalendarDays, subDays } from "date-fns";
import axios from "axios";
import { Navigate, Link } from "react-router-dom";
import { UserContext } from "./UserContext.jsx";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";



export default function BookingWidget({ place }) {
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [numberOfGuests, setNumberOfGuests] = useState(1);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [startDate, setStartDate] = useState(new Date());
  const [redirect, setRedirect] = useState("");
  const { user } = useContext(UserContext);

  const events = [
    {
        "start": "2023-10-07T15:30:00+05:00",
        "end": "2023-10-07T16:30:00+05:00"
    },
    {
        "start": "2023-10-11T16:00:00+05:00",
        "end": "2023-10-20T20:00:00+05:00"
    }
  ];
  
  const disabledDateRanges = events.map(range => ({
    start: new Date(range.start),
    end: new Date(range.end)
  }));

  useEffect(() => {
    if (user) {
      setName(user.name);
    }
  }, [user]);

  useEffect(() => {
    console.log(disabledDateRanges)
  },[])

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
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              excludeDateIntervals={disabledDateRanges}
            />
            <input
              type="date"
              value={checkIn}
              min={new Date().toISOString().split("T")[0]}
              onChange={(ev) => setCheckIn(ev.target.value)}
            />
          </div>
          <div className="py-3 px-4 border-l">
            <label>Check out:</label>
            <input
              type="date"
              value={checkOut}
              onChange={(ev) => setCheckOut(ev.target.value)}
              min={new Date().toISOString().split("T")[0]}
            />
          </div>
        </div>
        <div className="py-3 px-4 border-t">
          <label>Número de huéspedes:</label>
          <input
            type="number"
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
