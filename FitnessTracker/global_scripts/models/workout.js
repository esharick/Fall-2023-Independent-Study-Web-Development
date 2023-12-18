class Workout {
    constructor(date, startTime, duration) {
        this.date = date;
        this.startTime = startTime;
        this.duration = duration;
        this.exercises = [];
        this.totalCaloriesBurned = 0;
    }

    addExercise(exercise) {
        this.exercises.push(exercise);
        this.updateTotalCaloriesBurned();
    }

    updateTotalCaloriesBurned() {
        let sum = 0;
        for (let i = 0; i < this.exercises.length; i++)
            sum += this.exercises[i].caloriesBurned;
        this.totalCaloriesBurned = sum;
    }
}