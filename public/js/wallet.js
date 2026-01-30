// Funktion dient dazu, dass die Events erst gehoert werden wenn HTML DOM Fertig gebaut ist
let form_visible = false;

document.addEventListener("DOMContentLoaded", function() {
    const addBtn = document.getElementById("add-button");

    addBtn.addEventListener("click", function() {
        form_visible ? removeForm() : showForm();
    });
})

function showForm() {
    document.getElementById("popup-form").style.visibility = "visible";
    form_visible = true
}
function removeForm() {
    document.getElementById("popup-form").style.visibility = "hidden";
    form_visible = false;
}