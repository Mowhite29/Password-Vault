import { useEffect, useState } from 'react'
import '../styles/Vault.scss'
import { useSelector } from 'react-redux'
import { KeyCheck, GenerateKeyCheck } from '../utils/crypto'
import {
    KeyCreate,
    KeyFetch,
    VaultCreate,
    VaultDelete,
    VaultEdit,
    VaultFetch,
} from '../services/api'
import { Encrypt, Decrypt } from '../utils/crypto'

export default function Vault() {
    const token = useSelector((state) => state.auth.token)
    const userEmail = useSelector((stata) => stata.auth.userEmail)

    const [messageVisible, setMessageVisible] = useState(false)
    const [popUpMessage, setPopUpMessage] = useState('')
    const [search, setSearch] = useState('')

    const [keySetShown, setkeySetShown] = useState(false)
    const [keyEntryShown, setkeyEntryShown] = useState(false)
    const [masterKey, setMasterKey] = useState('')
    const [enteredKey, setEnteredkey] = useState('')

    const [creationShown, setCreationShown] = useState(false)
    const [notification, setNotification] = useState('')
    const [label, setLabel] = useState('')
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [notes, setNotes] = useState('')

    const [vault, setVault] = useState([])

    useEffect(() => {
        InitialiseVault()

        async function InitialiseVault() {
            const response = await KeyFetch(token)
            if (response === false) {
                setkeySetShown(true)
            } else {
                setkeyEntryShown(true)
            }
        }

        RetrieveVault()

        async function RetrieveVault() {
            const response = await VaultFetch(token)
            console.log(response)
            setVault(response)
            console.log(response[0].encrypted_password)
            const plaintext = await Decrypt(
                masterKey,
                response[0].encrypted_password,
                response[0].salt,
                response[0].nonce
            )
            console.log('plaintext', plaintext)
        }
        // eslint-disable-next-line
    }, [token])

    const keyInput = (e) => {
        setEnteredkey(e.target.value)
    }

    async function KeySet() {
        const key = await GenerateKeyCheck(enteredKey, userEmail)
        const response = await KeyCreate(
            key.encryptedString,
            key.salt1,
            key.salt2,
            key.nonce,
            token
        )
        if (response) {
            setMasterKey(enteredKey)
            setPopUpMessage('Master key set successfully')
            setMessageVisible(true)
            setTimeout(() => {
                setMessageVisible(false)
                setkeySetShown(false)
            }, 5000)
        }
    }

    async function KeyEntry() {
        const response = await KeyFetch(token)
        const key = await KeyCheck(
            enteredKey,
            userEmail,
            response.encrypted_string,
            response.salt1,
            response.salt2,
            response.nonce
        )
        if (key) {
            setMasterKey(enteredKey)
            setkeyEntryShown(false)
        } else {
            setPopUpMessage('Invalid master key entered, please try again')
            setMessageVisible(true)
            setTimeout(() => setMessageVisible(false), 3000)
        }
    }

    const inputHandler = (e) => {
        if (e.target.name === 'label') {
            setLabel(e.target.value)
        } else if (e.target.name === 'username') {
            setUsername(e.target.value)
        } else if (e.target.name === 'password') {
            setPassword(e.target.value)
        } else if (e.target.name === 'notes') {
            setNotes(e.target.value)
        } else if (e.target.name === 'search') {
            setSearch(e.target.value)
        }
    }

    async function EntryCreation() {
        var ready = true
        label === ''
            ? ((ready = false), setNotification('Please enter a password'))
            : username === ''
              ? ((ready = false), setNotification('Please enter a username'))
              : password === ''
                ? ((ready = false), setNotification('Please enter a password'))
                : null
        if (ready) {
            const cypher = await Encrypt(masterKey, password)
            const response = await VaultCreate(
                label,
                username,
                cypher.encryptedPassword,
                cypher.salt,
                cypher.nonce,
                notes,
                token
            )
            if (response === true) {
                setPopUpMessage('Password added successfully')
                setMessageVisible(true)
                setTimeout(() => {
                    setMessageVisible(false)
                }, 3000)
            }
        }
    }

    return (
        <>
            <div className="utilsContainer">
                <input
                    name="search"
                    value={search}
                    onChange={inputHandler}
                ></input>
                <button
                    className="addButton"
                    onClick={() => setCreationShown(true)}
                >
                    Add new password
                </button>
            </div>
            <div className="vaultDisplay">
                {vault.map((entry) => (
                    <div className="vaultEntry" key={entry.label}>
                        <div>
                            <h3 className="label">Website</h3>
                            <h3 className="value">{entry.label}</h3>
                        </div>
                        <div>
                            <h3 className="label">Username</h3>
                            <h3 className="value">{entry.username}</h3>
                        </div>
                        <div>
                            <h3 className="label">Password</h3>
                            <h3 className="value">
                                {entry.encrypted_password}
                            </h3>
                        </div>
                        <div>
                            <h3 className="label">Notes</h3>
                            <h3 className="value">{entry.notes}</h3>
                        </div>
                        <div>
                            <h3 className="label">Created at</h3>
                            <h3 className="value">{entry.created_at}</h3>
                        </div>
                        {entry.created_at === entry.updated_at ? null : (
                            <div>
                                <h3 className="label">Updated at</h3>
                                <h3 className="value">{entry.updated_at}</h3>
                            </div>
                        )}
                    </div>
                ))}
            </div>
            {keySetShown && (
                <div className="keyEntryContainer">
                    <h1>
                        Enter a master key to be used in accessing your saved
                        passwords.{' '}
                    </h1>
                    <h2>
                        There is no way to reset this key, if it is forgotten
                        your saved passwords will be irrecoverable
                    </h2>
                    <input
                        type="text"
                        placeholder="master key"
                        value={enteredKey}
                        onChange={keyInput}
                    ></input>
                    <button onClick={() => KeySet()}>Enter</button>
                </div>
            )}
            {keyEntryShown && (
                <div className="keyEntryContainer">
                    <h1>Enter your master key:</h1>
                    <input
                        type="text"
                        placeholder="master key"
                        value={enteredKey}
                        onChange={keyInput}
                    ></input>
                    <button onClick={() => KeyEntry()}>Enter</button>
                </div>
            )}
            {messageVisible && (
                <div className="popUpContainer">
                    <h1>{popUpMessage}</h1>
                </div>
            )}
            {creationShown && (
                <div className="entryCreationContainer">
                    <div className="formContainer">
                        <label for="label">Website</label>
                        <input
                            type="text"
                            name="label"
                            value={label}
                            onChange={inputHandler}
                        ></input>
                        <label for="username">Username</label>
                        <input
                            type="text"
                            name="username"
                            value={username}
                            onChange={inputHandler}
                        ></input>
                        <label for="password">Password</label>
                        <input
                            type="text"
                            name="password"
                            value={password}
                            onChange={inputHandler}
                        ></input>
                        <label for="notes">Notes</label>
                        <input
                            type="text"
                            name="notes"
                            value={notes}
                            onChange={inputHandler}
                        ></input>
                        <button
                            className="creationButton"
                            onClick={() => EntryCreation()}
                        >
                            Add new password
                        </button>
                    </div>
                    <h1>{notification}</h1>
                </div>
            )}
        </>
    )
}
