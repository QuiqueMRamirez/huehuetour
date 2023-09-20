import { useContext, useEffect } from "react";
import { UserContext } from "./UserContext.jsx";

export default function TestimonialCards(props) {
  const { user } = useContext(UserContext);
console.log(props)
  return (
    <div className="py-4 px-8 bg-white shadow-lg rounded-lg my-20 bg-slate-100">
      <div className="flex justify-center md:justify-end -mt-16">
        <img
          alt={props.author ? "" : ""}
          className="w-20 h-20 object-cover rounded-full border-2 border-indigo-500"
          height={80}
          width={80}
          src={
            !props.user?.photo ? "https://picsum.photos/id/28/4928/3264" : props.user.photo
          }
        />
      </div>
      <div>
        <h2 className="text-gray-800 text-3xl font-semibold">{props.title}</h2>
        <p className="mt-2 text-gray-600">{props.content}</p>
      </div>
      <div className="flex justify-end mt-4">{props.user.name}</div>
      <div className="flex justify-end mt-1 text-slate-400">
        Fecha: {new Date(props.datePost).getDate().toString()}-
        {new Date(props.datePost).getMonth().toString()}-
        {new Date(props.datePost).getFullYear().toString()}
      </div>
    </div>
  );
}
