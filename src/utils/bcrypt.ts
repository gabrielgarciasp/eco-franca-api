import bcrypt from 'bcrypt'

const encrypt = async (text: string): Promise<string> => {
    return await bcrypt.hash(text, parseInt(process.env.BCRYPT_SALT!) || 10)
}

const compare = async (text: string, hash: string): Promise<boolean> => {
    return await bcrypt.compare(text, hash)
}

export { encrypt, compare }
