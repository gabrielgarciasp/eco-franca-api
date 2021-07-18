import * as Yup from 'yup'

const schema = Yup.object().shape({
    email: Yup.string().email().required(),
})

export default schema
