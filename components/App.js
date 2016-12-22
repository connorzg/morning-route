import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TimePickerAndroid,
  Button,
  ToastAndroid,
  AsyncStorage
} from 'react-native';
import FCM from 'react-native-fcm';
import Input from './Input.js';
import Locations from './Locations.js'

// TODO
// Change name
// Save routes
// Save user home, work, etc
// Schedule button color, make it pop!
// eliminate repetitive api call
// handle time better

export default class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            initialPosition: 'unknown',
            lastPosition: 'unknown',
            from: {},
            to: {},
            start: '5808 Miramonte Dr',
            end: '600 Congress Ave',
            startText: 'Home',
            endText: 'Work',
            summary: 'Set a FROM and TO address above. You can view the fastest route right now, or schedule a daily notification below. Scheduling a new notification will overwrite your previous one.',
            driveTime: '',
            hour: 7,
            minute: 30,
            formattedTime: '7:30 AM',
            formattedCurrentLocation: ''
        };
        this._handleInput = this._handleInput.bind(this);
        this._setStart = this._setStart.bind(this);
        this._setEnd = this._setEnd.bind(this);
        this._timeAndDate = this._timeAndDate.bind(this);
        this._sendToServer = this._sendToServer.bind(this);
    }

    watchID: ?number = null;

    componentDidMount() {
      // this._getHome();

      navigator.geolocation.getCurrentPosition(
        (position) => {
          var initialPosition = JSON.stringify(position);
          this.setState({initialPosition});
        },
        (error) => alert(JSON.stringify(error)),
        {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000}
      );

      this.watchID = navigator.geolocation.watchPosition((position) => {
        var lastPosition = JSON.stringify(position);
        this.setState({lastPosition});
      });

      let query = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${this.state.lastPosition}&key=AIzaSyB3xsLMFn2XoZfmywOnsWn8tf0Ffvw7FF0`
      fetch(query).then((response) => response.json()).then((result) => {
          this.setState({formattedCurrentLocation: result})
          console.log(result);
      })
    }

    componentWillUnmount() {
      navigator.geolocation.clearWatch(this.watchID);
    }

    // These functions handle text input, save it to state
    _setStart(key, value) {
        this.setState({startText: key, start: value});
    }
    _setEnd(key, value) {
        this.setState({endText: key, end: value});
    }

    //  this.setState({from: this.state.from.push(place)});


    async _setFrom() {
      try {
        await AsyncStorage.setItem('@From:Home', '5808 Miramonte Dr');
      } catch (error) {
        // Error saving data
        console.log(error);
      }
    }

    async _getFrom() {
      try {
        const value = await AsyncStorage.getItem('@From');
        if (value !== null){
          // We have data!!
          console.log(value);
          this.setState({from: value});
        }
      } catch (error) {
        // Error retrieving data
        console.log(error);
      }
    }


    // Format from 24hr format, 1530 => 3:30 PM, 83 => 8:30 AM
    _formatTime(h, min) {
      if (min.toString().length == 1) {
        min = `0${min}`
      }

      let suffix = h >= 12 ? "PM":"AM";
      h = ((h + 11) % 12 + 1);

      let formattedTime = `${h}:${min} ${suffix}`;
      this.setState({formattedTime});
    }

    // Prepare route input for api call
    _handleInput() {
        let locations = [this.state.startText, this.state.endText];
        locations.forEach(function(location) {
            location = location.replace(/\s+/g, '+');
        });
        this._getRoute(locations[0], locations[1]);
    }

    // Will call api on front-end, unrelated to scheduling a notification
    _getRoute(start, end) {
        let query = `https://maps.googleapis.com/maps/api/directions/json?origin=${start}&destination=${end}&region=us&departure_time=now&traffic_model&key=AIzaSyB3xsLMFn2XoZfmywOnsWn8tf0Ffvw7FF0`
        fetch(query).then((response) => response.json()).then((result) => {
            this._setDriveInfo(result);
        }).catch(function(error) {
            ToastAndroid.show('This route could not be calculated, please try again with a more specific address.',
            ToastAndroid.LONG);
        });
    }

    // Will show route summary and time on the front end
    _setDriveInfo(result) {
      let summary = result.routes[0].summary;
      let driveTime = result.routes[0].legs[0].duration_in_traffic.text;
      this.setState({
        summary: `Take ${summary} today`,
        driveTime: `Your commute will take ${driveTime}`
      });
    }

    // Opens android time picker, sets hour and minute state when closed
    async _timeAndDate() {
      try {
        const {action, hour, minute} = await TimePickerAndroid.open({
          hour: this.state.hour,
          minute: this.state.minute,
          is24Hour: false,
        });
        if (action !== TimePickerAndroid.dismissedAction) {
          this._formatTime(hour, minute);
          this.setState({hour, minute});
        }
      } catch ({code, message}) {
        ToastAndroid.show('Cannot open the time picker, please restart the app.', ToastAndroid.LONG);
      }
    }

    // Sends data to app server which will schedule a notification
    _sendToServer() {
      FCM.send('642496660966', {
        startText: this.state.startText,
        endText: this.state.endText,
        hour: this.state.hour,
        minute: this.state.minute
      });
      ToastAndroid.show(`Notification scheduled for ${this.state.formattedTime}`,
      ToastAndroid.SHORT);
    }

    render() {
        return (
          <View style={styles.view}>
            <Text style={styles.title}>Morning Route</Text>
            <View style={styles.container}>

                <View style={styles.input}>

                  {/* <View>
                    <Text>
                      <Text style={styles.title}>Initial position: </Text>
                      {this.state.initialPosition}
                    </Text>
                    <Text>
                      <Text style={styles.title}>Current position: </Text>
                      {this.state.lastPosition}
                    </Text>
                  </View> */}

                  {/* <Input
                    setStart={this._setStart}
                    setEnd={this._setEnd}
                    startText={this.state.startText}
                    endText={this.state.endText}
                  /> */}

                  <Locations
                    setStart={this._setStart}
                    setEnd={this._setEnd}
                    startText={this.state.startText}
                    endText={this.state.endText}
                    currentLocation={this.state.formattedCurrentLocation}
                  />

                  <Button
                    onPress={this._handleInput}
                    title="View the current fastest route" color="steelblue"
                    accessibilityLabel="View the current fastest route"
                  />

                </View>

                <View style={styles.centerText}>
                  <Text style={styles.route}>{this.state.summary}</Text>
                  <Text style={styles.route}>{this.state.driveTime}</Text>
                </View>

                <View style={styles.notification}>
                  <View style={styles.row}>

                    <Text style={styles.notifText}>Notification Time:</Text>

                    <Button style={styles.button}
                      onPress={this._timeAndDate}
                      title={this.state.formattedTime} color="steelblue"
                      accessibilityLabel="Set notification time"
                    />

                  </View>

                  <Button style={styles.button}
                    onPress={this._sendToServer}
                    title="Schedule your notification" color="steelblue"
                    accessibilityLabel="Schedule the notification"
                  />

                </View>

            </View>
          </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#FFF'
    },
    view: {
      backgroundColor: 'steelblue',
      flex: 1,
      paddingBottom: 50
    },
    button: {
      margin: 20
    },
    route: {
      color: 'black',
      fontSize: 16,
      textAlign: 'center',
      width: 350
    },
    notification: {
      justifyContent: 'space-around',
      height: 120,
      width: 300
    },
    title: {
      fontSize: 30,
      fontWeight: 'bold',
      color: 'white',
      textAlign: 'center',
      padding: 15
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center'
    },
    centerText: {
      justifyContent: 'center',
      alignItems: 'center',
      height: 250
    },
    input: {
      height: 130,
      justifyContent: 'space-between'
    },
    notifText: {
      color: 'black',
      fontSize: 16,
      width:150
    }
});
