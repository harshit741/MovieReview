const { query } = require("express");
var express = require("express");
var router = express.Router();
var Movie = require("../models/movie");
const Reviews = require("../models/review");
var Review = require("../models/review");

/* GET home page. */
router.get("/", (req, res) => {
  let sortDirection = req?.query?.sort;
  let pageSize = parseInt(req?.query?.size || 5);
  let pageNumber = parseInt(
    req?.query?.pageNumber ? req?.query?.pageNumber : 1
  );
  let sortValue = sortDirection?.toUpperCase() === "ASC" ? 1 : -1;
  Movie.find({})
    .sort({ averageRating: sortValue, _id: 1 })
    .skip((pageNumber - 1) * pageSize)
    .limit(pageSize)
    .then(async (movies) => {
      let totalMoviesCount = await Movie.countDocuments();
      let data = {
        title: "Movie Rating and Reviews",
        layout: "layout",
        movies: movies,
        prevPageNumber: pageNumber === 1 ? null : pageNumber - 1,
        nextPageNumber:
          pageNumber * pageSize >= totalMoviesCount ? null : pageNumber + 1,
      };
      res.render("index", data);
    });
});

router.post("/addmovie", async (req, res, next) => {
  if(!req.body.name){
    err = new Error("Enetr movie name!");
    return next(err)
  }
  let k = await Movie.findOne({ name: req.body.name });
  if (k) {
    err = new Error("Movie already exist.");
    return next(err);
  } else {
    Movie.create(req.body).then(() => {
      res.redirect("/");
    });
  }
});
router.get("/addreview/:name", (req, res) => {
  res.render("movieAddReview", { title: req.params.name, layout: "layout" });
});

router.post("/addreview/:name", async (req, res, next) => {
  if (req.body.author === "") {
    err = new Error("Email required!");
    return next(err);
  } else {
    let k = await Review.findOne({
      author: req.body.author,
      movieName: req.params.name,
    });
    if (k) {
      err = new Error("You can't review again.");
      return next(err);
    } else if(!req.body.rating){
      err = new Error("You must choose a rating.");
      return next(err)
    } {
      let obj = req.body;
      obj.movieName = req.params.name;
      Review.create(obj).then(async () => {
        let _movieName = req.params.name;
        let movie = await Movie.findOne({ name: _movieName });

        console.log({ movie: movie });

        if (movie) {
          movie.totalRating = movie.totalRating++;

          let reviewArray = await Reviews.find({ movieName: _movieName });
          let totalRating = 0;

          if (reviewArray?.length) {
            let averageRating = 0;
            reviewArray.forEach((item) => {
              totalRating += item.rating;
            });

            let totalRatingCount = reviewArray.length;
            averageRating = totalRating / reviewArray.length;

            movie.averageRating = averageRating;
            movie.totalRating = totalRatingCount;

            await movie.save();
          }
        } else {
          err = new Error("Movie does not exist!");
          return next(err);
        }
        res.redirect(`/reviews/${req.params.name}`);
      });
    }
  }
});
router.get("/reviews/:name", async (req, res) => {
  console.log(req.params.name);
  let reviews = await Review.find({ movieName: req.params.name });
  if (reviews) {
    res.render("movieReview", {
      title: req.params.name,
      layout: "layout",
      reviews: reviews,
    });
    console.log(reviews);
  }
});
module.exports = router;
