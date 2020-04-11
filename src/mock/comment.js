import {getRandomArrayItem, getRandomIntegerNumber} from '../utils';

// Число возможных дней до текущей даты для даты комментария
const commenetPastDate = 365;

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
 * Возвращает случайную дату-время в периоде указанной в аргументе
 * @param {number} pastSinceDays Сколько захватить дней до текущей даты
 * @return {Date}
 */
const getRandomCommentDateTime = (pastSinceDays) => {
  const targetDate = new Date();
  targetDate.setDate(targetDate.getDate() - getRandomIntegerNumber(0, pastSinceDays));
  targetDate.setHours(getRandomIntegerNumber(0, 23), getRandomIntegerNumber(0, 59));
  return targetDate;
};

/**
 *
 * @param {number} number Входное число для добавления при необходимости ведущего нуля
 * @return {string}
 */
const addLeadZero = (number) => {
  return number < 10 ? `0${number}` : number;
};

/**
 * Форматирование даты согласно ТЗ
 * @param {Date} dateTime Дата для форматирования
 * @return {string}
 */
const formatCommentDateTime = (dateTime) => {
  return `${dateTime.getFullYear()}/${addLeadZero(dateTime.getMonth() + 1)}/${addLeadZero(dateTime.getDate())} ${addLeadZero(dateTime.getHours())}:${addLeadZero(dateTime.getMinutes())}`;
};


const generateFilmComment = ()=> {
  return {
    text: getRandomArrayItem(commentTexts),
    emoji: getRandomArrayItem(emojis),
    author: getRandomArrayItem(commentAuthors),
    date: formatCommentDateTime(getRandomCommentDateTime(commenetPastDate)),
  };
};

const generateFilmComments = (count)=> {
  return new Array(count)
    .fill(``)
    .map(generateFilmComment);
};

export {generateFilmComment, generateFilmComments};
