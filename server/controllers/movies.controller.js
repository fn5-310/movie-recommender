import { randomInt } from 'node:crypto';

const randRange = 500 // TMDB defined max page limit
const randomUrl = 'https://api.themoviedb.org/3/discover/movie?page=1&vote_average.gte=0';

/**
 * Selects a random page given randRange for the TMDB url
 * @returns A populated url with a random number for the page field
 */
const randomPage = () => {
    return `https://api.themoviedb.org/3/discover/movie?page=${randomInt(1, randRange)}&vote_average.gte=0`
}

const randomResult = (json) => {
    return json.results[randomInt(0,20)];
}

export const getRandomMovie = async (_req, res) => {
    fetch(randomPage(), {
        method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: `Bearer ${process.env.TMDB_ACCESS_TOKEN}`
        }
    })
        .then(apiRes => apiRes.json())
        .then(data => res.json(randomResult(data)))
        .catch(err => res.status(500).json({ message: err.message }))
}