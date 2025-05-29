import { celebrate, Joi, Segments } from 'celebrate';

export const validarRegistro = celebrate({
  [Segments.BODY]: Joi.object().keys({
    nome: Joi.string().min(3).required(),
    username: Joi.string().alphanum().min(3).required(),
    email: Joi.string().email().required(),
    senha: Joi.string().min(6).required(),
    genero: Joi.string().valid('masculino', 'feminino', 'outro').required(),
  }),
});
