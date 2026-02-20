const  passwordEntry = require('../models/Passwords')

//POST für Passwortspeichervorgang
exports.addPassword = async (req, res) => {
    try {
        const {userName, siteName, password} = req.body;
        const owner = req.session.userId;
        if(!(userName)||!(siteName)||!(password)){
            return res.status(400).json({error:"Invalid username",
                                            message:"Ungültige Eingabe",
                                            success: false});
        }
        const usageExist = await passwordEntry.findOne({
            siteName: siteName,
            owner: owner
        });

        if (usageExist){
            return res.status(400).json({ error: 'siteName already exists' ,
                                            message: 'Sie haben bereits ein Passwort für diese Seite gespeichert.',
                                            success: false});
        }

        const newPasswort = new passwordEntry({password, userName, siteName, owner});
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