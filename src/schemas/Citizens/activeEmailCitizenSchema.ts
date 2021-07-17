import * as Yup from 'yup'

const schema = Yup.object().shape({
    token: Yup.string().required(),
})

export default schema
