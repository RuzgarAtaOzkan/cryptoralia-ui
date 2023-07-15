// CONFIG
import config from '../config';

function displayDate(date) {
  const dataTypes = config.dev.dataTypes;

  if (!date || typeof date !== dataTypes.string) {
    return null;
  }

  if (new Date(date).toString() === 'Invalid Date') {
    return 'Invalid Date';
  }

  const dateparts = new Date(date).toDateString().split(' ');

  if (dateparts[1] && dateparts[2] && dateparts[3]) {
    return dateparts[2] + ' ' + dateparts[1] + ' ' + dateparts[3];
  }

  return null;
}

export default displayDate;
