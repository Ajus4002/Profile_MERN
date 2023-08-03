
import Joi from 'joi';


export const validateRegistration = (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string().required(),
    password: Joi.string().min(6).required(),
    address: Joi.string(),
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  next();
};


export const validateLogin = (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string().required(),
    password: Joi.string().required(),
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  next();
};


export const validateUpdate = (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string().optional().empty(''),
    password: Joi.string().min(6).optional().empty(''),
    address: Joi.string().optional().empty(''),
  }).min(1); 

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  next();
};
