
function generatePassword () {
    let password = "";

    for (let i = 0; i < 12; i++) {
        password = password + String.fromCharCode(Math.floor(Math.random() * (126 - 33 + 1)) + 33);

    }

    console.log(password);
    document.getElementById("password-input").value = password;
}