import { secretbox, randomBytes } from "tweetnacl";
import argon2 from "argon2";

export function Encrypt(masterKey, password) {
  const salt = randomBytes(16);
  const nonce = randomBytes(24);

  argon2
    .hash(masterKey, {
      salt: salt,
      hashLength: 32,
      type: argon2.argon2id,
    })
    .then((hash) => {
      return {
        encryptedPassword: secretbox(password, nonce, hash),
        salt: salt,
        nonce: nonce,
      };
    });
}

export function Decrypt(masterKey, encryptedPassword, salt, nonce) {
  argon2
    .hash(masterKey, {
      salt: salt,
      hashLength: 32,
      type: argon2.argon2id,
    })
    .then((hash) => {
      return secretbox.open(encryptedPassword, nonce, hash);
    });
}

export function GenerateKeyCheck(masterKey, email) {
  const salt1 = randomBytes(16);
  const salt2 = randomBytes(16);
  const nonce = randomBytes(24);

  const emailHash = argon2.hash(email, {
    salt: salt1,
    hashLength: 32,
    type: argon2.argon2id,
  });

  argon2
    .hash(masterKey, {
      salt: salt2,
      hashLength: 32,
      type: argon2.argon2id,
    })
    .then((hash) => {
      return {
        encryptedString: secretbox(emailHash, nonce, hash),
        salt1: salt1,
        salt2: salt2,
        nonce: nonce,
      };
    });
}

export function KeyCheck(
  masterKey,
  email,
  encryptedString,
  salt1,
  salt2,
  nonce,
) {
  const emailHash = argon2.hash(email, {
    salt: salt1,
    hashLength: 32,
    type: argon2.argon2id,
  });

  argon2
    .hash(masterKey, {
      salt: salt2,
      hashLength: 32,
      type: argon2.argon2id,
    })
    .then((hash) => {
      if (secretbox.open(encryptedString, nonce, hash) === emailHash) {
        return true;
      }
    });
}
