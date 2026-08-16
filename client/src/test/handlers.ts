import { http, HttpResponse } from 'msw';

export const handlers = [
  http.get("https://api.themoviedb.org/3/search/movie", () => {
    return HttpResponse.json({
      results: [
        {
          id: 123456,
          title: "TestMovie1",
          release_date: "2000-01-01",
          poster_path: "/7GC0TEOQ1ljAhtvcwdthAbb5D3h.jpg",
          overview: "This is an overview for a test movie.",
          genre_ids: [1, 2, 3],
          vote_average: 7,
        },
      ],
      page: 1,
      total_pages: 1,
      total_results: 1,
    });
  }),

  http.get("https://api.themoviedb.org/3/discover/movie", () => {
    return HttpResponse.json({
      results: [
        {
          id: 654321,
          title: "TestDiscoverMovie",
          release_date: "2015-06-01",
          poster_path: "/abc123.jpg",
          overview: "A discovered test movie.",
          genre_ids: [28],
          vote_average: 8.2,
        },
      ],
      page: 1,
      total_pages: 1,
      total_results: 1,
    });
  }),

  http.get("https://api.themoviedb.org/3/search/person", () => {
    return HttpResponse.json({
      results: [
        {
          id: 999,
          name: "Test Actor",
          profile_path: "/actor.jpg",
          known_for_department: "Acting",
          popularity: 15.5,
        },
        {
          id: 998,
          name: "Test Actor Two",
          profile_path: null,
          known_for_department: "Acting",
          popularity: 5.2,
        },
      ],
      page: 1,
      total_pages: 1,
      total_results: 2,
    });
  }),
];