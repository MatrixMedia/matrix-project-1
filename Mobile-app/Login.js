

import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ImageBackground,
  Image,
  SafeAreaView,
  Platform,
  PermissionsAndroid,
  useColorScheme,
  KeyboardAvoidingView,
  ScrollView,
  Alert,
  Linking,
  NativeModules,
} from 'react-native';
import React, { useState, useEffect } from 'react';

import { useApolloClient } from '@apollo/client';
import { Dropdown } from 'react-native-element-dropdown';
import AsyncStorage from "@react-native-async-storage/async-storage";
import Spinner from 'react-native-loading-spinner-overlay';
import Geolocation from 'react-native-geolocation-service';
import { LogBox } from 'react-native';
import RNRestart from 'react-native-restart';

import styles from '../styles/login';
import { connect } from 'react-redux';
import { languageChanges } from '../redux/actions/languageActions';
import { languages } from '../locales/languages';

import getDeviceId from '../constants/deviceId';
import getFcmToken from '../constants/fcmToken';

import {
  AuthToken,
  refreshToken,
  Latitude,
  Longitude,
  ANDROID,
  IOS,
  SelectedCommunity,
  SelectedCommunityName
} from '../constants/config';
import { textColor } from '../constants/colors';
import { userLogin, Get_CountryCodes } from '../redux/actions/userAuth';
import * as showMessage from '../constants/config';
import GetLocation, {
  Location,
  LocationErrorCode,
  isLocationError,
} from 'react-native-get-location';
import Modal from 'react-native-modal';
import LinearGradient from 'react-native-linear-gradient';

import NetworkUtils from '../constants/networkUtils';
import NoInternet from '../components/NoInternet';

const Login = props => {
  const client = useApolloClient();

  LogBox.ignoreLogs(['new NativeEventEmitter']); // Ignore log notification by message
  LogBox.ignoreAllLogs(); //Ignore all log notifications

  //  Language Update *********

  const { languageValue } = props;

  const [checked, setChecked] = React.useState(languageValue);
  const [loading, setLoading] = useState(false);

  const languageChange = async () => {
    await props.languageChanges(checked);
  };

  console.log('Current Lan:::', languages[languageValue].Home);

  //  Dark Mode Update *********
  const { darkModeValue } = props;
  console.log('darkModeValue:::', darkModeValue);

  //**** Font Size Update  ************/
  const { fontSizeValue } = props;
  console.log('fontSizeValue:::', fontSizeValue);

  const { navigation } = props;
  const [phone, setPhone] = useState('');

  const [phoneCode, setPhoneCode] = useState('');
  const [countryCode, setCountryCode] = useState('');
  const [flagImg, setFlagImg] = useState('');
  const [fcmToken, setFcmToken] = useState('');
  const [deviceId, setDeviceId] = useState('');
  const [deviceType, setDeviceType] = useState('');
  const [isAcceptTC, setIsAcceptTC] = useState(false);
  const [countryName, setCountryName] = useState('');
  const [countrycodelist, setCountryCodeList] = useState([]);

  const [isFocus, setIsFocus] = useState(false);

  const [isPhoneError, setIsPhoneError] = useState(false);
  const [isInvalidPhoneError, setIsInvalidPhoneError] = useState(false);
  const [isAppPortalVal, setIsAppPortalVal] = useState(true);
  const [getplccountrycode, setgetplccountrycode] = useState('');
  const [btnColor, setBtnColor] = useState(false);

  //*** Button color change when all fields are filled ***//

  useEffect(() => {
    if (phoneCode !== '' && phone !== '') {
      setBtnColor(true);
    } else {
      setBtnColor(false);
    }
  }, [phone]);

  // useEffect(() => {
  //   getLocation().then(res => {
  //     console.log(res);
  //   });
  // }, []);

  useEffect(() => {
    languageChange();
  }, [checked]);

  useEffect(() => {
    get_countrycode();
  }, []);

  //** Location Permission **//
  const [loading2, setLoading2] = useState(false);
  const [location, setLocation] = useState(Location);
  const [error, setError] = useState(LocationErrorCode);

  const [isRemoveFavModal, setIsRemoveModal] = useState(false);
  const toggleRemoveFav = () => {
    setIsRemoveModal(!isAddFavModal);
  };
  const hideisRemoveFav = () => setIsRemoveModal(false);













  useEffect(() => {
    if (Platform.OS === ANDROID) {
      requestLocation();
    } else {
      getLocation().then(res => {
        console.log(res);
      });
    }
  }, []);

  const requestLocation = async () => {
    const openSetting = () => {
      Linking.sendIntent('android.settings.SETTINGS').catch(() => {
        Alert.alert('Unable to open settings');
      });
    };
    setLoading2(true);
    setLocation(null);
    setError(null);

    GetLocation.getCurrentPosition({
      enableHighAccuracy: true,
      timeout: 30000,
      rationale: {
        title: 'Location permission',
        message: 'The app needs the permission to request your location.',
        buttonPositive: 'Ok',
      },
    })
      .then(async newLocation => {
        setLoading2(false);
        setLocation(newLocation);
        const lat = newLocation.latitude;
        const long = newLocation.longitude;
        console.log(
          '************NEW___location 1111',
          JSON.stringify(newLocation),
        );
        await AsyncStorage.setItem(Latitude, '' + lat);
        await AsyncStorage.setItem(Longitude, '' + long);
        console.log('*********longitude ####', long);
        console.log('$$$$$$$$___latitude ####', lat);
      })
      .catch(ex => {
        // toggleRemoveFav();
        Alert.alert(
          // toggleRemoveFav()

          `Turn on device location to get a better experience.`,
          '',
          [
            { text: 'Go to Settings', onPress: openSetting },
            { text: "Ok", onPress: () => { } },
          ],
        );
        console.log('********ex', ex);
        if (isLocationError(ex)) {
          const { code, message } = ex;
          console.warn(code, message);
          setError(code);
          console.log('********code', code);
        } else {
          console.warn(ex);
        }
        setLoading(false);
        setLocation(null);
      });
  };

  const hasLocationPermission = async () => {
    if (Platform.OS === 'ios') {
      const hasPermission = await hasPermissionIOS();
      return hasPermission;
    }

    if (Platform.OS === 'android' && Platform.Version < 23) {
      return true;
    }

    const hasPermission = await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
    );

    if (hasPermission) {
      return true;
    }

    const status = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    );
    console.log('**********status___location*****', status);
    if (status === PermissionsAndroid.RESULTS.GRANTED) {
      return true;
    }
    console.log('**********status___location22222*****', status);
    if (status === PermissionsAndroid.RESULTS.DENIED) {
      console.log('Location permission denied by user');
      presentToast('Location permission denied by user');
    } else if (status === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
      console.log('Location permission revoked by user');
      presentToast('Location permission revoked by user');
    }

    return false;
  };

  const hasPermissionIOS = async () => {
    const openSetting = () => {
      Linking.openSettings().catch(() => {
        Alert.alert('Unable to open settings');
      });
    };
    const status = await Geolocation.requestAuthorization('whenInUse');

    if (status === 'granted') {
      return true;
    }

    if (status === 'denied') {
      Alert.alert('Location permission denied');
    }

    if (status === 'disabled') {
      // toggleRemoveFav()

      Alert.alert(
        // openModal()
        `Turn on device location to get a better experience.`,
        '',
        [
          { text: 'Go to Settings', onPress: openSetting },
          { text: "Ok", onPress: () => { } },
        ],
      );
    }

    return false;
  };

  const getLocation = async () => {
    const hasPermission = await hasLocationPermission();
    // console.log("Current Lat long!!", lat+"::"+lng);

    if (!hasPermission) {
      //dispatch(updateLoaderStatus(false));

      return;
    }

    Geolocation.getCurrentPosition(
      async position => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        console.log('*****************position:::', position);

        if (lat !== undefined && lng !== undefined) {
          //   store.dispatch(setLocation({ type: 'SET_LOCATION',  payload:{lat, lng}}))
          console.log('Current Language:::', lat + '::' + lng);
          // await AsyncStorage.setItem(Latitude, lat+"::"+lng);
          await AsyncStorage.setItem(Latitude, '' + lat);
          await AsyncStorage.setItem(Longitude, '' + lng);
          console.log('*********latitude !!!!', Latitude);
          console.log('*********longitude ####', lng);
        }
      },
      error => {
        console.log(error);
      },
      {
        accuracy: {
          android: 'high',
          ios: 'best',
        },
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 10000,
        distanceFilter: 0,
        forceRequestLocation: true,
        forceLocationManager: false,
        showLocationDialog: true,
      },
    );
  };

  // useEffect(() => {
  //   getLocation().then(res => {
  //     console.log(res);
  //   });
  // }, []);

  useEffect(() => {
    getdeviceType();
  }, []);

  const getdeviceType = () => {
    var uniqueType = 'android';
    if (Platform.OS === 'ios') {
      uniqueType = 'ios';
    }

    setDeviceType(uniqueType);
    console.log('device type>>>', deviceType);
  };

  const pressSubmit = async () => {
    const isConnected = await NetworkUtils.isNetworkAvailable();

    const fcmToken = await getFcmToken();

    const deviceId = await getDeviceId();

    console.log('******fcmToken type>>>', fcmToken);

    // setLoading(true);
    if (phoneCode === '') {
      setIsPhoneError(true);
    } else if (phone === '') {
      setIsPhoneError(true);
    } else {
      setIsPhoneError(false);
      if (phone.length < 8) {
        setIsInvalidPhoneError(true);
      } else {
        setIsInvalidPhoneError(false);
      }
    }
    // if (phoneCode && phone && !isAcceptTC) {
    //   showMessage.showToast('Please accept terms and conditions');
    // }
    if (phoneCode !== '' && phone !== '' && phone.length >= 8) {
      setLoading(true);
      try {
        if (isConnected) {
          await props
            .userLogin(client, {
              phone,
              phoneCode,
              countryCode,
              fcmToken,
              deviceId,
              deviceType,
              isAppPortalVal,
            })
            .then(async response => {
              //    console.log('response log ::: login:::', response);
              setLoading(false);
              if (response.code === 200) {
                await AsyncStorage.setItem(
                  refreshToken,
                  response.data.token.refreshToken,
                );
                navigation.navigate('Otp');
                await AsyncStorage.setItem(
                  'userLogin',
                  JSON.stringify(response.data.phone),
                );
                // await AsyncStorage.setItem(
                //   SelectedCommunity,
                //   response.data.communityId,
                // );
                // await AsyncStorage.setItem(
                //   SelectedCommunityName,
                //   response.data.communityName,
                // );
                await AsyncStorage.setItem('phoneNumber', phone);
                await AsyncStorage.setItem('countryCode', phoneCode);

                await AsyncStorage.setItem(
                  AuthToken,
                  response.data.token.accessToken,
                );
                // showMessage.showToast(response.message);
              } else {
                showMessage.showToast(response.message);
              }
            })
            .catch(err => {
              setLoading(false);
              setTimeout(() => {
                // showMessage.showToast("Error", err, [
                //     {
                //         text: "OK",
                //         onPress: () => console.log("OK Pressed")
                //     }
                // ],
                //     { cancelable: false }
                // );
              }, 100);
              console.log('error log1111', err);
              Alert.alert(err);
            });
        } else {
          // Alert.alert(
          //   'Internet Connection',
          //   'You are offline. Some features may not be available.',

          //   [
          //     // {
          //     //   text: 'Go to Settings',
          //     //   onPress: () => openSetting(),
          //     //   style: 'cancel',
          //     // },
          //     {text: 'Reload App', onPress: () => RNRestart.Restart()},
          //   ],
          //   {cancelable: false},
          // );
          showMessage.showToast('Please check your internet connection');
          setLoading(false);
        }
      } catch (e) {
        console.log('err log', e);
      }
    }
  };

  //** Country Code **//

  const get_countrycode = async () => {
    const isConnected = await NetworkUtils.isNetworkAvailable();
    console.log('getList!!!!');

    let accessTokenval = await AsyncStorage.getItem(AuthToken);
    console.log('accessToken', accessTokenval);
    try {
      if (isConnected) {
        await props
          .Get_CountryCodes(client, { accessTokenval })
          .then(async response => {
            console.log('response log', JSON.stringify(response));
            setLoading(false);

            if (response.data.getCountryCodes.code === 200) {
              console.log(
                'country_codes',
                response.data.getCountryCodes.data.length,
              );
              if (response.data.getCountryCodes.data.length > 0) {
                setCountryCodeList(response.data.getCountryCodes.data);
                setgetplccountrycode(
                  response.data.getCountryCodes.data[0].dialCode,
                );

                console.log(
                  '***********__countrycode',
                  response.data.getCountryCodes.data[0].dialCode,
                );

              } else {
                setCountryCode([]);
              }
            }
          })
          .catch(err => {
            setLoading(false);
            setTimeout(() => {
              //   Alert.alert("Error", err, [
              //     {
              //       text: "OK",
              //       onPress: () => console.log("OK Pressed")
              //     }
              //   ],
              //     { cancelable: false }
              //   );
            }, 100);
            console.log('error log', err);
          });
      } else {
        showMessage.showToast('Please check your internet connection');
        // Alert.alert(
        //   'Internet Connection',
        //   'You are offline. Some features may not be available. After turn on internet reload the app.',

        //   [
        //     // {
        //     //   text: 'Go to Settings',
        //     //   onPress: () => openSetting(),
        //     //   style: 'cancel',
        //     // },
        //     {text: 'Reload App', onPress: () => RNRestart.Restart()},
        //   ],
        //   {cancelable: false},
        // );
        setLoading(false);
      }
    } catch (e) {
      console.log('err log', e);
      setLoading(false);
    }
  };
  const [isConnected, setIsConnected] = useState(false);
  const theme = useColorScheme();


  const renderItem = item => {
    return (
      <View style={styles.item}>
        <Text style={styles.textItem}>{item.label}</Text>
        {item.value === countrycodelist && (
          <Image
            source={{ uri: item.flag }}

          />
          //  setFlagImg(item.flag)

        )}
      </View>
    );
  };

  return (


    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : ''}
      style={{ flex: 1 }}>
      {isConnected == true ? (
        <SafeAreaView
          style={
            styles.outer
          }>
          <Spinner
            visible={loading}
            color={textColor}
            textContent={''}
            textStyle={styles.spinnerTextStyle}
          />
          <ImageBackground
            style={styles.imgBackgrnd}
            source={require('../assets/images/imagebackground2.png')}>
            <View style={{ flex: 1 }}>
              <View style={styles.appBar}>
                {/* <TouchableOpacity onPress={() => navigation.navigate('Language')}>
              <View>
                <Image
                  style={styles.whiteArrow}
                  source={require('../assets/images/ic_arrow_left_choose_your_language.png')}
                />
              </View>
            </TouchableOpacity> */}
                <View style={styles.appBarTextView}>
                  <Text style={styles.appText(fontSizeValue)}>
                    {languages[languageValue].GetStarted}
                  </Text>
                </View>
              </View>
              <ScrollView>
                {/* <ImageBackground style={styles.imgBackgrnd1}></ImageBackground> */}
                <View
                  style={{
                    paddingLeft: 30,
                    paddingRight: 30,
                    // justifyContent:'center',
                    // alignItems:'center',
                    marginTop: 100,
                    marginBottom: 10,
                  }}>
                  <View style={styles.middleBox}>
                    <View style={styles.headerTextView}>
                      <Text style={styles.headerText(fontSizeValue)}>
                        {
                          languages[languageValue]
                            .Pleaseenteryourmobiletoproceedfurther
                        }
                      </Text>
                      {/* {location ? (
                      <Text style={styles.location}>
                        {JSON.stringify(location, null, 2)}
                      </Text>
                    ) : null}
                    {error ? (
                      <Text style={styles.location}>Error: {error}</Text>
                    ) : null} */}
                    </View>
                    <View style={styles.mobileTextView}>
                      <Image
                        style={styles.mobileIcon}
                        source={require('../assets/images/mobileicon.png')}
                      />
                      <Text
                        style={
                          styles.mobileText(fontSizeValue)
                        }>
                        {languages[languageValue].PHONENUMBER}
                      </Text>
                    </View>
                    <View style={styles.contentView}>
                      <View
                        style={{
                          flexDirection: 'row',
                          paddingLeft: 5,
                          paddingRight: 5,
                        }}>
                        {isFocus === false && (
                          <View
                            style={{
                              alignItems: 'center',
                              justifyContent: 'center',
                              position: 'absolute',
                              top: 10,
                              left: 10,
                            }}>
                            <Text style={styles.textField}>
                              {languages[languageValue].Select}{'\n'}{languages[languageValue].countrycode}
                              {/* {languages[languageValue].Selectcountrycode} */}
                            </Text>
                          </View>
                        )}

                        <Dropdown
                          style={[styles.dropdownLast]}
                          placeholderStyle={styles.placeholderStyle}
                          selectedTextStyle={styles.selectedTextStyle(
                            fontSizeValue,
                          )}
                          inputSearchStyle={styles.inputSearchStyle(
                            fontSizeValue,
                          )}
                          containerStyle={
                            styles.containerStyle
                          }
                          fontFamily={'Poppins-Medium'}
                          dropdownPosition="bottom"
                          // activeColor="#cdcbcb"
                          data={countrycodelist}
                          search
                          maxHeight={250}
                          labelField="dialCode"
                          valueField="code"

                          placeholder="+1"
                          searchPlaceholder="Search..."

                          value={countrycodelist}
                          iconStyle={styles.iconStyle}
                          // onFocus={() => setIsFocus(true)}
                          // onBlur={() => setIsFocus(false)}
                          onChange={item => {
                            console.log('*****dialCode ' + item.dialCode);
                            console.log('***********code ' + item.code);
                            console.log('*****flag 1111111' + item.flag),
                              setPhoneCode(item.dialCode);
                            setCountryCode(item.code);
                            setFlagImg(item.flag)
                            setIsFocus(true);
                            //setIsFocus(false);
                          }}
                          renderItem={(item) => (
                            <View style={styles.dropdownItem}>
                              <Image source={{ uri: item.flag }} style={styles.flagStyle} />
                              <Text style={styles.itemText}>{`${item.name} (${item.dialCode})`}</Text>
                            </View>
                          )}


                        />
                        {/* <View   style={[
                          styles.textField
                        ]}>
                          <Text>+1</Text>
                        </View> */}
                        <View style={styles.inputView}>
                          <TextInput
                            style={styles.titleInput}
                            keyboardType="number-pad"
                            placeholder={
                              languages[languageValue].Enteryourmobilenumber
                            }
                            placeholderTextColor={'#333'}
                            maxLength={showMessage.PHONE_MAX_LENGTH}
                            value={phone}
                            onChangeText={text => {
                              if (text.trim() === '') {
                                setPhone('');
                                setIsPhoneError(true);
                              } else if (
                                !isNaN(text) &&
                                text.charAt(text.length - 1) !== '.'
                              ) {
                                setPhone(text);
                                setIsPhoneError(false);
                                if (text.length >= 8) {
                                  setIsInvalidPhoneError(false);
                                } else {
                                  setIsInvalidPhoneError(true);
                                }
                              } else {
                                setIsPhoneError(true);
                              }
                            }}
                          />
                        </View>
                      </View>

                      <View style={styles.alertStyle}>
                        {isPhoneError && (
                          <Text style={styles.alertTxt(fontSizeValue)}>
                            {languages[languageValue].Phonenumberisrequired}
                          </Text>
                        )}
                        {!isPhoneError && isInvalidPhoneError && (
                          <Text style={styles.alertTxt(fontSizeValue)}>
                            {
                              languages[languageValue]
                                .Mobilenumbershouldminimum10digits
                            }
                          </Text>
                        )}
                      </View>
                      <View style={styles.buttonView}>
                        <TouchableOpacity
                          onPress={pressSubmit}
                          // onPress={() => navigation.navigate('Otp')}
                          // style={
                          //   btnColor
                          //     ? styles.pressTouchableActive
                          //     : styles.pressTouchableInactive
                          // }
                          style={styles.pressTouchableActive}>
                          <Text
                            // style={
                            //   btnColor
                            //     ? styles.pressTextActive(fontSizeValue)
                            //     : styles.pressTextInactive(fontSizeValue)
                            // }
                            style={styles.pressTextActive(fontSizeValue)}>
                            {' '}
                            {languages[languageValue].submit}
                          </Text>
                        </TouchableOpacity>
                      </View>

                      <View style={styles.conditionView}>
                        <View style={styles.subHeadingView}>
                          <Text style={styles.text(fontSizeValue)}>
                            {languages[languageValue].App}
                          </Text>
                        </View>

                        <View style={styles.tickView}>
                          <Image
                            style={styles.eclipsicon}
                            source={require('../assets/images/eclips.png')}
                          />
                          <View style={styles.subTxtView}>
                            <Text style={styles.groupText(fontSizeValue)}>
                              {
                                languages[languageValue]
                                  .Doesnotsellortradeyourdata
                              }
                            </Text>
                          </View>
                        </View>

                        <View style={styles.tickView}>
                          <Image
                            style={styles.eclipsicon}
                            source={require('../assets/images/eclips.png')}
                          />
                          <View style={styles.subTxtView}>
                            <Text style={styles.groupText(fontSizeValue)}>
                              {
                                languages[languageValue]
                                  .IsISO27001certifiedforinformationsecurity
                              }
                            </Text>
                          </View>
                        </View>
                        <View style={styles.tickView}>
                          <Image
                            style={styles.eclipsicon}
                            source={require('../assets/images/eclips.png')}
                          />
                          <View style={styles.subTxtView}>
                            <Text style={styles.groupText(fontSizeValue)}>
                              {
                                languages[languageValue]
                                  .Encryptsandsecuresyourdata
                              }
                            </Text>
                          </View>
                        </View>
                        <View style={styles.tickView}>
                          <Image
                            style={styles.eclipsicon}
                            source={require('../assets/images/eclips.png')}
                          />
                          <View style={styles.subTxtView}>
                            <Text style={styles.groupText(fontSizeValue)}>
                              {
                                languages[languageValue]
                                  .IscertifiedGDPRreadyThegoldstandardinprivacy
                              }
                            </Text>
                          </View>
                        </View>

                        <View style={styles.clickableTextView}>
                          <TouchableOpacity
                            onPress={() => props.navigation.push('Privacy')}>
                            <Text style={styles.clickableText(fontSizeValue)}>
                              {languages[languageValue].privacypolicy}
                            </Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    </View>
                  </View>
                </View>
              </ScrollView>
            </View>
            {/* <View style={styles.eeView}>
            <Image
              style={styles.eeIcon}
              source={require('../assets/images/ee.png')}
            />
          </View> */}
          </ImageBackground>
        </SafeAreaView>
      ) : (
        <NoInternet isConnected={isConnected} setIsConnected={setIsConnected} />
      )}
    </KeyboardAvoidingView>
    //  ):(
    //   <NoInternet
    //   isConnected={isConnected}
    //   setIsConnected={setIsConnected}
    // />
    // )}

  );
};

const mapStateToProps = ({ dark, font, language }) => {
  console.log('language ' + language.currentlanguage);
  console.log('mapStateToProps ' + JSON.stringify(dark));
  console.log('mapStateToProps font ' + JSON.stringify(font));
  return {
    darkModeValue: dark.darkMode,
    fontSizeValue: font.fontSize,
    languageValue: language.currentlanguage,
  };
};

const mapDispatchToProps = dispatch => ({
  languageChanges: inputs => dispatch(languageChanges(inputs)),
  // demoAPI: (client) => dispatch(demoAPI(client)),
  userLogin: (client, inputs) => dispatch(userLogin(client, inputs)),
  Get_CountryCodes: (client, input) =>
    dispatch(Get_CountryCodes(client, input)),
});
export default connect(mapStateToProps, mapDispatchToProps)(Login);
