import { StatusBar } from "expo-status-bar";
import { Alert, Button, Platform, StyleSheet, View } from "react-native";
import * as Notifications from "expo-notifications";
import { useEffect } from "react";

Notifications.setNotificationHandler({
  handleNotification: async () => {
    return {
      shouldPlaySound: false,
      shouldSetBadge: false,
      shouldShowBanner: true,
      shouldShowList: true,
    };
  },
});

export default function App() {
  useEffect(() => {
    async function configurePushNotification() {
      const { status } = await Notifications.getPermissionsAsync();
      let finalStaus = status;

      if (finalStaus !== "granted") {
        const { status } = Notifications.requestPermissionsAsync();
        finalStaus = status;
      }

      if (finalStaus !== "granted") {
        Alert.alert(
          "Premissions required",
          "Push notifications need the appropriate permmissions."
        );
        return;
      }

      console.log("--------------");
      const pushTokenData = await Notifications.getExpoPushTokenAsync();
      console.log(pushTokenData);

      if (Platform.OS === "android") {
        Notifications.setNotificationChannelAsync("default", {
          name: "default",
          importance: Notifications.AndroidImportance.DEFAULT,
        });
      }
    }

    configurePushNotification();
  }, []);

  useEffect(() => {
    const subscription1 = Notifications.addNotificationReceivedListener(
      (notification) => {
        console.log("NOTIFICATION RECEIVED");
        // console.log(notification);
        const userName = notification.request.content.data.userName;
        // console.log(userName);
      }
    );

    const subscription2 = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        console.log("NOTIFICATION  RESPONSE RECEIVED");
        // console.log(response);
        const userName = response.notification.request.content.data.userName;
        // console.log(userName);
      }
    );

    return () => {
      subscription1.remove();
      subscription2.remove();
    };
  }, []);

  function ScheduleNotificationHandler() {
    Notifications.scheduleNotificationAsync({
      content: {
        title: "My first location",
        body: "This is the body of the notification.",
        data: {
          userName: "Max",
        },
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
        seconds: 5,
      },
    });
  }

  return (
    <View style={styles.container}>
      <Button
        title="Schedule Notification"
        onPress={ScheduleNotificationHandler}
      />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
