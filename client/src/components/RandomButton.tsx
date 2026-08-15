import { useState } from "react"
import { apiFetch } from "../api"
import type { Movie } from "../types/movie";


export default function RandomButton() {
    const [data, setData] = useState<Movie | null>(null);
    const getRandom = async () => {
        try {
            const movieData = await apiFetch("/movies/random");
            setData(movieData)
        } catch (err: unknown) {
            console.log(JSON.stringify(err));
            setData(null)
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