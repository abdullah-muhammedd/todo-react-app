import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faFaceDizzy } from "@fortawesome/free-solid-svg-icons"
import { Link } from "react-router-dom"

export default function ErrorPage({ message }) {
    return (<>
        <div className="flex justify-center items-center h-screen">
            <div className="flex flex-col items-center justify-center text-center">
                <FontAwesomeIcon icon={faFaceDizzy} className="text-9xl text-yellow-400 my-10" />
                <h1 className="text-4xl">{message}</h1>
                <button className="form-button my-5"><Link to={-1}>Go Back</Link></button>
            </div>
        </div>

    </>)
}