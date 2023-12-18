const tableBody = document.getElementById('workoutRows');
const calendarContainer = document.getElementById('calendar');

// Function to display workouts in a calendar view
function displayCalendarWorkouts(workouts) {
    var calendar = new FullCalendar.Calendar(calendarContainer, {
        initialView: 'dayGridMonth',
        eventTextColor: 'white',
        eventBackgroundColor: '#121212cd',
        handleWindowResize: true,
        contentHeight: "auto",
        events: workouts.map((workout, index) => {
            return {
                title: 'Workout', 
                start: workout.date, 
                duration: workout.startTime,
                extendedProps: { 'workoutId': index},
            };
        }),
        eventClick: function (info) {
            let id = info.event.extendedProps.workoutId;
            if (id !== undefined) {
                //hide all the extended table rows
                document.querySelectorAll('[id*="workout_index"]').forEach(r => {
                    const sib = r.nextSibling;
                    if (sib.classList.toggle('show'))
                        sib.classList.toggle('show');
                });

                //navigate to and show only the table row selected on the calendar
                window.location.href = './#workout_index' + id;
                const row = document.getElementById('workout_index' + id);
                const detailsRow = row.nextSibling;
                detailsRow.classList.toggle('show');
            }
        },
    });
    calendar.render();
}

//Display table view of workouts
function displayWorkoutTable(workouts) {
    userObject.workoutLog.forEach((workout, rowIndex) => {
        const [workoutRow, detailsRow] = createWorkoutRow(workout);
        tableBody.appendChild(workoutRow);
        tableBody.appendChild(detailsRow);
        workoutRow.id = `workout_index${rowIndex}`;
    });
}
function createWorkoutRow(workout) {
    const { date, startTime, duration, totalCaloriesBurned, exercises } = workout;

    const row = document.createElement('tr');
    row.style.maxWidth = "95%";
    row.style.margin = "auto";

    // Populate workout details
    row.innerHTML = `
        <td>${date}</td>
        <td>${formatTime(startTime)}</td>
        <td>${duration} min</td>
        <td>${parseFloat(totalCaloriesBurned).toFixed(0)}</td>
    `;

    // Add a click event listener to each row for toggling exercise details
    row.addEventListener('click', () => {
        const detailsRow = row.nextSibling;
        detailsRow.classList.toggle('show');
    });
    
    // Exercise details
    const detailsRow = document.createElement('tr');
    detailsRow.classList.add('exercise-details-container');
    detailsRow.classList.add('hidden');

    const detailsCell = document.createElement('td');
    detailsCell.setAttribute('colspan', '5');

    const exerciseTable = document.createElement('table');

    const exerciseTableHeader = document.createElement('tr');
    exerciseTableHeader.innerHTML = `
                <th>Exercise Name</th>
                <th>Target Muscle Area</th>
                <th>Sets</th>
                <th>Reps</th>
                <th>Weight (lbs)</th>
                <th>Time</th>
                <th>Approx Calories Burned</th>
            `;
    exerciseTable.appendChild(exerciseTableHeader);
    detailsCell.appendChild(exerciseTable);
    detailsRow.appendChild(detailsCell);

    exercises.forEach((exercise) => {
        const exerciseRow = document.createElement('tr');
        const { name, category, sets, reps, weight, duration, time, caloriesBurned } = exercise;

        let x;
        if (duration)
            x = duration + " min";
        else if (time)
            x = time + "sec";
        exerciseRow.innerHTML = `
                <td>${name}</td>
                <td>${category}</td>
                <td>${sets ? sets : ""}</td>
                <td>${reps ? reps : ""}</td>
                <td>${weight ? ((weight != 0) ? weight : "") : ""}</td>
                <td>${x ? x : ""}</td>
                <td>${parseFloat(caloriesBurned).toFixed(0)}</td>
            `;
        exerciseTable.appendChild(exerciseRow);
    });

    // Create an edit button for each workout
    const editButton = document.createElement('button');
    editButton.innerText = 'Edit';
    editButton.style.margin = "5px";
    editButton.style.height = "20px";
    editButton.style.padding = "0px";
    editButton.style.fontSize = "8pt";
    editButton.style.width = "50px";
    editButton.style.display = "inline-block";
    editButton.onclick = function () {
        redirectToEditPage(workout); // Redirect to log_workout page with workout data
    };
    exerciseTable.appendChild(editButton);

    // Create a delete button
    const delButton = document.createElement('button');
    delButton.innerText = 'Delete';
    delButton.style.margin = "5px";
    delButton.style.height = "20px";
    delButton.style.padding = "0px";
    delButton.style.fontSize = "8pt";
    delButton.style.width = "50px";
    delButton.style.display = "inline-block";
    delButton.onclick = function () {
        event.stopPropagation(); //prevent collapse/expand of table
        deleteWorkout(workout, row); // Function to delete workout from history
        displayCalendarWorkouts(userObject.workoutLog);
    };
    exerciseTable.appendChild(delButton);

    row.appendChild(delButton);
    detailsCell.appendChild(exerciseTable);
    detailsRow.appendChild(detailsCell);
    detailsRow.classList.add('exercise-details-container');
    detailsRow.classList.add('hidden');
    tableBody.appendChild(row);
    tableBody.appendChild(detailsRow);
    return [row, detailsRow];
}
      
// Convert military time to 12-hour format
function formatTime(time) {
    const [hours, minutes, seconds] = time.split(':');
    const hour = parseInt(hours, 10) % 12 || 12;
    const ampm = parseInt(hours, 10) >= 12 ? 'PM' : 'AM';
    return `${hour}:${minutes} ${ampm}`;
}


// Function to redirect to log_workout page with exercise data as a parameter
function redirectToEditPage(workout) {
    const workoutIndex = userObject.workoutLog.indexOf(workout);
    const queryString = `?workout_index=${workoutIndex}`;
    window.location.href = `/FitnessTracker/log_workout/${queryString}`;
}

//Delete the workout
function deleteWorkout(workout, tablerow) {
    if (confirm("Are you sure you want to delete this workout?")) {
        if (tablerow.nextSibling.classList.toggle('show')) //hide table below
            tablerow.nextSibling.classList.toggle('show');
        tablerow.remove();
        const index = userObject.workoutLog.indexOf(workout);
        if (index !== -1) {
            userObject.workoutLog.splice(index, 1);
            updateUserWorkouts('workoutLog', JSON.stringify(userObject.workoutLog));   
        }
    }
}

document.addEventListener('DOMContentLoaded', function () {
    let workouts = userObject.workoutLog;
    displayCalendarWorkouts(workouts);
    displayWorkoutTable(workouts);

    const urlParams = new URLSearchParams(window.location.search);
    const workoutIndex = urlParams.get('index');
    if (workoutIndex !== null) {
        const row = document.getElementById('workout_index' + workoutIndex);
        const detailsRow = row.nextSibling;
        detailsRow.classList.toggle('show');
    }
});