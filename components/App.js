import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TimePickerAndroid,
  Button
} from 'react-native';
import FCM from 'react-native-fcm';
import Input from './Input.js';

export default class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            startText: '5808 Miramonte Dr',
            endText: '600 Congress Ave',
            notifStart: '5808 Miramonte Dr',
            notifEnd: '600 Congress Ave',
            summary: '',
            driveTime: '',
            hour: 0,
            minute: 0,
            date: ''
        };
        this._handleInput = this._handleInput.bind(this);
        this._setStart = this._setStart.bind(this);
        this._setEnd = this._setEnd.bind(this);
        this._timeAndDate = this._timeAndDate.bind(this);
        this._getTitle = this._getTitle.bind(this);
    }

    componentDidMount() {
        FCM.getFCMToken().then(token => {
            console.log(token)
            // store fcm token in your server
        });
        this.notificationUnsubscribe = FCM.on('notification', (notif) => {
            // there are two parts of notif. notif.notification contains the notification payload, notif.data contains data payload
            if(notif.local_notification){
              //this is a local notification
            }
            if(notif.opened_from_tray){
              //app is open/resumed because user clicked banner
            }
        });
        this.refreshUnsubscribe = FCM.on('refreshToken', (token) => {
            console.log(token)
            // fcm token may not be available on first load, catch it here
        });
    }

    componentWillUnmount() {
        // prevent leaking
        this.refreshUnsubscribe();
        this.notificationUnsubscribe();
    }

    _setStart(text) {
        this.setState({startText: text});
    }

    _setEnd(text) {
        this.setState({endText: text});
    }

    _handleInput() {
        let locations = [this.state.startText, this.state.endText];
        locations.forEach(function(location) {
            location = location.replace(/\s+/g, '+');
        })
        this._getRoute(locations[0], locations[1]);
    }

    _getRoute(start, end) {
        let query = `https://maps.googleapis.com/maps/api/directions/json?origin=${start}&destination=${end}&region=us&departure_time=now&traffic_model&key=AIzaSyB3xsLMFn2XoZfmywOnsWn8tf0Ffvw7FF0`
        fetch(query).then((response) => response.json()).then((result) => {
            console.log(result);
            this._setDriveInfo(result);
        }).catch(function(error) {
            console.log(error);
        });
    }

    _getTitle() {
      return 'hi'
    }

    _setDriveInfo(result) {
      let summary = result.routes[0].summary;
      let driveTime = result.routes[0].legs[0].duration_in_traffic.text;
      this.setState({summary: `Take ${summary} today`, driveTime: `Your commute will take ${driveTime}`});
      return true;
    }

    async _timeAndDate() {
      try {
        const {action, hour, minute} = await TimePickerAndroid.open({
          hour: 7,
          minute: 30,
          is24Hour: false, // Will display '2 PM'
        });
        if (action !== TimePickerAndroid.dismissedAction) {
          let utc = new Date().toJSON().slice(0,10).split('-');
          let date = new Date(+utc[0], +utc[1] - 1, +utc[2], hour, minute).getTime()/1000;
          this.setState({date});

          function donothing() {

          }

          FCM.scheduleLocalNotification({
            my_custom_data: this._handleInput(),
            fire_date: date,     //RN's converter is used, accept epoch time and whatever that converter supports
            id: "1",    //REQUIRED! this is what you use to lookup and delete notification. In android notification with same ID will override each other
            title: '1:' + this.state.summary,
            body: '2:' + this.state.driveTime,
            repeat_interval: "day", //day, hour
            show_in_foreground: true
          })

          FCM.getScheduledLocalNotifications().then(notif => {
              // notif[0].body = this.state.summary;
              // notif[0].title = this.state.driveTime;
              console.log(notif);
          })

          FCM.getInitialNotification().then(notif=>console.log(notif));
        }
      } catch ({code, message}) {
        console.warn('Cannot open time picker', message);
      }
    }

    otherMethods() {
        FCM.subscribeToTopic('/topics/foo-bar');
        FCM.unsubscribeFromTopic('/topics/foo-bar');
        FCM.getInitialNotification().then(notif=>console.log(notif));
        FCM.presentLocalNotification({
            id: "UNIQ_ID_STRING",                               // (optional for instant notification)
            title: "My Notification Title",                     // as FCM payload
            body: "My Notification Message",                    // as FCM payload (required)
            sound: "default",                                   // as FCM payload
            priority: "high",                                   // as FCM payload
            click_action: "ACTION",                             // as FCM payload
            badge: 10,                                          // as FCM payload IOS only, set 0 to clear badges
            number: 10,                                         // Android only
            ticker: "My Notification Ticker",                   // Android only
            auto_cancel: true,                                  // Android only (default true)
            large_icon: "ic_launcher",                           // Android only
            icon: "ic_launcher",                                // as FCM payload, you can relace this with custom icon you put in mipmap
            big_text: "Show when notification is expanded",     // Android only
            sub_text: "This is a subText",                      // Android only
            color: "red",                                       // Android only
            vibrate: 300,                                       // Android only default: 300, no vibration if you pass null
            tag: 'some_tag',                                    // Android only
            group: "group",                                     // Android only
            my_custom_data:'my_custom_field_value',             // extra data you want to throw
            lights: true,                                       // Android only, LED blinking (default false)
            show_in_foreground                                  // notification when app is in foreground (local & remote)
        });

        FCM.scheduleLocalNotification({
            fire_date: new Date().getTime(),      //RN's converter is used, accept epoch time and whatever that converter supports
            id: "UNIQ_ID_STRING",    //REQUIRED! this is what you use to lookup and delete notification. In android notification with same ID will override each other
            body: "from future past",
            repeat_interval: "week" //day, hour
        })

        FCM.getScheduledLocalNotifications().then(notif=>console.log(notif));
        FCM.cancelLocalNotification("UNIQ_ID_STRING");
        FCM.cancelAllLocalNotifications();
        FCM.setBadgeNumber();                                       // iOS only and there's no way to set it in Android, yet.
        FCM.getBadgeNumber().then(number=>console.log(number));     // iOS only and there's no way to get it in Android, yet.
        FCM.send('984XXXXXXXXX', {
          my_custom_data_1: 'my_custom_field_value_1',
          my_custom_data_2: 'my_custom_field_value_2'
        });
    }

    render() {
        return (
            <View style={styles.container}>

                <Text>{this.state.summary}</Text>
                <Text>{this.state.driveTime}</Text>

                <Input
                  setStart={this._setStart}
                  setEnd={this._setEnd}
                  startText={this.state.startText}
                  endText={this.state.endText}
                />

                <Button style={{margin: 30}}
                  onPress={this._handleInput}
                  title="Set Your Commute" color="steelblue"
                  accessibilityLabel="Set Your Commute"
                />

                <Button style={{top: 30}}
                  onPress={this._timeAndDate}
                  title="Set notification Time" color="steelblue"
                  accessibilityLabel="Set notification time"
                />

            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'space-around',
        alignItems: 'center',
        backgroundColor: '#FFF'
    }
});
