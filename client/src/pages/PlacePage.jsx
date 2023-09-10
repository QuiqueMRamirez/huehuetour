import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import AddressLink from "../AddressLink";
import PlaceGallery from "../PlaceGallery";
import BookingWidget from "../BookingWidget";
import Slider from '../Slider'
import TestimonialCards from '../TestimonialCards'
import ReviewDialog from "../ReviewDialog";

const testimonials = [
  {
    "author": "Jayme Petracci",
    "title": "This is awesome!",
    "content": "Lorem ipsum ...",
    "imgSrc": "https://randomuser.me/api/portraits/men/46.jpg"
  },
  {
    "author": "Liuka Kivell",
    "title": "The best tutorial!",
    "content": "Lorem ipsum ...",
    "imgSrc": "https://randomuser.me/api/portraits/men/48.jpg"
  },
  {
    "author": "Chrysler Grinikhinov",
    "title": "Revenue increased by 50%",
    "content": "Lorem ipsum ...",
    "imgSrc": "https://randomuser.me/api/portraits/men/49.jpg"
  },
  {
    "author": "Kessiah Cornbell",
    "title": "Lorem ipsum",
    "content": "Lorem ipsum ...",
    "imgSrc": "https://randomuser.me/api/portraits/men/50.jpg"
  },
  {
    "author": "Wash Pont",
    "title": "The best overall service",
    "content": "Lorem ipsum ...",
    "imgSrc": "https://randomuser.me/api/portraits/men/51.jpg"
  }
]
export default function PlacePage() {
  const { id } = useParams();
  const [place, setPlace] = useState(null);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    if (!id) {
      return;
    }
    axios.get("/places/" + id).then((response) => {
      setPlace(response.data.placeById);
      setReviews(response.data.reviews)
    }).catch((error) => {
      console.log(error)
      //mostrar algun alert con el error
    });
  }, [id]);

  if (!place) return "";

  return (
    <div className="mt-4 bg-gray-100 -mx-8 px-8 pt-8">
      <h1 className="text-3xl">{place.title}</h1>
      <AddressLink>{place.address}</AddressLink>
      <PlaceGallery place={place} />
      <div className="mt-8 mb-8 grid gap-8 grid-cols-1 md:grid-cols-[2fr_1fr]">
        <div>
          <div className="my-4">
            <h2 className="font-semibold text-2xl">Descripción</h2>
            {place.description}
          </div>
          Check-in: {place.checkIn} hrs.
          <br />
          Check-out: {place.checkOut} hrs.
          <br />
          Número máximo de huéspedes: {place.maxGuests}
          <div className="mt-4">
            <h2 className="font-semibold text-2xl">Qué ofrecemos</h2>
            <div className="flex grid-rows-1 gap-1">
            {place.perks?.length > 0 &&
              place.perks.map((element) => (
                <div  key={element}>
                  {element === "wifi" ? (
                    <>
                      <label className="p-2 flex gap-2 items-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="w-6 h-"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M8.288 15.038a5.25 5.25 0 017.424 0M5.106 11.856c3.807-3.808 9.98-3.808 13.788 0M1.924 8.674c5.565-5.565 14.587-5.565 20.152 0M12.53 18.22l-.53.53-.53-.53a.75.75 0 011.06 0z"
                          />
                        </svg>
                        <span>{element}</span>
                      </label>
                    </>
                  ) : element === "parking" ? (
                    <>
                      <label className="p-2 flex gap-2 items-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="w-6 h-6"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12"
                          />
                        </svg>
                        <span>{element}</span>
                      </label>
                    </>
                  ) : element === "tv" ? (
                    <>
                      <label className="p-2 flex gap-2 items-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="w-6 h-6"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M6 20.25h12m-7.5-3v3m3-3v3m-10.125-3h17.25c.621 0 1.125-.504 1.125-1.125V4.875c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125z"
                          />
                        </svg>
                        <span>{element}</span>
                      </label>
                    </>
                  ) : element === 'pets' ? (<>
                    <label className="p-2 flex gap-2 items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.182 15.182a4.5 4.5 0 01-6.364 0M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75zm-.375 0h.008v.015h-.008V9.75zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75zm-.375 0h.008v.015h-.008V9.75z" />
                      </svg>
                      <span>{element}</span>
                    </label>
                  </>) : null}
                  <br />
                </div>
              ))}
              </div>
              <div>
          <h2 className="font-semibold text-2xl">Información Extra</h2>
        </div>
        <div className="mb-4 mt-2 text-sm text-gray-700 leading-5">
          {place.extraInfo}
        </div>
          </div>
        </div>
        <div>
          <BookingWidget place={place} />
        </div>
      </div>
      <div className="bg-white -mx-8 px-8 py-8 border-t">
      <div>
          <h2 className="font-semibold text-2xl">Qué dicen las personas acerca de este hospedaje</h2>
        </div>
        <div className="w-9/12 content-center">
          <Slider options={{ align: "center" }}>
            {reviews && reviews.length > 0 && reviews.map((review, i) => (
              <div key={i} className="flex-[0_0_90%] md:flex-[0_0_50%]">
                <TestimonialCards {...review} />
              </div>
            ))}
          </Slider>
        </div>
        <div>
          <ReviewDialog/>
        </div>
      </div>
    </div>
  );
}
