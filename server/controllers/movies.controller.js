
const randRange = 500
const randomUrl = 'https://api.themoviedb.org/3/discover/movie?page=1&vote_average.gte=0';

/**
 * 
 * @param {int} min The minimum returned integer
 * @param {int} max The maximum returned integer
 * @returns A random value between min and max
 */
const randInt = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

/**
 * Selects a random page given randRange for the TMDB url
 * @returns A populated url with a random number for the page field
 */
const randomPage = () => {
    return `https://api.themoviedb.org/3/discover/movie?page=${randInt(1, randRange)}&vote_average.gte=0`
}

const randomResult = (json) => {
    return json.results[randInt(0,20)];
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