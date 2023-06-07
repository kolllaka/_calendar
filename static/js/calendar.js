const constMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
	constWeek = ["пн", "вт", "ср", "чт", "пт", "сб", "вс"],
	constNameOfMonth = ["январь", "февраль", "март", "апрель", "май", "июнь", "июль", "август", "сентябрь", "октябрь", "ноябрь", "декабрь",]

class Calendar {
	constructor($selector, mode) {
		this.$el = document.getElementById($selector);
		this.mode = mode;

		this.year = 2023;
		this.month = 11;
		this.selectedValue;
		this.daysArray;

		this.#render();
		this.update();
	}

	#render() {
		this.$el.classList.add("calendar");
		this.$el.innerHTML = calenderTemplate();
	}

	update() {
		// set title
		this.$el.querySelector('.calendar__title').innerText = `${constNameOfMonth[this.month] ?? ""} ${this.year ?? ""}`;

		this.daysArray = this.#daysArray();
		this.$el.querySelector('.gridbody__web').innerHTML = this.daysArray.map((el) => {
			let day = new Date(el.value * 1000)

			return `
			<div class="gridbody__cell ${el.style}" data-value="${el.value}">${day.getDate()}</div>
			`
		}).join('')
	}

	#daysArray() {
		let arrayOfMonth = [];
		let time = new Date(this.year, this.month, 1);
		let day = getHumanDay(time.getDay());

		console.log(this.$el);


		console.log(`month: ${this.month}, year: ${this.year}`);

		console.log(`month unix time 1685566800: ${Math.floor(time / 1000)}`);
		console.log(`день недели: ${day} ${constWeek[day]}`);
		for (let index = day + 1; index > 1; index--) {
			arrayOfMonth.push({
				value: Math.floor(time / 1000) - index * 86400,
				style: "gridbody__gray",
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
		this.selectedValue = Math.floor(time / 1000)

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

		console.log("array:", arrayOfMonth);
		return arrayOfMonth
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