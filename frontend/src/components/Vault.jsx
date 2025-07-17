import React from 'react'
import { useEffect, useRef, useState } from 'react'
import '../assets/styles/Vault.scss'
import { useSelector } from 'react-redux'
import { KeyCheck, GenerateKeyCheck, Encrypt, Decrypt } from '../utils/crypto'
import {
    KeyCreate,
    KeyFetch,
    VaultCreate,
    VaultDelete,
    VaultEdit,
    VaultFetch,
} from '../services/api'
import { Generate, Check } from '../utils/passwordGenerator'

export default function Vault() {
    const token = useSelector((state) => state.auth.token)
    const userEmail = useSelector((state) => state.auth.userEmail)

    const [messageVisible, setMessageVisible] = useState(false)
    const [popUpMessage, setPopUpMessage] = useState('')
    const [search, setSearch] = useState('')

    const [keySetShown, setkeySetShown] = useState(false)
    const [keyEntryShown, setkeyEntryShown] = useState(false)
    const [keyEntryMessage, setKeyEntryMessage] = useState('')
    const [masterKey, setMasterKey] = useState('')
    const [enteredKey, setEnteredkey] = useState('')

    const [creationShown, setCreationShown] = useState(false)
    const [editShown, setEditShown] = useState(false)
    const [deleteShown, setDeleteShown] = useState(false)
    const [notification, setNotification] = useState('')
    const [label, setLabel] = useState('')
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [salt, setSalt] = useState('')
    const [nonce, setNonce] = useState('')
    const [notes, setNotes] = useState('')
    const [tag, setTag] = useState([])

    const [vault, setVault] = useState([])
    const [shownVault, setShownVault] = useState([])

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
            setShownVault(response)
        }
    }, [token])

    useEffect(() => {
        const toShow = []
        if (search != '') {
            for (let i = 0; i < vault.length; i++) {
                if (
                    // eslint-disable-next-line security/detect-object-injection
                    vault[i]['label']
                        .toLowerCase()
                        .includes(search.toLowerCase())
                ) {
                    // eslint-disable-next-line security/detect-object-injection
                    toShow.push(vault[i])
                }

                if (
                    // eslint-disable-next-line security/detect-object-injection
                    vault[i]['tag'].toLowerCase().includes(search.toLowerCase())
                ) {
                    // eslint-disable-next-line security/detect-object-injection
                    toShow.push(vault[i])
                }

                if (
                    // eslint-disable-next-line security/detect-object-injection
                    new Date(vault[i]['created_at'])
                        .toLocaleString()
                        .includes(search)
                ) {
                    // eslint-disable-next-line security/detect-object-injection
                    toShow.push(vault[i])
                }
            }
            setShownVault(toShow)
        } else {
            setShownVault(vault)
        }
    }, [search, vault])

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
            setKeyEntryMessage('Invalid master key entered, please try again')
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
        } else if (e.target.name === 'tag') {
            setTag(e.target.value)
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
            const check = await Check(userEmail, password)
            if (check != true) {
                let prompt = ''
                for (let i = 0; i < check['suggestions'].length; i++) {
                    // eslint-disable-next-line security/detect-object-injection
                    prompt = prompt + ' ' + check['suggestions'][i]
                }
                setNotification(prompt)
            } else {
                setNotification('')
                const cypher = await Encrypt(masterKey, password)
                console.log(tag)
                try {
                    const response = await VaultCreate(
                        label,
                        username,
                        cypher.encryptedPassword,
                        cypher.salt,
                        cypher.nonce,
                        notes,
                        tag,
                        token
                    )
                    if (response === true) {
                        setCreationShown(false)
                        setPopUpMessage('Password added successfully')
                        setMessageVisible(true)
                        setPassword('')
                        setLabel('')
                        setUsername('')
                        setNotes('')
                        setTag('')
                        const response = await VaultFetch(token)
                        setVault(response)
                        setShownVault(response)
                        setTimeout(() => {
                            setMessageVisible(false)
                        }, 3000)
                    } else {
                        setNotification(response)
                    }
                } catch (error) {
                    console.error('Error during VaultCreate:', error)
                }
            }
        }
    }

    async function GeneratePassword() {
        const generated = await Generate()
        setPassword(generated)
    }

    const ShowPassword = async (e) => {
        const elem = e.target
        if (elem.innerText != 'Show Password') {
            elem.innerText = 'Show Password'
            return
        }
        const plaintext = await Decrypt(
            masterKey,
            vault[elem.value]['encrypted_password'],
            vault[elem.value]['salt'],
            vault[elem.value]['nonce']
        )
        elem.innerText = plaintext
        const check = await Check(userEmail, plaintext)
        if (check != true) {
            setPopUpMessage(check['warning'])
            setMessageVisible(true)
            setTimeout(() => {
                setMessageVisible(false)
            }, 3000)
        }
    }

    async function EntryEdit(entry) {
        if (entry === 'submit') {
            const check = await Check(userEmail, password)
            if (check != true) {
                let prompt = ''
                for (let i = 0; i < check['suggestions'].length; i++) {
                    // eslint-disable-next-line security/detect-object-injection
                    prompt = prompt + ' ' + check['suggestions'][i]
                }
                setNotification(prompt)
            } else {
                const cypher = await Encrypt(masterKey, password)
                const response = VaultEdit(
                    label,
                    username,
                    cypher.encryptedPassword,
                    cypher.salt,
                    cypher.nonce,
                    notes,
                    tag,
                    token
                )
                if (response === true) {
                    setEditShown(false)
                    setPopUpMessage('Entry updated successfully')
                    setMessageVisible(true)
                    const response1 = await VaultFetch(token)
                    setVault(response1)
                    setShownVault(response1)
                    setTimeout(() => {
                        setMessageVisible(false)
                    }, 3000)
                }
            }
        } else if (entry === 'cancel') {
            setEditShown(false)
        } else {
            const plaintext = await Decrypt(
                masterKey,
                // eslint-disable-next-line security/detect-object-injection
                vault[entry]['encrypted_password'],
                // eslint-disable-next-line security/detect-object-injection
                vault[entry]['salt'],
                // eslint-disable-next-line security/detect-object-injection
                vault[entry]['nonce']
            )
            // eslint-disable-next-line security/detect-object-injection
            setLabel(vault[entry]['label'])
            // eslint-disable-next-line security/detect-object-injection
            setUsername(vault[entry]['username'])
            setPassword(plaintext)
            // eslint-disable-next-line security/detect-object-injection
            setNotes(vault[entry]['notes'])
            setEditShown(true)
        }
    }

    async function EntryDelete(entry) {
        if (entry === 'delete') {
            const response = await VaultDelete(
                label,
                username,
                password,
                salt,
                nonce,
                token
            )
            console.log(response)
            if (response === true) {
                setDeleteShown(false)
                setPopUpMessage('Entry deleted successfully')
                const response1 = await VaultFetch(token)
                setVault(response1)
                setShownVault(response1)
                setTimeout(() => {
                    setMessageVisible(false)
                }, 3000)
            }
        } else if (entry === 'cancel') {
            setDeleteShown(false)
            setMessageVisible(false)
        } else {
            // eslint-disable-next-line security/detect-object-injection
            setLabel(vault[entry]['label'])
            // eslint-disable-next-line security/detect-object-injection
            setUsername(vault[entry]['username'])
            // eslint-disable-next-line security/detect-object-injection
            setPassword(vault[entry]['encrypted_password'])
            // eslint-disable-next-line security/detect-object-injection
            setSalt(vault[entry]['salt'])
            // eslint-disable-next-line security/detect-object-injection
            setNonce(vault[entry]['nonce'])
            setPopUpMessage(
                'Are you sure you want to delete this entry? This action is permanent'
            )
            setMessageVisible(true)
            setDeleteShown(true)
        }
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
                {Array.isArray(shownVault) &&
                    shownVault.map((entry) => (
                        <div className="vaultEntry" key={entry.label}>
                            {entry.tag === 'Work' ? (
                                <div className="tag work">
                                    <h3 className="value">{entry.tag}</h3>
                                </div>
                            ) : entry.tag === 'Social' ? (
                                <div className="tag social">
                                    <h3 className="value">{entry.tag}</h3>
                                </div>
                            ) : entry.tag === 'School' ? (
                                <div className="tag school">
                                    <h3 className="value">{entry.tag}</h3>
                                </div>
                            ) : entry.tag === 'Personal' ? (
                                <div className="tag personal">
                                    <h3 className="value">{entry.tag}</h3>
                                </div>
                            ) : null}
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
                                    Show Password
                                </button>
                            </div>
                            {entry.notes === '' ? null : (
                                <div className="notes">
                                    <h3 className="label">Notes</h3>
                                    <h3 className="value">{entry.notes}</h3>
                                </div>
                            )}
                            <div className="createdAt">
                                <h3 className="label">Created at</h3>
                                <h3 className="value">
                                    {new Date(
                                        entry.created_at
                                    ).toLocaleString()}
                                </h3>
                            </div>
                            {new Date(entry.created_at).toLocaleString() ===
                            new Date(
                                entry.updated_at
                            ).toLocaleString() ? null : (
                                <div className="updatedAt">
                                    <h3 className="label">Updated at</h3>
                                    <h3 className="value">
                                        {new Date(
                                            entry.updated_at
                                        ).toLocaleString()}
                                    </h3>
                                </div>
                            )}
                            <div className="buttons">
                                <button
                                    className="editButton"
                                    onClick={() =>
                                        EntryEdit(vault.indexOf(entry))
                                    }
                                >
                                    Edit
                                </button>
                                <button
                                    className="deleteButton"
                                    onClick={() =>
                                        EntryDelete(vault.indexOf(entry))
                                    }
                                >
                                    Delete
                                </button>
                            </div>
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
                <form className="keyEntryContainer">
                    <h1>Enter your master key:</h1>
                    <input
                        type="password"
                        placeholder="master key"
                        value={enteredKey}
                        onChange={keyInput}
                        autoComplete="none"
                    ></input>
                    <button type="button" onClick={() => KeyEntry()}>
                        Enter
                    </button>
                    <h2>{keyEntryMessage}</h2>
                </form>
            )}
            {messageVisible && (
                <div className="popUpContainer">
                    <h1>{popUpMessage}</h1>
                    {deleteShown && (
                        <div className="buttons">
                            <button onClick={() => EntryDelete('delete')}>
                                Confirm
                            </button>
                            <button onClick={() => EntryDelete('cancel')}>
                                Cancel
                            </button>
                        </div>
                    )}
                </div>
            )}
            {creationShown && (
                <div className="entryCreationContainer">
                    <div className="formContainer">
                        <div className="inputs">
                            <label>Website</label>
                            <input
                                type="text"
                                name="label"
                                value={label}
                                onChange={inputHandler}
                                alt="website input"
                            ></input>
                        </div>
                        <div className="inputs">
                            <label>Username</label>
                            <input
                                type="text"
                                name="username"
                                value={username}
                                onChange={inputHandler}
                                alt="username input"
                            ></input>
                        </div>
                        <div className="inputs">
                            <label>Password</label>
                            <input
                                type="text"
                                name="password"
                                value={password}
                                onChange={inputHandler}
                                alt="password input"
                            ></input>
                            <button
                                onClick={() => GeneratePassword()}
                                alt="generate password"
                            >
                                Generate Password
                            </button>
                        </div>
                        <div className="inputs">
                            <label>Notes</label>
                            <textarea
                                type="text"
                                name="notes"
                                value={notes}
                                onChange={inputHandler}
                                alt="notes input"
                            ></textarea>
                        </div>
                        <div className="inputs">
                            <label>Tag</label>
                            <div className="checkBoxes">
                                <label>Work</label>
                                <input
                                    type="radio"
                                    name="tag"
                                    value="Work"
                                    onClick={inputHandler}
                                    alt="tag input"
                                />
                                <label>Social</label>
                                <input
                                    type="radio"
                                    name="tag"
                                    value="Social"
                                    onChange={inputHandler}
                                    alt="tag input"
                                />
                                <label>School</label>
                                <input
                                    type="radio"
                                    name="tag"
                                    value="School"
                                    onChange={inputHandler}
                                    alt="tag input"
                                />
                                <label>Personal</label>
                                <input
                                    type="radio"
                                    name="tag"
                                    value="Personal"
                                    onChange={inputHandler}
                                    alt="tag input"
                                />
                            </div>
                        </div>
                        <button
                            className="creationButton"
                            onClick={async () => await EntryCreation()}
                            alt="creation button"
                        >
                            Add password
                        </button>
                        <button onClick={() => setCreationShown(false)}>
                            Cancel
                        </button>
                        <h3>{notification}</h3>
                    </div>
                </div>
            )}
            {editShown && (
                <div className="entryCreationContainer">
                    <div className="formContainer">
                        <div className="inputs">
                            <label for="label">Website</label>
                            <h2>{label}</h2>
                        </div>
                        <div className="inputs">
                            <label for="username">Username</label>
                            <h2>{username}</h2>
                        </div>
                        <div className="inputs">
                            <label for="password">Password</label>
                            <input
                                type="text"
                                name="password"
                                value={password}
                                onChange={inputHandler}
                            ></input>
                            <button
                                onClick={() => GeneratePassword()}
                                alt="generate password"
                            >
                                Generate Password
                            </button>
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
                        <div className="inputs">
                            <label>Tag</label>
                            <div className="checkBoxes">
                                <label>Work</label>
                                <input
                                    type="radio"
                                    name="tag"
                                    value="Work"
                                    onClick={inputHandler}
                                    alt="tag input"
                                />
                                <label>Social</label>
                                <input
                                    type="radio"
                                    name="tag"
                                    value="Social"
                                    onChange={inputHandler}
                                    alt="tag input"
                                />
                                <label>School</label>
                                <input
                                    type="radio"
                                    name="tag"
                                    value="School"
                                    onChange={inputHandler}
                                    alt="tag input"
                                />
                                <label>Personal</label>
                                <input
                                    type="radio"
                                    name="tag"
                                    value="Personal"
                                    onChange={inputHandler}
                                    alt="tag input"
                                />
                            </div>
                        </div>
                        <button
                            className="creationButton"
                            onClick={() => EntryEdit('submit')}
                        >
                            Update Entry
                        </button>
                        <button
                            className="creationButton"
                            onClick={() => EntryEdit('cancel')}
                        >
                            Cancel
                        </button>
                        <h3>{notification}</h3>
                    </div>
                </div>
            )}
        </div>
    )
}
