import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Button
} from 'react-native';
import Input from './Input.js';

export default class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            startText: '5808 Miramonte Dr',
            endText: '600 Congress Ave',
            summary: '',
            driveTime: ''
        };
        this._handleInput = this._handleInput.bind(this);
        this._setStart = this._setStart.bind(this);
        this._setEnd = this._setEnd.bind(this);
    }

    _setStart(text) {
        this.setState({startText: text});
    }

    _setEnd(text) {
        this.setState({endText: text});
    }

    _getRoute(start, end) {
        let query = `https://maps.googleapis.com/maps/api/directions/json?origin=${start}&destination=${end}&region=us&departure_time=now&traffic_model&key=AIzaSyB3xsLMFn2XoZfmywOnsWn8tf0Ffvw7FF0`
        fetch(query).then((response) => response.json()).then((result) => {
            console.log(result);
            let summary = result.routes[0].summary;
            let driveTime = result.routes[0].legs[0].duration_in_traffic.text
            this.setState({summary, driveTime});
        }).catch(function(error) {
            console.log(error);
        });
    }

    _handleInput() {
        let locations = [this.state.startText, this.state.endText];
        locations.forEach(function(location) {
            location = location.replace(/\s+/g, '+');
        })
        this._getRoute(locations[0], locations[1]);
    }

    render() {
        return (
            <View style={styles.container}>

                <Text>Take {this.state.summary} Today!</Text>
                <Text>{this.state.driveTime}</Text>

                <Input
                  setStart={this._setStart}
                  setEnd={this._setEnd}
                  startText={this.state.startText}
                  endText={this.state.endText}
                />

                <Button
                  onPress={this._handleInput}
                  title="Set Your Commute" color="steelblue"
                  accessibilityLabel="Set Your Commute"
                />

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
    welcome: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10
    },
    instructions: {
        textAlign: 'center',
        color: '#333333',
        marginBottom: 5
    }
});
