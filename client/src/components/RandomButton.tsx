import { useState } from "react";
import { apiFetch } from "../api"
import type { Movie } from "../types/movie";
import "../styles/RandomButton.css"


type RandomButtonProps = {
    readonly onMovieGet?: (movie: Movie) => void;
}

export default function RandomButton({onMovieGet} : RandomButtonProps) {
    const [buttonName, setButtonName] = useState("Want a random movie?");
    const getRandom = async () => {
        try {
            setButtonName("Generating...")
            const movieData = await apiFetch("/movies/random");
            // pass hook to user (use movie data outside)
            onMovieGet?.(movieData);
            setButtonName("Generated!")
        } catch (err: unknown) {
            console.log(err instanceof Error ? err.message : "Something went wrong with RandomButton.");
            setButtonName("Want a random movie?")
        }
    }

    return (
        <button type="button" onClick={getRandom} className="cursor-pointer text-sm" id="random-button">
            {buttonName}
        </button>
    )
}