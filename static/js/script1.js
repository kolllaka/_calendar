let calendar = new Calendar('calendar')
let gridbody = document.querySelector('.gridbody__web');
let calendarTitle = document.querySelector('.calendar__title');
let calendarNextBtn = document.querySelector('.calendar__next');
let calendarPrevBtn = document.querySelector('.calendar__prev');
let gridbodydays = document.querySelectorAll('.gridbody__day');
let selectedValue;

console.log(calendar.day)
//calendar.setDay(2909090)
calendar.day = 29090909
console.log(calendar.day)
console.log(calendar.mode)
console.log("====================================================================================================")



let currentMonth = 0
let currentYear = 2023


// ----------------------------------- setup() --------------------------------------------------
gridbody.addEventListener('click', (e) => {
	let target = e.target.closest('.gridbody__cell')
	if (target) {
		switch (true) {
			case (target.classList.contains('gridbody__gray')):
				console.log('next or prev');

				break
			case (target.classList.contains('gridbody__day')):
				e.target.classList.add('gridbody__day-select')
				selectedValue = e.target.dataset.value

				break
		}
	}
})

gridbody.addEventListener('mouseover', (e) => {
	let target = e.target.closest('.gridbody__cell')
	if (target) {
		switch (true) {
			case (target.classList.contains('gridbody__gray')):
				console.log('next or prev');

				break
			case (target.classList.contains('gridbody__day')):
				clearDaysHover()
				let currentValue = e.target.dataset.value
				drawDaysHover(currentValue)

				//e.target.classList.add('gridbody__day-hover');

				break
		}
	}
})

function clearDaysHover() {
	document.querySelectorAll('.gridbody__day').forEach((day) => {
		if (day.classList.contains('gridbody__day-hover')) {
			day.classList.remove('gridbody__day-hover')
		}
	})
}

function drawDaysHover(value) {
	document.querySelectorAll('.gridbody__day').forEach((day) => {
		let currentValue = day.dataset.value

		if (currentValue >= value && currentValue <= selectedValue) {
			day.classList.add('gridbody__day-hover')
		}
	})
}

calendarNextBtn.addEventListener('click', (e) => {
	if (currentMonth == 11) {
		currentMonth = 0
		currentYear++
	} else {
		currentMonth++
	}

	render()
})

calendarPrevBtn.addEventListener('click', (e) => {
	if (currentMonth == 0) {
		currentMonth = 11
		currentYear--
	} else {
		currentMonth--
	}

	render()
})
// ----------------------------------- setup() --------------------------------------------------


const currentMonthUnixTime = (year, month) => {
	let arrayOfMonth = [];
	let time = new Date(year, month, 1);
	let day = getHumanDay(time.getDay())


	calendarTitle.innerText = `${constNameOfMonth[month]} ${year}`

	console.log(`month: ${month}, year: ${year}`);

	console.log(`month unix time 1685566800: ${Math.floor(time / 1000)}`);
	console.log(`день недели: ${day} ${constWeek[day]}`);
	for (let index = day + 1; index > 1; index--) {
		arrayOfMonth.push({
			value: Math.floor(time / 1000) - index * 86400,
			style: "gridbody__gray",
		})
	}

	let lenghtOfMonth = constMonth[month]
	if ((month == 1) && (year % 4 == 0)) {
		console.log('високосный год');

		lenghtOfMonth++
		console.log(lenghtOfMonth);
	}


	for (let index = 0; index < lenghtOfMonth; index++) {
		arrayOfMonth.push({
			value: Math.floor(time / 1000) + index * 86400,
			style: "gridbody__day",
		})
	}

	time = new Date(year, month, lenghtOfMonth)
	day = getHumanDay(time.getDay())
	selectedValue = Math.floor(time / 1000)

	console.log(`ласт день недели: ${day} ${constWeek[day]}`);
	let k = 1
	if (day != 6) {
		for (let index = day + 1; index < 7; index++) {
			arrayOfMonth.push({
				value: Math.floor(time / 1000) + k * 86400,
				style: "gridbody__gray",
			})

			k++
		}
	}

	return arrayOfMonth
}

const render = () => {
	let monthUnix = currentMonthUnixTime(currentYear, currentMonth)
	console.log(monthUnix);
	let elelel = monthUnix.map((el) => {
		let day = new Date(el.value * 1000)

		return `
		<div class="gridbody__cell ${el.style}" data-value="${el.value}">${day.getDate()}</div>
		`
	}).join('')
	gridbody.innerHTML = ``
	gridbody.innerHTML = elelel
}
render()

//let unixTime = Math.floor(Date.now() / 1000)
const currentUnixTime = () => {
	const time = Date.now()
	//time = time.now()
	console.log(time);

	return Math.floor(time / 1000)
}
const currentTime = (unixTime) => {
	const time = new Date(unixTime * 1000)
	const months = ['Янв', 'Фев', 'Мрт', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек'];
	const weeks = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
	const year = time.getFullYear();
	console.log(`${time.getMonth()} = ${months[5]}`);
	const month = months[time.getMonth()];
	const date = time.getDate();
	console.log(time);

	return `${date} ${month} ${year}`
}
unixTime = currentUnixTime()
console.log(unixTime);
console.log(currentTime(unixTime));

let calendarBtns = document.querySelectorAll('.calendar__btn');

if (calendarBtns) {
	calendarBtns.forEach((btn) => {
		btn.addEventListener('click', (e) => {
			e.preventDefault();
		})
	})
}


