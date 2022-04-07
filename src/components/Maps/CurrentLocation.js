import { Platform,Text, StyleSheet, View, TouchableOpacity, Dimensions, Image, ToastAndroid } from 'react-native'
import React, { Component } from 'react'
import MapView from 'react-native-maps'
import Entypo from 'react-native-vector-icons/Entypo'
// import Geocoder from 'react-native-geocoder'
import Geolocation from 'react-native-geolocation-service';

export default class CurrentLocation extends Component {
    constructor(props){
        super(props);
        this.state={
          initialRegion: {
            latitude: 33.7444613,
            longitude: -118.3870173,
            latitudeDelta: 0.0122,
            longitudeDelta: 0.0122
          },
          locationChosen: false,
          marginBottom: 1,
          currentAddress: ''
        }
      }
    
      componentDidMount() {
        // Instead of navigator.geolocation, just use Geolocation.
        if (hasLocationPermission) {
        Geolocation.getCurrentPosition(
        (position) => {
        console.log(position);
        },
        (error) => {
        // See error code charts below.
        console.log(error.code, error.message);
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
        );
        }
        }
    
      handleUserLocation=()=>{
        Geolocation.getCurrentPosition(pos => {
          // alert(JSON.stringify(pos))
          this.map.animateToRegion({
            ...this.state.initialRegion,
            latitude : pos.coords.latitude,
            longitude: pos.coords.longitude
          })
    
          this.setState({
            initialRegion: {
              ...this.state.initialRegion,
            latitude : pos.coords.latitude,
            longitude: pos.coords.longitude
            },
            locationChosen: true
          })
          // this.getAddress(pos.coords.latitude,pos.coords.longitude)
        },
        err => {
          console.log(err);
          alert("Something Went Wrong! Please select location manually")
        }
        )
      }
    
      // getAddress = async(lat,lng)=>{ 
      //   await Geocoder.fallbackToGoogle(AIzaSyAjI_NfMmz2vSZmtvV2c3HY0ziL2WJP-Rw);
      //   try {
      //     let ret = await Geocoder.geocodePosition({lat, lng})
      //     let addr = (res[0].formattedAddress)
      //     this.setState({
      //       currentAddress: addr
      //   })
      //   } catch (error) {
      //     alert(err)
      //   }
      // }
    
      onChangeValue = initialRegion => {
        ToastAndroid.show(JSON.stringify(this.state.currentAddress), ToastAndroid.SHORT)
        this.setState({
          initialRegion
        })
      }
    
    
      render() {
        console.disableYellowBox=true;
        return (
          <View style={{flex: 1}}>
            <View style={{flex: 1}}>
            <MapView
            style={{flex: 1}}
            showsUserLocation = {true}
            showsMyLocationButton = {true}
            initialRegion = {this.state.initialRegion}
            onRegionChangeComplete = {this.onChangeValue}
            ref = {ref => this.map = ref}
            />
            <View style={{top: '50%', left: '50%', marginLeft: -24, marginTop: -48, position: 'absolute'}}>
              <Entypo name={'location-pin'} size={40} style={{color: 'red'}}/>
            </View>
            </View>
          </View>
        )
      }}