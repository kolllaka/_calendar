const constMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
	constWeek = ["пн", "вт", "ср", "чт", "пт", "сб", "вс"],
	constNameOfMonth = ["январь", "февраль", "март", "апрель", "май", "июнь", "июль", "август", "сентябрь", "октябрь", "ноябрь", "декабрь",]

class Calendar {
	constructor($selector, mode) {
		this.$el = document.getElementById($selector);
		this.mode = mode;

		this.year = 2023;
		this.month = 11;
		this.selectedValue = [];
		this.daysArray;

		this.#render();
		this.#update();

		this.#setup();
	}

	#render() {
		this.$el.classList.add("calendar");
		this.$el.innerHTML = calenderTemplate();
	}

	#update() {
		// set title
		this.$el.querySelector('.calendar__title').innerText = `${constNameOfMonth[this.month] ?? ""} ${this.year ?? ""}`;

		this.daysArray = this.#daysArray();
		this.$el.querySelector('.gridbody__web').innerHTML = this.daysArray.map((el) => {
			let day = new Date(el.value * 1000)
			let selected = ""
			if (el.value == this.selectedValue[0] && el.style == "gridbody__day") {
				selected = "gridbody__day-select"
			}

			if (this.selectedValue[1] && el.value == this.selectedValue[1] && el.style == "gridbody__day") {
				selected = "gridbody__day-select"
			}

			return `
			<div class="gridbody__cell ${selected} ${el.style}" data-value="${el.value}">${day.getDate()}</div>
			`
		}).join('')

		if (this.selectedValue[1]) {
			this.#drawDaysHover(this.selectedValue[0], this.selectedValue[1], true, true)
		}
	}

	#setup() {
		this.buttonClickHandler = this.buttonClickHandler.bind(this);
		this.$el.addEventListener('click', this.buttonClickHandler)

		this.buttonHoverHandler = this.buttonHoverHandler.bind(this);

	}

	#daysArray() {
		let arrayOfMonth = [];
		let time = new Date(this.year, this.month, 1);
		let day = getHumanDay(time.getDay());

		for (let index = day + 1; index > 1; index--) {
			arrayOfMonth.push({
				value: Math.floor(time / 1000) - index * 86400,
				style: "gridbody__prev",
			})
		}

		let lenghtOfMonth = constMonth[this.month]
		if ((this.month == 1) && (this.year % 4 == 0)) {
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

		time = new Date(this.year, this.month, lenghtOfMonth)
		day = getHumanDay(time.getDay())

		let k = 1
		if (day != 6) {
			for (let index = day + 1; index < 7; index++) {
				arrayOfMonth.push({
					value: Math.floor(time / 1000) + k * 86400,
					style: "gridbody__next",
				})

				k++
			}
		}

		return arrayOfMonth
	}

	buttonClickHandler(event) {

		// next button on Calendar
		if (event.target.closest('.calendar__next') || event.target.closest('.gridbody__next')) {
			console.log(this.selectedValue);

			event.preventDefault();
			if (this.month == 11) {
				this.month = 0
				this.year++
			} else {
				this.month++
			}

			this.#update()
			return
		}

		// prev button on Calendar
		if (event.target.closest('.calendar__prev') || event.target.closest('.gridbody__prev')) {
			console.log(this.selectedValue);
			event.preventDefault();
			if (this.month == 0) {
				this.month = 11
				this.year--
			} else {
				this.month--
			}

			this.#update()
			return
		}

		// day button on Calendar
		if (event.target.closest('.gridbody__day')) {
			if (this.selectedValue[1]) {
				this.selectedValue = []
				calendar.#update()

				return
			}

			if (!this.selectedValue[0]) {
				this.$el.addEventListener('mouseover', this.buttonHoverHandler)
				this.selectedValue[0] = event.target.dataset.value

				this.#clearDaysHover()
				event.target.classList.add('gridbody__day-select')
			} else {
				this.$el.removeEventListener('mouseover', this.buttonHoverHandler)
				this.selectedValue[1] = event.target.dataset.value
				event.target.classList.add('gridbody__day-select')
				this.selectedValue = this.selectedValue.sort()
				this.#clearDaysHover()
				this.#drawDaysHover(this.selectedValue[0], this.selectedValue[1], true, true)
			}

			return
		}

		if (event.target.closest('.calendar__clear')) {
			event.preventDefault()
			this.selectedValue = []
			this.#update()

			return
		}

		if (event.target.closest('.calendar__submit')) {
			event.preventDefault()

			return
		}

	}

	buttonHoverHandler(event) {
		if (event.target.closest('.gridbody__day')) {
			this.#clearDaysHover()
			let currentValue = event.target.dataset.value

			switch (true) {
				case (currentValue < this.selectedValue[0]):
					this.#clearDaysHover()
					this.#drawDaysHover(currentValue, this.selectedValue[0], false, true)

					break
				case (currentValue > this.selectedValue[0]):
					this.#clearDaysHover()
					this.#drawDaysHover(this.selectedValue[0], currentValue, true, false)

					break
				case (currentValue == this.selectedValue[0]):
					this.#clearDaysHover()

					break
			}

			return
		}

		if (event.target.closest('.gridbody__prev')) {
			this.#clearDaysHover()
			this.#drawDaysHover(this.daysArray[0].value, this.selectedValue[0], false, true)

			return
		}

		if (event.target.closest('.gridbody__next')) {
			this.#clearDaysHover()
			this.#drawDaysHover(this.selectedValue[0], this.daysArray.at(-1).value, true, false)

			return
		}
	}


	#clearDaysHover() {
		this.$el.querySelectorAll('.gridbody__day').forEach((day) => {
			if (day.classList.contains('gridbody__day-hover')) {
				day.classList.remove('gridbody__day-hover')
			}
			if (day.classList.contains('gridbody__day-selectleft')) {
				day.classList.remove('gridbody__day-selectleft')
			}
			if (day.classList.contains('gridbody__day-selectright')) {
				day.classList.remove('gridbody__day-selectright')
			}
		})
	}

	#drawDaysHover(startVal, endVal, isSelectedStart, isSelectedEnd) {
		this.$el.querySelectorAll('.gridbody__day').forEach((day) => {
			let currentValue = day.dataset.value

			switch (true) {
				case (isSelectedStart && currentValue == startVal):
					day.classList.add('gridbody__day-selectleft')

					break
				case (isSelectedEnd && currentValue == endVal):
					day.classList.add('gridbody__day-selectright')

					break
				case (startVal <= currentValue && endVal >= currentValue):
					day.classList.add('gridbody__day-hover')

					break
			}
		})
	}
}

const getHumanDay = (day) => {
	day--
	if (day < 0) {
		day = 6
	}

	return day
}

const calenderTemplate = () => {
	return `
	<div class="calendar__header">
		<div class="calendar__btns">
			<a href="#" class="calendar__btn calendar__prev">
				&#60;--
			</a>
		</div>
		<div class="calendar__title">

		</div>
		<div class="calendar__btns">
			<a href="#" class="calendar__btn calendar__next">
				--&#62;
			</a>
		</div>
	</div>

	
	<div class="calendar__body gridbody">
		<div class="gridbody__row">
			<div class="gridbody__cell gridbody__cellname">Пн</div>
			<div class="gridbody__cell gridbody__cellname">Вт</div>
			<div class="gridbody__cell gridbody__cellname">Ср</div>
			<div class="gridbody__cell gridbody__cellname">Чт</div>
			<div class="gridbody__cell gridbody__cellname">Пт</div>
			<div class="gridbody__cell gridbody__cellname">Сб</div>
			<div class="gridbody__cell gridbody__cellname">Вс</div>
		</div>
		<div class="gridbody__row gridbody__web">

		</div>
	</div>

	<div class="calendar__footer">
		<div class="calendar__btns">
			<a href="#" class="calendar__btn calendar__clear">
				очистить
			</a>
			<a href="#" class="calendar__btn calendar__submit">
				применить
			</a>
		</div>
	</div>
	`
}