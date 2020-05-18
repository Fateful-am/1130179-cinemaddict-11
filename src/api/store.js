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

    value.comments.forEach((comment) => {
      this.setCommentItem(value.id, {commentId: comment, text: `${value.comments.length} [Offline...]`});
    });
  }

  setCommentItem(movieId, comment) {
    const store = this._getItems();
    const commentItems = this._getCommentItems();
    if (!comment.author
      && commentItems[movieId]
      && commentItems[movieId][comment.id || comment.commentId]
      && commentItems[movieId][comment.id || comment.commentId].author) {
      return;
    }
    const movieCommentItems = Object.assign({}, commentItems[movieId] || {}, {
      [comment.id || comment.commentId]: comment
    });
    const newCommentItems = Object.assign({}, commentItems, {
      [movieId]: movieCommentItems
    });

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

  removeItem(key) {

  }
}
