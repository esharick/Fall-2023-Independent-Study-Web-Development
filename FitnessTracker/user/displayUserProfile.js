const currentWeightInput = document.getElementById('currentWeightInput');
const dailyCaloriesInput = document.getElementById('dailyCaloriesInput');
const dailyWaterInput = document.getElementById('dailyWaterInput');
const ctx = document.getElementById('scatterChart').getContext('2d');
const goalsContainer = document.getElementById('goalsContainer');
const newGoalInput = document.getElementById('newGoal');
const addGoalButton = document.getElementById('addGoalButton');
const removeGoalsButton = document.getElementById('removeFinishedGoalsButton');
const weeklyCalendar = document.getElementById('weekly-calendar');

//Generic input function for the value/log pairs (weight, water, calories)
function updateUserInfo(name, logName, newValue, min, max) {
    //verify input is valid
    const value = Number(newValue);
    if (isNaN(value) || value < min || value > max)
        return;

    //update user object
    userObject[name] = value;
    let date = new Date();
    date.setHours(0, 0, 0, 0);
    userObject[logName][date] = value;

    //save updated object to database
    updateUser(name, value);
    updateUserLog(logName, date, value);
    console.log(name + " updated: " + userObject[name]);
    console.log(logName + " updated: " + userObject[logName]);
}

// Function to display goals
function displayGoals() {
    goalsContainer.innerHTML = ''; //clear goals before repopulation

    userObject.goals.forEach((goal, index) => {
        const goalElement = document.createElement('li');

        // Create checkbox
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = 'goal_' + index;

        // Create label for checkbox
        const label = document.createElement('label');
        label.setAttribute('for', 'goal_' + index);
        label.textContent = goal;

        goalElement.appendChild(label);
        goalElement.appendChild(checkbox);
        goalsContainer.appendChild(goalElement);
    });
}

// Add a new goal to the goal list
function addNewGoal() {
    const newGoal = newGoalInput.value.trim().replace('\"', '\'\''); //replace " with '' for parsing goal later
    if (newGoal !== '') {
        userObject.goals.push(newGoal); //add new goal to user object
        updateUser('goals', JSON.stringify(userObject.goals), true); //update the database
        displayGoals(); // Update the displayed goals
        newGoalInput.value = ''; // Clear the input field
    }
}
// remove checked goals
function removeFinishedGoals() {
    let changed = false;
    userObject.goals.forEach((goal, index) => {
        const checkbox = document.getElementById('goal_' + index);
        if (checkbox.checked) {
            userObject.goals.splice(index, 1); // Remove goal from array
            changed = true;
        }
    });
    if (changed) {
        if (userObject.goals.length == 0)
            updateUser('goals', ""); //update the database
        else
            updateUser('goals', JSON.stringify(userObject.goals), true); //update the database
        displayGoals(); // Refresh the displayed goals
    }
    
}

addGoalButton.addEventListener('click', function (event) {
    event.preventDefault(); // Prevent form submission (redirects, reload page, etc)
    addNewGoal();
});

removeGoalsButton.addEventListener('click', function (event) {
    event.preventDefault(); // Prevent form submission (redirects, reload page, etc)
    removeFinishedGoals();
});
//Create the chart to display the data
function createScatter(weightLabels, weightData, waterLabels, waterData, calorieLabels, calorieData) {
    // Create the scatter plot
    const scatterChart = new Chart(ctx, {
        type: 'scatter',
        data: {
            datasets: [
                {
                    label: 'Weight',
                    data: weightLabels.map((date, index) => ({
                        x: date,
                        y: weightData[index]
                    })),
                    type: 'line',
                    backgroundColor: 'green',
                    borderColor: 'green',
                    pointRadius: 3,
                    yAxisID: 'y-axis-weight'
                },
                {
                    label: 'Water',
                    data: waterLabels.map((date, index) => ({
                        x: date,
                        y: waterData[index]
                    })),
                    type: 'line',
                    backgroundColor: 'blue',
                    borderColor: 'blue',
                    pointRadius: 3,
                    yAxisID: 'y-axis-water'
                },
                {
                    label: 'Calories',
                    data: calorieLabels.map((date, index) => ({
                        x: date,
                        y: calorieData[index]
                    })),
                    type: 'line',
                    backgroundColor: 'red',
                    borderColor: 'red',
                    pointRadius: 3,
                    yAxisID: 'y-axis-calorie'
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    type: 'time',
                    time: {
                        unit: 'day'
                    },
                    display: true,
                    scaleLabel: {
                        display: true,
                        labelString: 'Date'
                    }
                },
                y: {
                    display: false,
                    yAxes: [{ id: 'y-axis-weight' }, { id: 'y-axis-water' }, { id: 'y-axis-calorie' }]
                }
            },
            plugins: {
                legend: {
                    onHover: function (e, legendItem) {
                        document.body.style.cursor = 'pointer';
                    },
                    onLeave: function (e, legendItem) {
                        document.body.style.cursor = 'default';
                    },
                    onClick: function (event, legendItem) {
                        //hide axis and dataset when data is hidden
                        var y_axis_id = event.chart.data.datasets[legendItem.datasetIndex].yAxisID;
                        var scaleAxis = event.chart.options.scales[y_axis_id];
                        scaleAxis.display = !scaleAxis.display;
                        event.chart.data.datasets[legendItem.datasetIndex].hidden = !event.chart.data.datasets[legendItem.datasetIndex].hidden;
                        event.chart.update();
                    },
                    display: true,
                    position: 'top'
                },
                title: {
                    display: true,
                    text: 'Weight, Water, and Calorie Logs'
                },
                zoom: {
                    zoom: {
                        wheel: {
                            enabled: true,
                        },
                        pinch: {
                            enabled: true
                        },
                        mode: 'xy',
                    }
                }
            
            }
        }
    });

}

//Parse date to format 'MM/dd'
function parseDate(dateString) {
    return moment(dateString, 'ddd MMM DD YYYY HH:mm:ss ZZ');
}

// Function to display workouts in a calendar view
function displayWeeklyCalendarSummary(workouts) {
    var today = new Date(); // Get today's date
    var past7Days = new Date(today.getTime() - (7 * 24 * 60 * 60 * 1000)); // Calculate 7 days ago

    var calendar = new FullCalendar.Calendar(weeklyCalendar, {
        initialView: 'dayGridWeek',
        initialDate: past7Days, // Set initial date as today
        eventTextColor: 'white',
        eventBackgroundColor: '#121212cd',
        handleWindowResize: true,
        contentHeight: "auto",

        events: workouts.map((workout, index) => {
            return {
                title: 'Workout',
                start: workout.date,
                duration: workout.startTime,
                extendedProps: { 'workoutId': index },
            };
        }),
        eventClick: function (info) {
            let id = info.event.extendedProps.workoutId;
            if (id !== undefined) {

                //navigate to and show only the table row selected on the calendar
                window.location.href = '/FitnessTracker/workout_history/' + '?index=' + id + '#workout_index' + id;
            }
        },
    });
    calendar.render();
}


// Attach event listeners to input elements
//currentWeightInput.addEventListener('input', () => { updateUserInfo('currentWeight', 'weightLog', currentWeightInput.value, 0, 1000); });
//dailyCaloriesInput.addEventListener('input', () => { updateUserInfo('dailyCalories', 'calorieLog', dailyCaloriesInput.value, 0, 35000); });
//dailyWaterInput.addEventListener('input', () => { updateUserInfo('waterIntake', 'waterLog', dailyWaterInput.value, 0, 500); });
//I decided to put them only when they hit the submit button

function submitDaily() {
    updateUserInfo('currentWeight', 'weightLog', currentWeightInput.value, 0, 1000);
    updateUserInfo('dailyCalories', 'calorieLog', dailyCaloriesInput.value, 0, 35000);
    updateUserInfo('waterIntake', 'waterLog', dailyWaterInput.value, 0, 500);
}

//Load the user data into the HTML
document.addEventListener('DOMContentLoaded', function () {
    let labels = data = undefined;
    if (userObject) {
        document.getElementById('userName').innerHTML += " " + userObject.username;


        //put user info into text inputs
        currentWeightInput.value = userObject.currentWeight;
        dailyCaloriesInput.value = userObject.dailyCalories;
        dailyWaterInput.value = userObject.waterIntake;
        //Display goals
        displayGoals();

        // Extracting data for the scatter plot
        weightLabels = Object.keys(userObject.weightLog).map(dateString => parseDate(dateString));
        weightData = Object.values(userObject.weightLog);
        waterLabels = Object.keys(userObject.waterLog).map(dateString => parseDate(dateString));
        waterData = Object.values(userObject.waterLog);
        calorieLabels = Object.keys(userObject.calorieLog).map(dateString => parseDate(dateString));
        calorieData = Object.values(userObject.calorieLog);

        //Scatter plot
        createScatter(weightLabels, weightData, waterLabels, waterData, calorieLabels, calorieData);

        //Weekly Calendar
        displayWeeklyCalendarSummary(userObject.workoutLog);
    }
    else { //error with userObject
        createScatter({}, {});
    }


});

