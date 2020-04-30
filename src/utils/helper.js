import moment from "moment";

const capitalize = (s) => {
    if (typeof s !== 'string') return '';
    return s.charAt(0).toUpperCase() + s.slice(1);
};

const refreshLog = () => {
  const date = moment().format('YYYY-MM-DD hh:mm a');
  console.log(`Database is refreshed ${date}`);
};

export {capitalize, refreshLog};