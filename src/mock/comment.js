import {getRandomArrayItem, getRandomIntegerNumber} from '../utils';

// Число возможных дней до текущей даты для даты комментария
const COMMENTS_PAST_DAYS = 365;

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
 * Генерация случайной даты в прошлом
 * @param {number} pastSinceDays Сколько захватить дней до текущей даты
 * @return {Date} Дата в прошлом
 */
const getRandomCommentDateTime = (pastSinceDays) => {
  const targetDate = new Date();
  targetDate.setDate(targetDate.getDate() - getRandomIntegerNumber(0, pastSinceDays));
  targetDate.setHours(getRandomIntegerNumber(0, 23), getRandomIntegerNumber(0, 59));
  return targetDate;
};

/**
 * Добавление 0 для цифр меньше 10
 * @param {number} number Входное число
 * @return {string} Отфарматированнное число
 */
const addLeadZero = (number) => {
  return number < 10 ? `0${number}` : number;
};

/**
 * Форматирование даты комментария
 * @param {Date} dateTime Дата для форматирования
 * @return {string} Отформатированная дата комментария
 */
const formatCommentDateTime = (dateTime) => {
  return `${dateTime.getFullYear()}/${addLeadZero(dateTime.getMonth() + 1)}/${addLeadZero(dateTime.getDate())} ${addLeadZero(dateTime.getHours())}:${addLeadZero(dateTime.getMinutes())}`;
};

/**
 * Генерация комментария к фильму
 * @return {{date: string, emoji: string, author: string, text: string}} date - отфармотированная дата комментария,
 * emoji - название эмоджи (файл), author - автор, text - текст
 */
const generateFilmComment = ()=> {
  return {
    text: getRandomArrayItem(commentTexts),
    emoji: getRandomArrayItem(emojis),
    author: getRandomArrayItem(commentAuthors),
    date: formatCommentDateTime(getRandomCommentDateTime(COMMENTS_PAST_DAYS)),
  };
};

/**
 * Генерация массива комментариев
 * @param {number} count Количество коментариев
 * @return {{date: string, emoji: string, author: string, text: string}[]} Массив комментариев
 */
const generateFilmComments = (count)=> {
  return new Array(count)
    .fill(``)
    .map(generateFilmComment);
};

export {generateFilmComment, generateFilmComments};
