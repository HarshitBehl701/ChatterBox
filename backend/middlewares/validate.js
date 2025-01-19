const validate = (schema)  => (req,res,next) => {
    try{
        const { error } = schema.validate(req.body, { abortEarly: false });
        if(error){
            return  res.status(400).send({ message: error.details[0].message , status: false });    
        }
        next();
    }catch(error){
        return  res.status(500).send({ message: "Server error during validation." , status: false });
    }
}

module.exports  = validate;