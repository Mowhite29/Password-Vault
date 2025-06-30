import { secretbox } from 'tweetnacl'

function base64ToUint8Array(base64, label = 'data') {
    if (!base64 || typeof base64 !== 'string') {
        throw new Error(
            `Missing or invalid base64 input for ${label}: ${base64}`
        )
    }
    const binary = atob(base64)
    const len = binary.length
    const bytes = new Uint8Array(len)
    for (let i = 0; i < len; i++) {
        // eslint-disable-next-line security/detect-object-injection
        bytes[i] = binary.charCodeAt(i)
    }
    return bytes
}

function uint8ArrayToBase64(bytes) {
    let binary = ''
    for (let i = 0; i < bytes.length; i++) {
        // eslint-disable-next-line security/detect-object-injection
        binary += String.fromCharCode(bytes[i])
    }
    return btoa(binary)
}

async function deriveKey(password, salt, iterations = 100000) {
    const enc = new TextEncoder()
    const keyMaterial = await crypto.subtle.importKey(
        'raw',
        enc.encode(password),
        'PBKDF2',
        false,
        ['deriveKey']
    )

    const key = await crypto.subtle.deriveKey(
        {
            name: 'PBKDF2',
            salt: salt,
            iterations: iterations,
            hash: 'SHA-256',
        },
        keyMaterial,
        { name: 'AES-GCM', length: 256 },
        true,
        ['encrypt', 'decrypt']
    )
    const outputKey = await crypto.subtle.exportKey('raw', key)
    return new Uint8Array(outputKey)
}

export async function Encrypt(masterKey, password) {
    const salt = crypto.getRandomValues(new Uint8Array(16))
    const nonce = crypto.getRandomValues(new Uint8Array(24))

    const derivedKey = await deriveKey(masterKey, salt, 100000)

    const enc = new TextEncoder()
    const passwordArray = enc.encode(password)

    const encryptedPassword = await secretbox(passwordArray, nonce, derivedKey)
    console.log(encryptedPassword, nonce, salt)
    return {
        encryptedPassword: uint8ArrayToBase64(encryptedPassword),
        salt: uint8ArrayToBase64(salt),
        nonce: uint8ArrayToBase64(nonce),
    }
}

export async function Decrypt(masterKey, encryptedPassword, salt, nonce) {
    const derivedKey = await deriveKey(
        masterKey,
        base64ToUint8Array(salt),
        100000
    )
    console.log('key', derivedKey)
    console.log('nonce', nonce)
    console.log('password', encryptedPassword)
    const passwordArray = secretbox.open(
        base64ToUint8Array(encryptedPassword),
        base64ToUint8Array(nonce),
        derivedKey
    )
    console.log(passwordArray)
    const enc = new TextDecoder()
    const plaintext = enc.decode(passwordArray)
    return plaintext
}

export async function GenerateKeyCheck(masterKey, email) {
    const salt1 = crypto.getRandomValues(new Uint8Array(16))
    const salt2 = crypto.getRandomValues(new Uint8Array(16))
    const nonce = crypto.getRandomValues(new Uint8Array(24))

    const emailDerivedKey = await deriveKey(email, salt1, 100000)
    const derivedKey = await deriveKey(masterKey, salt2, 100000)

    return {
        encryptedString: uint8ArrayToBase64(
            secretbox(emailDerivedKey, nonce, derivedKey)
        ),
        salt1: uint8ArrayToBase64(salt1),
        salt2: uint8ArrayToBase64(salt2),
        nonce: uint8ArrayToBase64(nonce),
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
    const emailDerivedKey = await deriveKey(
        email,
        base64ToUint8Array(salt1, 'salt1'),
        100000
    )
    const derivedKey = await deriveKey(
        masterKey,
        base64ToUint8Array(salt2, 'salt2'),
        100000
    )
    const retrievedKey = secretbox.open(
        base64ToUint8Array(encryptedString),
        base64ToUint8Array(nonce),
        derivedKey
    )

    if (retrievedKey === null) {
        return false
    }

    if (retrievedKey.length !== emailDerivedKey.length) return false
    for (let i = 0; i < retrievedKey.length; i++) {
        // eslint-disable-next-line security/detect-object-injection
        if (retrievedKey[i] !== emailDerivedKey[i]) return false
    }
    return true
}
