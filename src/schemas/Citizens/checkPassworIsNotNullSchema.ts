import * as Yup from 'yup'

const schema = Yup.object().shape({
    password: Yup.string().required(),
})

export default schema
