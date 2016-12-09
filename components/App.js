import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TimePickerAndroid,
  Button,
  ToastAndroid
} from 'react-native';
import FCM from 'react-native-fcm';
import Input from './Input.js';

export default class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            startText: '5808 Miramonte Dr',
            endText: '600 Congress Ave',
            summary: '',
            driveTime: '',
            hour: 7,
            minute: 30
        };
        this._handleInput = this._handleInput.bind(this);
        this._setStart = this._setStart.bind(this);
        this._setEnd = this._setEnd.bind(this);
        this._timeAndDate = this._timeAndDate.bind(this);
        this._sendToServer = this._sendToServer.bind(this);
    }

    _setStart(text) {
        this.setState({startText: text});
    }
    // Above and below functions handle text input, save it to state
    _setEnd(text) {
        this.setState({endText: text});
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
            console.log(result);
            this._setDriveInfo(result);
        }).catch(function(error) {
            console.log(error);
        });
    }

    // Will show route summary and time on the front end
    _setDriveInfo(result) {
      let summary = result.routes[0].summary;
      let driveTime = result.routes[0].legs[0].duration_in_traffic.text;
      this.setState({summary: `Take ${summary} today`, driveTime: `Your commute will take ${driveTime}`});
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
          this.setState({hour, minute});
        }
      } catch ({code, message}) {
        console.warn('Cannot open time picker', message);
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
      ToastAndroid.show(`Notification scheduled for ${this.state.hour}:${this.state.minute} AM`,
      ToastAndroid.SHORT);
    }

    render() {
        return (
          <View style={{backgroundColor: 'steelblue', flex: 1, paddingBottom: 40}}>
            <Text style={{fontSize: 30, fontWeight: 'bold', color: 'white',textAlign: 'center', padding: 15}}>Morning Route</Text>
            <View style={styles.container}>
                <View style={{height: 100, justifyContent: 'space-between'}}>

                  <Input
                    setStart={this._setStart}
                    setEnd={this._setEnd}
                    startText={this.state.startText}
                    endText={this.state.endText}
                  />

                <Button
                  onPress={this._handleInput}
                  title="View the current fastest route" color="steelblue"
                  accessibilityLabel="Set Your Commute"
                />
                </View>

                <View style={{justifyContent: 'center', height: 220}}>
                  <Text style={styles.route}>{this.state.summary}</Text>
                  <Text style={styles.route}>{this.state.driveTime}</Text>
                </View>


                <View style={{
                    justifyContent: 'space-between',
                    height: 120,
                    width: 300
                  }}>

                  <Text style={{textAlign: 'center'}}>To schedule a daily notification:</Text>
                  <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                    <Text style={styles.route}>Set Notification Time </Text>
                    <Button style={styles.button}
                      onPress={this._timeAndDate}
                      title={`${this.state.hour}:${this.state.minute} AM`} color="steelblue"
                      accessibilityLabel="Set notification time"
                    />
                  </View>

                  <Button style={styles.button}
                    onPress={this._sendToServer}
                    title="Schedule your notification" color="steelblue"
                    accessibilityLabel="Send"
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
    button: {
      margin: 20
    },
    route: {
      color: 'black',
      fontSize: 16
    }
});
