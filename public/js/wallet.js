let form_visible = false;

// Funktion dient dazu, dass die Events erst gehoert werden wenn HTML DOM Fertig gebaut ist
document.addEventListener("DOMContentLoaded", function() {
    const addBtn = document.getElementById("add-button");
    const cancelBtn = document.getElementById("cancel-button");

    addBtn.addEventListener("click", function() {
        form_visible ? removeForm() : showForm();
    });

    cancelBtn.addEventListener("click", function() {
        form_visible ? removeForm() : showForm();
    });
    

})

function showForm() {
    document.getElementById("frmPopupForm").style.visibility = "visible";
    form_visible = true
}
function removeForm() {
    document.getElementById("frmPopupForm").style.visibility = "hidden";
    form_visible = false;
}