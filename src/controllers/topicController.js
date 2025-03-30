import Topic from '../models/topic.js'

export async function getTopic(req, res) {
    try {
        const topics = await Topic.find();

        if (topics.length === 0) {
            return res.status(404).json({ message: 'No hay temas registrados' });
        }

        res.status(200).json(topics);
    } catch (error) {
        res.status(500).json({ message: 'Error al cargar los temas', error });
    }
}

export async function postTopic(req, res) {
    const body = req.body;
    try {
        const topic = new Topic(body);
        await topic.save();

        res.status(201).json({ message: 'Tema creado correctamente' });
    } catch (error) {
        res.status(500).json({ message: 'Error al crear el tema', error });
    }
}

export async function putTopic(req, res) {
    const { id } = req.params; // Obtener el ID desde los parámetros de la URL
    const { name, status } = req.body; // Obtener los datos a actualizar

    try {
        const updatedTopic = await Topic.findByIdAndUpdate( id, { name, status }, { new: true });

        if (!updatedTopic) {
            return res.status(404).json({ message: 'Tema no encontrado' });
        }

        res.status(200).json({ message: 'Tema actualizado exitosamente', updatedTopic });
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar el tema', error });
    }
}

export async function deleteTopic(req, res) {
    const { id } = req.params;

    try {
        const eliminatedTopic = await Topic.findByIdAndDelete(id);
        
        if (!eliminatedTopic) {
            return res.status(404).json({ message: 'Tema no encontrado' });
        }

        res.status(200).json({ message: 'Tema eliminado exitosamente' });
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar el tema', error });
    }
}

