import Program from "../models/program.js";

export async function getProgram(req, res) {
    try {
        const programs = await Program.find();
        res.status(200).json(programs);
    } catch (error) {
        res.status(500).json({ message: 'Error al cargar los programas', error });
    }
}