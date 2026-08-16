import { http, HttpResponse } from "msw";

export const handlers = [
  http.get("https://api.themoviedb.org/3/search/movie", () => {
    return HttpResponse.json({
      results: [
        {
          id: 123456,
          title: "TestMovie1",
          release_date: "2000-01-01",
          poster_path: "/7GC0TEOQ1ljAhtvcwdthAbb5D3h.jpg",
          overview: "Test Movie Overview.",
          genre_ids: [1, 2, 3],
          vote_average: 7,
        },
      ],
      page: 1,
      total_pages: 1,
      total_results: 1,
    });
  }),

  http.get("https://api.themoviedb.org/3/movie/:id", ({ params, request }) => {
    const { id } = params;
    return HttpResponse.json({
      id: Number(id),
      title: "Final Destination Bloodlines",
      overview:
        "Plagued by a violent recurring nightmare, college student Stefanie heads home to track down the one person who might be able to break the cycle and save her family from the grisly demise that inevitably awaits them all.",
      poster_path: "/final-destination-bloodlines.jpg",
      release_date: "2025-05-14",
      runtime: 110,
      vote_average: 7.0,
      genres: [
        { id: 27, name: "Horror" },
        { id: 9648, name: "Mystery" },
      ],
      credits: {
        cast: [
          {
            id: 1001,
            name: "Kaitlyn Santa Juana",
            character: "Stefani Reyes",
            profile_path: "/kaitlyn-santa-juana.jpg",
          },
          {
            id: 1002,
            name: "Teo Briones",
            character: "Charlie Reyes",
            profile_path: "/teo-briones.jpg",
          },
          {
            id: 1003,
            name: "Rya Kihlstedt",
            character: "Darlene Campbell",
            profile_path: "/rya-kihlstedt.jpg",
          },
          {
            id: 1004,
            name: "Richard Harmon",
            character: "Erik",
            profile_path: "/richard-harmon.jpg",
          },
          {
            id: 1005,
            name: "Owen Patrick Joyner",
            character: "Bobby",
            profile_path: "/owen-patrick-joyner.jpg",
          },
        ],
      },
    });
  }),
];
