import { useState } from "react";
import { apiFetch } from "../api"
import type { Movie } from "../types/movie";


type RandomButtonProps = {
    readonly onMovieGet?: (movie: Movie) => void;
}

export default function RandomButton({onMovieGet} : RandomButtonProps) {
    const [buttonName, setButtonName] = useState("Go to Random Movie");
    const getRandom = async () => {
        try {
            setButtonName("Generating...")
            const movieData = await apiFetch("/movies/random");
            // pass hook to user (use movie data outside)
            onMovieGet?.(movieData);
            setButtonName("Generated!")
        } catch (err: unknown) {
            console.log(err instanceof Error ? err.message : "Something went wrong with RandomButton.");
            setButtonName("Go to Random Movie")
        }
    }

    return (
        <button type="button" onClick={getRandom}>
            {buttonName}
        </button>
    )
}