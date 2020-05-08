/** Модель фильма */
export default class Movie {
  /**
   * @constructor
   * @param {Object} data - Объект с сервера с данными фильма
   */
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

  /**
   * Адаптер для преобразования к серверному формату
   * @return {{comments: [], film_info: {actors, alternative_title, age_rating, director,
   * release: {date: (*|null), release_country}, genre, runtime, description, total_rating, writers, title, poster},
   * user_details: {already_watched: boolean, watching_date: (*|null), watchlist: boolean, favorite: boolean}, id}}
   */
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

  /**
   * Парсер карточки фильма с сервера
   * @static
   * @param {Object} data - Объект карточки фильма с сервера
   * @return {Movie} - Модель карточки фильма
   */
  static parseMovie(data) {
    return new Movie(data);
  }

  /**
   * Парсер массива карточек фильмов с сервера
   * @static
   * @param {[Object]} data - Массив объектов карточек с сервера
   * @return {[Movie]} - Массив моделей фильмов
   */
  static parseMovies(data) {
    return data.map(Movie.parseMovie);
  }

  /**
   * Парсер комментария фильма с сервера
   * @static
   * @param {Object} data - Объект комментария фильма с сервера
   * @return {{date: (*|null), emoji: *, author: *, id: *, text: *}} - Объект комментария фильма
   */
  static parseComment(data) {
    return {
      id: data[`id`],
      author: data[`author`],
      emoji: data[`emotion`],
      text: data[`comment`],
      date: data[`date`] ? new Date(data[`date`]) : null
    };
  }

  /**
   * Парсер массива комментариев для фильма
   * @param {[Object]} data - Массив объектов комментариев к фильму с сервера
   * @return {[Object]} - Отсортированный по дате комментария массив объектов комментариев
   */
  static parseComments(data) {
    return data.map(Movie.parseComment).sort((a, b) => a.date - b.date);
  }

  /**
   * Клонирование объекта
   * @param {Object} data - Объект с данными о фильме
   * @return {Movie} - Модель фильма
   */
  static clone(data) {
    return new Movie(data.toRAW());
  }
}
