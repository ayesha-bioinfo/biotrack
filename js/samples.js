// ===============================
// GET HTML ELEMENTS
// ===============================

const tableBody =
    document.getElementById("samplesTableBody");

const searchInput =
    document.getElementById("searchInput");

const statusFilter =
    document.getElementById("statusFilter");

const noSamplesMessage =
    document.getElementById("noSamplesMessage");


// ===============================
// LOAD SAMPLES
// ===============================

let samples =
    JSON.parse(localStorage.getItem("samples")) || [];


// ===============================
// DISPLAY SAMPLES ON PAGE LOAD
// ===============================

displaySamples(samples);


// ===============================
// DISPLAY FUNCTION
// ===============================

function displaySamples(sampleArray) {

    tableBody.innerHTML = "";

    if (sampleArray.length === 0) {

        noSamplesMessage.style.display = "block";

        return;
    }

    noSamplesMessage.style.display = "none";


    sampleArray.forEach(function(sample) {

        const row =
            document.createElement("tr");

        row.innerHTML = `
            <td>${sample.id}</td>
            <td>${sample.type}</td>
            <td>${sample.analysis}</td>
            <td>${sample.status}</td>
            <td>${sample.researcher}</td>
            <td>${sample.notes || "No notes"}</td>
        `;

        tableBody.appendChild(row);

    });

}


// ===============================
// SEARCH EVENT
// ===============================

searchInput.addEventListener("input", function() {

    filterSamples();

});


// ===============================
// STATUS FILTER EVENT
// ===============================

statusFilter.addEventListener("change", function() {

    filterSamples();

});


// ===============================
// FILTER FUNCTION
// ===============================

function filterSamples() {

    const searchText =
        searchInput.value
            .toLowerCase()
            .trim();

    const selectedStatus =
        statusFilter.value;


    const filteredSamples =
        samples.filter(function(sample) {

            const matchesSearch =

                sample.id
                    .toLowerCase()
                    .includes(searchText)

                ||

                sample.researcher
                    .toLowerCase()
                    .includes(searchText)

                ||

                sample.type
                    .toLowerCase()
                    .includes(searchText)

                ||

                sample.analysis
                    .toLowerCase()
                    .includes(searchText);


            const matchesStatus =

                selectedStatus === "All"

                ||

                sample.status === selectedStatus;


            return matchesSearch && matchesStatus;

        });


    displaySamples(filteredSamples);

}