import { useParams, Navigate } from "react-router-dom";
import { useEffect, useState,useContext } from "react";
import axios from "axios";
import AddressLink from "../AddressLink";
import { UserContext } from "../UserContext";
import PlaceGallery from "../PlaceGallery";
import BookingDates from "../BookingDate";

export default function BookingPage() {
  const { id } = useParams();
  const { user } = useContext(UserContext);
  const [booking, setBooking] = useState(null);
  const [redirect, setRedirect] = useState(false)
  useEffect(() => {
    if (id) {
      axios.get("/bookings").then((response) => {
        const foundBooking = response.data.find(({ _id }) => _id === id);
        if (foundBooking) {
          setBooking(foundBooking);
        }
      });
    }
  }, [id]);

  function cancelBooking(){
    axios.delete(`/bookings/${id}`).then((response) => {
      setRedirect(true)
    }).catch((error) => {
      console.log(error)
    })
  }

  if (!booking) {
    return "";
  }

  if(redirect){
    return <Navigate to={'/account/bookings'}/>
  }

  return (
    <div className="my-8">
      <h1 className="text-3xl">{booking.place.title}</h1>
      <div className="flex items-center justify-between">
        <AddressLink className="my-2 block">
          {booking.place.address}
        </AddressLink>
        <button className="w-1/12 inline-flex gap-1 py-2 px-6 rounded-full bg-red-500 text-white" onClick={cancelBooking}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
            />
          </svg>
          Cancelar
        </button>
      </div>
      <div className="bg-gray-200 p-6 my-6 rounded-2xl flex items-center justify-between">
        <div>
          <h2 className="text-2xl mb-4">Tu información de reserva:</h2>
          <BookingDates booking={booking} />
        </div>
        <div className="bg-primary p-6 text-white rounded-2xl">
          <div>Total</div>
          <div className="text-3xl">Q{booking.price}</div>
        </div>
      </div>
      <PlaceGallery place={booking.place} />
    </div>
  );
}
