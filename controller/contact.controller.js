const contact = require('../models/contact');

exports.contact = async (req, res) => {
    try {
        //body se name email or description lena 
        const { name, email, description } = req.body;
        //form ka data create karna 
        const user = await contact.create({ name, email, description })
        res.send(201).json({ msg: 'thanks for giving opinions' })

    } catch (error) {
        res.status(400).json({ msg: err.message });
    }
}