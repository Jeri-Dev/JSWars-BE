import bcrypt from "npm:bcrypt"

interface IHashConfig {
	salt: number
}

export const hashString = async (
	text: string,
	config: IHashConfig = { salt: 15 },
) => {
	const { salt } = config
	const salts = await bcrypt.genSalt(salt)
	const result = await bcrypt.hash(text, salts)

	return result
}

interface ICompareHash {
	plain: string
	hash: string
}

export const compareHash = async ({ hash, plain }: ICompareHash) => {
	const result = await bcrypt.compare(plain, hash)
	return result
}
