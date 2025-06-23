# Security Considerations

## Handling of data

In this project, I will develop a system in which users data is handled following the principles of the CIA triad:

- Confidentiality
&nbsp;&nbsp;&nbsp;&nbsp;I will obfuscate all sensitive data and ensure that all transmissions of data use secure protocols to prevent disclosure. I will put in place authorisation protocols to maintain the privacy of users.

- Integrity
&nbsp;&nbsp;&nbsp;&nbsp;I will implement access logs and hashing to prevent the alteration of data.

- Availability
&nbsp;&nbsp;&nbsp;&nbsp;I will maintain the data using servers that use effective security solutions to prevent denial of access to users or destruction of their data. I will implement backups of data to ensure its continued availability.

## The Project

In this project I need to design a system in which users data can be entered in the frontend, before being transferred to the backend for storage in a database.
The main security concerns are:

- Frontend must be configured in a way that minimises the risk of data loss to techniques such as cross site scripting (XSS);
- Users unobfuscated data must not remain in memory on the users device;
- All data transferred between the frontend and backend must be done so via secure transmission protocols to minimise the risk of a successful man in the middle (MITM) or downgrade attack;
- All data stored at the backend must be in a secure form, so that in the event of a data breach the user data involved will be unusable;
- Encrypted data must not be stored in the same location as its corresponding encryption key;
- Data should not be exposed in a plaintext form on the backend where it might be vulnerable to an insider threat;
- 3-2-1 Rule: At three copies of the database should exist using two media types with one copy stored offsite.

## Options

### Scenario 1- Password is transferred to the backend in plaintext where it is encrypted

1. User enters password at frontend.
2. Frontend sends plaintext password to backend via HTTPS
3. Backend encrypts password and stores it in database
4. To view password, backend decrypts and sends plaintext to frontend

Pros:

- Simple architecture
- Key rotation can be implemented
- Easy to later add password sharing

Cons:

- Misconfigured HTTPS or downgrade attacks could expose the application to a MITM
- A compromised frontend could expose plaintext password to a threat actor using XSS
- A compromised backend could expose all data (keys + ciphertexts)
- Plaintext password will be present in RAM on user device
- Plaintext password will exist on backend, even briefly
- Vulnerable to insider threat
- May violate zero-knowledge expectation from users

### Scenario 2- Passwords encrypted on the frontend before transfer to backend

1. User enters master password at frontend
2. Encryption key derived from master password and salt
3. User enters password at frontend
4. Password is encrypted using encryption key
5. Cipher text and salt sent to backend
6. To view password, backend sends cipher text to frontend
7. User enters master password at frontend, which with the salt is used to derive encryption key
8. Password is decrypted using encryption key

Pros:

- No plaintext passwords would be transferred
- Zero knowledge
- If backend is breached, only cipher text would be revealed
- Enables use of a HSM

Cons:

- Key management is responsibility of user, if master password is forgotten data will be irrecoverable

### Scenario 3- Passwords encrypted on the frontend using asymmetric encryption before transfer to the backend

1. User enters master password at frontend
2. Public and private keys derived from master password
3. User enters password at frontend
4. Password encrypted using symmetrical encryption
5. Password encryption key encrypted using public key
6. Cipher text and encrypted key sent to back end.
7. To view password, backend sends cipher text and encrypted key to frontend
8. Encrypted key decrypted using private key
9. Password decrypted using key

Pros:

- End to end encryption

Cons:

- Requires user/device private key management
- Very complex

### My Solution

I have decided to use scenario 2. 3 is more secure but adds a lot of unneccessary complexity at the moment. Once I have the project running I may add asymmetric encryption.

## Encryption

As all encryption/decryption will now take place at the frontend, I need to select a new cryptography module that uses JS.

The available options are:

| Library/API                   | React support | React Native support | Symmetric encryption                                | Asymmetric encryption                        | Memory use   |
|:------------------------------|:-------------:|:--------------------:|:---------------------------------------------------:|:--------------------------------------------:|:------------:|
| crypto.subtle(Web Crypto API) | [x] Native    | []                   | [x] AES                                             | [x] RSA, ECDSA, Ed25519                      | Low (native) |
| TweetNaCl                     | [x]           | [x]                  | [X] Xsalsa20                                        | [x] X25519, Xsalsa20                         | Very low     |
| react-native-simple-crypto    | []            | [x] (Not Expo)       | [x] AES256, SHA, HMAC                               | [x] RSA, ECDSA, ECC                          | Depends      |
| Forge(node-forge)             | [x]           | [x]                  | [x] AES, 3DES, DES, RC2                             | [x] RSA, Ed25519, RSA-KEM, X.509, PKC, ASN.1 | Heavy        |
| libsodium.js                  | [x]           | [x]                  | [x] XSalsa20, XChaCha20, AEGIS-256,128L, AES256-GCM | [x] XSalsa20 Ed25519                         | Very low     |

Crypto.subtle and react-native-simple-crypto are not compatible with both of my frontends so I will discount.
node-forge is a memory heavy solution and older so I will also discount.

TweetNaCl and libsodium both offer similar features.
Libsodium
Pros:

- Built-in Argon2id
- Most secure encryption

Cons:

- Large bundle
- Often doesn't run smoothly with Expo
- Slightly higher memory use

TweetNaCl
Pros

- Very small bundle
- Very simple api

Cons

- No Argon2id, need to implement hashing library
- Slightly less secure, but still enough for my use case

TweetNaCl makes the most sense to me, and if needed I can switch to Libsodium later on

## Hashing

As my application will be reliant of the hashing of users password to provide an encryption key, I must ensure that I am using a solid library for this function.

Options:

| Library  | Strength    | Key length | Performance | Memory use            |
|:--------:|:-----------:|:----------:|:-----------:|:---------------------:|
| Argon2id | Strong      | Variable   | Adjustable  | 64 MiB to several GiB |
| scrypt   | Very strong | Variable   | Slow        | 64 MiB to 1 GiB       |
| bcrypt   | Strong      | 192        | Adjustable  | 3-8 MB                |
| PBKDF2   | Strong      | 256/512    | Adjustable  | 1-10 MB               |

## Data Flow

This is the data flow model I will use for the project:

### 1. Client Side of Frontend

1. User enters plaintext password string and master password string
2. Salt is generated, and used for hashing of master password to produce encryption key
3. Password string is encrypted using derived key, producing encrypted password and nonce
4. Encrypted password, salt and nonce are transferred to the backend via api call, where they are stored in a database entry

### 2. Backend

1. Transmitted data is stored
2. Upon successful authenticated api call, data is then transmitted to frontend

### 3. Client Side of Frontend

1. Encrypted password, salt and nonce are recieved following successful api call
2. User enters master password string, which with salt is hashed to generate encryption key
3. Key and nonce are used to decrypt chosen password

### Key Points

- Plaintext password strings are only present on client side of frontend, ensuring they are never transmitted or present on server. This ensures zero knowledge assurance and prevents risk of successful MITM or downgrade attacks
- Users master password is salted during hashing, meaning that every encryption key is unique. This prevents a range of password cracking methods, such as Rainbow table attacks, Brute force attacks, Replay attacks and Dictionary attacks. It also prevents hash collision, mitigating hash reuse attempts and Collision attacks. It also allows compliance with modern security standars and regulations such as PCI DSS and GDPR
- TweetNaCl's Constant-Time Operations mitigate Side-channel attacks due to the fact that operations always take the same amount of time regardless of inputs

### Drawbacks

The main negative aspect of this method are all related to using client-side rendering. All rendering of page content, as well as ll cryptographic operations take place upon the users device. This coud lead to poor performance if my application is not built with this in mind. All libraries and resources must be efficiently bundled to avoid slow downs due to poor internet connection.  

Another downside to my application design is that it will be reliant on an active internet connection is order to function. On the other hand, if the user cannot connect to the internet to access their passwords, they are unlikely to be able to acces other service that said passwords are required for.

## Password Checking

A new problem with my data flow is that it currently provides no option for checking that the master key entered is correct. This means that if a user enters the wrong key while adding a new password to their vault, that password will then be irrecoverable unless the wrong version of the key is entered for the decryption process.

While the current procedure ensure a zero knowledge approach, it is not user friendly. I would like to implement a checking system to ensure that user has not entered the wrong key while maintaining zero knowledge.

### Solution

At user creation:

1. User enters their master key, which i will use to generate a hash with a per user generated salt
2. Users email address is then hashed using a new per user generated salt to generate a known string
3. Known string is then encrypted using hash as key and a nonce.
4. Cypher text, nonce and both salt strings are stored in database.

When user adds a new password or wishes to decrypt one:

1. Cypher text, nonce and both salts are recalled from database
2. User enters master key, which along with their email address is hashed with their respective salts
3. Cypher text is decrypted using hash derived from master key and nonce
4. If decrypted hash matched hashed email address, master key match is confirmed

- No users master key is present outside of their browser ensuring zero knowledge
- Known string is not stored alongside cypher text which would offer an attacker an advantage when attempting to discover encryption key
- Known string is per user for peace of mind

## Testing

Security testing is covered in ```./TESTING.md```