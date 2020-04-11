
const generateFilmCard = ()=> {
  return {
    title: `The Dance of Life`,
    rating: `8.3`,
    year: 1929,
    duration: `1h 55m`,
    genre: `Musical`,
    poster: `the-dance-of-life.jpg`,
    description: `Burlesque comic Ralph "Skid" Johnson (Skelly), and specialty dancer Bonny Lee King (Carroll), end up together on a cold, rainy night at a tr…`,
    commentsCount: 5,
    addedToWatchlist: false,
    markedAsWatched: true,
    addedToFavorite: true,
  };
};

const generateFilmCards = (count)=> {
  return new Array(count)
    .fill(``)
    .map(generateFilmCard);
};

export {generateFilmCard, generateFilmCards};
