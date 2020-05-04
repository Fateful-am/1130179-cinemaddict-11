import {getRandomArrayItem, getRandomCommentDateTime} from '../utils';

// Число возможных дней до текущей даты для даты комментария
const COMMENTS_PAST_DAYS = 7;

// имена файлов с эмоджи
const emojis = [
  `angry.png`,
  `puke.png`,
  `sleeping.png`,
  `smile.png`
];

// Случайные имена комментаторов. Сгенерирована с помощью сайта http://megagenerator.ru
const commentAuthors = [
  `Холодов Мефодий`,
  `Нюхтилин Ипполит`,
  `Янчуковский Фока`,
  `Бессонов Терентий`,
  `Глазков Иосиф`,
  `Толстой Даниил`,
  `Ильинский Антон`,
  `Луньков Всеволод`,
  `Буклин Рюрик`,
  `Кабальнов Данил`
];

// Случайные комментарии (цитататы). Сгенерирована с помощью сайта http://megagenerator.ru/
const commentTexts = [
  `Истинное часто неправдоподобно, и напротив, ложное нередко бывает правдоподобно.`,
  `Многие, не учившиеся ничему разумному, тем не менее живут разумно.`,
  `Поскольку желания людей чаще всего ненасытны, они хотят иметь в изобилии не только вещи полезные и необходимые, но и приятные бесполезные вещи.`,
  `Человеку, который долго говорит о себе, трудно избежать тщеславия.`,
  `Величайший подвиг дружбы не в том, чтобы показать другу наши недостатки, а в том, чтобы открыть ему глаза на его собственные.`,
  `У кого не хватит ума поучать другого? Лишь великий разумом сам способен следовать надлежащим путем.`,
  `Самыми лучшими министрами были те люди, которые волею судеб дальше всего стояли от министерств.`,
  `Как ни мало благодеяние, оно пустит сотню ростков, если оказать его достойному.`,
  `Одна истина освещает другую.`,
  `Ничто так не мешает естественности, как желание казаться естественным.`
];


/**
 * Генерация комментария к фильму
 * @return {{date: Date, emoji: *, author: *, id: string, text: *}} date - отфармотированная дата комментария,
 * emoji - название эмоджи (файл), author - автор, text - текст
 */
const generateFilmComment = ()=> {
  return {
    id: String(new Date() + Math.random()),
    text: getRandomArrayItem(commentTexts),
    emoji: getRandomArrayItem(emojis),
    author: getRandomArrayItem(commentAuthors),
    date: getRandomCommentDateTime(COMMENTS_PAST_DAYS),
  };
};

/**
 * Генерация массива комментариев
 * @param {number} count Количество коментариев
 * @return {{date: Date, emoji: *, author: *, id: string, text: *}[]} Массив комментариев
 */
const generateFilmComments = (count)=> {
  return new Array(count)
    .fill(``)
    .map(generateFilmComment);
};

export {generateFilmComment, generateFilmComments};
