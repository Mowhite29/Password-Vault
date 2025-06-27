import { secretbox, randomBytes } from 'tweetnacl'
import loadArgon2 from 'argon2-wasm'

export async function Encrypt(masterKey, password) {
    const argon2 = await loadArgon2()

    const salt = randomBytes(16)
    const nonce = randomBytes(24)

    const derivedKey = await argon2.hash({
        pass: masterKey,
        salt: salt,
        hashLen: 32,
        type: argon2.Argontype.Argon2id,
    })

    const encryptedPassword = secretbox(password, nonce, derivedKey)

    return {
        encryptedPassword,
        salt,
        nonce,
    }
}

export async function Decrypt(masterKey, encryptedPassword, salt, nonce) {
    const argon2 = await loadArgon2()

    const derivedKey = await argon2.hash({
        pass: masterKey,
        salt: salt,
        hashLen: 32,
        type: argon2.Argontype.Argon2id,
    })

    return secretbox.open(encryptedPassword, nonce, derivedKey)
}

export async function GenerateKeyCheck(masterKey, email) {
    const argon2 = await loadArgon2()

    const salt1 = randomBytes(16)
    const salt2 = randomBytes(16)
    const nonce = randomBytes(24)

    const emailDerivedKey = await argon2.hash({
        pass: email,
        salt: salt1,
        hashLen: 32,
        type: argon2.Argontype.Argon2id,
    })

    const derivedKey = await argon2.hash({
        pass: masterKey,
        salt: salt2,
        hashLen: 32,
        type: argon2.Argontype.Argon2id,
    })

    return {
        encryptedString: secretbox(emailDerivedKey, nonce, derivedKey),
        salt1: salt1,
        salt2: salt2,
        nonce: nonce,
    }
}

export async function KeyCheck(
    masterKey,
    email,
    encryptedString,
    salt1,
    salt2,
    nonce
) {
    const argon2 = await loadArgon2()

    const emailDerivedKey = await argon2.hash({
        pass: email,
        salt: salt1,
        hashLen: 32,
        type: argon2.Argontype.Argon2id,
    })

    const derivedKey = await argon2.hash({
        pass: masterKey,
        salt: salt2,
        hashLen: 32,
        type: argon2.Argontype.Argon2id,
    })

    if (
        secretbox.open(encryptedString, nonce, derivedKey) === emailDerivedKey
    ) {
        return true
    }
}
