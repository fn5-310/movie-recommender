import { http, HttpResponse } from 'msw';

export const handlers = [
    // on get to this route, return this json data
    http.get("https://api.themoviedb.org/3/search/movie", () => {
        return HttpResponse.json({
            results: [
                {
                    id:123456,
                    title:"TestMovie1",
                    release_date: "2000-01-01",
                    poster_path:"/7GC0TEOQ1ljAhtvcwdthAbb5D3h.jpg",
                    overview:"This is an overview for a test movie.",
                    genre_ids:[1,2,3],
                    vote_average:7,
                }],
            page: 1,
            total_pages: 1,
            total_results: 1
        });
    }),
];