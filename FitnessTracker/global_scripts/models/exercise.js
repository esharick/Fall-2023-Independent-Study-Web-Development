class Exercise {
    constructor(name, category, sets, reps, weight, duration, time){
        this.name = name;
        this.category = category;
        this.sets = sets;
        this.reps = reps;
        this.weight = weight;
        this.duration = duration; //minutes
        this.time = time; //seconds
        this.caloriesBurned = this.calculateCaloriesBurned();
    }

    calculateCaloriesBurned() {
        if (this.duration) //calories estimated per minute of exercise
            return this.duration * 5; 
        if (this.time) //calculate based on number of reps and time held
            return ((this.sets) ? this.sets : 1) * ((this.reps) ? this.reps : 1) * this.time / 60.0 * 5;

        if (this.weight) //calculate calories burned based on exercise, sets, reps
            return ((this.sets) ? this.sets : 1) * ((this.reps) ? this.reps : 1) * (3 + 0.045 * this.weight / 2.2); 

        return 10; //placeholder
    }

    updateCaloriesBurned() {
        this.caloriesBurned = this.calculateCaloriesBurned();
    }
}