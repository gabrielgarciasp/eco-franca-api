import * as Yup from 'yup';
import { verifyCpf } from '../../utils/validateCpf';


const schema = Yup.object().shape({
    cpf: Yup.string().required(),
})

export default schema
