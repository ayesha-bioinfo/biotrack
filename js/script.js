// Select HTML elements
const form = document.getElementById("sampleForm");
const sampleList = document.getElementById("sampleList");

const sampleId = document.getElementById("sampleId");
const sampleType = document.getElementById("sampleType");
const analysisType = document.getElementById("analysisType");
const status = document.getElementById("status");
const researcher = document.getElementById("researcher");
const notes = document.getElementById("notes");

// Load existing samples from localStorage
let samples = JSON.parse(localStorage.getItem("samples")) || [];

// Track which sample is being edited
let editingIndex = null;


// Only run this code if the sample form exists on the page
if (form && sampleList) {

    // Display samples when page loads
    displaySamples();


    // Handle form submission
    form.addEventListener("submit", function(event) {

        event.preventDefault();

        const sample = {
            id: sampleId.value.trim(),
            type: sampleType.value,
            analysis: analysisType.value,
            status: status.value,
            researcher: researcher.value.trim(),
            notes: notes.value.trim()
        };


        // Basic validation
        if (sample.id === "") {

            alert("Please enter a Sample ID.");

            return;
        }


        // Update existing sample
        if (editingIndex !== null) {

            samples[editingIndex] = sample;

            editingIndex = null;

        } else {

            // Add new sample
            samples.push(sample);
        }


        saveSamples();

        displaySamples();

        form.reset();

    });

}


// Save samples to localStorage
function saveSamples() {

    localStorage.setItem(
        "samples",
        JSON.stringify(samples)
    );

}


// Display all samples
function displaySamples() {

    sampleList.innerHTML = "";


    if (samples.length === 0) {

        sampleList.innerHTML =
            "<p>No samples added yet.</p>";

        return;
    }


    samples.forEach(function(sample, index) {

        const newSample =
            document.createElement("div");

        newSample.classList.add("sample-card");


        newSample.innerHTML = `
            <h3>${sample.id}</h3>

            <p>
                <strong>Sample Type:</strong>
                ${sample.type}
            </p>

            <p>
                <strong>Analysis:</strong>
                ${sample.analysis}
            </p>

            <p>
                <strong>Status:</strong>
                ${sample.status}
            </p>

            <p>
                <strong>Researcher:</strong>
                ${sample.researcher}
            </p>

            <p>
                <strong>Notes:</strong>
                ${sample.notes || "No notes"}
            </p>

            <button class="edit-btn">
                Edit
            </button>

            <button class="delete-btn">
                Delete
            </button>
        `;


        sampleList.appendChild(newSample);


        // Edit button
        const editButton =
            newSample.querySelector(".edit-btn");


        editButton.addEventListener(
            "click",
            function() {

                editSample(index);

            }
        );


        // Delete button
        const deleteButton =
            newSample.querySelector(".delete-btn");


        deleteButton.addEventListener(
            "click",
            function() {

                deleteSample(index);

            }
        );

    });

}


// Edit sample
function editSample(index) {

    const sample = samples[index];

    sampleId.value = sample.id;

    sampleType.value = sample.type;

    analysisType.value = sample.analysis;

    status.value = sample.status;

    researcher.value = sample.researcher;

    notes.value = sample.notes;

    editingIndex = index;


    // Scroll back to the form
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

}


// Delete sample
function deleteSample(index) {

    const confirmDelete =
        confirm("Are you sure you want to delete this sample?");


    if (!confirmDelete) {

        return;

    }


    samples.splice(index, 1);

    saveSamples();

    displaySamples();

}