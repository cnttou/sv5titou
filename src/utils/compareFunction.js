import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';

export const compareStringName = (a, b) => {
	if (a.name > b.name) return 1;
	else return -1;
};
export const compareStringTarget = (a, b) => {
	if (a.target >= b.target) return 1;
	else return -1;
};
export const compareStringDate = (a, b) => {
    dayjs.extend(customParseFormat);
	let aDate = dayjs(a.date, 'DD-MM-YYYY');
	let bDate = dayjs(b.date, 'DD-MM-YYYY');
	if (aDate > bDate) return 1;
	else return -1;
};
export const compareNumber = (a, b) => {
	a = parseInt(a.numPeople);
	b = parseInt(b.numPeople);

	return a - b;
};
