let calendar = new Calendar('calendar')



let calendarBtns = document.querySelectorAll('.calendar__btn');

if (calendarBtns) {
	calendarBtns.forEach((btn) => {
		btn.addEventListener('click', (e) => {
			e.preventDefault();
		})
	})
}

let calendarNextBtn = document.querySelector('.calendar__next');
let calendarPrevBtn = document.querySelector('.calendar__prev');

calendarNextBtn.addEventListener('click', (e) => {
	if (calendar.month == 11) {
		calendar.month = 0
		calendar.year++
	} else {
		calendar.month++
	}

	calendar.update()
})

calendarPrevBtn.addEventListener('click', (e) => {
	if (calendar.month == 0) {
		calendar.month = 11
		calendar.year--
	} else {
		calendar.month--
	}

	calendar.update()
})