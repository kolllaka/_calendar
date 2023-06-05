class Calendar {
	constructor($selector, mode) {
		this.$el = document.getElementById($selector);
		this.mode = mode;

		//this.time;
		this.day;
	}

	setDay(day) {
		this.day = day;
	}

	getDay() {
		// console.log(this.time);
		return this.day;
	}
}