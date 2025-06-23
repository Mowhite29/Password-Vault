import { secretbox, randomBytes } from "tweetnacl";
import argon2 from 'argon2';

export function Encrypt(masterKey, password) {
  const salt = randomBytes(16);
  const nonce = randomBytes(24);

  argon2
    .hash(masterKey, {
      salt: salt,
      hashLength: 32,
      type: argon2.argon2id
    })
    .then(hash => {
      return {
        encryptedPassword: secretbox(password, nonce, hash),
        salt: salt,
        nonce: nonce
      }
    })
}

export function Decrypt(masterKey, encryptedPassword, salt, nonce){
  argon2
    .hash(masterKey, {
      salt: salt,
      hashLength: 32,
      type: argon2.argon2id
    })
    .then(hash => {
      return secretbox.open(encryptedPassword, nonce, hash)
    })
}
