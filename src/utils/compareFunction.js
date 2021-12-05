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
const pointSort = {
	typeActivity: {
		require: 300,
		other: 200,
		register: 100,
	},
	target: {
		'dao-duc': 100,
		'hoc-tap': 90,
		'the-luc': 80,
		'tinh-nguyen': 70,
		've-ngoai-ngu': 60,
		've-ky-nang': 50,
		'hoi-nhap': 40,
		'tieu-bieu-khac': 30,
	},
};
export const handleSortActivity = (activity1, activity2) => {
	let point1 = pointSort.typeActivity[activity1.typeActivity] || 0;
	let point2 = pointSort.typeActivity[activity2.typeActivity] || 0;
	return point2 - point1;
};
