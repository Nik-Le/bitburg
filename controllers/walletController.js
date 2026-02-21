const  passwordEntry = require('../models/Passwords')

//POST für Passwortspeichervorgang
exports.addPassword = async (req, res) => {
    try {
        const {iv, entry} = req.body;
        const owner = req.session.userId;

        /**const usageExist = await passwordEntry.findOne({
            siteName: siteName,
            owner: owner
        });

        if (usageExist){
            console.log("User hat diesen Eintrag bereits");
            return res.status(400).json({ error: 'Du hast bereits ein Passwort für diese Seite gespeichert.' });
        };*/

        const newPasswort = new passwordEntry({iv, entry, owner});
        const savedEntry = await newPasswort.save();

        

        console.log("saved entry", savedEntry)
        console.log("Password added successfully");

        return res.status(200).json({
            message: 'Erfolgreich',
            success: true,
            redirectUrl: '/wallet'
        });
    }
        catch (error) {
            console.error(error);
            res.status(500).json({error:"Server Fehler beim Registrieren",
            message: "Ein Fehler ist aufgetreten",
            success: false});
        }
};

exports.removePassword = async (req, res) => {
    try {
        const id = req.params.id;
        await passwordEntry.findByIdAndDelete(id);

        return res.status(200).json({
            message: 'Erfolgreich',
            redirectUrl: '/wallet'
        });
    }
    catch(error) {
        console.error("Fehler beim Löschen:", error);
        res.status(500).send("Fehler beim Löschen des Eintrags.");
    }
};