const monday = (date = new Date()) => {
  let diff = date.getDate() - date.getDay() + (date.getDay() === 0 ? -6 : 1);
  return new Date(
    date.setDate(diff) - (date.getTime() % (1000 * 60 * 60 * 24))
  );
};

const endOfWeek = (date = new Date()) => {
  return new Date(monday(date).getTime() + 1000 * 60 * 60 * 24 * 7);
};

module.exports = { monday, endOfWeek };
