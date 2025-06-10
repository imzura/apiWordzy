import CourseProgramming from "../models/courseProgramming.js";
import Program from '../models/program.js';
import Topic from '../models/topic.js';
import Evaluation from '../models/evaluation.js';
import SupportMaterial from '../models/supportMaterial.js';

export async function getCourseProgramming(req, res) {
    try {
        const courses = await CourseProgramming.find()
            .populate('programId')
        res.status(200).json(courses);
    } catch (error) {
        res.status(500).json({ message: 'Error al cargar las programaciones', error });
    }
};

export async function createCourseProgramming(req, res) {
    try {
        const { programId, startDate, endDate, status, levels } = req.body;

        // Validar existencia de programa
        const program = await Program.findById(programId);
        if (!program) {
            return res.status(400).json({ message: 'El programa no existe.' });
        }

        // Validar mínimo 3 niveles
        if (!Array.isArray(levels) || levels.length < 3) {
            return res.status(400).json({ message: 'Debe incluir al menos 3 niveles.' });
        }

        const allTopicIds = [];
        const allActivityIds = [];
        const allExamIds = [];
        const allMaterialIds = [];

        let hasValidLevel = false;

        for (const level of levels) {
            if (!Array.isArray(level.topics)) continue;

            const topicSum = level.topics.reduce((sum, t) => sum + t.value, 0);
            if (topicSum === 100) {
                for (const topic of level.topics) {
                    const actSum = (topic.activities || []).reduce((sum, a) => sum + a.value, 0);
                    const examSum = (topic.exams || []).reduce((sum, e) => sum + e.value, 0);
                    const hasMaterial = Array.isArray(topic.materials) && topic.materials.length > 0;

                    if (actSum === 100 && examSum === 100 && hasMaterial) {
                        hasValidLevel = true;
                    }
                }
            }

            for (const topic of level.topics) {
                if (!topic.topicId || topic.value == null) {
                    return res.status(400).json({ message: 'Cada tema debe tener un ID y un valor.' });
                }

                allTopicIds.push(topic.topicId);

                for (const activity of topic.activities || []) {
                    if (!activity.evaluationId || activity.value == null) {
                        return res.status(400).json({ message: 'Cada actividad debe tener un ID y un valor.' });
                    }
                    allActivityIds.push(activity.evaluationId);
                }

                for (const exam of topic.exams || []) {
                    if (!exam.evaluationId || exam.value == null) {
                        return res.status(400).json({ message: 'Cada examen debe tener un ID y un valor.' });
                    }
                    allExamIds.push(exam.evaluationId);
                }

                for (const material of topic.materials || []) {
                    if (!material.materialId) {
                        return res.status(400).json({ message: 'Cada material debe tener un ID.' });
                    }
                    allMaterialIds.push(material.materialId);
                }
            }
        }

        if (!hasValidLevel) {
            return res.status(400).json({
                message: 'Al menos un nivel debe tener temas con 100% de valor, y al menos un tema con actividades 100%, exámenes 100% y materiales de apoyo.'
            });
        }

        const [validTopics, validEvaluations, validMaterials] = await Promise.all([
            Topic.find({ _id: { $in: allTopicIds } }),
            Evaluation.find({ _id: { $in: [...allActivityIds, ...allExamIds] } }),
            SupportMaterial.find({ _id: { $in: allMaterialIds } })
        ]);

        if (validTopics.length !== allTopicIds.length) {
            return res.status(400).json({ message: 'Algunos temas no existen.' });
        }

        const evalMap = new Map(validEvaluations.map(e => [e._id.toString(), e]));

        const invalidActivities = allActivityIds.filter(id => {
            const e = evalMap.get(id.toString());
            return !e || e.tipoEvaluacion !== 'Actividad';
        });

        const invalidExams = allExamIds.filter(id => {
            const e = evalMap.get(id.toString());
            return !e || e.tipoEvaluacion !== 'Examen';
        });

        if (invalidActivities.length > 0) {
            return res.status(400).json({ message: 'Algunas actividades no son válidas o no existen.' });
        }

        if (invalidExams.length > 0) {
            return res.status(400).json({ message: 'Algunos exámenes no son válidos o no existen.' });
        }

        if (validMaterials.length !== allMaterialIds.length) {
            return res.status(400).json({ message: 'Algunos materiales de apoyo no existen.' });
        }

        const newProgramming = new CourseProgramming({
            programId,
            startDate,
            endDate,
            status,
            levels
        });

        await newProgramming.save();

        return res.status(201).json({
            message: 'Programación creada exitosamente.',
            programming: newProgramming
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error al crear la programación.', error });
    }
};

export async function getById(req, res) {
    try {
        const program = await CourseProgramming.findById(req.params.id).populate('programId').exec();
        if (!program) return res.status(404).json({ message: 'No encontrado' });
        res.json(program);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export async function updateCourseProgramming(req, res) {
    try {
        const { id } = req.params;
        const { programId, startDate, endDate, status, levels } = req.body;

        // Verificar si existe la programación
        const existing = await CourseProgramming.findById(id);
        if (!existing) {
            return res.status(404).json({ message: 'Programación no encontrada.' });
        }

        // Validar existencia de programa
        const program = await Program.findById(programId);
        if (!program) {
            return res.status(400).json({ message: 'El programa no existe.' });
        }

        // Validar mínimo 3 niveles
        if (!Array.isArray(levels) || levels.length < 3) {
            return res.status(400).json({ message: 'Debe incluir al menos 3 niveles.' });
        }

        const allTopicIds = [];
        const allActivityIds = [];
        const allExamIds = [];
        const allMaterialIds = [];

        let hasValidLevel = false;

        for (const level of levels) {
            if (!Array.isArray(level.topics)) continue;

            const topicSum = level.topics.reduce((sum, t) => sum + t.value, 0);
            if (topicSum === 100) {
                for (const topic of level.topics) {
                    const actSum = (topic.activities || []).reduce((sum, a) => sum + a.value, 0);
                    const examSum = (topic.exams || []).reduce((sum, e) => sum + e.value, 0);
                    const hasMaterial = Array.isArray(topic.materials) && topic.materials.length > 0;

                    if (actSum === 100 && examSum === 100 && hasMaterial) {
                        hasValidLevel = true;
                    }
                }
            }

            for (const topic of level.topics) {
                if (!topic.topicId || topic.value == null) {
                    return res.status(400).json({ message: 'Cada tema debe tener un ID y un valor.' });
                }

                allTopicIds.push(topic.topicId);

                for (const activity of topic.activities || []) {
                    if (!activity.evaluationId || activity.value == null) {
                        return res.status(400).json({ message: 'Cada actividad debe tener un ID y un valor.' });
                    }
                    allActivityIds.push(activity.evaluationId);
                }

                for (const exam of topic.exams || []) {
                    if (!exam.evaluationId || exam.value == null) {
                        return res.status(400).json({ message: 'Cada examen debe tener un ID y un valor.' });
                    }
                    allExamIds.push(exam.evaluationId);
                }

                for (const material of topic.materials || []) {
                    if (!material.materialId) {
                        return res.status(400).json({ message: 'Cada material debe tener un ID.' });
                    }
                    allMaterialIds.push(material.materialId);
                }
            }
        }

        if (!hasValidLevel) {
            return res.status(400).json({
                message: 'Al menos un nivel debe tener temas con 100% de valor, y al menos un tema con actividades 100%, exámenes 100% y materiales de apoyo.'
            });
        }

        const [validTopics, validEvaluations, validMaterials] = await Promise.all([
            Topic.find({ _id: { $in: allTopicIds } }),
            Evaluation.find({ _id: { $in: [...allActivityIds, ...allExamIds] } }),
            SupportMaterial.find({ _id: { $in: allMaterialIds } })
        ]);

        if (validTopics.length !== allTopicIds.length) {
            return res.status(400).json({ message: 'Algunos temas no existen.' });
        }

        const evalMap = new Map(validEvaluations.map(e => [e._id.toString(), e]));

        const invalidActivities = allActivityIds.filter(id => {
            const e = evalMap.get(id.toString());
            return !e || e.tipoEvaluacion !== 'Actividad';
        });

        const invalidExams = allExamIds.filter(id => {
            const e = evalMap.get(id.toString());
            return !e || e.tipoEvaluacion !== 'Examen';
        });

        if (invalidActivities.length > 0) {
            return res.status(400).json({ message: 'Algunas actividades no son válidas o no existen.' });
        }

        if (invalidExams.length > 0) {
            return res.status(400).json({ message: 'Algunos exámenes no son válidos o no existen.' });
        }

        if (validMaterials.length !== allMaterialIds.length) {
            return res.status(400).json({ message: 'Algunos materiales de apoyo no existen.' });
        }

        // Actualizar programación
        existing.programId = programId;
        existing.startDate = startDate;
        existing.endDate = endDate;
        existing.status = status;
        existing.levels = levels;

        await existing.save();

        return res.status(200).json({
            message: 'Programación actualizada correctamente.',
            programming: existing
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error al actualizar la programación.', error });
    }
};

export async function deleteCourseProgramming(req, res) {
    try {
        const deleteCourseProgramming = await CourseProgramming.findByIdAndDelete(req.params.id);

        if (!deleteCourseProgramming) {
            return res.status(404).json({ message: 'Programación no encontrada' });
        }

        res.status(200).json({ message: 'Programación eliminada exitosamente' });
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar la programación', error });
    }
};
