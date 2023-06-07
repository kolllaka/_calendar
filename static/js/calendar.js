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
		this.selectedEl
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

			return `
			<div class="gridbody__cell ${selected} ${el.style}" data-value="${el.value}">${day.getDate()}</div>
			`
		}).join('')

		if (this.selectedValue[0]) {
			this.$el.querySelectorAll('.gridbody__day').forEach((el) => {
				if (el.dataset.value == this.selectedValue[0]) {
					this.selectedEl = el
				}
			})
		}
	}

	#setup() {
		this.buttonClickHandler = this.buttonClickHandler.bind(this);
		this.$el.addEventListener('click', this.buttonClickHandler)

		this.buttonHoverHandler = this.buttonHoverHandler.bind(this);
		this.$el.addEventListener('mouseover', this.buttonHoverHandler)
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

		if (event.target.closest('.gridbody__day')) {
			this.selectedValue[0] = event.target.dataset.value

			if (this.selectedEl) {
				this.selectedEl.classList.remove('gridbody__day-select')
				this.#removeHoverSelected()
			}
			this.selectedEl = event.target

			clearDaysHover()
			event.target.classList.add('gridbody__day-select')

			return
		}

	}

	buttonHoverHandler(event) {
		if (event.target.closest('.gridbody__day')) {
			clearDaysHover()
			let currentValue = event.target.dataset.value

			switch (true) {
				case (currentValue < this.selectedValue[0]):
					drawDaysHover(currentValue, this.selectedValue[0])
					this.#removeHoverSelected()
					this.selectedEl.classList.add('gridbody__day-selectright')

					break
				case (currentValue > this.selectedValue[0]):
					drawDaysHover(this.selectedValue[0], currentValue)
					this.#removeHoverSelected()
					this.selectedEl.classList.add('gridbody__day-selectleft')

					break
				case (currentValue == this.selectedValue[0]):
					clearDaysHover()
					this.#removeHoverSelected()

					break
			}

			return
		}

		if (event.target.closest('.gridbody__prev')) {
			clearDaysHover()
			drawDaysHover(this.daysArray[0].value, this.selectedValue[0])
			this.#removeHoverSelected()
			this.selectedEl.classList.add('gridbody__day-selectright')
		}

		if (event.target.closest('.gridbody__next')) {
			clearDaysHover()
			drawDaysHover(this.selectedValue[0], this.daysArray.at(-1).value)
			this.#removeHoverSelected()
			this.selectedEl.classList.add('gridbody__day-selectleft')
		}
	}

	#removeHoverSelected() {
		this.selectedEl.classList.remove('gridbody__day-hover')
		this.selectedEl.classList.remove('gridbody__day-selectleft')
		this.selectedEl.classList.remove('gridbody__day-selectright')
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
			<a href="#" class="calendar__btn">
				очистить
			</a>
			<a href="#" class="calendar__btn">
				применить
			</a>
		</div>
	</div>
	`
}

const clearDaysHover = () => {
	document.querySelectorAll('.gridbody__day').forEach((day) => {
		if (day.classList.contains('gridbody__day-hover')) {
			day.classList.remove('gridbody__day-hover')
		}
	})
}

const drawDaysHover = (startVal, endVal) => {
	document.querySelectorAll('.gridbody__day').forEach((day) => {
		let currentValue = day.dataset.value

		if (startVal <= currentValue && endVal >= currentValue) {
			day.classList.add('gridbody__day-hover')
		}
	})
}
