import { View, Text, Button, Link } from "react-native";
import { useState } from "react";
import StyleSheet from "../styles/About.scss";

export default function About() {
  const [about, setAbout] = useState(true);
  const [legal, setLegal] = useState(false);
  const [credits, setCredits] = useState(false);

  function inputHandler(input) {
    if (input === "about") {
      setAbout(true);
      setLegal(false);
      setCredits(false);
    } else if (input === "legal") {
      setAbout(false);
      setLegal(true);
      setCredits(false);
    } else if (input === "credits") {
      setAbout(false);
      setLegal(false);
      setCredits(true);
    }
  }

  return (
    <View style={StyleSheet.aboutContainer}>
      <View style={StyleSheet.Buttons}>
        <Button
          onClick={() => inputHandler("about")}
          title="About"
          accessibilityLabel="About"
        />
        <Button
          onClick={() => inputHandler("legal")}
          title="Legal"
          accessibilityLabel="Legal"
        />
        <Button
          onClick={() => inputHandler("credits")}
          title="Credits"
          accessibilityLabel="Credits"
        />
      </View>
      {about && (
        <View style={StyleSheet.about}>
          <Text style={StyleSheet.h1}>About</Text>
          <Text style={StyleSheet.p}>
            This application is a personal portfolio project created to
            demonstrate front-end and back-end development skills. It is not a
            production-ready system and is not intended for real-world use.
          </Text>

          <Link
            href="https://github.com/Mowhite29/Password-Vault"
            target="_blank"
          >
            Project Repository
          </Link>
        </View>
      )}
      {legal && (
        <View style={StyleSheet.legal}>
          <Text style={StyleSheet.h1}>Legal Disclaimer</Text>
          <Text style={StyleSheet.p}>
            This application is a non-commercial portfolio project created by
            Moses White for the purposes of demonstrating application
            development skills.
          </Text>
          <Text style={StyleSheet.p}>
            The application is provided &quot;as is&quot;, with no warranties of
            any kind, express or implied, including but not limited to any
            warranties of merchantability, fitness for a particular purpose, or
            non-infringement
          </Text>
          <Text style={StyleSheet.p}>
            **Do not store real passwords, sensitive data, or personal
            information within this application. It is not a production hardened
            system**
          </Text>
          <Text style={StyleSheet.p}>
            The authior accepts no liability for any loss, damage, or misuse
            resulting from the use of this project. By accessing or interacting
            with this demo, you agree to these terms.
          </Text>
        </View>
      )}
      {credits && (
        <View style={StyleSheet.credits}>
          <Link
            href="https://www.flaticon.com/free-animated-icons"
            title="animated icons"
          >
            Animated icons created by Freepik - Flaticon
          </Link>
          <br></br>
          <Link
            href="https://www.flaticon.com/free-icons/dropdown"
            title="dropdown icons"
          >
            Dropdown icons created by HideMaru - Flaticon
          </Link>
          <br></br>
          <Link
            href="https://www.flaticon.com/authors/graphicmall"
            title="door icons"
          >
            Door icons created by graphicmall - Flaticon
          </Link>
          <br></br>
          <Link
            href="https://www.flaticon.com/free-icons/recycle-bin"
            title="recycle bin icons"
          >
            Recycle bin icons created by lakonicon - Flaticon
          </Link>
          <br></br>
          <Link
            href="https://www.flaticon.com/free-icons/edit"
            title="edit icons"
          >
            Edit icons created by Kiranshastry - Flaticon
          </Link>
          <br></br>
          <Link
            href="https://www.flaticon.com/free-icons/close"
            title="close icons"
          >
            Close icons created by Pixel perfect - Flaticon
          </Link>
          <br></br>
          <Link
            href="https://www.flaticon.com/free-icons/close"
            title="close icons"
          >
            Close icons created by joalfa - Flaticon
          </Link>
        </View>
      )}
    </View>
  );
}
