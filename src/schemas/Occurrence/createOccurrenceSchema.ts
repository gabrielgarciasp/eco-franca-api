import * as Yup from 'yup'

const schema = Yup.object().shape({
    category: Yup.string().required(),
    description: Yup.string().required(),
    cep: Yup.string(),
    address: Yup.string(),
    number: Yup.string(),
    district: Yup.string(),
    reference: Yup.string(),
    latitude: Yup.string(),
    longitude: Yup.string(),
    citizenId: Yup.string().required(),
})

export default schema
