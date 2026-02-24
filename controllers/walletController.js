const passwordEntry = require('../models/Passwords');

/**
 * Saves a new encrypted password entry to the database.
 * @param {Object} req - The Express request object.
 * @param {Object} res - The Express response object.
 */
exports.addPassword = async (req, res) => {
    try {
        const { iv, entry } = req.body;
        const owner = req.session.userId;

        const newPasswort = new passwordEntry({ iv, entry, owner });
        const savedEntry = await newPasswort.save();

        console.log("saved entry", savedEntry);
        console.log("Password added successfully");

        return res.status(200).json({
            message: 'Erfolgreich',
            success: true,
            redirectUrl: '/wallet'
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: "Server Fehler beim Speichern", 
            message: "Ein Fehler ist aufgetreten",
            success: false
        });
    }
};

/**
 * Deletes a specific password entry from the database by its ID.
 * @param {Object} req - The Express request object.
 * @param {Object} res - The Express response object.
 */
exports.removePassword = async (req, res) => {
    try {
        const id = req.params.id;
        await passwordEntry.findByIdAndDelete(id);

        return res.status(200).json({
            message: 'Erfolgreich',
            redirectUrl: '/wallet'
        });
    } catch(error) {
        console.error("Fehler beim Löschen:", error);
        res.status(500).send("Fehler beim Löschen des Eintrags.");
    }
};