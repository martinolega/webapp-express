import connection from "../database/databaseConnections.js";

function index(req, res, next) {
    const indexQuery = "SELECT * FROM `movies`";

    connection.query(indexQuery, (err, result) => {
        if (err) return next(err);
        return res.json({
            results: result,
        });
    });
}

function show(req, res, next) {
    const id = req.params.id;

    const movieQuery = `
    SELECT *
    FROM movies
    WHERE id = ?
    `;
    connection.query(movieQuery, [id], (err, movieResult) => {
        if (err) return next(err);

        if (movieResult.length === 0) {
            return res.status(404).json({ message: "Movie not found", status: 404 });
        }
        const movie = movieResult[0];

        const reviewsQuery = `
        SELECT *
        FROM reviews
        WHERE movie_id = ?
        `;
        connection.query(reviewsQuery, [id], (err, reviewsResult) => {
            if (err) return next(err);

            return res.status(200).json({
                movie: movie,
                reviews: reviewsResult
            });
        });
    });
}

function postReview(req, res, next) {
    const id = req.params.id;
    const { vote, text, name } = req.body;

    console.log("Review created");

    if (vote === undefined || text === undefined || name === undefined) {
        return res.status(400).json({ message: "Bad request. Fields undefined", status: "400" });
    }

    if (!text || text.trim() === "" || !name || name.trim() === "") {
        return res.status(400).json({ message: "Bad request. Fields empty", status: "400" });
    }

    const parsedVote = parseInt(vote);
    //console.log(parsedVote);
    if (parsedVote < 1 || parsedVote > 5 || !Number.isInteger(parsedVote)) {
        return res.status(400).json({ message: "The vote has to be an integer between 1 and 5", status: "400" })
    }

    const showQuery = `
    SELECT *
    FROM movies
    WHERE id = ?
    `;

    connection.query(showQuery, [id], (err, shownMovie) => {
        if (err) return next(err);

        //console.log(shownMovie);

        if (shownMovie.length === 0) {
            return res.status(404).json({ message: "The movie you want to write a review about doesn't exist", status: 404 });
        }


        const createReviewQuery = `
        INSERT INTO reviews (movie_id, vote, text, name)
        VALUES (?, ?, ?, ?)
        `;

        connection.query(createReviewQuery, [id, parsedVote, text, name], (err2, result) => {
            if (err2) return next(err2);

            return res.status(201).json({ message: "Review created", id: result.insertId })
        })
    });
}

export default { index, show, postReview };