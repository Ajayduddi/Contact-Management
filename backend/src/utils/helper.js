import bcrypt from 'bcrypt';

export const hashPassword = async (password) => {
    try {
        const saltRounds = process.env.SALT_ROUNDS | 10;
        return await bcrypt.hash(password, saltRounds);
    } catch (error) {
        return error;
    }
}

export const comparePassword = (password, hash) => {
    try {
        return bcrypt.compareSync(password, hash);
    } catch (error) {
        console.log(error);
        return false;
    }
}