const  passwordEntry = require('../models/Passwords')

//POST für Passwortspeichervorgang
exports.addPassword = async (req, res) => {
    try {
        const {username,siteName, password} = req.body;
        const usageExists = await passwordEntry.findOne({siteName: siteName});
        if (usageExists) {
            console.log("Entry already exist");
            return res.status(400).json({error: 'Es existiert bereits ein Eintrag zu dieser Seite'})
        }
        const owner = req.session.userId
        const newPasswort = new passwordEntry({password, username, siteName, owner});
        await newPasswort.save();
        console.log("Password added successfully");
        return res.status(200).json({
            message: 'Erfolgreich',
            redirectUrl: '/wallet'
        });
    }
        catch (error) {
            console.error(error);
            res.status(500).send("Server Fehler beim Registrieren");
        }
};