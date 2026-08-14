
const randRange = 1000
const randomUrl = 'https://api.themoviedb.org/3/discover/movie?page=1&vote_average.gte=0';

const options = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: `Bearer ${process.env.TMDB_ACCESS_TOKEN}`
  }
};

/**
 * Selects a random page given randRange for the TMDB url
 * @returns A populated url with a random number for the page field
 */
const randomPage = () => {
    console.log(process.env.TMDB_ACCESS_TOKEN)
    const page = Math.floor(Math.random() * randRange + 1)
    const newUrl = randomUrl.replace('page=1', `page=${page}`)
    return newUrl
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
        .then(data => res.json(data))
        .catch(err => res.status(500).json({ message: err.message }))
}