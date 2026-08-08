const contactForm =
    document.getElementById("contactForm");

const contactSuccess =
    document.getElementById("contactSuccess");


contactForm.addEventListener("submit", function(event) {

    event.preventDefault();

    const name =
        document.getElementById("contactName").value.trim();

    contactSuccess.textContent =
        "Thank you, " + name + "! Your message has been received.";

    contactForm.reset();

});