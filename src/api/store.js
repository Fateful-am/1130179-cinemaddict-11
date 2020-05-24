const ItemsType = {
  MOVIE: `movies`,
  COMMENT: `comments`,
  OFFLINE: `offline`
};

const OfflineItem = {
  UPDATED_MOVIES: `updatedMovies`,
  DELETED_COMMENTS: `deletedComments`,
  CREATED_COMMENTS: `createdComments`
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
      const [offlineItems, updatedMovies] = this._getOfflineItems(OfflineItem.UPDATED_MOVIES);
      if (updatedMovies[key]) {
        delete updatedMovies[key];
        this._setOfflineItems(OfflineItem.UPDATED_MOVIES, offlineItems, updatedMovies);
      }

      return;
    }

    const [offlineItems, updatedMovies] = this._getOfflineItems(OfflineItem.UPDATED_MOVIES);
    const newUpdatedMovies = Object.assign({}, updatedMovies, {
      [key]: key
    });

    this._setOfflineItems(OfflineItem.UPDATED_MOVIES, offlineItems, newUpdatedMovies);
  }

  _setOfflineItems(itemType, offlineItems, items) {
    const newOfflineItems = Object.assign({}, offlineItems, {
      [itemType]: items
    });
    this._storage.setItem(
        this._storeKey,
        JSON.stringify(
            Object.assign({}, this._getItems(), {
              [ItemsType.OFFLINE]: newOfflineItems
            })
        )
    );
  }

  _getOfflineItems(itemType) {
    const offlineItems = this._getItems()[ItemsType.OFFLINE] || {};
    const items = offlineItems[itemType] || {};
    return [offlineItems, items];
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

    const [offlineItems, createdComments] = this._getOfflineItems(OfflineItem.CREATED_COMMENTS);
    const movieCreatedComments = createdComments[movieId] || {};
    const newCreatedComments = Object.assign({}, movieCreatedComments, {
      [comment.id]: movieId
    });
    const newMovieCreatedComments = Object.assign({}, createdComments, {
      [movieId]: newCreatedComments
    });

    this._setOfflineItems(OfflineItem.CREATED_COMMENTS, offlineItems, newMovieCreatedComments);
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

    const createdComments = this.getOfflineCreatedComments(false)
      .filter((it) => commentId === it.commentId);
    if (createdComments.length > 0) {
      this.deleteCreatedOfflineComment(movieId, commentId);
      return;
    }

    const [offlineItems, deletedComments] = this._getOfflineItems(OfflineItem.DELETED_COMMENTS);
    const newDeletedComments = Object.assign({}, deletedComments, {
      [commentId]: movieId
    });

    this._setOfflineItems(OfflineItem.DELETED_COMMENTS, offlineItems, newDeletedComments);
  }

  getOfflineUpdatedMovies() {
    const store = this._getItems();
    const updatedMovieIds = Object.values(this._getOfflineItem(OfflineItem.UPDATED_MOVIES));
    return updatedMovieIds.map((movieId) => {
      return store[ItemsType.MOVIE][movieId];
    });
  }

  getOfflineCreatedComments(doDelete = true) {
    const newComments = [];
    const createdComments = Object.values(this._getOfflineItem(OfflineItem.CREATED_COMMENTS));
    createdComments.forEach((it) => {
      const commentsIds = Object.keys(it);
      commentsIds.forEach((commentId) => {
        const movieId = it[commentId];
        const movieComments = this.getMovieComments(movieId);
        const comment = movieComments[commentId];
        if (comment) {
          newComments.push({movieId,
            commentObject: {
              comment: comment.text,
              date: new Date(comment.date).toISOString(),
              emotion: comment.emoji
            },
            commentId});
        } else {
          if (doDelete) {
            this.deleteCreatedOfflineComment(movieId, commentId);
          } else {
            newComments.push({commentId});
          }
        }
      });
    });
    return newComments;
  }

  getOfflineDeletedComments() {
    const deletedComments = this._getOfflineItem(OfflineItem.DELETED_COMMENTS);
    return Object.keys(deletedComments)
      .map((it) => {
        return {movieId: deletedComments[it],
          commentId: it};
      });
  }

  deleteCreatedOfflineComment(movieId, commentId) {
    const [offlineItems, createdComments] = this._getOfflineItems(OfflineItem.CREATED_COMMENTS);
    const movieCreatedComments = createdComments[movieId] || {};
    if (movieCreatedComments[commentId]) {
      delete movieCreatedComments[commentId];
      if (Object.keys(movieCreatedComments).length === 0) {
        delete createdComments[movieId];
      }
      this._storage.setItem(
          this._storeKey,
          JSON.stringify(
              Object.assign({}, this._getItems(), {
                [ItemsType.OFFLINE]: offlineItems
              })
          )
      );
    }
  }

  deleteDeletedOfflineComment(commentId) {
    const offlineItems = this._getItems()[ItemsType.OFFLINE] || {};
    delete offlineItems[OfflineItem.DELETED_COMMENTS][commentId];
    this._storage.setItem(
        this._storeKey,
        JSON.stringify(
            Object.assign({}, this._getItems(), {
              [ItemsType.OFFLINE]: offlineItems
            })
        )
    );

  }
}
