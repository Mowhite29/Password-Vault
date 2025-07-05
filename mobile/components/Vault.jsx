import { View, Text, Button, TextInput, ScrollView } from "react-native";
import { useEffect, useRef, useState } from "react";
import StyleSheet from "../styles/Vault.scss";
import { useSelector } from "react-redux";
import { KeyCheck, GenerateKeyCheck, Encrypt, Decrypt } from "../utils/crypto";
import {
  KeyCreate,
  KeyFetch,
  VaultCreate,
  VaultDelete,
  VaultEdit,
  VaultFetch,
} from "../services/api";

export default function Vault() {
  const token = useSelector((state) => state.auth.token);
  const userEmail = useSelector((state) => state.auth.userEmail);

  const [messageVisible, setMessageVisible] = useState(false);
  const [popUpMessage, setPopUpMessage] = useState("");
  const [search, setSearch] = useState("");

  const [keySetShown, setkeySetShown] = useState(false);
  const [keyEntryShown, setkeyEntryShown] = useState(false);
  const [keyEntryMessage, setKeyEntryMessage] = useState("");
  const [masterKey, setMasterKey] = useState("");
  const [enteredKey, setEnteredkey] = useState("");

  const [creationShown, setCreationShown] = useState(false);
  const [editShown, setEditShown] = useState(false);
  const [deleteShown, setDeleteShown] = useState(false);
  const [notification, setNotification] = useState("");
  const [label, setLabel] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [salt, setSalt] = useState("");
  const [nonce, setNonce] = useState("");
  const [notes, setNotes] = useState("");

  const [vault, setVault] = useState([]);
  const [shownVault, setShownVault] = useState([]);

  const timerRef = useRef(null);

  const resetTimer = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      if (masterKey) {
        setMasterKey("");
        setkeyEntryShown(true);
      }
    }, 180000);
  };

  useEffect(() => {
    const events = ["mousemove", "keydown", "click", "scroll", "touchstart"];

    const handleActivity = () => resetTimer();

    events.forEach((event) => window.addEventListener(event, handleActivity));

    resetTimer();

    return () => {
      events.forEach((event) =>
        window.removeEventListener(event, handleActivity),
      );
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  });

  useEffect(() => {
    setMasterKey("");
    InitialiseVault();

    async function InitialiseVault() {
      const response = await KeyFetch(token);
      if (response === false) {
        setkeySetShown(true);
      } else {
        setkeyEntryShown(true);
      }
    }

    RetrieveVault();

    async function RetrieveVault() {
      const response = await VaultFetch(token);
      setVault(response);
      setShownVault(response);
    }
  }, [token]);

  useEffect(() => {
    const toShow = [];
    if (search !== "") {
      for (let i = 0; i < vault.length; i++) {
        // eslint-disable-next-line security/detect-object-injection
        if (vault[i]["label"].includes(search)) {
          // eslint-disable-next-line security/detect-object-injection
          toShow.push(vault[i]);
        }
      }
      setShownVault(toShow);
    } else {
      setShownVault(vault);
    }
  }, [search, vault]);

  const keyInput = (e) => {
    setEnteredkey(e.target.value);
  };

  async function KeySet() {
    const key = await GenerateKeyCheck(enteredKey, userEmail);
    const response = await KeyCreate(
      key.encryptedString,
      key.salt1,
      key.salt2,
      key.nonce,
      token,
    );
    if (response) {
      setMasterKey(enteredKey);
      setPopUpMessage("Master key set successfully");
      setMessageVisible(true);
      setTimeout(() => {
        setMessageVisible(false);
        setkeySetShown(false);
      }, 5000);
    }
  }

  async function KeyEntry() {
    const response = await KeyFetch(token);
    const key = await KeyCheck(
      enteredKey,
      userEmail,
      response.encrypted_string,
      response.salt1,
      response.salt2,
      response.nonce,
    );
    if (key) {
      setMasterKey(enteredKey);
      setkeyEntryShown(false);
    } else {
      setKeyEntryMessage("Invalid master key entered, please try again");
    }
    setEnteredkey("");
  }

  const inputHandler = (e) => {
    if (e.target.name === "label") {
      setLabel(e.target.value);
    } else if (e.target.name === "username") {
      setUsername(e.target.value);
    } else if (e.target.name === "password") {
      setPassword(e.target.value);
    } else if (e.target.name === "notes") {
      setNotes(e.target.value);
    } else if (e.target.name === "search") {
      setSearch(e.target.value);
    }
  };

  async function EntryCreation() {
    let ready = true;
    if (label === ""){
      ready = false 
      setNotification("Please enter a password")
    }else if (username === ""){
      ready = false
      setNotification("Please enter a username")
    // eslint-disable-next-line security/detect-possible-timing-attacks
    }else if (password === "") {
      ready = false 
      setNotification("Please enter a password")
    }
    
    if (ready) {
      const cypher = await Encrypt(masterKey, password);
      try {
        const response = await VaultCreate(
          label,
          username,
          cypher.encryptedPassword,
          cypher.salt,
          cypher.nonce,
          notes,
          token,
        );
        if (response === true) {
          setCreationShown(false);
          setPopUpMessage("Password added successfully");
          setMessageVisible(true);
          const response = await VaultFetch(token);
          setVault(response);
          setShownVault(response);
          setTimeout(() => {
            setMessageVisible(false);
          }, 3000);
        }
      } catch (error) {
        console.error("Error during VaultCreate:", error);
      }
    }
  }

  const ShowPassword = async (e) => {
    const elem = e.target;
    const plaintext = await Decrypt(
      masterKey,
      vault[elem.value]["encrypted_password"],
      vault[elem.value]["salt"],
      vault[elem.value]["nonce"],
    );
    elem.innerText = plaintext;
  };

  async function EntryEdit(entry) {
    if (entry === "submit") {
      const cypher = await Encrypt(masterKey, password);
      const response = VaultEdit(
        label,
        username,
        cypher.encryptedPassword,
        cypher.salt,
        cypher.nonce,
        notes,
        token,
      );
      if (response === true) {
        setEditShown(false);
        setPopUpMessage("Entry updated successfully");
        setMessageVisible(true);
        const response1 = await VaultFetch(token);
        setVault(response1);
        setShownVault(response1);
        setTimeout(() => {
          setMessageVisible(false);
        }, 3000);
      }
    } else if (entry === "cancel") {
      setEditShown(false);
    } else {
      const plaintext = await Decrypt(
        masterKey,
        // eslint-disable-next-line security/detect-object-injection
        vault[entry]["encrypted_password"],
        // eslint-disable-next-line security/detect-object-injection
        vault[entry]["salt"],
        // eslint-disable-next-line security/detect-object-injection
        vault[entry]["nonce"],
      );
      // eslint-disable-next-line security/detect-object-injection
      setLabel(vault[entry]["label"]);
      // eslint-disable-next-line security/detect-object-injection
      setUsername(vault[entry]["username"]);
      setPassword(plaintext);
      // eslint-disable-next-line security/detect-object-injection
      setNotes(vault[entry]["notes"]);
      setEditShown(true);
    }
  }

  async function EntryDelete(entry) {
    if (entry === "delete") {
      const response = await VaultDelete(
        label,
        username,
        password,
        salt,
        nonce,
        token,
      );
      console.log(response);
      if (response === true) {
        setDeleteShown(false);
        setPopUpMessage("Entry deleted successfully");
        const response1 = await VaultFetch(token);
        setVault(response1);
        setShownVault(response1);
        setTimeout(() => {
          setMessageVisible(false);
        }, 3000);
      }
    } else if (entry === "cancel") {
      setDeleteShown(false);
      setMessageVisible(false);
    } else {
      // eslint-disable-next-line security/detect-object-injection
      setLabel(vault[entry]["label"]);
      // eslint-disable-next-line security/detect-object-injection
      setUsername(vault[entry]["username"]);
      // eslint-disable-next-line security/detect-object-injection
      setPassword(vault[entry]["encrypted_password"]);
      // eslint-disable-next-line security/detect-object-injection
      setSalt(vault[entry]["salt"]);
      // eslint-disable-next-line security/detect-object-injection
      setNonce(vault[entry]["nonce"]);
      setPopUpMessage(
        "Are you sure you want to delete this entry? This action is permanent",
      );
      setMessageVisible(true);
      setDeleteShown(true);
    }
  }

  return (
    <View style={StyleSheet.vaultView}>
      <View style={StyleSheet.utilsContainer}>
        <TextInput
          name="search"
          value={search}
          onChange={inputHandler}
          placeholder="search"
        ></TextInput>
        <Button style={StyleSheet.addButton} onClick={() => setCreationShown(true)} title="Add new password" />
      </View>
      <ScrollView style={StyleSheet.vaultDisplay}>
        {shownVault.map((entry) => (
          <View style={StyleSheet.vaultEntry} key={entry.label}>
            <View style={StyleSheet.label}>
              <Text style={StyleSheet.label}>Website</Text>
              <Text style={StyleSheet.value}>{entry.label}</Text>
            </View>
            <View style={StyleSheet.username}>
              <Text style={StyleSheet.label}>Username</Text>
              <Text style={StyleSheet.value}>{entry.username}</Text>
            </View>
            <View style={StyleSheet.password}>
              <Text style={StyleSheet.label}>Password</Text>
              <Button
                style={StyleSheet.showPasswordButton}
                value={vault.indexOf(entry)}
                onClick={ShowPassword}
              >
                Show password
              </Button>
            </View>
            {entry.notes === "" ? null : (
              <View style={StyleSheet.notes}>
                <Text style={StyleSheet.label}>Notes</Text>
                <Text style={StyleSheet.value}>{entry.notes}</Text>
              </View>
            )}
            <View style={StyleSheet.createdAt}>
              <Text style={StyleSheet.label}>Created at</Text>
              <Text style={StyleSheet.value}>
                {new Date(entry.created_at).toLocaleString()}
              </Text>
            </View>
            {new Date(entry.created_at).toLocaleString() ===
            new Date(entry.updated_at).toLocaleString() ? null : (
              <View style={StyleSheet.updatedAt}>
                <Text style={StyleSheet.label}>Updated at</Text>
                <Text style={StyleSheet.value}>
                  {new Date(entry.updated_at).toLocaleString()}
                </Text>
              </View>
            )}
            <View style={StyleSheet.buttons}>
              <Button
                style={StyleSheet.editButton}
                onClick={() => EntryEdit(vault.indexOf(entry))}
              >
                Edit
              </Button>
              <Button
                style={StyleSheet.deleteButton}
                onClick={() => EntryDelete(vault.indexOf(entry))}
              >
                Delete
              </Button>
            </View>
          </View>
        ))}
      </ScrollView>
      {keySetShown && (
        <View style={StyleSheet.keySetContainer}>
          <Text style={StyleSheet.h1}>
            Enter a master key to be used in accessing your saved
            passwords.{" "}
          </Text>
          <Text style={StyleSheet.h2}>
            There is no way to reset this key, if it is forgotten your saved
            passwords will be irrecoverable
          </Text>
          <TextInput
            type="text"
            placeholder="master key"
            value={enteredKey}
            onChange={keyInput}
          ></TextInput>
          <Button onClick={() => KeySet()} title="Enter" />
        </View>
      )}
      {keyEntryShown && (
        <View style={StyleSheet.keyEntryContainer}>
          <Text style={StyleSheet.h1}>Enter your master key:</Text>
          <TextInput
            type="password"
            placeholder="master key"
            value={enteredKey}
            onChange={keyInput}
          ></TextInput>
          <Button onClick={() => KeyEntry()}title="Enter" />
          <Text style={StyleSheet.h2}>{keyEntryMessage}</Text>
        </View>
      )}
      {messageVisible && (
        <View style={StyleSheet.popUpContainer}>
          <Text style={StyleSheet.h1}>{popUpMessage}</Text>
          {deleteShown && (
            <View style={StyleSheet.buttons}>
              <Button onClick={() => EntryDelete("delete")} title="Confirm" />
              <Button onClick={() => EntryDelete("cancel")} title="Cancel" />
            </View>
          )}
        </View>
      )}
      {creationShown && (
        <View style={StyleSheet.entryCreationContainer}>
          <View style={StyleSheet.formContainer}>
            <View style={StyleSheet.inputs}>
              <Text for="label">Website</Text>
              <TextInput
                type="text"
                name="label"
                value={label}
                onChange={inputHandler}
              ></TextInput>
            </View>
            <View style={StyleSheet.inputs}>
              <Text for="username">Username</Text>
              <TextInput
                type="text"
                name="username"
                value={username}
                onChange={inputHandler}
              ></TextInput>
            </View>
            <View style={StyleSheet.inputs}>
              <Text for="password">Password</Text>
              <TextInput
                type="text"
                name="password"
                value={password}
                onChange={inputHandler}
              ></TextInput>
            </View>
            <View style={StyleSheet.inputs}>
              <Text for="notes">Notes</Text>
              <TextInput
                type="text"
                name="notes"
                value={notes}
                onChange={inputHandler}
              ></TextInput>
            </View>
            <Button style={StyleSheet.creationButton} onClick={() => EntryCreation()} title="Add new password" />
            <Button onClick={() => setCreationShown(false)} title="Cancel" />
          </View>
          <Text style={StyleSheet.h1}>{notification}</Text>
        </View>
      )}
      {editShown && (
        <View style={StyleSheet.entryCreationContainer}>
          <View style={StyleSheet.formContainer}>
            <View style={StyleSheet.inputs}>
              <Text for="label">Website</Text>
              <Text style={StyleSheet.h2}>{label}</Text>
            </View>
            <View style={StyleSheet.inputs}>
              <Text for="username">Username</Text>
              <Text style={StyleSheet.h2}>{username}</Text>
            </View>
            <View style={StyleSheet.inputs}>
              <Text for="password">Password</Text>
              <TextInput
                type="text"
                name="password"
                value={password}
                onChange={inputHandler}
              ></TextInput>
            </View>
            <View style={StyleSheet.inputs}>
              <Text for="notes">Notes</Text>
              <textarea
                type="text"
                name="notes"
                value={notes}
                onChange={inputHandler}
              ></textarea>
            </View>
            <Button
              style={StyleSheet.creationButton}
              onClick={() => EntryEdit("submit")}
              title="Update Entry"
            />
            <Button
              style={StyleSheet.creationButton}
              onClick={() => EntryEdit("cancel")}
              title="Cancel"
            />
          </View>
          <Text style={StyleSheet.h1}>{notification}</Text>
        </View>
      )}
    </View>
  );
}
