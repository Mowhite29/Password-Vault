import { View, Button, Text } from "react-native";
import { useNavigate } from "react-router";
import StyleSheet from "../styles/Email.scss";

export default function Email({ type, url, user, email }) {
  const navigate = useNavigate();

  const siteURL = process.env.EXPO_FRONTEND_URL;

  function Verify() {
    navigate(url);
  }

  if (type === "email") {
    return (
      <View className="screen">
        <View className="emailContainer">
          <Text style={StyleSheet.p} className="emailHeaders">
            From: email-verify@passwordvault.info
          </Text>
          <Text style={StyleSheet.p} className="emailHeaders">
            To: {email}
          </Text>
          <Text style={StyleSheet.p} className="emailHeaders">
            Subject: Email Verification
          </Text>
          <View className="emailBody">
            <Text style={StyleSheet.p}>Hi {user},</Text>
            <Text style={StyleSheet.p}>
              Please verify your email address by clicking the link below:
            </Text>
            <Button onClick={() => Verify()}>{siteURL + url}</Button>
            <Text style={StyleSheet.p}>
              If you didn&apos;t register, please ignore this email.
            </Text>
          </View>
        </View>
      </View>
    );
  } else if (type === "email-change") {
    return (
      <View className="screen">
        <View className="emailContainer">
          <Text style={StyleSheet.p} className="emailHeaders">
            From: email-verify@passwordvault.info
          </Text>
          <Text style={StyleSheet.p} className="emailHeaders">
            To: {email}
          </Text>
          <Text style={StyleSheet.p} className="emailHeaders">
            Subject: Email Change Verification
          </Text>
          <View className="emailBody">
            <Text style={StyleSheet.p}>Hi {user},</Text>
            <Text style={StyleSheet.p}>
              Please clicking the link below to change your email address:
            </Text>
            <Button onClick={() => Verify()}>{siteURL + url}</Button>
            <Text style={StyleSheet.p}>
              If you didn&apos;t request this, please ignore this email.
            </Text>
          </View>
        </View>
      </View>
    );
  } else {
    return (
      <View className="screen">
        <View className="emailContainer">
          <Text style={StyleSheet.p} className="emailHeaders">
            From: password-change@passwordvault.info
          </Text>
          <Text style={StyleSheet.p} className="emailHeaders">
            To: {email}
          </Text>
          <Text style={StyleSheet.p} className="emailHeaders">
            Subject: Email Verification
          </Text>
          <View className="emailBody">
            <Text style={StyleSheet.p}>Hi {user},</Text>
            <Text style={StyleSheet.p}>
              Complete your password change by clicking the link below:
            </Text>
            <Button onClick={() => Verify()}>{siteURL + url}</Button>
            <Text style={StyleSheet.p}>
              If you didn&apos;t request this, please ignore this email.
            </Text>
          </View>
        </View>
      </View>
    );
  }
}
