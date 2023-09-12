import { useState, useContext } from 'react'
import axios from 'axios'
import { Navigate, useParams } from "react-router-dom"
import { UserContext } from "./UserContext.jsx";
import DatePicker from "react-datepicker";

export default function ReviewDialog() {
    const { id } = useParams()
    const [startDate, setStartDate] = useState(new Date());
    const { user } = useContext(UserContext);
    const [showModal, setShowModal] = useState(false);
    const [review, setReview] = useState({
        title: '',
        content: ''
    })

    async function saveUserReview() {
        if (!id) return;

        const reviewData = { title: review.title, content: review.content }
        const response = await axios.post(`/review/${id}`, reviewData)
        if (response.status === 200) {
            <Navigate to={'/account/place/' + id} />
        } else {
            //marcar error
        }
    }
    return (
        <>
            {user ? (<div className="flex items-stretch">
                <button
                    className="primary mt-4" type="button"
                    onClick={() => setShowModal(true)}
                >
                    Comentar
                </button>
                
            </div>) : null}
            {showModal ? (
                <>
                    <div
                        className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"
                    >
                        <div className="relative w-full my-6 mx-auto max-w-3xl">
                            {/*content*/}
                            <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                                {/*header*/}
                                <div className="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
                                    <h3 className="text-3xl font-semibold">
                                        Déjanos tu opinión
                                    </h3>
                                    <button
                                        className="p-1 ml-auto bg-transparent border-0 text-black opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                                        onClick={() => setShowModal(false)}
                                    >
                                        <span className="bg-transparent text-black opacity-5 h-6 w-6 text-2xl block outline-none focus:outline-none">
                                            ×
                                        </span>
                                    </button>
                                </div>
                                {/*body*/}
                                <div className="bg-white">
                                    <div className="py-3 px-4 border-t">
                                        <label>Título:</label>
                                        <input type="text" value={review.title} onChange={(e) => setReview({ ...review, title: e.target.value })} />
                                        <label htmlFor="message" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Tu comentario</label>
                                        <textarea id="message" rows="7" value={review.content} onChange={(e) => setReview({ ...review, content: e.target.value })} className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Deja tu comentario aquí..."></textarea>

                                    </div>
                                </div>
                                {/*footer*/}
                                <div className="flex items-center justify-end p-6 border-t border-solid border-slate-200 rounded-b gap-4">
                                    <div className="w-3/12">
                                        <button
                                            className="secondary mt-4"
                                            type="button"
                                            onClick={() => setShowModal(false)}
                                        >
                                            Cerrar
                                        </button>
                                    </div>
                                    <div className='w-3/12'>
                                        <button
                                            className="primary mt-4" type="button"
                                            onClick={saveUserReview}
                                        >
                                            Enviar
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
                </>
            ) : null}
        </>
    );
}