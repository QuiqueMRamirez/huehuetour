const data = [
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

export default function TestimonialCards(props) {
    return (
        <div className="py-4 px-8 bg-white shadow-lg rounded-lg my-20 bg-slate-100">
            <div className="flex justify-center md:justify-end -mt-16">
                <img
                    alt={props.author}
                    className="w-20 h-20 object-cover rounded-full border-2 border-indigo-500"
                    height={80}
                    width={80}
                    src={props.imgSrc}
                />
            </div>
            <div>
                <h2 className="text-gray-800 text-3xl font-semibold">{props.title}</h2>
                <p className="mt-2 text-gray-600">{props.content}</p>
            </div>
            <div className="flex justify-end mt-4">
                hola
            </div>
        </div>
    )
}