import React, {Component} from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Button
} from 'react-native';
import Input from './components/Input.js'

export default class MorningRoute extends Component {
    constructor(props) {
        super(props);
        this.state = {
            startText: '',
            endText: '',
            summary: ''
        };
    }

    _setStart(text) {
        console.log(this.state.endText);
        this.setState({startText: text});
    }

    _setEnd(text) {
        this.setState({endText: text});
        console.log(this.state.endText);
    }

    _getRoute(start, end) {
        let query = `https://maps.googleapis.com/maps/api/directions/json?origin=${start}&destination=${end}&key=AIzaSyB3xsLMFn2XoZfmywOnsWn8tf0Ffvw7FF0`
        fetch(query).then((response) => response.json()).then((responseText) => {
            this.setState({summary: responseText});
            console.log(this.state.summary);
        }).catch(function(error) {
            console.log(error);
        });
    }

    _handleInput() {
        console.log(this.state.startText, this.state.endText);
        var locations = [this.state.startText, this.state.endText];
        locations.forEach(function(location) {
            location.replace(/\s+/g, '+');
        })
        _getRoute(locations[0], locations[1]);
    }

    render() {
        return (
            <View style={styles.container}>

                <Input
                  setStart={() => this._setStart}
                  setEnd={() => this._setEnd}
                />

                <Button
                  onPress={() => this._handleInput}
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

AppRegistry.registerComponent('MorningRoute', () => MorningRoute);
