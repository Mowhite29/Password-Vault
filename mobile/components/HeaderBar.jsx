import { View, Text } from "react-native";
import { useSelector } from "react-redux";
import StyleSheet from "../styles/HeaderBar.scss";

export default function HeaderBar() {
  const connected = useSelector((state) => state.connect.connected);
  return (
    <View style={StyleSheet.headerContainer}>
      <Text>
        DEMO PROJECT ONLY - DO NOT USE WITH REAL DATA. THIS APPLICATION IS A
        PORTFOLIO PROJECT TO DEMONSTRATE SKILLS - SEE ABOUT PAGE
      </Text>
      <Text>
        This application uses a backend which spins down when not used.
        Connection status: {connected ? "Active" : "Loading"}
      </Text>
    </View>
  );
}
