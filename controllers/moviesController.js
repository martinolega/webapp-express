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

        if (movieResult === 0) {
            return res.status(404).json({ message: "Movie not found" });
        }
        const movie = movieResult[0];

        const reviewsQuery = `
        SELECT *
        FROM reviews
        WHERE movie_id = ?
        `;
        connection.query(reviewsQuery, [id], (err, reviewsResult) => {
            if (err) return next(err);

            return res.json({
                movie: movie,
                reviews: reviewsResult
            });
        });
    });
}

export default { index, show };