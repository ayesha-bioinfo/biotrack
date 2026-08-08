// Load samples from localStorage
const samples =
    JSON.parse(localStorage.getItem("samples")) || [];


// Count total samples
const total = samples.length;


// Count each status
const pending =
    samples.filter(function(sample) {
        return sample.status === "Pending";
    }).length;


const inProgress =
    samples.filter(function(sample) {
        return sample.status === "In Progress";
    }).length;


const completed =
    samples.filter(function(sample) {
        return sample.status === "Completed";
    }).length;


// Update summary cards
document.getElementById("totalSamples").innerText = total;

document.getElementById("pendingSamples").innerText = pending;

document.getElementById("progressSamples").innerText = inProgress;

document.getElementById("completedSamples").innerText = completed;


// Update count labels beside bars
document.getElementById("pendingCount").innerText = pending;

document.getElementById("progressCount").innerText = inProgress;

document.getElementById("completedCount").innerText = completed;


// Calculate percentages
let pendingPercent = 0;
let progressPercent = 0;
let completedPercent = 0;


if (total > 0) {

    pendingPercent =
        (pending / total) * 100;

    progressPercent =
        (inProgress / total) * 100;

    completedPercent =
        (completed / total) * 100;

}


// Set bar widths
document.getElementById("pendingBar").style.width =
    pendingPercent + "%";

document.getElementById("progressBar").style.width =
    progressPercent + "%";

document.getElementById("completedBar").style.width =
    completedPercent + "%";