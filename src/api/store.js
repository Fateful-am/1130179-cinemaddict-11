const ItemsType = {
  MOVIE: `movies`,
  COMMENT: `comments`
};

export default class Store {
  constructor(key, storage) {
    this._storage = storage;
    this._storeKey = key;
  }

  _getItems() {
    try {
      return JSON.parse(this._storage.getItem(this._storeKey)) || {};
    } catch (err) {
      return {};
    }
  }

  getMovieItems() {
    const store = this._getItems();
    return store[ItemsType.MOVIE] || {};
  }

  _getCommentItems() {
    const store = this._getItems();
    return store[ItemsType.COMMENT] || {};
  }

  setMovieItems(movies) {
    const comments = Object.values(movies)
      .reduce((accMovies, currentMovie) => {
        return Object.assign({}, accMovies, {
          [currentMovie.id]: currentMovie.comments
            .reduce((accComments, currentComment) => {
              const storeComments = this.getMovieComments(currentMovie.id);
              return Object.assign({}, accComments, {
                [currentComment]: Object.assign({}, {
                  commentId: currentComment,
                  text: `${currentMovie.comments.length} [Offline...]`
                }, storeComments[currentComment]),
              });
            }, {}),
        });
      }, {});

    const store = this._getItems();
    this._storage.setItem(
        this._storeKey,
        JSON.stringify(
            Object.assign({}, store, {
              [ItemsType.MOVIE]: movies,
              [ItemsType.COMMENT]: comments,
            })
        )
    );
  }

  setMovieItem(key, value) {
    const store = this._getItems();
    const movieItems = Object.assign({}, this.getMovieItems(), {
      [key]: value
    });
    this._storage.setItem(
        this._storeKey,
        JSON.stringify(
            Object.assign({}, store, {
              [ItemsType.MOVIE]: movieItems
            })
        )
    );
  }

  setCommentItems(movieId, comments) {
    const storeComments = this.getMovieComments(movieId);
    const newStoreComments = Object.values(comments)
      .reduce((acc, current) => {
        return Object.assign({}, acc, {
          [current.id || current.commentId]: Object.assign({}, storeComments[current.id || current.commentId],
              comments[current.id || current.commentId])
        });
      }, {});
    const newCommentItems = Object.assign({}, this._getCommentItems(), {
      [movieId]: newStoreComments
    });

    const store = this._getItems();

    this._storage.setItem(
        this._storeKey,
        JSON.stringify(
            Object.assign({}, store, {
              [ItemsType.COMMENT]: newCommentItems
            })
        )
    );
  }

  setCommentItem(movieId, comment) {
    const commentItems = this._getCommentItems();
    const movieCommentItems = Object.assign({}, commentItems[movieId] || {}, {
      [comment.id || comment.commentId]: comment
    });
    const newCommentItems = Object.assign({}, commentItems, {
      [movieId]: movieCommentItems
    });

    const store = this._getItems();
    this._storage.setItem(
        this._storeKey,
        JSON.stringify(
            Object.assign({}, store, {
              [ItemsType.COMMENT]: newCommentItems
            })
        )
    );
  }

  getMovieComments(movieId) {
    return this._getCommentItems()[movieId] || {};
  }

  removeCommentItem(movieId, commentId) {
    const store = this._getItems();
    const commentItems = this._getCommentItems();
    if (commentItems[movieId]) {
      delete commentItems[movieId][commentId];
      this._storage.setItem(
          this._storeKey,
          JSON.stringify(
              Object.assign({}, store, {
                [ItemsType.COMMENT]: commentItems
              })
          )
      );
    }
  }
}
