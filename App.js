import React from 'react';
import {StyleSheet, Text, View, Platform, ImageBackground, Image} from 'react-native';
import {MapView, Constants, Location, Permissions} from 'expo';
import {fetchLocationId} from "./api";
import Svg, {Image as Imagesvg} from "react-native-svg";


export default class App extends React.Component {
    state = {
        location: null,
        userList: [],
        errorMessage: null,
        initialRender: true,
        region: {
            latitude: 37.78825,
            longitude: -122.4324,
            latitudeDelta: 0.0122,
            longitudeDelta: 0.0121,
        },
    };

    componentWillMount() {
        this._getLocationAsync();
    }

    _getLocationAsync = async () => {
        let {status} = await Permissions.askAsync(Permissions.LOCATION);
        if (status !== 'granted') {
            this.setState({
                errorMessage: 'Permission to access location was denied',
            });
        }
        let location = await Location.getCurrentPositionAsync({});
        this.setState({location});
        this.setState({
            region: {
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
            }
        });
        let userList = await fetchLocationId();
        this.setState({
            userList: userList
        })

    };

    render() {
        let text = 'Waiting...';
        if (this.state.errorMessage) {
            text = this.state.errorMessage;
        } else if (this.state.location && this.state.userList) {
            text = JSON.stringify(this.state.location);
            return (
                <MapView
                    style={{flex: 1}}
                    region={this.state.region}
                >
                    <MapView.Marker
                        coordinate={{
                            latitude: this.state.location.coords.latitude,
                            longitude: this.state.location.coords.longitude
                        }}
                        title='You'
                        pinColor='#BF7039'
                    >
                        <View style={styles.raidus}>
                            <View style={styles.marker}>
                            </View>
                        </View>

                    </MapView.Marker>
                    {this.state.userList.map((marker, i) => (
                        <MapView.Marker
                            key={i}
                            coordinate={{
                                latitude: marker.lat,
                                longitude: marker.lng
                            }}
                            title={marker.name}
                        >
                            <Svg
                            width='50' height='50'>
                            <Imagesvg
                            x="5%"
                            y="5%"
                            href={{uri: marker.avatar}}
                            width='40'
                            height='40'
                            />
                            </Svg>
                        </MapView.Marker>
                    ))}

                </MapView>
            );
        }
        return (
            <View style={styles.container}>
                <Text>{text}</Text>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    raidus: {
        height: 40,
        width: 40,
        borderRadius: 40 / 2,
        backgroundColor: '#CBD9EF',
        overflow: 'hidden',
        alignItems: 'center',
        justifyContent: 'center'
    },
    marker: {
        height: 20,
        width: 20,
        borderWidth: 1,
        borderRadius: 20 / 2,
        borderColor: '#fff',
        overflow: 'hidden',
        backgroundColor: '#4285F4',
        justifyContent: 'center',
        alignItems: 'center'
    },
});
