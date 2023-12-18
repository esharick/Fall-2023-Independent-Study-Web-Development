class User {
    constructor(userObject) {
        if (userObject) {
            const {
                username,
                currentWeight,
                dailyCalories,
                waterIntake,
                workoutLog,
                weightLog,
                calorieLog,
                waterLog,
                goals
            } = userObject;

            // Assign properties to the instance with proper type conversion
            this.username = username || '';
            this.currentWeight = parseFloat(currentWeight) || 0;
            this.dailyCalories = parseInt(dailyCalories) || 0;
            this.waterIntake = parseInt(waterIntake) || 0;

            this.workoutLog = typeof workoutLog === 'string' ?
                this.decodeAndParseWorkoutLog(workoutLog) : workoutLog || [];        
            this.weightLog = typeof weightLog === 'string' ?
                JSON.parse(weightLog) : weightLog || {};
            this.calorieLog = typeof calorieLog === 'string' ?
                JSON.parse(calorieLog) : calorieLog || {};
            this.waterLog = typeof waterLog === 'string' ?
                JSON.parse(waterLog) : waterLog || {};
            this.goals = typeof goals === 'string' ?
                this.decodeAndParseGoals(goals) : goals || [];
        } else {
            // If no userObject provided, initialize with default values
            this.username = '';
            this.currentWeight = 0;
            this.dailyCalories = 0;
            this.waterIntake = 0;
            this.workoutLog = [];
            this.weightLog = {};
            this.calorieLog = {};
            this.waterLog = {};
            this.goals = [];
        }
    }
    decodeAndParseGoals(encodedString) {
        if (encodedString.length < 3)
            return [];
        const tempElement = document.createElement('div');
        tempElement.innerHTML = encodedString;
        let s = tempElement.textContent;
        s = s.substring(3, s.length - 3); //remove "[" and "]" from beginning and end
        return s.split("\",\""); //When the user enters a goal containing ", I will replace it with ''.          
    }
    decodeAndParseWorkoutLog(encodedString) {
        if (encodedString.length < 3)
            return [];
        try {
            let s = encodedString.replace(/&quot;/g, '"').trim();
            s = s.substring(1, s.length - 1);
            console.log(s);
            const exercisesArray = JSON.parse(s);
            if (!Array.isArray(exercisesArray)) {
                throw new Error('Input is not an array');
            }
            console.log(exercisesArray);
            const exercises = exercisesArray.map(workout => {
                const { date, startTime, duration, exercises, totalCaloriesBurned } = workout;

                let parsedExercises = [];
                if (exercises !== undefined) {
                    parsedExercises = exercises.map(exercise => new Exercise(exercise.name,
                        exercise.category, exercise.sets, exercise.reps, exercise.weight,
                        exercise.duration, exercise.time, exercise.caloriesBurned));
                }
                console.log(parsedExercises);
                const workoutObj = new Workout(date, startTime, duration);
                workoutObj.exercises = parsedExercises;
                workoutObj.totalCaloriesBurned = totalCaloriesBurned;
                return workoutObj;
            });

            return exercises;
        } catch (error) {
            console.error('Error parsing exercises:', error);
            return [];
        }
             
    }



    logWorkout(workout) {
        this.workoutLog.push(workout);
    }

    logWeight(date, weight) {
        this.weightLog[date] = weight;
    }

    logCalories(date, caloricIntake) {
        this.calorieLog[date] = caloricIntake;
    }

    logWater(date, waterIntake) {
        this.waterLog[date] = waterIntake;
    }

    addGoal(goal) {
        this.goals.push(goal);
    }
}

