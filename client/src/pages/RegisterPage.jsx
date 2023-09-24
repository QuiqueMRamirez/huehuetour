import { Link, Navigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isError, setIsError] = useState(false);
  const [redirect, setRedirect] = useState(false);
  const [profilePhoto, setProfilePhoto] = useState('');

  async function registerUser(e) {
    e.preventDefault();
    try {
      if(profilePhoto !== ''){
        await axios.post("/register", {
          name,
          email,
          photo: profilePhoto,
          password,
        });
        setName("");
        setPassword("");
        setEmail("");
        setProfilePhoto('')
        setIsError(false);
        setRedirect(true);
      } else {
        setIsError(true)
      }
    } catch (err) {
      setIsError(true);
    }
  }
//35.91.241.69
  function uploadPhoto(event) {
    const data = new FormData();
    data.append('photos',event.target.files[0]);
    axios
      .post("/upload", data, {
        hedaers: { "Content-type": "multipart/form-data" },
      })
      .then((response) => setProfilePhoto(response.data[0]))
      .catch((error) => console.log(error));
  }

  if (redirect) {
    return <Navigate to={"/login"} />;
  }

  return (
    <div className="mt-4 grow flex items-center justify-around">
      <div className="mb-64">
        <h1 className="text-4xl text-center mb-4">Registro</h1>
        <form className="max-w-md mx-auto" onSubmit={registerUser}>
          <input
            type="text"
            placeholder={"Nombre"}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="email"
            placeholder={"ejemplo@gmail.com"}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder={"password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <label className="h-18 mb-1 cursor-pointer flex items-center gap-1 justify-center border bg-transparent rounded-2xl p-2 text-2xl text-gray-600">
            <input
              type="file"
              multiple
              className="hidden"
              onChange={uploadPhoto}
            />
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
                d="M9 8.25H7.5a2.25 2.25 0 00-2.25 2.25v9a2.25 2.25 0 002.25 2.25h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25H15m0-3l-3-3m0 0l-3 3m3-3V15"
              />
            </svg>
            Foto de perfil
          </label>
          <button className="primary">Register</button>
          <div className="text-center py-2 text-gray-500">
            Ya tienes cuenta?
            <Link to={"/login"} className="underline text-black">
              {" "}
              Login
            </Link>
          </div>
        </form>
        <div className="mt-4">
          {isError ? (
            <div
              className="flex p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:text-red-400"
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
                  Ocurrió un error al intentar registrar tu usuario. Por favor
                  asegúrate de que <br /> los datos cumplen con las siguientes
                  restricciones:
                </span>
                <ul className="mt-1.5 ml-4 list-disc list-inside">
                  <li>Tu contraseña debe tener al menos 8 caracteres.</li>
                  <li>
                    Tu email debe ser único, no puedes crear dos o más cuentas
                    con el mismo email.
                  </li>
                  <li>
                    La foto de perfil es obligatoria.
                  </li>
                </ul>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
