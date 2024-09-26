import { Request, Response, NextFunction } from "express";
import { paramsSchema, pollCreationSchema, voteSchema } from "../validation/pollValidation";

export const validatePollCreation = (req: Request, res: Response, next: NextFunction) => {
  const { error } = pollCreationSchema.validate(req.body, { abortEarly: false});

  if (error) {
    console.log(error);
    // Map validation errors to the respective fields
    const errorDetails = error.details.reduce((acc: Record<string, string>, detail) => {
        const field = detail.path.join('.'); // Field name causing the error
        acc[field] = detail.message; // Error message for the field
        return acc;
    }, {});

    return res.status(400).json({
        message: 'Validation error',
        errors: errorDetails  // Return the errors object where key is the field and value is the error message
    });
}
    next();
};

export const validateVote = (req: Request, res: Response, next: NextFunction) => {
    // Validate request parameters
    const { error: paramsError } = paramsSchema.validate(req.params);
    if (paramsError) {
        console.log(paramsError);
        return res.status(400).json({ error: paramsError.details[0].message })
    }

    const { error: bodyError } = voteSchema.validate(req.body, { abortEarly: false});

    if (bodyError) {
        console.log(bodyError);
        const errorDetails = bodyError.details.reduce((acc: Record<string, string>, detail) => {
            const field = detail.path.join('.'); // Field name causing the error
            acc[field] = detail.message; // Error message for the field
            return acc;
        }, {});
        return res.status(400).json({
            message: 'Validation error',
            errors: errorDetails
        });
    }

    next();
};