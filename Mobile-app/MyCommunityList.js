import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  Alert,
  FlatList,
  Image,
  ScrollView,
  ImageBackground,
  Dimensions,
  TouchableOpacity,
  NativeModules,
  useColorScheme,
  Linking,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import {useApolloClient} from '@apollo/client';
import AsyncStorage from "@react-native-async-storage/async-storage";
import Spinner from 'react-native-loading-spinner-overlay';
import Modal from 'react-native-modal';
import {Provider, useSelector, useDispatch} from 'react-redux';
import NoInternet from '../components/NoInternet';

import styles from '../styles/mycommunitylist';
import {connect} from 'react-redux';
import {languages} from '../locales/languages';
import {languageChanges} from '../redux/actions/languageActions';

import {textColor} from '../constants/colors';
import LinearGradient from 'react-native-linear-gradient';
import NetworkUtils from '../constants/networkUtils';

// import {communitySwitch} from '../redux/actions/communitySwitchAction';

import {
  Phone_Regx,
  countryCode,
  phoneCode,
  EMAIL_REGX,
  AuthToken,
  SelectedCommunity,
  SelectedCommunityName,
  SelectedCommunityLogo,
  Latitude,
  Longitude,
  EventId,
  // isCommunitySwitch
} from '../../src/constants/config';
import {
  switch_communitiesList,
  community_switch,
  current_user_role,
  self_demotion,
  leave_community,
  myCommunities,
  logout,
} from '../redux/actions/userAuth';
import {communitySwitchAction} from '../redux/actions/communitySwitchAction';
import {switchCommunity} from '../redux/actions/switchCommunityAction';
import RNRestart from 'react-native-restart';

import * as showMessage from '../constants/config';

const MyCommunityList = props => {
  const client = useApolloClient();

  //  Language Update *********

  const {languageValue} = props;

  const [checked, setChecked] = React.useState(languageValue);

  useEffect(() => {
    languageChange();
  }, [checked]);

  const languageChange = async () => {
    await props.languageChanges(checked);
  };

  console.log('Current Lan:::', languages[languageValue].Home);

  //  Dark Mode Update *********
  const {darkModeValue} = props;
  console.log('darkModeValue:::', darkModeValue);

  //**** Font Size Update  ************/
  const {fontSizeValue} = props;
  console.log('fontSizeValue:::', fontSizeValue);
  const {navigation} = props;

  const [getCommunityList, setGetCommunityList] = useState([]);
  const [getcommunityId, setGetCommunityId] = useState('');
  const [memberCount, setMemberCount] = useState('');
  const [approvedCommunity, setApprovedCommunity] = useState([]);
  const [commCount, setCommCount] = useState(0);

  const [loading, setLoading] = useState(false);
  const [item, setitemdvalue] = useState({});

  const isUserLoggedIn = useSelector(state => {
    console.log('userDetails:: ', state.user.userDetails);
    return state.user.userDetails;
  });

  useEffect(() => {
    getMyRelatedCommunities();
  }, []);

  const getMyRelatedCommunities = async () => {
    console.log('getList!!!!');
    setLoading(true);
    let getLatVal = parseFloat(await AsyncStorage.getItem(Latitude));

    console.log('lat_MyComm!!', getLatVal);

    let getLngVal = parseFloat(await AsyncStorage.getItem(Longitude));
    console.log('long_MyComm!!', getLngVal);
    let isAppPortal = true;

    let accessTokenval = await AsyncStorage.getItem(AuthToken);
    console.log('accessToken', accessTokenval);
    try {
      await props
        .myCommunities(client, {
          accessTokenval,
          getLatVal,
          getLngVal,
          isAppPortal,
        })
        .then(async response => {
          console.log('response log', JSON.stringify(response));
          setLoading(false);
          // setRefreshing(false);

          if (response.data.getMyRelatedCommunities.code == 200) {
            console.log(
              '------response.data.myCommunities.lenghth',
              response.data.getMyRelatedCommunities.data.myCommunities.length,
            );
            if (
              response.data.getMyRelatedCommunities.data.myCommunities.length >
              0
            ) {
              setApprovedCommunity(
                response.data.getMyRelatedCommunities.data.myCommunities,
              );
              // getmycommunities({id: response.data.myCommunities.id, communityName:response.data.myCommunities.communityName})
            }
            // else {
            //   setGetLatitude(getLatitude);
            //   setGetLongitude(getLongitude);
            // }
          }
          if (response.data.getMyRelatedCommunities.code === 403) {
            logoutval();

            RNRestart.Restart();
          }
        })
        .catch(err => {
          setLoading(false);
          // setRefreshing(false);

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
    } catch (e) {
      console.log('err log', e);
      setLoading(false);
      //  setRefreshing(false);
    }
  };

  // useEffect(() => {
  //   getSwitchCommunity();
  // }, []);

  const getSwitchCommunity = async bannerImage => {
    const isConnected = await NetworkUtils.isNetworkAvailable();
    console.log('getList!!!!');
    setLoading(true);

    //   let eventIdVal = await AsyncStorage.getItem(EventId);
    //   console.log('eventIdVal >>', eventIdVal);

    //   let getLatVal = await AsyncStorage.getItem(Latitude);
    //   console.log('lat_SwitchComm !!', getLatVal);
    //   let getLngVal = await AsyncStorage.getItem(Longitude);
    //   console.log('long_SwitchComm !!', getLngVal);

    let accessTokenval = await AsyncStorage.getItem(AuthToken);
    console.log('accessToken', accessTokenval);
    try {
      if (isConnected) {
        await props
          .switch_communitiesList(client, {accessTokenval})
          .then(async response => {
            // console.log('res_get_community:::', JSON.stringify(response));
            setLoading(false);

            if (response.data.getMyCommunities.code == 200) {
              //   console.log('res_get_community:::', JSON.stringify(response));
              // if (
              //   response.data.getMyCommunities.data.myCommunities.length === 0
              // ) {
              //   navigation.navigate('ExploreMoreCommunity');
              // }
              setCommCount(
                response.data.getMyCommunities.data.myCommunities.length,
              );
              await AsyncStorage.setItem(
                '_______comm_______list',
                JSON.stringify(
                  response.data.getMyCommunities.data.myCommunities,
                ),
              );

              console.log(
                'response.data.switchCommunity.length',
                response.data.getMyCommunities.data.myCommunities.length,
              );
              if (
                response.data.getMyCommunities.data.myCommunities.length > 0
              ) {
                setGetCommunityList(
                  response.data.getMyCommunities.data.myCommunities,
                );
                console.log(
                  '**********item*****************',
                  JSON.stringify(
                    response.data.getMyCommunities.data.myCommunities,
                  ),
                );
              } else {
                setGetCommunityList([]);
              }
            }
            if (response.data.getMyCommunities.code === 403) {
              logoutval();

              RNRestart.Restart();
            }
          })
          .catch(err => {
            setLoading(false);
            setTimeout(() => {}, 100);
            console.log('error log', err);
          });
      } else {
        showMessage.showToast('Please check your internet connection');
        setLoading(false);
      }
    } catch (e) {
      console.log('err log', e);
      setLoading(false);
    }
  };

  const [commId, setCommId] = useState('');
  const [getCommName, setGetCommName] = useState('');
  const [getCommRole, setGetCommRole] = useState([]);

  const [promote, setPromote] = useState(false);
  const [isAppPortal, setIsAppPortal] = useState(true);

  const [isDemoteVisible, setDemoteVisible] = useState(false);

  const toggleDemote = () => {
    setDemoteVisible(!isDemoteVisible);
  };
  const hideDemote = () => setDemoteVisible(false);

  const [isLeaveCommVisible, setLeaveCommVisible] = useState(false);

  const toggleLeaveComm = () => {
    setLeaveCommVisible(!isLeaveCommVisible);
  };
  const hideLeaveComm = () => setLeaveCommVisible(false);

  const [alertModal, setAlertModal] = useState(false);
  const togglealertModal = () => {
    setAlertModal(!alertModal);
  };
  const hideAlertModal = () => setAlertModal(false);

  // useEffect(() => {
  //   getCurrentUserRole();
  // }, []);

  const getCurrentUserRole = async commId => {
    console.log('getList!!!!');
    setLoading(true);
    let isAppPortal = true;

    let accessTokenval = await AsyncStorage.getItem(AuthToken);
    console.log('accessToken', accessTokenval);

    console.log('_____________commId______________', commId);
    // let commval = JSON.stringify(item.id);
    // setCommId(commval);
    try {
      await props
        .current_user_role(client, {accessTokenval, commId, isAppPortal})
        .then(async response => {
          console.log(
            '________currentUserRole XXXXXX:::',
            JSON.stringify(response),
          );
          setLoading(false);

          if (response.data.communityUserRole.code == 200) {
            console.log('________currentUserRole:::', JSON.stringify(response));

            // setGetUserRole(response.data.communityUserRole.data.role);
            // console.log('________currentUserRole22222:::', getUserRole);
            // setGetCommRole(response.data.communityUserRole.data.role);

            console.log(
              '________currentUserRole111111111:::',
              JSON.stringify(response.data.communityUserRole.data.role),
            );

            if (response.data.communityUserRole.data.role === 'member') {
              toggleDemote();
            } else if (response.data.communityUserRole.data.role === 'fan') {
              toggleLeaveComm();
            } else {
              togglealertModal();
              // alert(
              //   'Your are' +
              //     ' ' +
              //     response.data.communityUserRole.data.role +
              //     ' ' +
              //     'of this community, you cannot leave!' +
              //     ' ' +
              //     'To leave this community you need go to SangaRaahi.net for demoting yourself to member.',
              // );
            }
          }
          if (response.data.communityUserRole.code === 403) {
            logoutval();

            RNRestart.Restart();
          }
        })
        .catch(err => {
          setLoading(false);
          setTimeout(() => {}, 100);
          console.log('error log', err);
        });
    } catch (e) {
      console.log('err log', e);
      setLoading(false);
    }
  };

  const handleSelfDemotion = async commId => {
    const isConnected = await NetworkUtils.isNetworkAvailable();
    console.log('getList!!!!');
    setLoading(true);

    console.log('**************commId!!!!', commId);
    let usrIDvalue = isUserLoggedIn.id;
    console.log('**** isUserLoggedIn __ ID ********', usrIDvalue);
    let isAppPortal = true;

    let accessTokenval = await AsyncStorage.getItem(AuthToken);
    console.log('accessToken', accessTokenval);
    try {
      if (isConnected) {
        await props
          .self_demotion(client, {
            accessTokenval,
            usrIDvalue,
            commId,
            promote,
            isAppPortal,
          })
          .then(async response => {
            console.log('response log**********', JSON.stringify(response));
            setLoading(false);

            if (response.data.promoteOrDemoteAppMember.code === 200) {
              showMessage.showToast(
                response.data.promoteOrDemoteAppMember.message,
              );

              getMyRelatedCommunities();
              hideDemote();
            } else {
              showMessage.showToast(
                response.data.promoteOrDemoteAppMember.message,
              );
            }
            if (response.data.promoteOrDemoteAppMember.code === 403) {
              logoutval();

              RNRestart.Restart();
            }
            console.log(
              'promoteOrDemoteAppMember !!',
              response.data.promoteOrDemoteAppMember.message,
            );
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
        setLoading(false);
      }
    } catch (e) {
      console.log('err log', e);
      setLoading(false);
    }
  };

  const handleLeaveCommunity = async commId => {
    const isConnected = await NetworkUtils.isNetworkAvailable();
    console.log('getList!!!!');
    setLoading(true);

    console.log('**************____leave___commId!!!!', commId);
    let isAppPortal = true;

    let accessTokenval = await AsyncStorage.getItem(AuthToken);
    console.log('accessToken', accessTokenval);
    try {
      if (isConnected) {
        await props
          .leave_community(client, {
            accessTokenval,
            commId,
            isAppPortal,
          })
          .then(async response => {
            console.log('response log**********', JSON.stringify(response));
            setLoading(false);

            if (response.data.leaveCommunity.code === 200) {
              showMessage.showToast(response.data.leaveCommunity.message);

              getMyRelatedCommunities();
              hideLeaveComm();
              navigation.navigate('ExploreMoreCommunity');
              // if(commCount === 0){
              //   RNRestart.Restart();
              // }
            } else {
              showMessage.showToast(response.data.leaveCommunity.message);
            }
            if (response.data.leaveCommunity.code === 403) {
              logoutval();

              RNRestart.Restart();
            }
            console.log(
              'leaveCommunity !!',
              response.data.leaveCommunity.message,
            );
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
        setLoading(false);
      }
    } catch (e) {
      console.log('err log', e);
      setLoading(false);
    }
  };

  const theme = useColorScheme();
  const [isConnected, setIsConnected] = useState(false);

  const logoutval = async () => {
    const isConnected = await NetworkUtils.isNetworkAvailable();
    console.log('out !!!!!');
    setLoading(true);
    let accessTokenval2 = await AsyncStorage.getItem(AuthToken);
    console.log('accessToken', accessTokenval2);

    try {
      if (isConnected) {
        await props
          .logout(client, {accessTokenval2})
          .then(async response => {
            console.log('response log', JSON.stringify(response));
            setLoading(false);
            if (response.data.logout.error == false) {
              // await AsyncStorage.removeItem(UserInfo);
              await AsyncStorage.removeItem(AuthToken);
              await AsyncStorage.setItem(UserInfo, JSON.stringify(''));
              // await AsyncStorage.setItem(SelectedCommunity,
              //   JSON.stringify(''),);
              // await AsyncStorage.removeItem(SelectedCommunity);

              RNRestart.Restart();
              // navigation.navigate("Login")
              // NativeModules.DevSettings.reload();
              // await props.removeUserDetails()
              // navigation.navigate("Intro")
            } else {
            }
          })
          .catch(err => {
            setLoading(false);
            setTimeout(() => {}, 100);
            console.log('error log', JSON.stringify(err));
          });
      } else {
        showMessage.showToast('Please check your internet connection');
        setLoading(false);
      }
    } catch (e) {
      console.log('err log', e);
      setLoading(false);
    }
  };

  return (
    <>
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
            blurRadius={5}
            style={styles.imgBackgrnd}
            source={require('../assets/images/imagebackground2.png')}>
            <View style={{backgroundColor: '#06C0BA', paddingBottom: 50}}>
              <View style={styles.appBar}>
                <TouchableOpacity
                  onPress={() => navigation.navigate('More')}
                  style={{}}>
                  <Image
                    style={styles.arrowleft}
                    source={require('../assets/images/arrowleft.png')}
                  />
                </TouchableOpacity>
                <Text style={styles.appBarText}>
                  {languages[languageValue].MyCommunities}
                </Text>
              </View>
            </View>

            <ScrollView style={{bottom: 0}}>
              <LinearGradient
                colors={['#06C0BA', '#06C0BA', '#00A19C']}
                style={{
                  backgroundColor: '#06C0BA',
                  borderBottomLeftRadius: 80,
                  height: 540,
                  paddingBottom: 40,
                }}>
                <View style={styles.body}>
                  <LinearGradient
                    colors={['#ED8015', '#ED8015', '#FFB345']}
                    style={styles.mainBox}>
                    <View style={styles.titleCont}>
                      <Text style={styles.titleText}>
                        {languages[languageValue].LeaveOrganization}
                      </Text>
                    </View>
                    {approvedCommunity.length > 0 ? (
                      <FlatList
                        showsVerticalScrollIndicator={false}
                        data={approvedCommunity}
                        renderItem={({item}) => {
                          return (
                            <View style={styles.subMainBox}>
                              <View
                                style={styles.contentBox}
                                //   onPress={value => {
                                //     {
                                //       item.currentlySelected === true
                                //         ? alert(
                                //             'You are already belong to this community',
                                //           )
                                //         : communitySwitch(
                                //             item.id,
                                //             item.communityName,
                                //             item.logoImage,
                                //             item,
                                //           );

                                //     }
                                //   }}
                              >
                                <View style={styles.contentBoxView}>
                                  <View style={styles.imgView}>
                                    <Image
                                      resizeMode="contain"
                                      style={styles.commImg}
                                      source={
                                        item.logoImage === null ||
                                        item.logoImage === ''
                                          ? require('../assets/images/rockbandImggg.jpg')
                                          : {uri: item.logoImage}
                                      }
                                    />
                                  </View>
                                  <View style={styles.contentBoxTextView5}>
                                    <Text style={styles.contentBoxText}>
                                      {item.communityName}
                                    </Text>
                                    <Text style={styles.contentBoxText2}>
                                      {item.communityType}
                                    </Text>

                                    <Text style={styles.contentBoxText2}>
                                      {item.members.roles}
                                    </Text>
                                  </View>
                                </View>
                                {item.members.roles === 'Fan' && (
                                  <TouchableOpacity
                                    onPress={() => {
                                      setCommId(item.id);
                                      getCurrentUserRole(item.id);
                                      setGetCommName(item.communityName);
                                      setGetCommRole(item.members.roles[0]);
                                      console.log(
                                        '_________________role________',
                                        item.members.roles,
                                      );

                                      // setGetUserRole(item.role);
                                      // if(item.role === 'member'){
                                      //   toggleDemote()
                                      // }
                                      // else if(item.role === 'fan'){
                                      //   toggleLeaveComm()
                                      // }
                                    }}
                                    style={styles.arrowView}>
                                    <Image
                                      style={styles.rightarrow}
                                      source={require('../assets/images/leave.png')}
                                    />
                                  </TouchableOpacity>
                                )}

                                {item.members.roles === 'Member' && (
                                  <TouchableOpacity
                                    onPress={() => {
                                      setCommId(item.id);
                                      getCurrentUserRole(item.id);
                                      setGetCommName(item.communityName);
                                      setGetCommRole(item.members.roles[0]);
                                      console.log(
                                        '_________________role________',
                                        item.members.roles,
                                      );

                                      // setGetUserRole(item.role);
                                      // if(item.role === 'member'){
                                      //   toggleDemote()
                                      // }
                                      // else if(item.role === 'fan'){
                                      //   toggleLeaveComm()
                                      // }
                                    }}
                                    style={styles.arrowView}>
                                    <Image
                                      style={styles.rightarrow}
                                      source={require('../assets/images/demote.png')}
                                    />
                                  </TouchableOpacity>
                                )}

                                {(item.members.roles === 'Board Member' ||
                                  item.members.roles ===
                                    'Executive Member') && (
                                  <TouchableOpacity
                                    onPress={() => {
                                      setCommId(item.id);
                                      getCurrentUserRole(item.id);
                                      setGetCommName(item.communityName);
                                      setGetCommRole(item.members.roles);
                                      console.log(
                                        '_________________role________',
                                        item.members.roles,
                                      );

                                      // setGetUserRole(item.role);
                                      // if(item.role === 'member'){
                                      //   toggleDemote()
                                      // }
                                      // else if(item.role === 'fan'){
                                      //   toggleLeaveComm()
                                      // }
                                    }}
                                    style={styles.arrowView}>
                                    <Image
                                      style={styles.rightarrow}
                                      source={require('../assets/images/info.png')}
                                    />
                                  </TouchableOpacity>
                                )}
                                <Modal
                                  animationIn="swing"
                                  animationOut="zoomOut"
                                  style={styles.recurringModalView}
                                  isVisible={isDemoteVisible}
                                  onDismiss={hideDemote}
                                  backdropOpacity={0.5}
                                  onBackdropPress={toggleDemote}>
                                  <LinearGradient
                                    colors={['#ED8015', '#ED8015', '#FFB345']}
                                    style={styles.recurringModal}>
                                    <View
                                      style={{
                                        justifyContent: 'flex-start',
                                        // alignItems: 'center',
                                        bottom: 0,
                                        paddingLeft: 15,
                                        paddingRight: 15,
                                        marginTop: 10,
                                      }}>
                                      <Text style={styles.modTitleTxt}>
                                        {languages[languageValue].SelfDemotion}
                                      </Text>
                                      <Text style={styles.modDesTxt}>
                                        {languages[languageValue].Youare}{' '}
                                        <Text style={styles.modTitleTxt2}>
                                          {languages[languageValue].member}{' '}
                                        </Text>
                                        {languages[languageValue].of}{' '}
                                        <Text style={styles.modTitleTxt2}>
                                          {getCommName}.{' '}
                                        </Text>
                                        {
                                          languages[languageValue]
                                            .Toleavethiscommunityyouneedtodemoteyourselfto
                                        }{' '}
                                        <Text style={styles.modTitleTxt2}>
                                          {languages[languageValue].fan}
                                        </Text>{' '}
                                        {languages[languageValue].first}.{'\n'}
                                        {
                                          languages[languageValue]
                                            .Onceyoubecomeafanyoucanonlyaccess
                                        }{' '}
                                        <Text style={styles.modTitleTxt2}>
                                          {
                                            languages[languageValue]
                                              .publicevents
                                          }
                                        </Text>{' '}
                                        {
                                          languages[languageValue]
                                            .ofthiscommunity
                                        }
                                        .{'\n'}
                                        {'\n'}
                                        {
                                          languages[languageValue]
                                            .Areyousuretodemoteyourselftofan
                                        }
                                        ?
                                      </Text>
                                    </View>
                                    <View style={styles.amntView}>
                                      <View
                                        style={
                                          styles.evntModalDetailsCont
                                        }></View>
                                      <TouchableOpacity
                                        onPress={() => {
                                          handleSelfDemotion(commId);
                                        }}
                                        style={styles.confirmPress}>
                                        <Text style={styles.confirmPressText}>
                                          {languages[languageValue].YesDemote}
                                        </Text>
                                      </TouchableOpacity>
                                      <TouchableOpacity
                                        onPress={() => {
                                          hideDemote();
                                        }}
                                        style={styles.cancelPress}>
                                        <Text style={styles.confirmPressText}>
                                          {languages[languageValue].cancel}
                                        </Text>
                                      </TouchableOpacity>
                                    </View>
                                  </LinearGradient>
                                </Modal>

                                <Modal
                                  animationIn="swing"
                                  animationOut="zoomOut"
                                  style={styles.recurringModalView}
                                  isVisible={isLeaveCommVisible}
                                  onDismiss={hideLeaveComm}
                                  backdropOpacity={0.5}
                                  onBackdropPress={toggleLeaveComm}>
                                  <LinearGradient
                                    colors={['#ED8015', '#ED8015', '#FFB345']}
                                    style={styles.recurringModal}>
                                    <View
                                      style={{
                                        justifyContent: 'flex-start',
                                        // alignItems: 'center',
                                        bottom: 0,
                                        paddingLeft: 15,
                                        paddingRight: 15,
                                        marginTop: 10,
                                      }}>
                                      <Text style={styles.modTitleTxt}>
                                        {
                                          languages[languageValue]
                                            .LeaveOrganization
                                        }
                                      </Text>
                                      <Text style={styles.modDesTxt}>
                                        {
                                          languages[languageValue]
                                            .Onceyouleavethecommunityyouwillnolongerpartofanyactivitiesofthiscommunity
                                        }
                                        .{'\n'}
                                        {
                                          languages[languageValue]
                                            .Areyousuretoleave
                                        }{' '}
                                        <Text style={styles.modTitleTxt2}>
                                          {getCommName}?
                                        </Text>
                                      </Text>
                                    </View>
                                    <View style={styles.amntView}>
                                      <View
                                        style={
                                          styles.evntModalDetailsCont
                                        }></View>
                                      <TouchableOpacity
                                        onPress={() => {
                                          handleLeaveCommunity(commId);
                                        }}
                                        style={styles.confirmPress}>
                                        <Text style={styles.confirmPressText}>
                                          {languages[languageValue].yessure}
                                        </Text>
                                      </TouchableOpacity>
                                      <TouchableOpacity
                                        onPress={() => {
                                          hideLeaveComm();
                                        }}
                                        style={styles.cancelPress}>
                                        <Text style={styles.confirmPressText}>
                                          {languages[languageValue].notnow}
                                        </Text>
                                      </TouchableOpacity>
                                    </View>
                                  </LinearGradient>
                                </Modal>

                                <Modal
                                  animationIn="swing"
                                  animationOut="zoomOut"
                                  style={styles.recurringModalView}
                                  isVisible={alertModal}
                                  onDismiss={hideAlertModal}
                                  backdropOpacity={0.5}
                                  onBackdropPress={togglealertModal}>
                                  <LinearGradient
                                    colors={['#ED8015', '#ED8015', '#FFB345']}
                                    style={styles.recurringModaljoin}>
                                    <View
                                      style={{
                                        justifyContent: 'flex-start',
                                        // alignItems: 'center',
                                        bottom: 0,
                                        paddingLeft: 15,
                                        paddingRight: 15,
                                        marginTop: 25,
                                      }}>
                                      <Text style={styles.modTitleTxt}>
                                        {languages[languageValue].Alert}!
                                      </Text>
                                      <Text style={styles.modDesTxt}>
                                        {languages[languageValue].Yourare}{' '}
                                        {getCommRole}{' '}
                                        {
                                          languages[languageValue]
                                            .ofthiscommunityyoucannotleaveToleavethiscommunityyouneedgoto
                                        }{' '}
                                        <Text
                                          style={styles.urlTxt}
                                          onPress={() =>
                                            Linking.openURL(
                                              'https://sangarahinet.demoyourprojects.com/',
                                            )
                                          }>
                                          SangaRahinet
                                        </Text>{' '}
                                        {
                                          languages[languageValue]
                                            .fordemotingyourselftomember
                                        }
                                        .
                                      </Text>
                                    </View>
                                    <View style={styles.paymentSuccessImgCont}>
                                      <TouchableOpacity
                                        onPress={hideAlertModal}
                                        style={styles.confirmPress}>
                                        <Text style={styles.confirmPressText}>
                                          {languages[languageValue].okthanks}
                                        </Text>
                                      </TouchableOpacity>
                                    </View>
                                  </LinearGradient>
                                </Modal>
                              </View>
                            </View>
                          );
                        }}
                      />
                    ) : (
                      <View
                        style={{
                          justifyContent: 'center',
                          alignItems: 'center',
                          marginTop: 20,
                        }}>
                        <Text style={styles.text5}>
                          {
                            languages[languageValue]
                              .Youdontbelongtoanycommunityyet
                          }
                          !
                        </Text>
                        {/* <Text style={styles.text5}>
                    To join a community, go to {'\n'}</Text> */}

                        <TouchableOpacity
                          onPress={() => {
                            navigation.navigate('ExploreMoreCommunity');
                          }}
                          style={styles.buttonView}>
                          <LinearGradient
                            colors={['#2CD6D1', '#2CD6D1', '#09605D']}
                            style={styles.buttonStyle}>
                            <Text style={styles.buttonText}>
                              {languages[languageValue].ExploreNewCommunity}
                            </Text>
                          </LinearGradient>
                        </TouchableOpacity>

                        {/* <TouchableOpacity onPress={()=>{navigation.navigate("ExploreMoreCommunity")}}>
                      <Text style={styles.modTitleTxt}> Explore New Community </Text>
                    </TouchableOpacity> */}
                      </View>
                    )}
                  </LinearGradient>
                </View>
              </LinearGradient>
            </ScrollView>
          </ImageBackground>
        </SafeAreaView>
      ) : (
        <NoInternet isConnected={isConnected} setIsConnected={setIsConnected} />
      )}
    </>
  );
};

const mapStateToProps = ({dark, font, language, switchcomm}) => {
  console.log('language ' + language.currentlanguage);
  // console.log('switchcomm ' + switchcomm.isCommunitySwitch);

  return {
    darkModeValue: dark.darkMode,
    fontSizeValue: font.fontSize,
    languageValue: language.currentlanguage,
    // communitySwitchValue: switchcomm.isCommunitySwitch
  };
};

const mapDispatchToProps = dispatch => ({
  languageChanges: inputs => dispatch(languageChanges(inputs)),
  switch_communitiesList: (client, inputs) =>
    dispatch(switch_communitiesList(client, inputs)),
  community_switch: (client, inputs) =>
    dispatch(community_switch(client, inputs)),
  communitySwitchAction: inputs => dispatch(communitySwitchAction(inputs)),
  switchCommunity: inputs => dispatch(switchCommunity(inputs)),
  current_user_role: (client, inputs) =>
    dispatch(current_user_role(client, inputs)),
  self_demotion: (client, inputs) => dispatch(self_demotion(client, inputs)),
  leave_community: (client, inputs) =>
    dispatch(leave_community(client, inputs)),

  myCommunities: (client, inputs) => dispatch(myCommunities(client, inputs)),
  logout: (client, inputs) => dispatch(logout(client, inputs)),
});

export default connect(mapStateToProps, mapDispatchToProps)(MyCommunityList);
