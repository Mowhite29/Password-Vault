import { useEffect, useState } from 'react'
import '../styles/Vault.scss'
import { useSelector } from 'react-redux'
import { KeyCheck, GenerateKeyCheck } from '../utils/crypto'
import { KeyCreate, KeyFetch } from '../services/api'

export default function Vault() {
    const token = useSelector((state) => state.auth.token)
    const userEmail = useSelector((stata) => stata.auth.userEmail)

    const [messageVisible, setMessageVisible] = useState(false)
    const [popUpMessage, setPopUpMessage] = useState('')

    const [keySetShown, setkeySetShown] = useState(false)
    const [keyEntryShown, setkeyEntryShown] = useState(false)
    const [keyValues, setKeyValues] = useState({})
    const [masterKey, setMasterKey] = useState('')
    const [enteredKey, setEnteredkey] = useState('')

    useEffect(() => {
        InitialiseVault()

        async function InitialiseVault() {
            const response = await KeyFetch(token)
            if (response === false) {
                setkeySetShown(true)
            } else {
                setKeyValues(response.data)
                setkeyEntryShown(true)
            }
        }
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

    async function EntryCreation() {
        keyValues
        masterKey
    }

    return (
        <>
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
        </>
    )
}
