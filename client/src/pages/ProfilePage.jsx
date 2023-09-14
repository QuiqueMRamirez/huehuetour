import { useContext, useState, useEffect } from "react";
import { UserContext } from "../UserContext";
import { Link, Navigate, useParams } from "react-router-dom";
import axios from "axios";
import PlacesPage from "./PlacesPage";
import AccountNavigation from "../AccountNavigation";
import PlaceImg from "../PlaceImg";
import BookingDates from "../BookingDate";

export default function ProfilePage() {
  const { user, ready, setUser } = useContext(UserContext);
  const [redirect, setRedirect] = useState(null);
  const [totalEarnings, setTotalEarnings] = useState(0);
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    axios
      .get("/bookingsByOwnUser")
      .then((response) => {
        setBookings(response.data);
        const total = response.data.reduce((t, { price }) => t + price, 0);
        setTotalEarnings(total);
      })
      .catch((error) => console.log(error));
  }, []);

  let { subpage } = useParams();
  if (subpage === undefined) {
    subpage = "profile";
  }

  async function logout() {
    await axios.post("/logout");
    setRedirect("/");
    setUser(null);
  }

  if (!ready) {
    return "Loading...";
  }

  if (ready && !user && !redirect) {
    return <Navigate to={"/login"} />;
  }

  if (redirect) {
    return <Navigate to={redirect} />;
  }

  function linkClasses(type = null) {
    let classes = "inline-flex gap-1 py-2 px-6 rounded-full";
    if (type === subpage) {
      classes += " bg-primary text-white";
    } else {
      classes += " bg-gray-200";
    }
    return classes;
  }

  return (
    <div>
      <AccountNavigation />
      <div>
        {bookings?.length > 0 &&
          bookings.map((booking) => (
            <div
              className="flex gap-4 bg-gray-200 rounded-2xl overflow-hidden mt-4"
              key={booking._id}
            >
              <div className="w-80">
                <PlaceImg place={booking.place} />
              </div>
              <div className="py-3 pr-3 grow">
                <h2 className="text-xl">{booking.place.title}</h2>
                <div className="text-xl">
                  <div className="mb-1">Usuario: {booking.name}</div>
                  <div className="mb-1">
                    Teléfono de la reserva: {booking.phone}
                  </div>
                  <BookingDates
                    booking={booking}
                    className="mb-2 mt-4 text-gray-500"
                  />
                  <div className="flex gap-1">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-8 h-8"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z"
                      />
                    </svg>
                    <span className="text-2xl">Total: Q{booking.price}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        {totalEarnings === 0 ? (
          <div className="mt-8 mb-8 text-2xl text-center text-gray-500">
            Aún no tienes reservas de tus hospedajes, prueba a promocionar más
            tu hospedaje con tus amigos y familia.
          </div>
        ) : (
          <div className="text-end mt-4">
            <span className="inline-flex gap-1 bg-primary text-white py-2 px-6 rounded-lg">
              Total ganancias: Q. {totalEarnings}
            </span>
          </div>
        )}
      </div>
      {subpage === "profile" && (
        <div className="text-center max-w-lg mx-auto">
          Logged in as {user.name} {user.email}
          <br />
          <button className="primary max-w-sm mt-2" onClick={logout}>
            Logout
          </button>
        </div>
      )}
      {subpage === "places" && <PlacesPage />}
    </div>
  );
}
