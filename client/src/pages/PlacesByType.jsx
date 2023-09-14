import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useParams } from "react-router-dom";

export default function PlacesByType() {
  const [places, setPlaces] = useState([]);
  const { id } = useParams()
  useEffect(() => {
    axios.get(`/placesByFilter/${id}`).then((response) => {
      setPlaces(response.data);
    });
  }, [id]);

  return (
    <div className="mt-8 grid gap-x-6 gap-y-8 grid-cols-2 md:grid-cols-3 lg:grid-cols-3">
      {places.length > 0 &&
        places.map((place) => (
          <Link to={`/place/${place._id}`} key={place._id}>
            {place.photos?.[0] && (
              <div className="bg-gray-500 rounded-2xl flex">
                <img
                  className="rounded-2xl object-cover aspect-square"
                  src={"http://localhost:8000/uploads/" + place.photos?.[0]}
                  alt=""
                />
              </div>
            )}
            <h2 className="font-bold">{place.address}</h2>
            <h3 className="text-sm text-gray-500">{place.title}</h3>
            <div className="mt-1">
              {place.placeType === "H" ? (
                <>
                  <span className="font-bold">Q{place.price}</span> por noche
                </>
              ) : (
                <>Gratis</>
              )}
            </div>
          </Link>
        ))}
    </div>
  );
}