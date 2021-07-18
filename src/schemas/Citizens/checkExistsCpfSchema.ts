import * as Yup from 'yup';

const schema = Yup.object().shape({
    cpf: Yup.string().required(),
})

export default schema
