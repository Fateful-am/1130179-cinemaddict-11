const ItemsType = {
  MOVIE: `movies`,
  COMMENT: `comments`,
  OFFLINE: `offline`
};

const OfflineItem = {
  UPDATED_MOVIES: `updatedMovies`
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

  _getOfflineItem(item) {
    const offlineItems = this._getItems()[ItemsType.OFFLINE] || {};
    return offlineItems[item] || {};
  }

  setMovieItem(key, value, isOnline = true) {
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

    if (isOnline) {
      const UpdatedMovies = this._getOfflineItem(OfflineItem.UPDATED_MOVIES);
      if (UpdatedMovies[key]) {
        delete UpdatedMovies[key];
        this._storage.setItem(
            this._storeKey,
            JSON.stringify(
                Object.assign({}, this._getItems(), {
                  [ItemsType.OFFLINE]: {[OfflineItem.UPDATED_MOVIES]: UpdatedMovies}
                })
            )
        );
      }

      return;
    }
    const updatedMovies = this._getOfflineItem(OfflineItem.UPDATED_MOVIES);
    const newUpdatedMovies = Object.assign({}, updatedMovies, {
      [key]: key
    });

    this._storage.setItem(
        this._storeKey,
        JSON.stringify(
            Object.assign({}, this._getItems(), {
              [ItemsType.OFFLINE]: {[OfflineItem.UPDATED_MOVIES]: newUpdatedMovies}
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

  setCommentItem(movieId, comment, isOnline = true) {
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

    if (isOnline) {
      return;
    }
  }

  getMovieComments(movieId) {
    return this._getCommentItems()[movieId] || {};
  }

  removeCommentItem(movieId, commentId, isOnline = true) {
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

    if (isOnline) {
      return;
    }
  }

  getOfflineUpdatedMovies() {
    const store = this._getItems();
    const updatedMovieIds = Object.values(this._getOfflineItem(OfflineItem.UPDATED_MOVIES));
    return updatedMovieIds.map((movieId) => {
      return store[ItemsType.MOVIE][movieId];
    });
  }
}
