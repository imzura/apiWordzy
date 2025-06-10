import Topic from "../models/topic.js";

export async function getTopic(req, res) {
    try {
        const topics = await Topic.find();
        res.status(200).json(topics);
    } catch (error) {
        res.status(500).json({ message: 'Error al cargar los temas', error });
    }
}

export async function postTopic(req, res) {
    try {
        const { name, description } = req.body;

        const existingTopic = await Topic.findOne({ name });

        if (existingTopic) {
            return res.status(400).json({ message: "Ya existe un tema con ese nombre." });
        }

        const topic = new Topic({ name, description });
        await topic.save();

        res.status(201).json({ message: 'Tema creado correctamente' });
    } catch (error) {
        res.status(500).json({ message: 'Error al crear el tema', error });
    }
}

export async function putTopic(req, res) {
  const { id } = req.params;
  const { name, status, description } = req.body;

  try {
    // Verifica si otro tema (con diferente ID) ya tiene ese nombre exacto
    const duplicate = await Topic.findOne({ name, _id: { $ne: id } });

    if (duplicate) {
      return res.status(400).json({ message: "Ya existe otro tema con ese nombre." });
    }

    const updatedTopic = await Topic.findByIdAndUpdate(
      id,
      { name, status, description },
      { new: true }
    );

    if (!updatedTopic) {
      return res.status(404).json({ message: "Tema no encontrado" });
    }

    res.status(200).json({ message: "Tema actualizado exitosamente", updatedTopic });
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar el tema", error });
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

