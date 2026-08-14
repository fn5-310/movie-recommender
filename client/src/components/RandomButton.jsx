import { useState } from "react"
import { apiFetch } from "../api"


export default function RandomButton() {
    const [data, setData] = useState(null);
    const getRandom = async () => {
        try {
            const movieData = await apiFetch("/movies/random");
            setData(movieData)
        } catch (err) {
            setData(JSON.stringify(err))
        }
    }

    return (
        <>
            <button type="button" onClick={getRandom}>
                Get Random
            </button>
            <p>
                {data ? JSON.stringify(data) : "content"}
            </p>
        </>
        
    )
}