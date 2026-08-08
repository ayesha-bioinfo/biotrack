const researchersTableBody =
    document.getElementById("researchersTableBody");

const noResearchersMessage =
    document.getElementById("noResearchersMessage");

const samples =
    JSON.parse(localStorage.getItem("samples")) || [];

const researcherSummary = {};

samples.forEach(function(sample) {

    const name = sample.researcher.trim();

    if (name === "") {
        return;
    }

    if (!researcherSummary[name]) {

        researcherSummary[name] = {
            total: 0,
            pending: 0,
            inProgress: 0,
            completed: 0
        };

    }

    researcherSummary[name].total++;

    if (sample.status === "Pending") {
        researcherSummary[name].pending++;
    }

    if (sample.status === "In Progress") {
        researcherSummary[name].inProgress++;
    }

    if (sample.status === "Completed") {
        researcherSummary[name].completed++;
    }

});

displayResearchers();


function displayResearchers() {

    researchersTableBody.innerHTML = "";

    const researcherNames =
        Object.keys(researcherSummary);

    if (researcherNames.length === 0) {

        noResearchersMessage.style.display = "block";

        return;
    }

    noResearchersMessage.style.display = "none";


    researcherNames.forEach(function(name) {

        const researcher =
            researcherSummary[name];

        const row =
            document.createElement("tr");

        row.innerHTML = `
            <td>${name}</td>
            <td>${researcher.total}</td>
            <td>${researcher.pending}</td>
            <td>${researcher.inProgress}</td>
            <td>${researcher.completed}</td>
        `;

        researchersTableBody.appendChild(row);

    });

}