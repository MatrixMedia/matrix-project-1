import {
  View,
  Text,
  StyleSheet,
  Image,
  SafeAreaView,
  TouchableOpacity,
  TouchableHighlight,
  FlatList,
  Pressable,
  ScrollView,
  ImageBackground,
  useColorScheme,
  Alert,
  PermissionsAndroid,
  Platform,
} from 'react-native';
import React, { useState, useEffect } from 'react';

import Feather from 'react-native-vector-icons/Feather';
import styles from '../styles/communitydetails';
import { connect } from 'react-redux';
import { languages } from '../locales/languages';
import { languageChanges } from '../redux/actions/languageActions';
import AsyncStorage from "@react-native-async-storage/async-storage";
import Spinner from 'react-native-loading-spinner-overlay';
import { useApolloClient } from '@apollo/client';

import { AuthToken, CommunityId, IOS } from '../../src/constants/config';
import { community_Details, join_community, logout } from '../redux/actions/userAuth';
import { textColor } from '../constants/colors';
import * as showMessage from '../constants/config';
import LinearGradient from 'react-native-linear-gradient';
import NetworkUtils from '../constants/networkUtils';
import Modal from 'react-native-modal';
import NoInternet from '../components/NoInternet';

import {
  getFormattedDate_NEW,
  getFormattedTime_NEW,
  getFormattedDate_FULL,
  getFormattedDate,
  getFormattedDate2,
  getFormattedDate_rsvp,
} from '../../src/constants/datetimeFormat';

import RNFetchBlob from 'rn-fetch-blob';
var RNFS = require('react-native-fs');

const CommunityDetails = props => {
  const client = useApolloClient();
  const [loading, setLoading] = useState(false);

  const { navigation } = props;
  const { languageValue } = props;
  const [imageModalVisible, setImageModalVisible] = useState(false);
  const [itemval, setItemVal] = useState({});

  const [communityName, setCommunityName] = useState('');
  const [bannerImage, setBannerImage] = useState('');
  const [firstaddressline, setFirstaddressline] = useState('');
  const [secondaddressline, setSecondaddressline] = useState('');
  const [getCity, setGetCity] = useState('');
  const [getState, setGetState] = useState('');
  const [getCountry, setGetCountry] = useState('');
  const [zipcode, setZipcode] = useState('');
  const [communityEmail, setCommunityEmail] = useState('');
  const [isJoined, setIsJoined] = useState(false);
  const [roleKey, setRoleKey] = useState('');
  const [getPromotionType, setGetPromotionType] = useState('Promotion');
  const [role, setRole] = useState('');
  const [isJoinRequestSent, setIsJoinRequestSent] = useState(false);

  const [communityDescriptiom, setCommunityDescriptiom] = useState('');
  const [commType, setCommType] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [getCommunityViewDetailsId, setGetCommunityViewDetailsId] =
    useState('');
  const [isJoinModal, setIsJointModal] = useState(false);
  const toggleJoinComm = () => {
    setIsJointModal(!isJoinModal);
  };
  const hideJoinContact = () => setIsJointModal(false);

  const [isMemReqModal, setIsMemReqModal] = useState(false);
  const toggleMemReqComm = () => {
    setIsMemReqModal(!isMemReqModal);
  };
  const hideMemReq = () => setIsMemReqModal(false);

  const [isMemberReqAccepted, setIsMemberReqAccepted] = useState(false);

  const toggleMemberReqAcceptedModal = () => {
    setIsMemberReqAccepted(!isMemberReqAccepted);
  };
  const hideMemberReqAccepted = () => setIsMemberReqAccepted(false);

  const showSlide = async item => {
    setImageModalVisible(!imageModalVisible);
    setItemVal(item);
    console.log('picccc itemval ?????', itemval);
  };
  useEffect(() => {
    handleCommunityDetails();
  }, []);

  const handleCommunityDetails = async () => {
    const isConnected = await NetworkUtils.isNetworkAvailable();
    console.log('getList!!!!');
    setLoading(true);

    let itemval = await AsyncStorage.getItem(CommunityId);
    console.log('comm ********', itemval);
    let comm_id = JSON.parse(itemval);
    console.log('___ comm id 1222 ', comm_id);

    console.log('**********comm__idd??????', comm_id);

    let accessTokenval = await AsyncStorage.getItem(AuthToken);
    console.log('accessToken', accessTokenval);
    if (isConnected) {
      try {
        await props
          .community_Details(client, { accessTokenval, comm_id })
          .then(async response => {
            console.log('response log', JSON.stringify(response));
            setLoading(false);
            if (response.data.communityViewDetails.code == 200) {
              console.log(
                'communityViewDetails',
                JSON.stringify(response.data.communityViewDetails.data),
              );
              setIsJoinRequestSent(
                response.data.communityViewDetails.data.isJoinRequestSent,
              );
              console.log('_______IsJoinRequestSent', isJoinRequestSent);

              setCommunityName(
                response.data.communityViewDetails.data.community.communityName,
              );
              console.log(
                'comm__name',
                response.data.communityViewDetails.data.community.communityName,
              );
              setBannerImage(
                response.data.communityViewDetails.data.community.logoImage,
              );
              console.log(
                'img',
                response.data.communityViewDetails.data.community.logoImage,
              );
              setCommunityDescriptiom(
                response.data.communityViewDetails.data.community
                  .communityDescription,
              );
              setCommunityEmail(
                response.data.communityViewDetails.data.community
                  .communityEmail,
              );
              setFirstaddressline(
                response.data.communityViewDetails.data.community.address
                  .firstAddressLine,
              );
              setSecondaddressline(
                response.data.communityViewDetails.data.community.address
                  .secondAddressLine,
              );
              setGetCountry(
                response.data.communityViewDetails.data.community.address
                  .country,
              );
              setGetState(
                response.data.communityViewDetails.data.community.address.state,
              );
              setGetCity(
                response.data.communityViewDetails.data.community.address.city,
              );
              setZipcode(
                response.data.communityViewDetails.data.community.address
                  .zipcode,
              );

              setIsJoined(response.data.communityViewDetails.data.isJoined);
              console.log(
                'is joined',
                response.data.communityViewDetails.data.isJoined,
              );
              setCommType(
                response.data.communityViewDetails.data.community.communityType,
              );
              console.log(
                'communityType',
                response.data.communityViewDetails.data.community.communityType,
              );
              setRoleKey(response.data.communityViewDetails.data.roleKey);
              console.log(
                'role key !!!',
                response.data.communityViewDetails.data.roleKey,
              );
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
      } catch (e) {
        console.log('err log', e);
        setLoading(false);
      }
    } else {
      showMessage.showToast('Please check your internet connection');
      setLoading(false);
    }
  };

  const sendJoinRequest = async role => {


    let accessTokenval = await AsyncStorage.getItem(AuthToken);
    console.log('accessToken', accessTokenval);

    let itemval = await AsyncStorage.getItem(CommunityId);
    console.log('comm ********', itemval);
    let comm_id = JSON.parse(itemval);
    console.log('___ comm id 1222 ', comm_id);

    console.log('**********comm__idd??????', comm_id);

    console.log('__________________role___member??????', role);
    let isAppPortal = true;

    console.log('communityType', getPromotionType);

    try {
      await props
        .join_community(client, {
          accessTokenval,
          comm_id,
          getPromotionType,
          role,
          isAppPortal
        })
        .then(async response => {
          console.log('response log', JSON.stringify(response));
          // setLoading(false);
          if (response.data.joinOrPromoteCommunity.code == 200) {
            // navigation.navigate('ExploreMoreCommunity');

            showMessage.showToast(response.data.joinOrPromoteCommunity.message);
            if (role == 'fan') {
              navigation.navigate('SwitchCommunityScreen');
              showMessage.showToast(
                response.data.joinOrPromoteCommunity.message,
              );
            }
            if (role == 'member') {
              hideMemReq();
              navigation.navigate('ProfileScreen');
              toggleMemberReqAcceptedModal();
            }
          }
        })
        .catch(err => {
          // setLoading(false);
          setTimeout(() => {
            Alert.alert(
              'Error',
              err,
              [
                {
                  text: 'OK',
                  onPress: () => console.log('OK Pressed'),
                },
              ],
              { cancelable: false },
            );
          }, 100);
          console.log('error log', JSON.stringify(err));
        });
    } catch (e) {
      console.log('err log', e);
      setLoading(false);
    }
  };

  //** Html tag remove **//
  function removeTags(str) {
    if (str === null || str === '') return false;
    else str = str.toString();

    // Regular expression to identify HTML tags in
    // the input string. Replacing the identified
    // HTML tag with a null string.
    var dStr = str.replace(/(<([^>]+)>)/gi, ' ');
    var dStr2 = dStr.replace('&#39;', ' ');
    return dStr2.replace(/\&nbsp;/g, '');
  }
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
          .logout(client, { accessTokenval2 })
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
            setTimeout(() => { }, 100);
            console.log('error log', JSON.stringify(err));
          });
      }
      else {
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
        <SafeAreaView style={styles.outer}>
          <Spinner
            visible={loading}
            color={textColor}
            textContent={''}
            textStyle={styles.spinnerTextStyle}
          />
          <ImageBackground
            blurRadius={3}
            style={styles.imgBackgrnd}
            source={require('../assets/images/imagebackground2.png')}>
            <View style={{ paddingBottom: 45, flex: 1 }}>
              <View style={styles.appBar}>
                <TouchableOpacity
                  onPress={() => navigation.navigate('ExploreMoreCommunity')}>
                  <Image
                    style={styles.arrowleft}
                    source={require('../assets/images/arrowleft.png')}
                  />
                </TouchableOpacity>
                <View style={styles.appBarTextView}>
                  <Text style={styles.appText}>{languages[languageValue].CommunityDetails}</Text>
                </View>
              </View>

              <ScrollView style={{ paddingBottom: 10 }}>
                <View style={styles.body}>
                  <View style={styles.eventBasicDetails}>
                    {bannerImage !== '' || bannerImage !== null ? (
                      <Image
                        style={styles.thumbnailImage}
                        source={{ uri: bannerImage }}
                      />
                    ) : (
                      <Image
                        style={styles.thumbnailImage}
                        source={require('../assets/images/noimg.png')}
                      />
                    )}
                  </View>

                  <View style={styles.eventMoreDetails}>
                    <View style={styles.titleButtonView}>
                      <Text style={styles.eventNameText2}>{communityName}</Text>
                      <Text style={styles.eventTypeText}>{commType}</Text>
                    </View>
                    <View style={styles.abtEvntTextView}>
                      <View style={styles.textCont1}>
                        <Text style={styles.addressText}>
                          {removeTags(communityDescriptiom)}
                        </Text>
                      </View>
                    </View>

                    {/* <View style={styles.borderBlue}></View> */}
                    {/* <View style={styles.titleButtonView}>
                    <Text style={styles.czmTxt}>
                      Event name :{' '}
                      <Text style={styles.addressText}>
                        {eventName}
                      </Text>
                    </Text>
                  </View> */}
                    {/* <View style={styles.titleButtonView}>
                    <Text style={styles.czmTxt}>
                      Created at :{' '}
                      <Text style={styles.addressText}>
                        {getFormattedDate_FULL(blogDate)}
                      </Text>
                    </Text>
                  </View> */}
                  </View>

                  <View style={styles.commDetails}>
                    <View style={{ marginTop: 10 }}>
                      <Text style={styles.modTitleTxt}>
                        {languages[languageValue].ContactInformation}{' '}
                      </Text>
                    </View>
                    <View style={styles.titleButtonView}>
                      <Text style={styles.modTitleTxt2}>
                        {languages[languageValue].Email} :{' '}
                        <Text style={styles.modDesTxt}>{communityEmail}</Text>
                      </Text>
                    </View>
                    <View style={styles.borderView2}></View>

                    <View style={styles.titleButtonView}>
                      <Text style={styles.modTitleTxt2}>
                        {languages[languageValue].Address} :{' '}
                        <Text style={styles.modDesTxt}>
                          {firstaddressline}
                          {','}
                          {secondaddressline}
                        </Text>
                      </Text>
                    </View>

                    <View style={styles.borderView2}></View>
                    <View style={styles.titleButtonView}>
                      <Text style={styles.modTitleTxt2}>
                        {languages[languageValue].Country} :{' '}
                        <Text style={styles.modDesTxt}>{getCountry}</Text>
                      </Text>
                    </View>
                    <View style={styles.borderView2}></View>
                    <View style={styles.titleButtonView}>
                      <Text style={styles.modTitleTxt2}>
                        {languages[languageValue].State} : <Text style={styles.modDesTxt}>{getState}</Text>
                      </Text>
                    </View>
                    <View style={styles.borderView2}></View>
                    <View style={styles.titleButtonView}>
                      <Text style={styles.modTitleTxt2}>
                        {languages[languageValue].City} : <Text style={styles.modDesTxt}>{getCity}</Text>
                      </Text>
                    </View>
                    <View style={styles.borderView2}></View>
                    <View style={styles.titleButtonView}>
                      <Text style={styles.modTitleTxt2}>
                        {languages[languageValue].Zipcode} :{' '}
                        <Text style={styles.modDesTxt}>{zipcode}</Text>
                      </Text>
                    </View>

                    {/* <View style={styles.abtEvntTextView}>
                  <View style={styles.textCont1}>
                    <Text style={styles.addressText}>
                      {removeTags(communityDescriptiom)}
                    </Text>
                  </View>
                </View> */}

                    {/* <View style={styles.borderBlue}></View> */}
                  </View>
                </View>
              </ScrollView>
              <View
                style={
                  Platform.OS === IOS
                    ? styles.cancelView_IOS
                    : styles.cancelView
                }>
                <View style={styles.buttonCont3}>
                  {/* {roleKey == 'member' && roleKey == 'fan' ? ( */}
                  {isJoinRequestSent == false ? (
                    <TouchableOpacity
                      onPress={() => {
                        toggleJoinComm();
                      }}
                      style={styles.joinReqPress}>
                      <Text style={styles.acrejText}>{languages[languageValue].JoinComm}</Text>
                    </TouchableOpacity>
                  ) : (
                    <View
                      style={[styles.memreqPress, { backgroundColor: '#888' }]}>
                      <Text style={styles.acrejText}>{languages[languageValue].JoinComm}</Text>
                    </View>
                  )}
                  {isJoinRequestSent == false ? (
                    <TouchableOpacity
                      onPress={() => {
                        toggleMemReqComm();
                      }}
                      style={styles.memreqPress}>
                      <Text style={styles.acrejText}>
                        {languages[languageValue].sendmemreq}
                      </Text>
                    </TouchableOpacity>
                  ) : (
                    <View
                      style={[styles.memreqPress, { backgroundColor: '#888' }]}>
                      <Text style={styles.acrejText}>
                        {languages[languageValue].sendmemreq}
                      </Text>
                    </View>
                  )}

                  {/* ):( */}
                  {/* <TouchableOpacity
                onPress={() => {
                    Alert.alert(
                      '',
                      'You are owner, you cannot send membership request',
                      [{text: 'OK', onPress: () => console.log('OK Pressed')}],
                      {cancelable: false},
                    );
                  }}
              style={styles.cancelPressPaid}>
              <Text style={styles.acrejText}>Send Join Request</Text>
            </TouchableOpacity> */}
                  {/* )} */}
                </View>
                <Modal
                  animationIn="swing"
                  animationOut="zoomOut"
                  style={styles.recurringModalView}
                  isVisible={isJoinModal}
                  onDismiss={hideJoinContact}
                  backdropOpacity={0.5}
                  onBackdropPress={toggleJoinComm}>
                  <LinearGradient
                    colors={['#ED8015', '#ED8015', '#FFB345']}
                    style={styles.recurringModal}>
                    <View
                      style={{
                        justifyContent: 'center',
                        // alignItems: 'center',
                        // bottom: 0,
                        paddingLeft: 15,
                        paddingRight: 15,
                        marginTop: 0,
                      }}>
                      <View style={styles.titleButtonView}>
                        <Text style={styles.modTitleTxt}>
                          {languages[languageValue].Areyousuretconnectwiththiscommunity}?
                        </Text>
                      </View>

                      <Text style={styles.modDesTxt}></Text>
                    </View>
                    <View style={styles.amntView}>
                      <View style={styles.evntModalDetailsCont}></View>

                      <TouchableOpacity
                        onPress={() => {
                          setRole('fan');
                          sendJoinRequest('fan');
                          hideJoinContact();
                        }}
                        style={styles.confirmPress}>
                        <Text style={styles.confirmPressText}>{languages[languageValue].Yessure}</Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        onPress={hideJoinContact}
                        style={styles.confirmPress2}>
                        <Text style={styles.confirmPressText}>{languages[languageValue].cancel}</Text>
                      </TouchableOpacity>
                    </View>
                  </LinearGradient>
                </Modal>

                <Modal
                  animationIn="swing"
                  animationOut="zoomOut"
                  style={styles.recurringModalView}
                  isVisible={isMemReqModal}
                  onDismiss={hideJoinContact}
                  backdropOpacity={0.5}
                  onBackdropPress={toggleMemReqComm}>
                  <LinearGradient
                    colors={['#ED8015', '#ED8015', '#FFB345']}
                    style={styles.recurringModal}>
                    <View
                      style={{
                        justifyContent: 'center',
                        // alignItems: 'center',
                        // bottom: 0,
                        paddingLeft: 15,
                        paddingRight: 15,
                        marginTop: 0,
                      }}>
                      <View style={styles.titleButtonView}>
                        <Text style={styles.modTitleTxt}>
                          {languages[languageValue].Areyousurtobememberofthiscommunity}?
                        </Text>
                      </View>

                      <Text style={styles.modDesTxt}></Text>
                    </View>
                    <View style={styles.amntView}>
                      <View style={styles.evntModalDetailsCont}></View>

                      <TouchableOpacity
                        onPress={() => {
                          setRole('member');
                          sendJoinRequest('member');
                          hideMemReq();
                        }}
                        style={styles.confirmPress}>
                        <Text style={styles.confirmPressText}>{languages[languageValue].Yessure}</Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        onPress={hideMemReq}
                        style={styles.confirmPress2}>
                        <Text style={styles.confirmPressText}>{languages[languageValue].cancel}</Text>
                      </TouchableOpacity>
                    </View>
                  </LinearGradient>
                </Modal>

                <Modal
                  // animationIn="swing"
                  // animationOut="zoomOut"
                  style={styles.recurringModalView}
                  isVisible={isMemberReqAccepted}
                  onDismiss={hideMemberReqAccepted}
                  backdropOpacity={0.5}
                  onBackdropPress={toggleMemberReqAcceptedModal}>
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
                      <Text style={styles.modTitleTxt}>{languages[languageValue].Note}!</Text>
                      <Text style={styles.modDesTxt}>
                        {languages[languageValue].ThanksforsendingmembershiprequesttothiscommunityPleasewaitforadminuapprovalThanks}❤
                      </Text>
                    </View>
                    <View style={styles.paymentSuccessImgCont}>
                      {/* <Image
style={styles.paymentSuccessImg}
source={require('../assets/images/paysuccess.png')}
/> */}
                      <TouchableOpacity
                        onPress={() => {
                          hideMemberReqAccepted();
                          navigation.navigate('ExploreMoreCommunity');
                        }}
                        style={styles.confirmPress}>
                        <Text style={styles.confirmPressText}>{languages[languageValue].okthanks}</Text>
                      </TouchableOpacity>
                    </View>
                  </LinearGradient>
                </Modal>
              </View>
            </View>
          </ImageBackground>
        </SafeAreaView>
      ) : (
        <NoInternet isConnected={isConnected} setIsConnected={setIsConnected} />
      )}
    </>
  );
};
{
  /* <View tyle={styles.venueDetailsCont}>
  <View style={styles.titleButtonView}>
    <Text style={styles.eventNameText2}>Rock Band Concert</Text>
  
  
  </View>
  <Text style={styles.eventNameText2}>Rock Band Concert</Text>
  <Text style={styles.eventNameText2}>Rock Band Concert</Text>
  <Text style={styles.eventNameText2}>Rock Band Concert</Text>
  <Text style={styles.eventNameText2}>Rock Band Concert</Text>
  
  </View> */
}
const mapStateToProps = ({ dark, font, language }) => {
  console.log('language ' + language.currentlanguage);
  return {
    // darkModeValue: dark.darkMode,
    // fontSizeValue: font.fontSize,
    languageValue: language.currentlanguage,
  };
};

const mapDispatchToProps = dispatch => ({
  languageChanges: inputs => dispatch(languageChanges(inputs)),
  community_Details: (client, inputs) =>
    dispatch(community_Details(client, inputs)),
  join_community: (client, inputs) => dispatch(join_community(client, inputs)),
  logout: (client, inputs) => dispatch(logout(client, inputs)),
});
export default connect(mapStateToProps, mapDispatchToProps)(CommunityDetails);
