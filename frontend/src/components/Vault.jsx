import React from 'react'
import { useEffect, useRef, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { signOut } from '../redux/authSlice'
import { setTheme } from '../redux/appearanceSlice'
import { KeyCheck, GenerateKeyCheck, Encrypt, Decrypt } from '../utils/crypto'
import {
    KeyCreate,
    KeyFetch,
    VaultCreate,
    VaultDelete,
    VaultEdit,
    VaultFetch,
} from '../services/api'
import useKeepBackendAwake from '../hooks/useKeepBackendAwake'
import useInactivityLogout from '../hooks/useInactivityLogout'
import useTokenTimeout from '../hooks/useTokenTimeout'
import HeaderBar from './HeaderBar'
import MenuBar from './MenuBar'
import Account from './Account'
import '../assets/styles/Vault.scss'
import { Generate, Check } from '../utils/passwordGenerator'

export default function Vault() {
    const screen = useSelector((state) => state.auth.screen)
    const token = useSelector((state) => state.auth.token)
    const userEmail = useSelector((state) => state.auth.userEmail)
    const theme = useSelector((state) => state.appearance.theme)

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

    const [loading, setLoading] = useState(false)

    const timerRef = useRef(null)
    const dispatch = useDispatch()

    useKeepBackendAwake()
    useInactivityLogout()
    useTokenTimeout()

    const handleTheme = (newTheme) => {
        dispatch(setTheme(newTheme))
    }

    useEffect(() => {
        if (theme === '') {
            const colorScheme = window.matchMedia(
                '(prefers-color-scheme: dark)'
            )
            if (colorScheme.matches) {
                handleTheme('dark')
            } else {
                handleTheme('light')
            }
        }
    })

    useEffect(() => {
        document.documentElement.style.setProperty('--theme', theme)
    }, [theme])

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
            if (response === 'not set') {
                setkeySetShown(true)
            } else if (response === 'error') {
                dispatch(signOut())
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
    }, [token, dispatch])

    useEffect(() => {
        const toShow = []
        if (search != '') {
            vault.forEach((entry) => (entry.active = false))
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

    const KeySet = async () => {
        setLoading(true)
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
            setLoading(false)
            setPopUpMessage('Master key set successfully')
            setMessageVisible(true)
            setTimeout(() => {
                setMessageVisible(false)
                setkeySetShown(false)
            }, 5000)
        }
    }

    const KeyEntry = async () => {
        setLoading(true)
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
            setLoading(false)
        } else {
            setKeyEntryMessage('Invalid master key entered, please try again')
            setLoading(false)
        }
        setEnteredkey('')
    }

    const EntryCreation = async () => {
        var ready = true
        label === ''
            ? ((ready = false), setNotification('Please enter website'))
            : username === ''
              ? ((ready = false), setNotification('Please enter username'))
              : password === ''
                ? ((ready = false), setNotification('Please enter password'))
                : null

        if (ready) {
            setLoading(true)
            const check = await Check(userEmail, password)
            if (check != true) {
                let prompt = ''
                for (let i = 0; i < check['suggestions'].length; i++) {
                    // eslint-disable-next-line security/detect-object-injection
                    prompt = prompt + ' ' + check['suggestions'][i]
                }
                setNotification(prompt)
                setLoading(false)
            } else {
                setNotification('')
                const cypher = await Encrypt(masterKey, password)
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
                        setLoading(false)
                    }
                } catch (error) {
                    console.error('Error during VaultCreate:', error)
                    setLoading(false)
                }
            }
        }
    }

    const GeneratePassword = async () => {
        const generated = await Generate()
        setPassword(generated)
    }

    const EntryEdit = async (entry) => {
        if (entry === 'submit') {
            setLoading(true)
            const check = await Check(userEmail, password)
            if (check != true) {
                let prompt = ''
                for (let i = 0; i < check['suggestions'].length; i++) {
                    // eslint-disable-next-line security/detect-object-injection
                    prompt = prompt + ' ' + check['suggestions'][i]
                }
                setNotification(prompt)
                setLoading(false)
            } else {
                const cypher = await Encrypt(masterKey, password)
                const response = await VaultEdit(
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
                    setLabel('')
                    setUsername('')
                    setPassword('')
                    setNotes('')
                    setPopUpMessage('Entry updated successfully')
                    setMessageVisible(true)
                    const response1 = await VaultFetch(token)
                    setVault(response1)
                    setShownVault(response1)
                    setLoading(false)
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
            // eslint-disable-next-line security/detect-object-injection
            setTag(vault[entry]['tag'])
            setEditShown(true)
        }
    }

    const EntryDelete = async (entry) => {
        if (entry === 'delete') {
            setDeleteShown(false)
            setLoading(true)
            const response = await VaultDelete(
                label,
                username,
                password,
                salt,
                nonce,
                token
            )
            if (response === true) {
                setDeleteShown(false)
                setPopUpMessage('Entry deleted successfully')

                const response1 = await VaultFetch(token)
                setVault(response1)
                setShownVault(response1)
                setLoading(false)
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

    const CopyPassword = async (e) => {
        const elem = e.currentTarget
        const plaintext = await Decrypt(
            masterKey,
            vault[elem.value]['encrypted_password'],
            vault[elem.value]['salt'],
            vault[elem.value]['nonce']
        )
        navigator.clipboard.writeText(plaintext)
        if (theme === 'dark') {
            e.target.src = '/light/copy-light-40w.webp'
            e.target.srcset =
                '/light/copy-light-20w.webp 20w, /light/copy-light-40w.webp 40w'
        } else {
            e.target.src = '/dark/copy-dark-40w.webp'
            e.target.srcset =
                '/dark/copy-dark-20w.webp 20w, /dark/copy-dark-40w.webp 40w'
        }
        setTimeout(() => {
            if (theme === 'dark') {
                e.target.src = '/dark/copy-dark-40w.webp'
                e.target.srcset =
                    '/dark/copy-dark-20w.webp 20w, /dark/copy-dark-40w.webp 40w'
            } else {
                e.target.src = '/light/copy-light-40w.webp'
                e.target.srcset =
                    '/light/copy-light-20w.webp 20w, /light/copy-light-40w.webp 40w'
            }
        }, 1000)
    }

    const ShowEntry = (e) => {
        const label = e.currentTarget.getAttribute('data-label')
        const newVault = shownVault.map((entry) =>
            entry.label === label ? { ...entry, active: !entry.active } : entry
        )
        setShownVault(newVault)
    }

    const inputHandler = (e) => {
        e.preventDefault()
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
        } else if (e.target.name === 'keyInput') {
            setEnteredkey(e.target.value)
        } else if (e.target.name === 'keyEntry') {
            KeyEntry()
        } else if (e.target.name === 'keySet') {
            KeySet()
        } else if (e.currentTarget.name === 'addButton') {
            setLabel('')
            setUsername('')
            setPassword('')
            setNotes('')
            setTag('')
            setCreationShown(true)
        } else if (e.currentTarget.name === 'copy') {
            navigator.clipboard.writeText(e.currentTarget.value)
            if (theme === 'dark') {
                e.target.src = '/light/copy-light-40w.webp'
                e.target.srcset =
                    '/light/copy-light-20w.webp 20w, /light/copy-light-40w.webp 40w'
            } else {
                e.target.src = '/dark/copy-dark-40w.webp'
                e.target.srcset =
                    '/dark/copy-dark-20w.webp 20w, /dark/copy-dark-40w.webp 40w'
            }
            setTimeout(() => {
                if (theme === 'dark') {
                    e.target.src = '/dark/copy-dark-40w.webp'
                    e.target.srcset =
                        '/dark/copy-dark-20w.webp 20w, /dark/copy-dark-40w.webp 40w'
                } else {
                    e.target.src = '/light/copy-light-40w.webp'
                    e.target.srcset =
                        '/light/copy-light-20w.webp 20w, /light/copy-light-40w.webp 40w'
                }
            }, 1000)
        } else if (e.currentTarget.name === 'showPasswordButton') {
            ShowPassword()
        } else if (e.currentTarget.name === 'editButton') {
            EntryEdit(e.currentTarget.value)
        } else if (e.currentTarget.name === 'deleteButton') {
            EntryDelete(e.currentTarget.value)
        } else if (e.currentTarget.name === 'popupClose') {
            setMessageVisible(false)
        }
    }

    const radioHandler = (e) => {
        if (tag != e.target.value) {
            setTag(e.target.value)
        }
    }

    return (
        <>
            <HeaderBar />
            <MenuBar />
            {screen === 'account' && <Account />}
            {screen === 'vault' && (
                <div className="vaultView">
                    <div className="utilsContainer">
                        <input
                            name="search"
                            value={search}
                            onChange={inputHandler}
                            placeholder="search"
                        ></input>
                        <button
                            name="addButton"
                            alt="create new entry"
                            aria-label="create new entry"
                            onClick={inputHandler}
                        >
                            <img
                                src="/dark/add-60w.webp"
                                alt="create new entry"
                            />
                        </button>
                    </div>
                    <div className="vaultDisplay">
                        {Array.isArray(shownVault) &&
                            shownVault.map((entry) => (
                                <div
                                    className={
                                        entry.active
                                            ? 'vaultEntry'
                                            : 'vaultEntry hidden'
                                    }
                                    key={entry.label}
                                >
                                    {entry.tag === 'Work' ? (
                                        <div className="tag work">
                                            <h3 className="value">
                                                {entry.tag}
                                            </h3>
                                        </div>
                                    ) : entry.tag === 'Social' ? (
                                        <div className="tag social">
                                            <h3 className="value">
                                                {entry.tag}
                                            </h3>
                                        </div>
                                    ) : entry.tag === 'School' ? (
                                        <div className="tag school">
                                            <h3 className="value">
                                                {entry.tag}
                                            </h3>
                                        </div>
                                    ) : entry.tag === 'Personal' ? (
                                        <div className="tag personal">
                                            <h3 className="value">
                                                {entry.tag}
                                            </h3>
                                        </div>
                                    ) : (
                                        <div className="tag none">
                                            <h3 className="value">
                                                {entry.tag}
                                            </h3>
                                        </div>
                                    )}
                                    <div className="website">
                                        <div className="row">
                                            <h3 className="label">Website</h3>
                                            <button
                                                name="copy"
                                                value={entry.label}
                                                onClick={inputHandler}
                                                alt="copy website"
                                                aria-label="copy website"
                                            >
                                                <img
                                                    srcSet={
                                                        theme === 'dark'
                                                            ? '/dark/copy-dark-20w.webp 20w, /dark/copy-dark-40w.webp 40w'
                                                            : '/light/copy-light-20w.webp 20w, /light/copy-light-40w.webp 40w'
                                                    }
                                                    size="(pointer: fine) 20w, (max-width: 445) 20w, 40w"
                                                    src={
                                                        theme === 'dark'
                                                            ? '/dark/copy-dark-40w.webp'
                                                            : '/light/copy-light-40w.webp'
                                                    }
                                                />
                                            </button>
                                        </div>
                                        <h3 className="value">{entry.label}</h3>
                                    </div>
                                    <div className="username">
                                        <div className="row">
                                            <h3 className="label">Username</h3>
                                            <button
                                                name="copy"
                                                value={entry.username}
                                                onClick={inputHandler}
                                                alt="copy username"
                                                aria-label="copy username"
                                            >
                                                <img
                                                    srcSet={
                                                        theme === 'dark'
                                                            ? '/dark/copy-dark-20w.webp 20w, /dark/copy-dark-40w.webp 40w'
                                                            : '/light/copy-light-20w.webp 20w, /light/copy-light-40w.webp 40w'
                                                    }
                                                    size="(pointer: fine) 20w, (max-width: 445) 20w, 40w"
                                                    src={
                                                        theme === 'dark'
                                                            ? '/dark/copy-dark-40w.webp'
                                                            : '/light/copy-light-40w.webp'
                                                    }
                                                />
                                            </button>
                                        </div>
                                        <h3 className="value">
                                            {entry.username}
                                        </h3>
                                    </div>
                                    <div className="password">
                                        <div className="row">
                                            <button
                                                className="showPasswordButton"
                                                name="showPasswordButton"
                                                value={vault.findIndex(
                                                    (v) =>
                                                        v.label === entry.label
                                                )}
                                                onClick={ShowPassword}
                                                alt="show password"
                                                aria-label="show password"
                                            >
                                                Show Password
                                            </button>
                                            <button
                                                value={vault.findIndex(
                                                    (v) =>
                                                        v.label === entry.label
                                                )}
                                                onClick={CopyPassword}
                                                alt="copy password"
                                                aria-label="copy password"
                                            >
                                                <img
                                                    srcSet={
                                                        theme === 'dark'
                                                            ? '/dark/copy-dark-20w.webp 20w, /dark/copy-dark-40w.webp 40w'
                                                            : '/light/copy-light-20w.webp 20w, /light/copy-light-40w.webp 40w'
                                                    }
                                                    size="(pointer: fine) 20w, (max-width: 445) 20w, 40w"
                                                    src={
                                                        theme === 'dark'
                                                            ? '/dark/copy-dark-40w.webp'
                                                            : '/light/copy-light-40w.webp'
                                                    }
                                                />
                                            </button>
                                        </div>
                                    </div>
                                    {entry.notes === '' ? null : (
                                        <div className="notes">
                                            <h3 className="label">Notes</h3>
                                            <h3 className="value">
                                                {entry.notes}
                                            </h3>
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
                                    {new Date(
                                        entry.created_at
                                    ).toLocaleString() ===
                                    new Date(
                                        entry.updated_at
                                    ).toLocaleString() ? null : (
                                        <div className="updatedAt">
                                            <h3 className="label">
                                                Updated at
                                            </h3>
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
                                            name="editButton"
                                            value={vault.findIndex(
                                                (v) => v.label === entry.label
                                            )}
                                            onClick={inputHandler}
                                            alt="edit entry"
                                            aria-label="edit entry"
                                        >
                                            <img
                                                srcSet={
                                                    theme === 'dark'
                                                        ? '/dark/edit-dark-20w.webp 20w, /dark/edit-dark-40w.webp 40w'
                                                        : '/light/edit-light-20w.webp 20w, /light/edit-light-40w.webp 40w'
                                                }
                                                size="(pointer: fine) 20w, (max-width: 445) 20w, 40w"
                                                src={
                                                    theme === 'dark'
                                                        ? '/dark/edit-dark-40w.webp'
                                                        : '/light/edit-light-40w.webp'
                                                }
                                            />
                                        </button>
                                        <button
                                            className="deleteButton"
                                            name="deleteButton"
                                            value={vault.findIndex(
                                                (v) => v.label === entry.label
                                            )}
                                            onClick={inputHandler}
                                            alt="delete entry"
                                            aria-label="delete entry"
                                        >
                                            <img
                                                srcSet={
                                                    theme === 'dark'
                                                        ? '/dark/delete-dark-20w.webp 20w, /dark/delete-dark-40w.webp 40w'
                                                        : '/light/delete-light-20w.webp 20w, /light/delete-light-40w.webp 40w'
                                                }
                                                size="(pointer: fine) 20w, (max-width: 445) 20w, 40w"
                                                src={
                                                    theme === 'dark'
                                                        ? '/dark/delete-dark-40w.webp'
                                                        : '/light/delete-light-40w.webp'
                                                }
                                            />
                                        </button>
                                    </div>
                                    <button
                                        className="arrow"
                                        data-label={entry.label}
                                        onClick={ShowEntry}
                                        alt="show entry"
                                        aria-label="show entry"
                                    >
                                        <img
                                            srcSet="/dark/arrow-20w.webp 20w, /dark/arrow-40w.webp 40w"
                                            size="(pointer: fine) 20w, (max-width: 445) 20w, 40w"
                                            src="/dark/arrow-40w.webp"
                                        />
                                    </button>
                                </div>
                            ))}
                    </div>
                    {keySetShown && (
                        <form
                            className="keyContainer"
                            name="keySet"
                            onSubmit={inputHandler}
                        >
                            <h1>
                                Enter a master key to be used in accessing your
                                saved passwords.{' '}
                            </h1>
                            <h2>
                                There is no way to reset this key, if it is
                                forgotten your saved passwords will be
                                irrecoverable
                            </h2>
                            <input
                                name="keyInput"
                                type="text"
                                placeholder="master key"
                                value={enteredKey}
                                onChange={inputHandler}
                            ></input>
                            <button
                                type="submit"
                                alt="key set button"
                                aria-label="key set button"
                            >
                                Enter
                            </button>
                        </form>
                    )}
                    {keyEntryShown && (
                        <form
                            className="keyContainer"
                            name="keyEntry"
                            onSubmit={inputHandler}
                        >
                            <h1>Enter your master key:</h1>
                            <input
                                name="keyInput"
                                type="password"
                                placeholder="master key"
                                value={enteredKey}
                                onChange={inputHandler}
                                autoComplete="none"
                                autoFocus
                            ></input>
                            <button
                                type="submit"
                                alt="key entry button"
                                aria-label="key entry button"
                            >
                                Enter
                            </button>
                            <h2>{keyEntryMessage}</h2>
                        </form>
                    )}
                    {messageVisible && (
                        <div className="popUpContainer">
                            <button
                                name="popupClose"
                                onClick={inputHandler}
                                alt="close popup button"
                                aria-label="close popup button"
                            >
                                <img
                                    srcSet={
                                        theme === 'dark'
                                            ? 'dark/close-dark-20w.webp 20w, dark/close-dark-40w.webp 40w'
                                            : 'light/close-light-20w.webp 20w, light/close-light-40w.webp 40w'
                                    }
                                    size="(pointer: fine) 20w, (pointer: coarse) and (max-width: 450px) 20w, 40w"
                                    src={
                                        theme === 'dark'
                                            ? 'dark/close-dark-40w.webp'
                                            : 'light/close-light-40w.webp'
                                    }
                                />
                            </button>
                            <h1>{popUpMessage}</h1>
                            {deleteShown && (
                                <div className="buttons">
                                    <button
                                        onClick={() => EntryDelete('delete')}
                                    >
                                        Confirm
                                    </button>
                                    <button
                                        onClick={() => EntryDelete('cancel')}
                                    >
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
                                    <div className="checkBoxes">
                                        <label>Work</label>
                                        <input
                                            className="checkBox"
                                            type="radio"
                                            name="tag"
                                            value="Work"
                                            onChange={radioHandler}
                                            alt="tag input"
                                        />
                                        <label>Social</label>
                                        <input
                                            className="checkBox"
                                            type="radio"
                                            name="tag"
                                            value="Social"
                                            onChange={radioHandler}
                                            alt="tag input"
                                        />
                                        <label>School</label>
                                        <input
                                            className="checkBox"
                                            type="radio"
                                            name="tag"
                                            value="School"
                                            onChange={radioHandler}
                                            alt="tag input"
                                        />
                                        <label>Personal</label>
                                        <input
                                            className="checkBox"
                                            type="radio"
                                            name="tag"
                                            value="Personal"
                                            onChange={radioHandler}
                                            alt="tag input"
                                        />
                                        <label>None</label>
                                        <input
                                            className="checkBox"
                                            type="radio"
                                            name="tag"
                                            value=""
                                            onChange={radioHandler}
                                            alt="tag input"
                                            checked={tag === ''}
                                        />
                                    </div>
                                </div>
                                <div className="buttons">
                                    <button
                                        className="creationButton"
                                        onClick={async () =>
                                            await EntryCreation()
                                        }
                                        alt="creation button"
                                    >
                                        Add password
                                    </button>
                                    <button
                                        onClick={() => setCreationShown(false)}
                                    >
                                        Cancel
                                    </button>
                                </div>
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
                                            className="checkBox"
                                            type="radio"
                                            name="tag"
                                            value="Work"
                                            onChange={radioHandler}
                                            alt="tag input"
                                            checked={tag === 'Work'}
                                        />
                                        <label>Social</label>
                                        <input
                                            className="checkBox"
                                            type="radio"
                                            name="tag"
                                            value="Social"
                                            onChange={radioHandler}
                                            alt="tag input"
                                            checked={tag === 'Social'}
                                        />
                                        <label>School</label>
                                        <input
                                            className="checkBox"
                                            type="radio"
                                            name="tag"
                                            value="School"
                                            onChange={radioHandler}
                                            alt="tag input"
                                            checked={tag === 'School'}
                                        />
                                        <label>Personal</label>
                                        <input
                                            className="checkBox"
                                            type="radio"
                                            name="tag"
                                            value="Personal"
                                            onChange={radioHandler}
                                            alt="tag input"
                                            checked={tag === 'Personal'}
                                        />
                                        <label>None</label>
                                        <input
                                            className="checkBox"
                                            type="radio"
                                            name="tag"
                                            value=""
                                            onChange={radioHandler}
                                            alt="tag input"
                                            checked={tag === ''}
                                        />
                                    </div>
                                </div>
                                <div className="buttons">
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
                                </div>
                                <h3>{notification}</h3>
                            </div>
                        </div>
                    )}
                    {loading && (
                        <div className="loading">
                            <div className="badge">
                                <video
                                    alt="loading"
                                    autoPlay
                                    muted
                                    playsInline
                                    loop
                                >
                                    <source
                                        src={
                                            theme === 'dark'
                                                ? '/dark/loading-dark-95w.webm'
                                                : '/light/loading-light-95w.webm'
                                        }
                                        media="(max-width: 400px)"
                                        type="video/webm"
                                    />
                                    <source
                                        src={
                                            theme === 'dark'
                                                ? '/dark/loading-dark-125w.webm'
                                                : '/light/loading-light-125w.webm'
                                        }
                                        media="(max-width: 520px)"
                                        type="video/webm"
                                    />
                                    <source
                                        src={
                                            theme === 'dark'
                                                ? '/dark/loading-dark-95w.webm'
                                                : '/light/loading-light-95w.webm'
                                        }
                                        type="video/webm"
                                    />
                                </video>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </>
    )
}
