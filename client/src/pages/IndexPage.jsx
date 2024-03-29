import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export default function IndexPage() {
  const [places, setPlaces] = useState([]);
  useEffect(() => {
    axios.get("/places").then((response) => {
      setPlaces(response.data);
    });
  }, []);

  return (
    <div className="mt-8 grid gap-x-6 gap-y-8 grid-cols-2 md:grid-cols-3 lg:grid-cols-3">
      {places.length > 0 &&
        places.map((place) => (
          <Link to={`/place/${place._id}`} key={place._id}>
            {place.photos?.[0] && (
              <div className="bg-gray-500 rounded-2xl flex">
                <img
                  className="rounded-2xl object-cover aspect-square min-w-full min-h-full"
                  src={place.photos?.[0]}
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
