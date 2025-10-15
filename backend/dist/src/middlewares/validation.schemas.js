import {} from "zod/v3";
export const validateSchema = (schema) => (req, res, next) => {
    const validation = schema.safeParse({
        body: req.body,
        params: req.params,
        query: req.query,
    });
    if (!validation.success) {
        return res.status(400).json({
            msg: "Error de validación, por favor verificar la petición",
            details: validation.error.format(),
        });
    }
    // Reasignamos solo si existen
    if (validation.data.body)
        req.body = validation.data.body;
    if (validation.data.params)
        req.params = validation.data.params;
    if (validation.data.query)
        req.query = validation.data.query;
    next();
};
