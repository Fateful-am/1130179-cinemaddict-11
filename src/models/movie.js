export default class Movie {
  constructor(data) {
    const filmInfo = data[`film_info`];
    const userDetails = data[`user_details`];

    this.id = data[`id`];
    this.comments = data[`comments`] || [];
    if (this.comments.length > 0) {
      this.comments[0] = {commentId: this.comments[0], text: `loading...`};
    }
    this.country = filmInfo[`release`][`release_country`];
    this.releaseDate = filmInfo[`release`][`date`] ? new Date(filmInfo[`release`][`date`]) : null;
    this.director = filmInfo[`director`];
    this.rating = filmInfo[`total_rating`];
    this.title = filmInfo[`title`];
    this.originTitle = filmInfo[`alternative_title`];
    this.writers = filmInfo[`writers`];
    this.actors = filmInfo[`actors`];
    this.duration = filmInfo[`runtime`];
    this.genres = filmInfo[`genre`];
    this.poster = filmInfo[`poster`];
    this.description = filmInfo[`description`];
    this.age = filmInfo[`age_rating`];

    this.markedAsWatched = Boolean(userDetails[`already_watched`]);
    this.addedToWatchlist = Boolean(userDetails[`watchlist`]);
    this.watchingDate = userDetails[`watching_date`] ? new Date(userDetails[`watching_date`]) : null;
    this.addedToFavorite = Boolean(userDetails[`favorite`]);
  }

  toRAW() {
    let comments = [];
    if (this.comments.length > 0) {
      const {commentId} = this.comments[0];
      comments = commentId ? [].concat(commentId, this.comments.slice(1)) : this.comments.map((it) => it.id);
    }
    const release = {
      "date": this.releaseDate ? this.releaseDate.toISOString() : null,
      "release_country": this.country,
    };
    const filmInfo = {
      "title": this.title,
      "alternative_title": this.originTitle,
      "total_rating": this.rating,
      "poster": this.poster,
      "age_rating": this.age,
      "director": this.director,
      "writers": this.writers,
      "actors": this.actors,
      "release": release,
      "runtime": this.duration,
      "genre": this.genres,
      "description": this.description,
    };
    const userDetails = {
      "watchlist": this.addedToWatchlist,
      "already_watched": this.markedAsWatched,
      "watching_date": this.watchingDate ? this.watchingDate.toISOString() : null,
      "favorite": this.addedToFavorite,
    };
    return {
      "id": this.id,
      "comments": comments,
      "film_info": filmInfo,
      "user_details": userDetails
    };
  }

  static parseMovie(data) {
    return new Movie(data);
  }

  static parseMovies(data) {
    return data.map(Movie.parseMovie);
  }

  static parseComment(data) {
    return {
      id: data[`id`],
      author: data[`author`],
      emoji: data[`emotion`],
      text: data[`comment`],
      date: data[`date`] ? new Date(data[`date`]) : null
    };
  }

  static parseComments(data) {
    return data.map(Movie.parseComment).sort((a, b) => b.date - a.date);
  }

  static clone(data) {
    return new Movie(data.toRAW());
  }
}
