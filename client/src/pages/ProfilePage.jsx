import { useContext, useState } from "react"
import { UserContext } from "../UserContext"
import { Link, Navigate, useParams } from "react-router-dom"
import axios from 'axios'
import PlacesPage from "./PlacesPage"
import AccountNavigation from "../AccountNavigation"

export default function ProfilePage() {
    const { user, ready, setUser } = useContext(UserContext)
    const [redirect, setRedirect] = useState(null)

    let { subpage } = useParams()
    if (subpage === undefined) {
        subpage = 'profile'
    }

    async function logout() {
        await axios.post('/logout')
        setRedirect('/')
        setUser(null)
    }

    if (!ready) {
        return 'Loading...'
    }

    if (ready && !user && !redirect) {
        return <Navigate to={'/login'} />
    }


    

    if (redirect) {
        return <Navigate to={redirect} />
    }

    function linkClasses(type = null) {
        let classes = 'inline-flex gap-1 py-2 px-6 rounded-full';
        if (type === subpage) {
            classes += ' bg-primary text-white';
        } else {
            classes += ' bg-gray-200';
        }
        return classes;
    }
    
    return (
        <div>
            
        <AccountNavigation/>
            {subpage === 'profile' && (
                <div className="text-center max-w-lg mx-auto">
                    Logged in as {user.name} {user.email}<br />
                    <button className="primary max-w-sm mt-2" onClick={logout}>Logout</button>
                </div>
            )}
            {subpage === "places" && (
                <PlacesPage />
            )}
        </div>
    )
}