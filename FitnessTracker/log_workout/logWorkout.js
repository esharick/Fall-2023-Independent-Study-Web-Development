let workoutExercises = []; // Array to store workout exercises
let exerciseElementBeingEditted = null;
let exerciseBeingEditted = null;
const allBuiltinExercises = [];
const addEditWorkoutLabel = document.getElementById('addEditWorkoutLabel');
const suggestWorkoutButton = document.getElementById('suggestWorkoutButton');
const suggestWorkoutModal = document.getElementById('workoutModal');
const form = document.getElementById('workoutCategoriesForm');
const workoutForm = document.getElementById('workoutForm');
const workoutDate = document.getElementById('workoutDate');
const startTime = document.getElementById('startTime');
const workoutDuration = document.getElementById('workoutDuration');
const exerciseForm = document.getElementById('exerciseForm');
const exerciseName = document.getElementById('exerciseName');
const category = document.getElementById('category');
const sets = document.getElementById('sets');
const reps = document.getElementById('reps');
const weight = document.getElementById('weight');
const duration = document.getElementById('duration');
const time = document.getElementById('time');
const exerciseList = document.getElementById('exerciseList');
const addEditLabel = document.getElementById('addEditLabel');
const addExerciseBtn = document.getElementById('addExerciseBtn');
const editExerciseBtn = document.getElementById('editExerciseBtn');
const logWorkoutBtn = document.getElementById('logWorkoutButton');
const updateWorkoutBtn = document.getElementById('updateWorkoutButton');
const otherInputs = document.getElementById('otherInputs');
const customExerciseName = document.getElementById('customExerciseName');
const customCategory = document.getElementById('customCategory');


function addExercise() {
    // Validate name and category entered
    if (!exerciseName.value || !category.value) {
        alert('Please fill in exercise name and category.');
        return;
    }

    //Check other category or name
    let other = exerciseName.value === "Other" || category.value === "Other";
    if (other && (!customExerciseName.value || !customCategory.value)) {
        alert('Please fill in custom exercise name and category.');
        toggleExerciseForm();
        return;
    }
    
    const newExercise = new Exercise(other ? customExerciseName.value : exerciseName.value,
        other ? customCategory.value : category.value, sets.value, reps.value, weight.value, duration.value, time.value);
    workoutExercises.push(newExercise);

    // Container for list item and corresponding buttons
    const exerciseElement = document.createElement('div');
    exerciseElement.style.border = "2px solid #357377bc";
    exerciseElement.style.borderRadius = "10px";
    exerciseElement.style.backgroundColor = "#a7faff6f";
    exerciseElement.style.margin = "5px";
    exerciseElement.style.padding = "5px";

    populateExerciseElement(newExercise, exerciseElement);

    // Append the exercise to the list
    exerciseList.appendChild(exerciseElement);

    // Clear form fields after adding the exercise
    exerciseForm.reset();

}


function saveEditedExercise() {
    // Validate name and category entered
    if (!exerciseName.value || !category.value) {
        alert('Please select an exercise name and category.');
        return;
    }

    //Check other category or name
    let other = exerciseName.value === "Other" || category.value === "Other";
    if (other && (!customExerciseName.value || !customCategory.value)) {
        alert('Please fill in custom exercise name and category.');
        toggleExerciseForm();
        return;
    }

    //change exercise object   
    exerciseBeingEditted.name = other ? customExerciseName.value : exerciseName.value;
    exerciseBeingEditted.category = other ? customCategory.value : category.value;
    exerciseBeingEditted.sets = sets.value;
    exerciseBeingEditted.reps = reps.value;
    exerciseBeingEditted.weight = weight.value;
    exerciseBeingEditted.duration = duration.value;
    exerciseBeingEditted.time = time.value;
    exerciseBeingEditted.updateCaloriesBurned();

    //repopulate element
    exerciseElementBeingEditted.textContent = '';
    populateExerciseElement(exerciseBeingEditted, exerciseElementBeingEditted);

    //reset globals
    exerciseBeingEditted = null;
    exerciseElementBeingEditted = null;

    //reset forms
    exerciseForm.reset();
    toggleAddEditButtons();
    scrollToExerciseList();
}

function populateExerciseElement(exercise, exerciseElement) {
    // Create list item for the new exercise
    const exerciseText = document.createElement('p');
    let contentStr = `${exercise.name} - Target Area: ${exercise.category}`;
    contentStr += exercise.sets ? `, Sets: ${exercise.sets}` : "";
    contentStr += exercise.reps ? `, Reps: ${exercise.reps}` : "";
    contentStr += exercise.weight ? `, Weight: ${exercise.weight}` : "";
    contentStr += exercise.time ? `, Time: ${exercise.time} seconds` : "";
    contentStr += exercise.duration ? `, Duration: ${exercise.duration} minutes.` : "";

    exerciseText.textContent = contentStr;
    exerciseText.style.padding = "5px";
    exerciseText.style.margin = "5px";
    exerciseText.style.color = "Black";

    // Create an edit button for the exercise
    const editButton = document.createElement('span');
    editButton.textContent = 'Edit';
    editButton.style.padding = "1em";
    editButton.classList.add("hover-over-label");
    editButton.onclick = function () {
        editExercise(exercise, exerciseElement);
    };

    // Create a delete button for the exercise
    const removeButton = document.createElement('span');
    removeButton.textContent = 'Remove';
    removeButton.classList.add("hover-over-label");
    removeButton.onclick = function () {
        removeExercise(exercise, exerciseElement);
    };

    exerciseElement.appendChild(exerciseText);
    exerciseElement.appendChild(editButton);
    exerciseElement.appendChild(removeButton);
}



function editExercise(exercise, exerciseElement) {
    exerciseForm.reset();
    exerciseName.value = exercise.name;
    category.value = exercise.category;
    if (!exerciseName.value || !category.value) {
        exerciseName.value = "Other";
        category.value = "Other";
        customExerciseName.value = exercise.name;
        customCategory.value = exercise.category;
        toggleCustomInputs(true);
    } else toggleCustomInputs(false);

    sets.value = exercise.sets;
    reps.value = exercise.reps;
    weight.value = exercise.weight;
    duration.value = exercise.duration;
    time.value = exercise.time;

    if (exerciseForm.style.display === 'none') 
        exerciseForm.style.display = 'block';
    //Toggle add/edit button and label
    toggleAddEditButtons('edit');
    scrollToExerciseForm();
    exerciseElementBeingEditted = exerciseElement;
    exerciseBeingEditted = exercise;
}

function removeExercise(exercise, exerciseElement) {
    //remove exercise from list of exercises
    let i = workoutExercises.indexOf(exercise);
    workoutExercises.splice(i, 1);
    //find child in exercise list and remove the exercise element from the display
    for (let j = 0; j < exerciseList.children.length; j++) {
        let c = exerciseList.children[j];
        if (c === exerciseElement) {
            exerciseElement.remove();
            break;
        }
    }
}

function scrollToExerciseForm() {
    const yOffset = -150;
    const y = exerciseForm.getBoundingClientRect().top + window.pageYOffset + yOffset;
    window.scrollTo({ top: y, behavior: 'smooth' });
}

function scrollToExerciseList() {
    const yOffset = -150;
    const y = exerciseList.getBoundingClientRect().top + window.pageYOffset + yOffset;
    window.scrollTo({ top: y, behavior: 'smooth' });
}

function logWorkout() {


    // Validate if any field is empty (add your validation logic)
    if (!workoutDate.value || !startTime.value || !workoutDuration.value) {
        alert('Please fill in the date, start time and duration for the workout.');
        return;
    }
    if (workoutExercises.length == 0) {
        alert('Please enter at least one exercise.');
        return;
    }

    // Create a workout object
    const newWorkout = new Workout(workoutDate.value, startTime.value, workoutDuration.value);
    workoutExercises.forEach(e => newWorkout.addExercise(e));

    //Save workout to user profile
    userObject.logWorkout(newWorkout);
    //Update database
    updateUserWorkouts('workoutLog', JSON.stringify(userObject.workoutLog));

    //Redirect to workout history page to display new workout
    window.location.href = '/FitnessTracker/workout_history/';

}

function updateWorkout() {

    // Validate if any field is empty (add your validation logic)
    if (!workoutDate.value || !startTime.value || !workoutDuration.value) {
        alert('Please fill in the date, start time and duration for the workout.');
        return;
    }
    if (workoutExercises.length == 0) {
        alert('Please enter at least one exercise.');
        return;
    }
 
    // Create a workout object 
    const newWorkout = new Workout(workoutDate.value, startTime.value, workoutDuration.value);
    workoutExercises.forEach(e => newWorkout.addExercise(e));

    //Replace workout in workout log with new workout
    const urlParams = new URLSearchParams(window.location.search);
    const workoutIndex = urlParams.get('workout_index');
    userObject.workoutLog.splice(workoutIndex, 1, newWorkout);

    //Update database
    updateUserWorkouts('workoutLog', JSON.stringify(userObject.workoutLog));

    //Redirect to workout history page to display new workout
    window.location.href = '/FitnessTracker/workout_history/';
}

//Show/hide the exercise form
function toggleExerciseForm() {
    if (exerciseForm.style.display === 'none') {
        exerciseForm.style.display = 'block';
    } else {
        exerciseForm.style.display = 'none';
    }
}

//Toggle state of form
function toggleAddEditButtons(state="add") {
    if (state == "add") {
        addEditLabel.innerHTML = "Add exercise";
        addExerciseBtn.style.display = 'block';
        editExerciseBtn.style.display = 'none';
    } else {
        addEditLabel.innerHTML = "Edit exercise";
        addExerciseBtn.style.display = 'none';
        editExerciseBtn.style.display = 'block';
    }
}

function formatDate(date) {
    const d = new Date(date);

    const year = d.getFullYear();
    let month = '' + (d.getMonth() + 1); //january is 0
    let day = '' + d.getDate();
    let hours = '' + d.getHours();
    let minutes = '' + d.getMinutes();

    //format single digits
    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;
    if (hours.length < 2) hours = '0' + hours;
    if (minutes.length < 2) minutes = '0' + minutes;

    return `${year}-${month}-${day}`;
}

function populateCurrentTime() {
    const currentDate = formatDate(new Date()); // Get current date
    const currentTime = new Date().toLocaleTimeString('en-US', { hour12: false }); // Get current time in HH:MM format

    // Set values in date and time input fields
    workoutDate.value = currentDate;
    startTime.value = currentTime;
}

function populateEditableWorkout(workoutIndex) {
    //Change the title of the first header from "Add Workout" to "Edit Workout"
    addEditWorkoutLabel.textContent = 'Edit Workout';
    suggestWorkoutButton.style.display = 'none';

    //populate fields with the workout at the index in the url param
    const workout = userObject.workoutLog[workoutIndex];
    workoutDate.value = workout.date;
    startTime.value = workout.startTime;
    workoutDuration.value = workout.duration;

    //Populate exercises completed list:
    workout.exercises.forEach(exerciseObj => {
        const {
            name, category, sets, reps, weight, duration, time, caloriesBurned 
        } = exerciseObj;
        let exercise = new Exercise(name, category, sets, reps, weight, duration, time);
        // Container for list item and corresponding buttons
        const exerciseElement = document.createElement('div');
        exerciseElement.style.border = "2px solid #357377bc";
        exerciseElement.style.borderRadius = "10px";
        exerciseElement.style.backgroundColor = "#a7faff6f";
        exerciseElement.style.margin = "5px";
        exerciseElement.style.padding = "5px";

        populateExerciseElement(exercise, exerciseElement);

        // Append the exercise to the list
        exerciseList.appendChild(exerciseElement);

        // Add to the workout list
        workoutExercises.push(exercise);
    });

  
    //Change the button being displayed
    updateWorkoutBtn.style.display = 'block';
    logWorkoutBtn.style.display = 'none';
}

function populateExerciseSuggestions() {
    fetch('/FitnessTracker/exercises.xml')
        .then(response => response.text())
        .then(data => {
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(data, 'text/xml');

            const categories = xmlDoc.getElementsByTagName('category');

            for (const c of categories) {
                const categoryName = c.getAttribute('name');
                const exercises = c.getElementsByTagName('exercise');

                //Option group for exercise dropdown
                const optGroup = document.createElement('optgroup');
                optGroup.label = categoryName;

                //Option for category dropdown
                const categoryOption = document.createElement('option');
                categoryOption.textContent = categoryName;
                categoryOption.value = categoryName;

                for (const exercise of exercises) {
                    const exerciseName = exercise.getAttribute('name');
                    const option = document.createElement('option');
                    option.textContent = exerciseName;
                    option.value = exerciseName;

                    optGroup.appendChild(option);

                    allBuiltinExercises.push({
                        name: exerciseName,
                        category: categoryName,
                        suggestedWeight: exercise.getAttribute('suggestedWeight'),
                        suggestedSets: exercise.getAttribute('suggestedSets'),
                        suggestedReps: exercise.getAttribute('suggestedReps'),
                        suggestedDuration: exercise.getAttribute('suggestedDuration'),
                        suggestedTime: exercise.getAttribute('suggestedTime'),

                    });
                }
                category.appendChild(categoryOption);
                exerciseName.appendChild(optGroup);
            }
        })
        .catch(error => {
            console.error('Error fetching exercises:', error);
        });
}

function suggestWorkout() {
    suggestWorkoutModal.style.display = 'block';

}

function closeModal() {
    suggestWorkoutModal.style.display = 'none';
}

// Function to generate the workout based on selected categories from modal
function generateWorkout() {
    const selectedCategories = Array.from(form.elements)
        .filter((checkbox) => checkbox.checked)
        .map((checkbox) => checkbox.value);

    if (selectedCategories.length == 0) {
        alert("Please select at least one category.");
        return;
    }

    const categoriesToPickFrom = [];
    if (selectedCategories.includes("Upper body")) {
        categoriesToPickFrom.push("Chest");
    }
    if (selectedCategories.includes("Lower body")) {
        categoriesToPickFrom.push("Legs");
    }
    if (selectedCategories.includes("Back and core")) {
        categoriesToPickFrom.push("Back", "Core");
    }
    if (selectedCategories.includes("Full body")) {
        categoriesToPickFrom.push("Chest", "Arms", "Shoulders", "Legs", "Back", "Core");
    }
    if (selectedCategories.includes("Cardio")) {
        categoriesToPickFrom.push("Cardio");
    }
    if (selectedCategories.includes("Surprise me!")) {
        categoriesToPickFrom.push("Chest", "Arms", "Shoulders", "Legs", "Back", "Core", "Cardio");
    }

    //clear forms before repopulating
    workoutExercises = [];
    workoutForm.reset();
    populateCurrentTime();
    exerciseList.innerHTML = '<h5>Exercises completed:</h5>'; // Clear the exercise list

    //randomly select exercises from built-in list that contain categories that match
    const selectedExercises = allBuiltinExercises.filter((exercise) =>
        categoriesToPickFrom.includes(exercise.category)
    );
    

    const numExercises = 6;
    for (let i = 0; i < numExercises; i++) {
        let x = Math.floor(Math.random() * selectedExercises.length);
        let randomExercise = selectedExercises[x];
        console.log(randomExercise);

        let exercise = new Exercise(randomExercise.name, randomExercise.category, randomExercise.suggestedSets,
            randomExercise.suggestedReps, randomExercise.suggestedWeight, randomExercise.suggestedDuration, randomExercise.suggestedTime);

        exercise.updateCaloriesBurned();
        addExerciseFromExerciseObject(exercise);
    }
    

    // Close the modal after generating the workout
    closeModal();
}

function addExerciseFromExerciseObject(exercise) {
    workoutExercises.push(exercise);
    // Container for list item and corresponding buttons
    const exerciseElement = document.createElement('div');
    exerciseElement.style.border = "2px solid #357377bc";
    exerciseElement.style.borderRadius = "10px";
    exerciseElement.style.backgroundColor = "#a7faff6f";
    exerciseElement.style.margin = "5px";
    exerciseElement.style.padding = "5px";

    populateExerciseElement(exercise, exerciseElement);

    // Append the exercise to the list
    exerciseList.appendChild(exerciseElement);
}

// Function to update category based on selected exercise name
function updateCategoryBasedOnExercise() {
    const selectedExercise = exerciseName.value;
    const correspondingCategory = exerciseName.querySelector(`option[value="${selectedExercise}"]`).parentElement.label;
    category.value = correspondingCategory;
}

function toggleCustomInputs(on=true) {
    // Show/hide additional inputs
    if (on) 
        otherInputs.style.display = 'block';
    else 
        otherInputs.style.display = 'none';
}

// Event listeners for changes in the select elements
exerciseName.addEventListener('change', updateCategoryBasedOnExercise);
exerciseName.addEventListener('change', function () {
    // Show additional inputs if "other" is selected in category
    if (exerciseName.value === 'Other') {
        otherInputs.style.display = 'block';
    } else {
        otherInputs.style.display = 'none';
    }
});
category.addEventListener('change', function () {
    // Show additional inputs if "other" is selected in category
    if (category.value === 'Other') {
        otherInputs.style.display = 'block';
    } else {
        otherInputs.style.display = 'none';
    }
});

window.onload = function () {
    const urlParams = new URLSearchParams(window.location.search);
    const workoutIndex = urlParams.get('workout_index');
    if (workoutIndex !== null) 
        populateEditableWorkout(workoutIndex);
    else //populating for new workout
        populateCurrentTime();

    populateExerciseSuggestions();

};