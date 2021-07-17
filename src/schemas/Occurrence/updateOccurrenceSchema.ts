import * as Yup from 'yup'

const schema = Yup.object().shape({
    number: Yup.string(),
    violationNumber: Yup.string(),
    status: Yup.string(),
    comment: Yup.string(),
})

export default schema
