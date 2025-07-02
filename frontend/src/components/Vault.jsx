import { useEffect, useRef, useState } from 'react'
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
    const userEmail = useSelector((state) => state.auth.userEmail)

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

    const timerRef = useRef(null)

    const resetTimer = () => {
        if (timerRef.current) clearTimeout(timerRef.current)
        timerRef.current = setTimeout(() => {
            if (masterKey) {
                setMasterKey('')
                setkeyEntryShown(true)
            }
        }, 180000)
    }

    useEffect(() => {
        const events = ['mousemove', 'keydown', 'click', 'scroll', 'touchstart']

        const handleActivity = () => resetTimer()

        events.forEach((event) =>
            window.addEventListener(event, handleActivity)
        )

        resetTimer()

        return () => {
            events.forEach((event) =>
                window.removeEventListener(event, handleActivity)
            )
            if (timerRef.current) clearTimeout(timerRef.current)
        }
    })

    useEffect(() => {
        setMasterKey('')
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
            setVault(response)
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
        setEnteredkey('')
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
            console.log('masterkey', masterKey)
            console.log('password', password)
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
                setCreationShown(false)
                setPopUpMessage('Password added successfully')
                setMessageVisible(true)
                const response = await VaultFetch(token)
                setVault(response)
                setTimeout(() => {
                    setMessageVisible(false)
                }, 3000)
            }
        }
    }

    const ShowPassword = async (e) => {
        const elem = e.target
        console.log(elem.value)
        const plaintext = await Decrypt(
            masterKey,
            vault[elem.value]['encrypted_password'],
            vault[elem.value]['salt'],
            vault[elem.value]['nonce']
        )
        elem.innerText = plaintext
    }

    return (
        <div className="vaultView">
            <div className="utilsContainer">
                <input
                    name="search"
                    value={search}
                    onChange={inputHandler}
                    placeholder="search"
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
                    <div
                        className="vaultEntry"
                        key={entry.label}
                    >
                        <div className="label">
                            <h3 className="label">Website</h3>
                            <h3 className="value">{entry.label}</h3>
                        </div>
                        <div className="username">
                            <h3 className="label">Username</h3>
                            <h3 className="value">{entry.username}</h3>
                        </div>
                        <div className="password">
                            <h3 className="label">Password</h3>
                            <button
                                className="showPasswordButton"
                                value={vault.indexOf(entry)}
                                onClick={ShowPassword}
                            >
                                Show password
                            </button>
                        </div>
                        <div className="notes">
                            <h3 className="label">Notes</h3>
                            <h3 className="value">{entry.notes}</h3>
                        </div>
                        <div className="createdAt">
                            <h3 className="label">Created at</h3>
                            <h3 className="value">
                                {new Date(entry.created_at).toLocaleString()}
                            </h3>
                        </div>
                        {entry.created_at === entry.updated_at ? null : (
                            <div classname="updatedAt">
                                <h3 className="label">Updated at</h3>
                                <h3 className="value">
                                    {new Date(
                                        entry.updated_at
                                    ).toLocaleString()}
                                </h3>
                            </div>
                        )}
                    </div>
                ))}
            </div>
            {keySetShown && (
                <div className="keySetContainer">
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
                    <form className="formContainer">
                        <div className="inputs">
                            <label for="label">Website</label>
                            <input
                                type="text"
                                name="label"
                                value={label}
                                onChange={inputHandler}
                            ></input>
                        </div>
                        <div className="inputs">
                            <label for="username">Username</label>
                            <input
                                type="text"
                                name="username"
                                value={username}
                                onChange={inputHandler}
                            ></input>
                        </div>
                        <div className="inputs">
                            <label for="password">Password</label>
                            <input
                                type="text"
                                name="password"
                                value={password}
                                onChange={inputHandler}
                            ></input>
                        </div>
                        <div className="inputs">
                            <label for="notes">Notes</label>
                            <textarea
                                type="text"
                                name="notes"
                                value={notes}
                                onChange={inputHandler}
                            ></textarea>
                        </div>
                        <button
                            className="creationButton"
                            onClick={() => EntryCreation()}
                        >
                            Add new password
                        </button>
                    </form>
                    <h1>{notification}</h1>
                </div>
            )}
        </div>
    )
}
