let calendar = new Calendar('calendar')



let calendarBtns = document.querySelectorAll('.calendar__btn');

if (calendarBtns) {
	calendarBtns.forEach((btn) => {
		btn.addEventListener('click', (e) => {
			e.preventDefault();
		})
	})
}