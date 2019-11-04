import React from "react";
import { Alert } from "react-native";
import Loading from "./Loading";
import * as Location from "expo-location";
import axios from "axios";
import Weather from "./Weather";

const API_KEY = "aedd0486703e157c7ddf657dcd4db407";

export default class extends React.Component {
  state = {
    isLoading: true
  };
  getWether = async (latitude, longitude) => {
    const {
      data: {
        main: { temp },
        weather,
        name
      }
    } = await axios.get(
      `http://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&APPID=${API_KEY}&units=metric`
    );
    this.setState({
      isLoading: false,
      condition: weather[0].main,
      temp,
      city: name
    });
  };

  getLocation = async () => {
    try {
      await Location.requestPermissionsAsync();

      const {
        coords: { latitude, longitude }
      } = await Location.getCurrentPositionAsync();

      this.getWether(latitude, longitude);
    } catch (error) {
      Alert.alert("Cant't find you.", "So sad");
    }
  };

  componentDidMount() {
    this.getLocation();
  }
  render() {
    const { isLoading, temp, condition, city } = this.state;
    return isLoading ? (
      <Loading />
    ) : (
      <Weather temp={Math.round(temp)} condition={condition} city={city} />
    );
  }
}
