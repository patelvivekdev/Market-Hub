const formattedDate = (d) => {
	const date = new Date(d);
	const day = String(date.getDate()).padStart(2, '0');
	const month = String(date.getMonth() + 1).padStart(2, '0'); // January is 0!
	const year = date.getFullYear();

	return `${day}/${month}/${year}`;
};

const formattedDateTime = (d) => {
	const date = new Date(d);
	const day = String(date.getDate()).padStart(2, '0');
	const month = String(date.getMonth() + 1).padStart(2, '0'); // January is 0!
	const year = date.getFullYear();
	const hours = date.getHours();
	const minutes = date.getMinutes();

	return `${day}/${month}/${year} ${hours}:${minutes}`;
};

export { formattedDate, formattedDateTime };
