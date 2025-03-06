import {z,ZodSchema} from "zod";

export  const validateSchema = (schema:ZodSchema,data:z.infer<typeof schema>):string[] |  boolean => {
    const  response = schema.safeParse(data);
    if(!response.success)
    {
        const errors = response.error.formErrors.fieldErrors as {[key:string]:string[]};
        return  Object.values(errors).flatMap((arr) => arr);
    }
    return true;
}