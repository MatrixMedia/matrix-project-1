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
  Platform,
} from 'react-native';
import { StripeProvider } from '@stripe/stripe-react-native';

import React, { useState, useEffect } from 'react';

import Feather from 'react-native-vector-icons/Feather';
import styles from '../styles/paidperhead';
import { connect, useDispatch, useSelector } from 'react-redux';
import { languages } from '../locales/languages';
import { languageChanges } from '../redux/actions/languageActions';
import AsyncStorage from "@react-native-async-storage/async-storage";
import Spinner from 'react-native-loading-spinner-overlay';
import { useApolloClient } from '@apollo/client';
import {
  AuthToken,
  EventId,
  IOS,
  CommunityId,
  SelectedCommunity,
} from '../../src/constants/config';
import NoInternet from '../components/NoInternet';
import RNRestart from 'react-native-restart';

import {
  event_details,
  accept_reject_invited_event,
  rsvp_response_edit,
  event_attending_alert,
  event_payment_details,
  update_event_payment,
  logout,
} from '../redux/actions/userAuth';
import { textColor } from '../constants/colors';
import * as showMessage from '../constants/config';
import LinearGradient from 'react-native-linear-gradient';
import NetworkUtils from '../constants/networkUtils';

import Modal from 'react-native-modal';
import {
  getFormattedDate_NEW,
  getFormattedTime_NEW,
  getFormattedDate_FULL,
  getFormattedDate_rsvp,
  getFormattedDate_earlybird,
} from '../../src/constants/datetimeFormat';
// import {
//   PagerTabIndicator,
//   IndicatorViewPager,
//   PagerTitleIndicator,
//   PagerDotIndicator,
// } from '@shankarmorwal/rn-viewpager';
import { navigationUpdateAction } from '../redux/actions/navigationUpdateAction';
import { rejectNavigationUpdateAction } from '../redux/actions/rejectNavigation';
import Payment from '../components/Payment';
import { useStripe } from '@stripe/stripe-react-native';
import { CardField, useConfirmPayment } from '@stripe/stripe-react-native';
import { settIdvalue } from '../redux/actions/settingIdAction';

const EventDetailsPaidPerHead = props => {
  const base_url = 'https://demoyourprojects.com:5066/api/';
  const [paymentStatus, setPaymentStatus] = useState('false');

  const [name, setName] = useState('');
  const stripe = useStripe();
  const [cardDetails, setCardDetails] = useState(null);
  const { confirmPayment, loading1 } = useConfirmPayment();
  const [amountPaid, setAmountPaid] = useState('');

  const [payIntentVal, setPayIntentVal] = useState('');
  const [currency, setCurrency] = useState('');
  const [communityId, setcommunityId] = useState('');
  const [clientSecret, setClientSecret] = useState('');
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const [idVal, setIdVal] = useState('');

  const [type, setType] = useState('online');

  const isUserLoggedIn = useSelector(state => {
    // console.log('userDetails:: ', state.user.userDetails);
    return state.user.userDetails;
  });

  const client = useApolloClient();
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  //  Language Update *********

  const { languageValue } = props;

  const [checked, setChecked] = React.useState(languageValue);

  useEffect(() => {
    languageChange();
  }, [checked]);

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

  const increaseAttendees = () => {
    setNumberOfAttendees(numberOfAttendees + 1);
    console.log('****** number>>>*****', numberOfAttendees);
  };
  const decreaseAttendees = () => {
    if (numberOfAttendees > 1) {
      setNumberOfAttendees(numberOfAttendees - 1);
    }
  };

  const [isEventAlertVisible, setIsEventAlertVisible] = useState(false);

  const toggleEventAlertModal = (invitedEventID, status) => {
    console.log('accept__status', status);
    console.log('invitedEventID', invitedEventID);
    setIsEventAlertVisible(!isEventAlertVisible);
  };
  const hideDialogEventAlert = () => setIsEventAlertVisible(false);

  const [isOnlineEventAlertVisible, setIsOnlineEventAlertVisible] =
    useState(false);

  const toggleOnlineEventAlertModal = (invitedEventID, status) => {
    console.log('accept__status', status);
    console.log('invitedEventID', invitedEventID);
    setIsOnlineEventAlertVisible(!isOnlineEventAlertVisible);
  };
  const hideDialogOnlineEventAlert = () => setIsOnlineEventAlertVisible(false);

  const [isPaymentSuccessVisible, setIsPaymentSuccessVisible] = useState(false);

  const togglePaymentSuccessModal = (invitedEventID, status) => {
    console.log('accept__status', status);
    console.log('invitedEventID', invitedEventID);
    setIsPaymentSuccessVisible(!isPaymentSuccessVisible);
  };
  const hideDialogPaymentSuccess = () => setIsPaymentSuccessVisible(false);

  const [isAcceptanceVisible, setIsAcceptanceVisible] = useState(false);

  const toggleAcceptanceModal = (invitedEventID, status) => {
    console.log('accept__status', status);
    console.log('invitedEventID', invitedEventID);
    setIsAcceptanceVisible(!isAcceptanceVisible);
  };
  const hideDialogAcceptance = () => setIsAcceptanceVisible(false);

  const [isOnlineAcceptanceVisible, setIsOnlineAcceptanceVisible] =
    useState(false);

  const toggleOnlineAcceptanceModal = (invitedEventID, status) => {
    console.log('accept__status', status);
    console.log('invitedEventID', invitedEventID);
    setIsOnlineAcceptanceVisible(!isOnlineAcceptanceVisible);
  };
  const hideDialogOnlineAcceptance = () => setIsOnlineAcceptanceVisible(false);

  const [isRejectionVisible, setIsRejectionVisible] = useState(false);

  const toggleRejectionModal = (invitedEventID, status) => {
    console.log('accept__status', status);
    console.log('invitedEventID', invitedEventID);

    setIsRejectionVisible(!isRejectionVisible);
  };
  const hideDialogRejection = () => setIsRejectionVisible(false);

  const [isPaymentFailedVisible, setIsPaymentFailedVisible] = useState(false);

  const togglePaymentFailedModal = () => {
    setIsPaymentFailedVisible(!isPaymentFailedVisible);
  };
  const hidePaymentFailed = () => setIsPaymentFailedVisible(false);

  const [getCommunityViewDetailsId, setGetCommunityViewDetailsId] =
    useState('');
  const [getEventDetails, setGetEventDetails] = useState({});
  const [validity, setValidity] = useState('');
  const [eventTitle, setEventTitle] = useState('');
  const [bannerImage, setBannerImage] = useState('');
  const [firstaddressline, setFirstaddressline] = useState('');
  const [secondaddressline, setSecondaddressline] = useState('');
  const [eventDescriptiom, setEventDescriptiom] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [city, setCity] = useState('');
  const [eventHost, setEventHost] = useState('');
  const [userName, setUserName] = useState('');
  const [eventImage, setEventImage] = useState('');
  const [rsvpEndTime, setRsvpEndTime] = useState('');

  const [getPaymentStatus, setGetPaymentStatus] = useState('');
  const [getPaymentCatagory, setGetPaymentCatagory] = useState('');
  const [getPackages, setGetPackages] = useState([]);
  const [getHostCounter, setGetHostCounter] = useState('');
  const [getAttendeesLimit, setGetAttendeesLimit] = useState('');
  const [getAttendeesNumber, setGetAttendeesNumber] = useState('');
  const [getMaxNumberGuest, setGetMaxNumberGuest] = useState('');

  const [getRemainingAttendees, setGetRemainingAttendees] = useState('');
  const [getEventImages, setGetEventImages] = useState([]);

  const [getEventBlogs, setGetEventBlogs] = useState([]);

  const [getInvitedNum, setGetInvitedNum] = useState('');
  const [getRSVPcount, setGetRSVPcount] = useState('');
  const [getBlogCount, setGetBlogCount] = useState('');
  const [getPhotoCount, setGetPhotoCount] = useState('');

  const [getHostName, setGetHostName] = useState('');
  const [getHostRole, setGetHostRole] = useState('');
  const [getEventLogo, setGetEventLogo] = useState('');
  const [getInviType, setGetInviType] = useState('');
  const [communityName, setCommunityName] = useState('');
  const [postEventasCommunity, setPostEventasCommunity] = useState(false);

  const [getMsg, setGetMsg] = useState('');
  const [rsvpStatus, setRsvpStatus] = useState('');
  const [alterEventDetails, setAlertEventDetails] = useState([]);
  const [blogStatus, setBlogStatus] = useState(false);
  //   const [isJoined, setIsJoined] = useState(false);

  //   const [roleKey, setRoleKey] = useState('');

  const [zipcode, setZipcode] = useState('');
  const [attendees, setAttendees] = useState('');
  const [loginUser, setLoginUser] = useState('');
  const [item, setitemdvalue] = useState({});

  const [status, setStatus] = useState('');
  const [adults, setAdults] = useState(0);
  const [minors, setMinors] = useState(0);
  const [familyMembers, setFamilyMembers] = useState('');
  const [currentAttendees, setcurrentAttendees] = useState(0);
  const [remainingAttendees, setRemainingAttendees] = useState(0);
  const [eventStartDate, seteventStartDate] = useState('');
  const [eventStartTime, setEventStartTime] = useState('');
  const [timezone, setTimezone] = useState('');
  const [eventEndTime, setEventEndTime] = useState('');
  const [numberOfAttendees, setNumberOfAttendees] = useState(1);
  const [userID, setUserID] = useState('');
  const [isJoined, setIsJoined] = useState(false);
  // const [loginUser, setLoginUser] = useState('');
  const [hostID, setHostID] = useState('');
  const [refreshing, setrefreshing] = useState(false);

  const [isEvntPicView, setIsEvntPicView] = useState(true);

  const [getEventID, setGetEventID] = useState('');
  const [invitedEventID, setInvitedEventID] = useState('');

  const [getPackageId, setGetPackageId] = useState('');

  const [OnPhoto, setOnPhoto] = useState(true);
  const [blogDescription, setBlogDescription] = useState('');
  const [blogTitle, setBlogTitle] = useState('');
  const [createDate, setCreateDate] = useState('');
  const [loggedUserRole, setLoggedUserRole] = useState(false);

  var today = new Date();
  var dd = String(today.getDate()).padStart(2, '0');
  var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
  var yyyy = today.getFullYear();

  let todayDate = yyyy + '-' + mm + '-' + dd; //you get the current date
  console.log('******** current Date*********', todayDate);

  const [numberOfSenior, setNumberOfSenior] = useState(0);

  const increaseSenior = () => {
    setNumberOfSenior(numberOfSenior + 1);
    console.log('****** number>>>*****', numberOfSenior);
  };
  const decreaseSenior = () => {
    if (numberOfSenior > 0) {
      setNumberOfSenior(numberOfSenior - 1);
    }
  };

  const [numberOfAdults, setNumberOfAdults] = useState(0);

  const increaseAdults = () => {
    setNumberOfAdults(numberOfAdults + 1);
    console.log('****** number>>>*****', numberOfAdults);
  };
  const decreaseAdult = () => {
    if (numberOfAdults > 0) {
      setNumberOfAdults(numberOfAdults - 1);
    }
  };

  const [numberOfChildren, setNumberOfChildren] = useState(0);

  const increaseChildren = () => {
    setNumberOfChildren(numberOfChildren + 1);
    console.log('****** number>>>*****', numberOfChildren);
  };
  const decreaseChildren = () => {
    if (numberOfChildren > 0) {
      setNumberOfChildren(numberOfChildren - 1);
    }
  };

  const increaseAttendeesPackage = pos => {
    const cData = getPackages;
    var countPacknumber = cData[pos].selectPacknumber;
    console.log('****** countPacknumber ++>>>*****', countPacknumber);

    cData[pos].selectPacknumber = countPacknumber + 1;
    console.log('****** countPacknumber data+>>>*****', cData);
    setGetPackages(cData);
    console.log('****** setGetPackages>>>*****', getPackages);
    setrefreshing(!refreshing);
    // if ( cData[pos].earlyBirdRate !== null || cData[pos].earlyBirdRate !== ''){
    //   let packageRateVal = cData[pos].earlyBirdRate;
    //   console.log(
    //     '_______________packageRateVal_____',
    //     packageRateVal
    //   );
    // } else {
    //   let packageRateVal = cData[pos].packageRate;
    //   console.log(
    //     '_______________packageRateVal_____',
    //     packageRateVal
    //   );
    // }

    // setAmount((cData[pos].selectPacknumber) *  packageRateVal);
    // console.log(
    //   '_______________tot **** amount_____',
    // amount
    // );
  };
  const decreaseAttendeesPackage = pos => {
    const cData = getPackages;
    var countPacknumber = cData[pos].selectPacknumber;
    console.log('****** countPacknumber-->>>*****', countPacknumber);
    if (countPacknumber > 0) {
      cData[pos].selectPacknumber = countPacknumber - 1;
      console.log('****** countPacknumber data-->>>*****', cData);
      setGetPackages(cData);
    }
    console.log('****** setGetPackages>>>*****', getPackages);
    setrefreshing(!refreshing);
  };

  useEffect(() => {
    eventDetails();
  }, []);

  const eventDetails = async () => {
    const isConnected = await NetworkUtils.isNetworkAvailable();
    console.log('getList!!!!');
    setLoading(true);

    let itemval = await AsyncStorage.getItem(EventId);
    console.log('CommunityDetails list', itemval);
    setitemdvalue(JSON.parse(itemval));
    let evntID = JSON.parse(itemval);
    console.log('EventDetails list123 ', evntID);
    // setGetCommunityViewDetailsId(JSON.parse(itemval).id);
    let isAppPortal = true;
    let accessTokenval = await AsyncStorage.getItem(AuthToken);
    console.log('accessToken', accessTokenval);

    console.log('Id', item.id);
    // console.log('communityName', item.communityName);

    try {
      if (isConnected) {
        await props
          .event_details(client, { accessTokenval, evntID, isAppPortal })
          .then(async response => {
            console.log('response log', JSON.stringify(response));
            setLoading(false);

            if (response.data.getEventDetails.code === 200) {
              // console.log("response.data.getMyProfileDetails.length", response.data.getMyProfileDetails.data.length);

              console.log(
                'eventViewDetails',
                JSON.stringify(response.data.getEventDetails.data),
              );
              setGetEventDetails(response.data.getEventDetails.data);
              setGetEventID(response.data.getEventDetails.data.id);
              console.log(
                '****** EVENT ID *******',
                JSON.stringify(response.data.getEventDetails.data.id),
              );
              // setGetPackageId(response.data.getEventDetails.data.paymentPackages.id);
              // console.log(
              //   '****** PACKAGE ID *******',
              //   JSON.stringify(response.data.getEventDetails.data.paymentPackages[0].id),
              // );
              setLoggedUserRole(response.data.getEventDetails.data.title);
              setEventTitle(response.data.getEventDetails.data.title);
              setBannerImage(response.data.getEventDetails.data.image);
              setEventDescriptiom(
                response.data.getEventDetails.data.description,
              );
              setFirstaddressline(
                response.data.getEventDetails.data.venueDetails
                  .firstAddressLine,
              );
              setSecondaddressline(
                response.data.getEventDetails.data.venueDetails
                  .secondAddressLine,
              );
              setZipcode(
                response.data.getEventDetails.data.venueDetails.zipcode,
              );
              // setOwnerName(
              //   response.data.communityViewDetails.data.community.ownerDetails
              //     .name,
              // );
              setRsvpEndTime(response.data.getEventDetails.data.rsvpEndTime);
              setPhoneNumber(
                response.data.getEventDetails.data.venueDetails.phoneNo,
              );
              setCity(response.data.getEventDetails.data.venueDetails.city);
              setEventHost(
                response.data.getEventDetails.data.community.communityName,
              );
              setGetAttendeesLimit(
                response.data.getEventDetails.data.attendees
                  .numberOfMaxAttendees,
              );
              setLoginUser(response.data.getEventDetails.data.loginUser);
              // setUserID(response.data.getEventDetails.data.rsvp.userId);
              setUserName(response.data.getEventDetails.data.user.name);
              setcurrentAttendees(
                response.data.getEventDetails.data.currentAttendees,
              );
              setGetPaymentStatus(
                response.data.getEventDetails.data.paymentStatus,
              );
              setGetPaymentCatagory(
                response.data.getEventDetails.data.paymentCategory,
              );
              console.log(
                'paymentCategory:::',
                response.data.getEventDetails.data.paymentCategory,
              );

              setInvitedEventID(response.data.getEventDetails.data.id);
              setRsvpStatus(response.data.getEventDetails.data.rsvp.status);
              setGetInviType(response.data.getEventDetails.data.invitationType);

              var tempArr = [];
              tempArr = response.data.getEventDetails.data.paymentPackages;
              console.log('::packages result 111::', tempArr);
              var result = tempArr.map(function (el) {
                var o = Object.assign({}, el);
                o.selectPacknumber = 0;
                return o;
              });
              console.log(':::::::::::::::::::packages result 222::', result);
              setGetPackages(result);
              // console.log('::packages::', getPackages);
              setGetHostCounter(
                response.data.getEventDetails.data.eventHostCounters,
              );
              // SetGetPackageRate(
              //   response.data.getEventDetails.data.paymentPackages.packageRate,
              // );
              setGetAttendeesNumber(
                response.data.getEventDetails.data.currentAttendees,
              );
              setGetMaxNumberGuest(
                response.data.getEventDetails.data.attendees.numberOfMaxGuests,
              );
              setGetRemainingAttendees(
                response.data.getEventDetails.data.remainingAttendees,
              );
              setGetEventImages(response.data.getEventDetails.data.eventImage);
              setGetEventBlogs(response.data.getEventDetails.data.blogs);
              setGetInvitedNum(
                response.data.getEventDetails.data.listing.invited,
              );
              setGetRSVPcount(
                response.data.getEventDetails.data.listing.rsvpCount,
              );
              setGetBlogCount(
                response.data.getEventDetails.data.listing.blogCount,
              );
              setGetPhotoCount(
                response.data.getEventDetails.data.listing.photosCount,
              );
              setGetHostName(response.data.getEventDetails.data.hostName);
              setCommunityName(
                response.data.getEventDetails.data.community.communityName,
              );
              setPostEventasCommunity(
                response.data.getEventDetails.data.postEventAsCommunity,
              );
              seteventStartDate(response.data.getEventDetails.data.date.from);
              setEventStartTime(response.data.getEventDetails.data.time.from);
              setEventEndTime(response.data.getEventDetails.data.time.to);
              setTimezone(response.data.getEventDetails.data.time.timezone);
              setIsJoined(response.data.getEventDetails.data.isJoined);
              setGetEventLogo(response.data.getEventDetails.data.logoImage);
              console.log(
                'is joined>>>',
                response.data.getEventDetails.data.isJoined,
              );
              setHostID(response.data.getEventDetails.data.hostId);
              // setAdults(response.data.getEventDetails.data.rsvp.guests.adults);
              // setMinors(response.data.getEventDetails.data.rsvp.guests.minor);
              console.log('numberOfMaxAttendees>>>>', numberOfAttendees);
            }

            if (response.data.getEventDetails.code === 403) {
              logoutval();

              RNRestart.Restart();
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
        setLoading(false);
      }
    } catch (e) {
      console.log('err log', e);
      setLoading(false);
    }
  };

  useEffect(() => {
    const getRemainingAttendees = () => {
      setRemainingAttendees(attendees - currentAttendees);
      console.log('remaining Attendees', remainingAttendees);
    };
    getRemainingAttendees();
  }, []);

  const goToEventPayement = async invitedEventID => {
    // setType('online')
    console.log('**********EventDetails item___id: ', invitedEventID);
    await AsyncStorage.setItem(EventId, JSON.stringify(invitedEventID));
    // if (type == 'online') {
    navigation.navigate('PaymentScreen');
    // }
  };

  const accept_reject = async (invitedEventID, status) => {
    const isConnected = await NetworkUtils.isNetworkAvailable();
    console.log('getList!!!!');
    let itemval = await AsyncStorage.getItem(EventId);
    console.log('CommunityDetails list', itemval);
    setitemdvalue(JSON.parse(itemval));
    let evntID = JSON.parse(itemval);
    console.log('EventDetails list123 ', evntID);
    console.log('invitedEventID!!!!', invitedEventID);

    let attendeesCount = 0;
    const totalAttendeesCount_per_head =
      numberOfAdults + numberOfChildren + numberOfSenior;

    var tempArr = [];
    tempArr = getPackages;

    let nameArr = tempArr.map(({ id, selectPacknumber }) => {
      if (getPaymentCatagory == 'per_head') {
        selectPacknumber = totalAttendeesCount_per_head;
        attendeesCount = totalAttendeesCount_per_head;
      } else {
        attendeesCount = selectPacknumber;
      }
      return { packageId: id, number: selectPacknumber };
    });

    console.log('::packages result 333::', nameArr);

    // if ((attendeesCount == totalAttendeesCount_per_head) || (status == 'Not_Attending')) {
    setLoading(true);
    let isAppPortal = true;
    let accessTokenval = await AsyncStorage.getItem(AuthToken);
    console.log('accessToken', accessTokenval);
    try {
      if (isConnected) {
        await props
          .accept_reject_invited_event(client, {
            accessTokenval,
            status,
            invitedEventID,
            numberOfSenior,
            numberOfAdults,
            numberOfChildren,
            nameArr,
            // isAppPortal,
          })
          .then(async response => {
            console.log('response log', JSON.stringify(response));
            setLoading(false);

            if (response.data.acceptOrRejectEvent.code === 200) {
              setGetMsg(response.data.acceptOrRejectEvent.message);
              dispatch(settIdvalue(response.data.acceptOrRejectEvent.data.id));

              setIdVal(response.data.acceptOrRejectEvent.data.id);
              console.log('________________id ___ val', idVal);

              if (status === 'Attending' && type !== 'online') {
                dispatch(navigationUpdateAction(true));
                navigation.navigate('Events', {
                  screen: 'Accepted',
                });
              } else if (
                status === 'Attending' &&
                type === 'online' &&
                getPaymentStatus === 'Paid'
              ) {

                goToEventPayement(invitedEventID);

                hideDialogAcceptance();
                hideDialogEventAlert();

              } else {
                dispatch(rejectNavigationUpdateAction(true));
                navigation.navigate('Events', {
                  screen: 'Rejected',
                });
              }
            } else {
              showMessage.showToast(response.data.acceptOrRejectEvent.message);
            }

            if (response.data.acceptOrRejectEvent.code === 403) {
              logoutval();

              RNRestart.Restart();
            }
            // if (response.code === 200) {
            //   navigation.navigate('Events', {screen: 'Rejected'});
            // } else {
            //   showMessage.showToast(message);
            // }
            // console.log(
            //   'approveOrRejectMemberRequest !!',
            //   response.data.approveOrRejectMemberRequest.message,
            // );
            // if (response.data.approveOrRejectMemberRequest.code === 200) {
            //   communityRequestList();
            //   showMessage.showToast(
            //     response.data.approveOrRejectMemberRequest.message,
            //   );
            // }
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
    // }
    // else {
    //   showMessage.showToast(
    //     'Total Package count and per head count must be same',
    //   );
    // }
  };

  const alert_event = async invitedEventID => {
    const isConnected = await NetworkUtils.isNetworkAvailable();
    console.log('getList!!!!');

    console.log('invitedEventID!!!!', invitedEventID);

    // if ((attendeesCount == totalAttendeesCount_per_head) || (status == 'Not_Attending')) {
    setLoading(true);
    let isAppPortal = true;
    let accessTokenval = await AsyncStorage.getItem(AuthToken);
    console.log('accessToken', accessTokenval);
    try {
      if (isConnected) {
        await props
          .event_attending_alert(client, {
            accessTokenval,

            invitedEventID,
            isAppPortal,
          })
          .then(async response => {
            console.log('response log', JSON.stringify(response));
            setLoading(false);

            if (response.data.eventAttendingAlert.code === 200) {
              // setGetMsg(response.data.acceptOrRejectEvent.message);

              toggleAcceptanceModal();
              // toggleOnlineAcceptanceModal();

              // if (status === 'Attending') {
              //   navigation.navigate('Events', {
              //     screen: 'Accepted',
              //   });
              // } else {
              //   navigation.navigate('Events', {
              //     screen: 'Rejected',
              //   });
              // }
            } else {
              setAlertEventDetails(response.data.eventAttendingAlert.data);
              console.log(
                '**************** alert___data*************',
                response.data.eventAttendingAlert.data,
              );
              toggleEventAlertModal();

              // showMessage.showToast(response.data.acceptOrRejectEvent.message);
            }

            if (response.data.eventAttendingAlert.code === 403) {
              logoutval();

              RNRestart.Restart();
            }
            // if (response.code === 200) {
            //   navigation.navigate('Events', {screen: 'Rejected'});
            // } else {
            //   showMessage.showToast(message);
            // }
            // console.log(
            //   'approveOrRejectMemberRequest !!',
            //   response.data.approveOrRejectMemberRequest.message,
            // );
            // if (response.data.approveOrRejectMemberRequest.code === 200) {
            //   communityRequestList();
            //   showMessage.showToast(
            //     response.data.approveOrRejectMemberRequest.message,
            //   );
            // }
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
    // }
    // else {
    //   showMessage.showToast(
    //     'Total Package count and per head count must be same',
    //   );
    // }
  };

  const theme = useColorScheme();
  const [imageModalVisible, setImageModalVisible] = useState(false);
  const [itemval, setItemVal] = useState({});

  const showSlide = async item => {
    setImageModalVisible(!imageModalVisible);
    setItemVal(item);
    console.log('picccc itemval ?????', itemval);
  };

  const [blogModalVisible, setBlogModalVisible] = useState(false);
  const toggleblogModalVisible = () => {
    setBlogModalVisible(!blogModalVisible);
  };
  const hideDialogblogModalVisible = () => setBlogModalVisible(false);
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
  const [freeViewOn, setFreeView] = useState(false);
  const [paidViewOn, setPaidView] = useState(false);

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
            blurRadius={3}
            style={styles.imgBackgrnd}
            source={require('../assets/images/imagebackground2.png')}>
            <View style={{ paddingBottom: 45, flex: 1 }}>
              <View style={styles.appBar}>
                <TouchableOpacity onPress={() => navigation.navigate('Events')}>
                  <Image
                    style={styles.arrowleft}
                    source={require('../assets/images/arrowleft.png')}
                  />
                </TouchableOpacity>
                <View style={styles.appBarTextView}>
                  <Text style={styles.appText}>
                    {languages[languageValue].eventdet}
                  </Text>
                </View>
              </View>

              <ScrollView style={{ paddingBottom: 10 }}>
                <View style={styles.body}>
                  <View style={styles.eventBasicDetails2}>
                    {bannerImage === '' || bannerImage === null ? (
                      <Image
                        style={styles.thumbnailImage}
                        source={require('../assets/images/noimg.png')}
                      />
                    ) : (
                      <Image
                        //resizeMode='contain'
                        style={styles.thumbnailImage}
                        source={{ uri: bannerImage }}
                      />
                    )}
                  </View>
                  <View style={styles.eventBasicDetails}>
                    <View style={styles.titleButtonView}>
                      <Text style={styles.eventNameText}>{eventTitle}</Text>
                      <View style={styles.statusView}>
                        <Text style={styles.text3}>{getPaymentStatus}</Text>
                      </View>
                    </View>
                    <View style={styles.rsvpTxtView}>
                      <View style={styles.textCont1}>
                        <Text style={styles.text1}>
                          {languages[languageValue].RSVPby}
                        </Text>
                      </View>

                      <View style={styles.textCont1}>
                        <Text style={styles.text2}>
                          {getFormattedDate_FULL(rsvpEndTime)}
                        </Text>
                      </View>
                    </View>

                    <View style={styles.dtpCont}>
                      <View style={styles.dateCont}>
                        <Text style={styles.text3}>
                          {languages[languageValue].Date}
                        </Text>

                        <View style={styles.borderyellow}></View>
                        <View style={styles.dateTxtView}>
                          <Text style={styles.dtpText}>
                            {getFormattedDate_FULL(eventStartDate)}
                          </Text>
                        </View>
                      </View>
                      <View style={styles.timeCont}>
                        <Text style={styles.text3}>
                          {languages[languageValue].Time}
                        </Text>
                        <View style={styles.borderyellow}></View>
                        <View style={styles.timeTxtView}>
                          <Text style={styles.dtpText}>
                            {getFormattedTime_NEW(eventStartTime)}
                            {'\n'}
                            {languages[languageValue].to}{' '}
                            {getFormattedTime_NEW(eventEndTime)}
                          </Text>
                          <Text style={styles.dtpText}>{timezone}</Text>
                        </View>
                      </View>
                      <View style={styles.placeCont}>
                        <Text style={styles.text3}>
                          {languages[languageValue].Place}
                        </Text>
                        <View style={styles.borderyellow}></View>
                        <View style={styles.placeTxtView}>
                          <Text style={styles.dtpText}>
                            {firstaddressline},{secondaddressline}
                          </Text>
                        </View>
                      </View>
                    </View>
                    <View style={styles.borderBlue}></View>
                    <View style={styles.inviterCont}>
                      {getEventLogo === '' || getEventLogo === null ? (
                        <Image
                          style={styles.inviterImg}
                          source={require('../assets/images/noimg.png')}
                        />
                      ) : (
                        <Image
                          style={styles.inviterImg}
                          source={{ uri: getEventLogo }}
                        />
                      )}

                      <View style={styles.inviterTxtView}>
                        <Text style={styles.inviterTxt}>
                          {getPaymentCatagory}
                        </Text>

                        <View style={styles.verticalBorder}></View>
                        <Text style={styles.inviterTxt}>
                          {getRemainingAttendees == null ||
                            getRemainingAttendees == ''
                            ? 0
                            : getRemainingAttendees}{' '}
                          {languages[languageValue].avseat}{' '}
                        </Text>
                      </View>
                    </View>
                  </View>

                  <View style={styles.packeageCont}>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                      }}>
                      {getInviType == 'Public' ? (
                        <View style={{ marginRight: -60 }}></View>
                      ) : (
                        <LinearGradient
                          // colors={['#FADCBF', '#FADCBF', '#FADCBF']}
                          colors={['#ED8015', '#ED8015', '#FFB345']}
                          style={styles.horizontalBox}>
                          <Text style={styles.dtpText}>{getInvitedNum}</Text>
                          <Text style={styles.dtpText}>
                            {languages[languageValue].Invited}
                          </Text>
                        </LinearGradient>
                      )}

                      <LinearGradient
                        // colors={['#FADCBF', '#FADCBF', '#FADCBF']}
                        colors={['#ED8015', '#ED8015', '#FFB345']}
                        style={styles.horizontalBox}>
                        <Text style={styles.dtpText}>{getRSVPcount}</Text>
                        <Text style={styles.dtpText}>RSVP'd</Text>
                      </LinearGradient>
                      <LinearGradient
                        // colors={['#FADCBF', '#FADCBF', '#FADCBF']}
                        colors={['#ED8015', '#ED8015', '#FFB345']}
                        style={styles.horizontalBox}>
                        <Text style={styles.dtpText}>{getBlogCount}</Text>
                        <Text style={styles.dtpText}>
                          {languages[languageValue].Blogs}
                        </Text>
                      </LinearGradient>
                      <LinearGradient
                        // colors={['#FADCBF', '#FADCBF', '#FADCBF']}
                        colors={['#ED8015', '#ED8015', '#FFB345']}
                        style={styles.horizontalBox}>
                        <Text style={styles.dtpText}>{getPhotoCount}</Text>
                        <Text style={styles.dtpText}>
                          {languages[languageValue].Photos}
                        </Text>
                      </LinearGradient>
                    </View>
                    {getPaymentCatagory == 'per_head' ? (
                      <View>
                        <View style={styles.greyBorder}></View>
                        <View style={styles.attendeesCountCont}>
                          <Text style={styles.amntTxt}>
                            {languages[languageValue].Seniors}
                          </Text>
                          {todayDate <= getFormattedDate_rsvp(rsvpEndTime) ? (
                            <View style={styles.countCont}>
                              <TouchableOpacity
                                onPress={decreaseSenior}
                              // style={{marginLeft: 5}}
                              >
                                <View
                                  style={{
                                    marginLeft: 5,
                                    height: 30,
                                    width: 30,
                                    borderRadius: 100 / 2,
                                    borderColor: '#00A19C',
                                    borderWidth: 1,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    marginRight: 5,
                                  }}>
                                  <Image
                                    style={styles.micon}
                                    source={require('../assets/images/minus.png')}
                                  />
                                </View>
                              </TouchableOpacity>
                              <View style={styles.counterResTxt}>
                                <Text style={styles.contentBoxText}>
                                  {' '}
                                  {numberOfSenior}{' '}
                                </Text>
                              </View>

                              <TouchableOpacity onPress={increaseSenior}>
                                <View
                                  style={{
                                    marginRight: 15,
                                    height: 30,
                                    width: 30,
                                    borderRadius: 100 / 2,
                                    borderColor: '#00A19C',
                                    borderWidth: 1,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    marginLeft: 5,
                                  }}>
                                  <Image
                                    style={styles.aicon}
                                    source={require('../assets/images/add.png')}
                                  />
                                </View>
                              </TouchableOpacity>
                            </View>
                          ) : (
                            <View style={styles.countCont}>
                              <View

                              // style={{marginLeft: 5}}
                              >
                                <View
                                  style={{
                                    marginLeft: 5,
                                    height: 30,
                                    width: 30,
                                    borderRadius: 100 / 2,
                                    borderColor: '#888',
                                    borderWidth: 1,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    marginRight: 5,
                                  }}>
                                  <Image
                                    style={styles.micon_g}
                                    source={require('../assets/images/minus.png')}
                                  />
                                </View>
                              </View>
                              <View style={styles.counterResTxt_g}>
                                <Text style={styles.contentBoxText}>
                                  {' '}
                                  {numberOfSenior}{' '}
                                </Text>
                              </View>

                              <View>
                                <View
                                  style={{
                                    marginRight: 15,
                                    height: 30,
                                    width: 30,
                                    borderRadius: 100 / 2,
                                    borderColor: '#888',
                                    borderWidth: 1,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    marginLeft: 5,
                                  }}>
                                  <Image
                                    style={styles.aicon_g}
                                    source={require('../assets/images/add.png')}
                                  />
                                </View>
                              </View>
                            </View>
                          )}
                        </View>

                        <View style={styles.attendeesCountCont}>
                          <Text style={styles.amntTxt}>
                            {languages[languageValue].Adults}
                          </Text>
                          {todayDate <= getFormattedDate_rsvp(rsvpEndTime) ? (
                            <View style={styles.countCont}>
                              <TouchableOpacity
                                onPress={decreaseAdult}
                              // style={{marginLeft: 5}}
                              >
                                <View
                                  style={{
                                    marginLeft: 5,
                                    height: 30,
                                    width: 30,
                                    borderRadius: 100 / 2,
                                    borderColor: '#00A19C',
                                    borderWidth: 1,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    marginRight: 5,
                                  }}>
                                  <Image
                                    style={styles.micon}
                                    source={require('../assets/images/minus.png')}
                                  />
                                </View>
                              </TouchableOpacity>
                              <View style={styles.counterResTxt}>
                                <Text style={styles.contentBoxText}>
                                  {' '}
                                  {numberOfAdults}{' '}
                                </Text>
                              </View>

                              <TouchableOpacity onPress={increaseAdults}>
                                <View
                                  style={{
                                    marginRight: 15,
                                    height: 30,
                                    width: 30,
                                    borderRadius: 100 / 2,
                                    borderColor: '#00A19C',
                                    borderWidth: 1,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    marginLeft: 5,
                                  }}>
                                  <Image
                                    style={styles.aicon}
                                    source={require('../assets/images/add.png')}
                                  />
                                </View>
                              </TouchableOpacity>
                            </View>
                          ) : (
                            <View style={styles.countCont}>
                              <View

                              // style={{marginLeft: 5}}
                              >
                                <View
                                  style={{
                                    marginLeft: 5,
                                    height: 30,
                                    width: 30,
                                    borderRadius: 100 / 2,
                                    borderColor: '#888',
                                    borderWidth: 1,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    marginRight: 5,
                                  }}>
                                  <Image
                                    style={styles.micon_g}
                                    source={require('../assets/images/minus.png')}
                                  />
                                </View>
                              </View>
                              <View style={styles.counterResTxt_g}>
                                <Text style={styles.contentBoxText}>
                                  {' '}
                                  {numberOfAdults}{' '}
                                </Text>
                              </View>

                              <View>
                                <View
                                  style={{
                                    marginRight: 15,
                                    height: 30,
                                    width: 30,
                                    borderRadius: 100 / 2,
                                    borderColor: '#888',
                                    borderWidth: 1,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    marginLeft: 5,
                                  }}>
                                  <Image
                                    style={styles.aicon_g}
                                    source={require('../assets/images/add.png')}
                                  />
                                </View>
                              </View>
                            </View>
                          )}
                        </View>

                        <View style={styles.attendeesCountCont}>
                          <Text style={styles.amntTxt}>
                            {languages[languageValue].Children}
                          </Text>
                          {todayDate <= getFormattedDate_rsvp(rsvpEndTime) ? (
                            <View style={styles.countCont}>
                              <TouchableOpacity
                                onPress={decreaseChildren}
                              // style={{marginLeft: 5}}
                              >
                                <View
                                  style={{
                                    marginLeft: 5,
                                    height: 30,
                                    width: 30,
                                    borderRadius: 100 / 2,
                                    borderColor: '#00A19C',
                                    borderWidth: 1,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    marginRight: 5,
                                  }}>
                                  <Image
                                    style={styles.micon}
                                    source={require('../assets/images/minus.png')}
                                  />
                                </View>
                              </TouchableOpacity>
                              <View style={styles.counterResTxt}>
                                <Text style={styles.contentBoxText}>
                                  {' '}
                                  {numberOfChildren}{' '}
                                </Text>
                              </View>

                              <TouchableOpacity onPress={increaseChildren}>
                                <View
                                  style={{
                                    marginRight: 15,
                                    height: 30,
                                    width: 30,
                                    borderRadius: 100 / 2,
                                    borderColor: '#00A19C',
                                    borderWidth: 1,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    marginLeft: 5,
                                  }}>
                                  <Image
                                    style={styles.aicon}
                                    source={require('../assets/images/add.png')}
                                  />
                                </View>
                              </TouchableOpacity>
                            </View>
                          ) : (
                            <View style={styles.countCont}>
                              <View

                              // style={{marginLeft: 5}}
                              >
                                <View
                                  style={{
                                    marginLeft: 5,
                                    height: 30,
                                    width: 30,
                                    borderRadius: 100 / 2,
                                    borderColor: '#888',
                                    borderWidth: 1,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    marginRight: 5,
                                  }}>
                                  <Image
                                    style={styles.micon_g}
                                    source={require('../assets/images/minus.png')}
                                  />
                                </View>
                              </View>
                              <View style={styles.counterResTxt_g}>
                                <Text style={styles.contentBoxText}>
                                  {' '}
                                  {numberOfChildren}{' '}
                                </Text>
                              </View>

                              <View>
                                <View
                                  style={{
                                    marginRight: 15,
                                    height: 30,
                                    width: 30,
                                    borderRadius: 100 / 2,
                                    borderColor: '#888',
                                    borderWidth: 1,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    marginLeft: 5,
                                  }}>
                                  <Image
                                    style={styles.aicon_g}
                                    source={require('../assets/images/add.png')}
                                  />
                                </View>
                              </View>
                            </View>
                          )}
                        </View>

                        <View style={styles.greyBorder2}></View>
                        <FlatList
                          data={getPackages}
                          renderItem={({ item }) => {
                            return (
                              <View style={styles.totalAmntCont}>
                                <Text style={styles.totText}>
                                  {languages[languageValue].TotalAmount}.
                                </Text>
                                <Text style={styles.amntTxt}>
                                  {todayDate <
                                    getFormattedDate_rsvp(item.earlyBirdDate) ? (
                                    <View style={styles.contentBoxTextView5}>
                                      {/* <View
                                    style={{
                                      flexDirection: 'row',
                                      justifyContent: 'flex-end',
                                    }}> */}
                                      {/* <Text style={styles.packText2}>
                                      Actual rate -{' '}
                                    </Text> */}
                                      <Text style={styles.packText_linetrough}>
                                        {item.currency} {item.packageRate}
                                      </Text>
                                      {/* </View> */}
                                      <Text
                                        style={
                                          styles.packText_earlyrate_perhead
                                        }>
                                        {item.currency} {item.earlyBirdRate}
                                      </Text>
                                      <View
                                        style={{
                                          justifyContent: 'flex-end',
                                        }}>
                                        <Text style={styles.packText2}>
                                          {item.earlyBirdRate *
                                            (numberOfSenior +
                                              numberOfAdults +
                                              numberOfChildren)}{' '}
                                          {item.currency}
                                        </Text>
                                      </View>
                                      {/* <Text
                                                                  style={
                                                                    styles.packTex2
                                                                  }>
                                                                  {
                                                                    item.packageName
                                                                  }
                                                                </Text> */}
                                    </View>
                                  ) : (
                                    <View style={styles.contentBoxTextView5}>
                                      <Text style={styles.packText}>
                                        {item.currency} {item.packageRate}
                                      </Text>
                                      <Text style={styles.packText2}>
                                        {item.packageRate *
                                          (numberOfSenior +
                                            numberOfAdults +
                                            numberOfChildren)}
                                        { } {item.currency}
                                      </Text>
                                      {/* <Text
                                                                  style={
                                                                    styles.packTex2
                                                                  }>
                                                                  {
                                                                    item.packageName
                                                                  }
                                                                </Text> */}
                                    </View>
                                  )}
                                  {/* {item.packageRate *
                                                            (numberOfSenior +
                                                              numberOfAdults +
                                                              numberOfChildren)}{' '}
                                                          {item.currency} */}
                                </Text>
                                {/* <Text style={styles.amntTxt}>
                              {item.packageRate *
                                (numberOfSenior +
                                  numberOfAdults +
                                  numberOfChildren)}{' '}
                              {item.currency}
                            </Text> */}
                              </View>
                            );
                          }}
                        />
                      </View>
                    ) : (
                      <View>
                        <View style={styles.greyBorder}></View>
                        <View style={styles.attendeesCountCont}>
                          <Text style={styles.amntTxt}>
                            {languages[languageValue].Seniors}
                          </Text>
                          <View style={styles.countCont}>
                            <TouchableOpacity
                              onPress={decreaseSenior}
                            // style={{marginLeft: 5}}
                            >
                              <View
                                style={{
                                  marginLeft: 5,
                                  height: 30,
                                  width: 30,
                                  borderRadius: 100 / 2,
                                  borderColor: '#00A19C',
                                  borderWidth: 1,
                                  justifyContent: 'center',
                                  alignItems: 'center',
                                  marginRight: 5,
                                }}>
                                <Image
                                  style={styles.micon}
                                  source={require('../assets/images/minus.png')}
                                />
                              </View>
                            </TouchableOpacity>
                            <View style={styles.counterResTxt}>
                              <Text style={styles.contentBoxText}>
                                {' '}
                                {numberOfSenior}{' '}
                              </Text>
                            </View>

                            <TouchableOpacity onPress={increaseSenior}>
                              <View
                                style={{
                                  marginRight: 15,
                                  height: 30,
                                  width: 30,
                                  borderRadius: 100 / 2,
                                  borderColor: '#00A19C',
                                  borderWidth: 1,
                                  justifyContent: 'center',
                                  alignItems: 'center',
                                  marginLeft: 5,
                                }}>
                                <Image
                                  style={styles.aicon}
                                  source={require('../assets/images/add.png')}
                                />
                              </View>
                            </TouchableOpacity>
                          </View>
                        </View>

                        <View style={styles.attendeesCountCont}>
                          <Text style={styles.amntTxt}>
                            {languages[languageValue].Adults}
                          </Text>
                          <View style={styles.countCont}>
                            <TouchableOpacity
                              onPress={decreaseAdult}
                            // style={{marginLeft: 5}}
                            >
                              <View
                                style={{
                                  marginLeft: 5,
                                  height: 30,
                                  width: 30,
                                  borderRadius: 100 / 2,
                                  borderColor: '#00A19C',
                                  borderWidth: 1,
                                  justifyContent: 'center',
                                  alignItems: 'center',
                                  marginRight: 5,
                                }}>
                                <Image
                                  style={styles.micon}
                                  source={require('../assets/images/minus.png')}
                                />
                              </View>
                            </TouchableOpacity>
                            <View style={styles.counterResTxt}>
                              <Text style={styles.contentBoxText}>
                                {' '}
                                {numberOfAdults}{' '}
                              </Text>
                            </View>

                            <TouchableOpacity onPress={increaseAdults}>
                              <View
                                style={{
                                  marginRight: 15,
                                  height: 30,
                                  width: 30,
                                  borderRadius: 100 / 2,
                                  borderColor: '#00A19C',
                                  borderWidth: 1,
                                  justifyContent: 'center',
                                  alignItems: 'center',
                                  marginLeft: 5,
                                }}>
                                <Image
                                  style={styles.aicon}
                                  source={require('../assets/images/add.png')}
                                />
                              </View>
                            </TouchableOpacity>
                          </View>
                        </View>

                        <View style={styles.attendeesCountCont}>
                          <Text style={styles.amntTxt}>
                            {languages[languageValue].Children}
                          </Text>
                          <View style={styles.countCont}>
                            <TouchableOpacity
                              onPress={decreaseChildren}
                            // style={{marginLeft: 5}}
                            >
                              <View
                                style={{
                                  marginLeft: 5,
                                  height: 30,
                                  width: 30,
                                  borderRadius: 100 / 2,
                                  borderColor: '#00A19C',
                                  borderWidth: 1,
                                  justifyContent: 'center',
                                  alignItems: 'center',
                                  marginRight: 5,
                                }}>
                                <Image
                                  style={styles.micon}
                                  source={require('../assets/images/minus.png')}
                                />
                              </View>
                            </TouchableOpacity>
                            <View style={styles.counterResTxt}>
                              <Text style={styles.contentBoxText}>
                                {' '}
                                {numberOfChildren}{' '}
                              </Text>
                            </View>

                            <TouchableOpacity onPress={increaseChildren}>
                              <View
                                style={{
                                  marginRight: 15,
                                  height: 30,
                                  width: 30,
                                  borderRadius: 100 / 2,
                                  borderColor: '#00A19C',
                                  borderWidth: 1,
                                  justifyContent: 'center',
                                  alignItems: 'center',
                                  marginLeft: 5,
                                }}>
                                <Image
                                  style={styles.aicon}
                                  source={require('../assets/images/add.png')}
                                />
                              </View>
                            </TouchableOpacity>
                          </View>
                        </View>

                        <View style={styles.greyBorder2}></View>
                        {/* <FlatList
                      data={getPackages}
                      renderItem={({item}) => {
                        return (
                          <View style={styles.totalAmntCont}>
                            <Text style={styles.totText}>Total Amount.</Text>
                            <Text style={styles.amntTxt}>
                              {item.packageRate *
                                (numberOfSenior +
                                  numberOfAdults +
                                  numberOfChildren)}{' '}
                              {item.currency}
                            </Text>
                          </View>
                        );
                      }}
                    /> */}

                        <FlatList
                          data={getPackages}
                          renderItem={({ item, index }) => {
                            return (
                              <View style={styles.packageDetailsView}>
                                <View style={styles.contentBox}>
                                  <View style={styles.contentBoxView}>
                                    <View style={styles.imgView}>
                                      {item.packageLogo == '' ||
                                        item.packageLogo == null ? (
                                        <Image
                                          resizeMode="contain"
                                          style={styles.commImg}
                                          source={require('../assets/images/packageImg.png')}
                                        />
                                      ) : (
                                        <Image
                                          resizeMode="contain"
                                          style={styles.commImg}
                                          source={{ uri: item.packageLogo }}
                                        />
                                      )}
                                    </View>
                                    {todayDate <
                                      getFormattedDate_rsvp(
                                        item.earlyBirdDate,
                                      ) ? (
                                      <View style={styles.contentBoxTextView5}>
                                        <Text
                                          style={styles.packText_linetrough}>
                                          {item.currency} {item.packageRate}
                                        </Text>
                                        <Text style={styles.packText_earlyrate}>
                                          {item.currency} {item.earlyBirdRate}
                                        </Text>
                                        <Text style={styles.packTex2}>
                                          {item.packageName}
                                        </Text>
                                      </View>
                                    ) : (
                                      <View style={styles.contentBoxTextView5}>
                                        <Text style={styles.packText}>
                                          {item.currency} {item.packageRate}
                                        </Text>

                                        <Text style={styles.packTex2}>
                                          {item.packageName}
                                        </Text>
                                      </View>
                                    )}
                                  </View>
                                  <View style={styles.arrowView}>
                                    <View style={styles.countCont}>
                                      <TouchableOpacity
                                        onPress={() =>
                                          decreaseAttendeesPackage(index)
                                        }
                                      // style={{marginLeft: 5}}
                                      >
                                        <View
                                          style={{
                                            marginLeft: 5,
                                            height: 30,
                                            width: 30,
                                            borderRadius: 100 / 2,
                                            borderColor: '#00A19C',
                                            borderWidth: 1,
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            marginRight: 5,
                                          }}>
                                          <Image
                                            style={styles.micon}
                                            source={require('../assets/images/minus.png')}
                                          />
                                        </View>
                                      </TouchableOpacity>
                                      <View style={styles.counterResTxt}>
                                        <Text style={styles.contentBoxText}>
                                          {item.selectPacknumber}
                                        </Text>
                                      </View>
                                      <TouchableOpacity
                                        onPress={() =>
                                          increaseAttendeesPackage(index)
                                        }>
                                        <View
                                          style={{
                                            marginRight: 15,
                                            height: 30,
                                            width: 30,
                                            borderRadius: 100 / 2,
                                            borderColor: '#00A19C',
                                            borderWidth: 1,
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            marginLeft: 5,
                                          }}>
                                          <Image
                                            style={styles.aicon}
                                            source={require('../assets/images/add.png')}
                                          />
                                        </View>
                                      </TouchableOpacity>

                                      {/* <TouchableOpacity
                                  onPress={handleNumberOfMinAttendees}>
                                  <View style={{marginRight: 15}}>
                                    <Image
                                      style={styles.aicon}
                                      source={require('../assets/images/add.png')}
                                    />
                                  </View>
                                </TouchableOpacity> */}
                                    </View>
                                    {/* <Text>total amount: </Text> */}
                                  </View>
                                </View>
                              </View>
                            );
                          }}
                        />
                      </View>
                    )}
                  </View>

                  <View style={styles.eventMoreDetails}>
                    <View style={styles.titleButtonView}>
                      <Text style={styles.eventNameText2}>{eventTitle}</Text>
                    </View>
                    <View style={styles.abtEvntTextView}>
                      {/* <View style={styles.textCont1}> */}
                      <Text style={styles.abtEvntText}>{eventDescriptiom}</Text>
                      {/* </View> */}
                    </View>

                    <View style={styles.titleButtonView}>
                      <Text style={styles.eventNameText2}>
                        {languages[languageValue].PostedBy} :{' '}
                        {postEventasCommunity === false ? (
                          <Text style={styles.eventNameText2}>
                            {getHostName}
                          </Text>
                        ) : (
                          <Text style={styles.eventNameText2}>
                            {communityName}{' '}
                          </Text>
                        )}
                      </Text>
                    </View>
                    <View style={styles.borderBlue}></View>

                    <View style={styles.detailAttView}>
                      <Text style={styles.abtEvntText}>
                        {languages[languageValue].EventHost}
                      </Text>
                      <Text style={styles.abtEvntText}>{getHostCounter}</Text>
                    </View>
                    <View style={styles.detailAttView}>
                      <Text style={styles.abtEvntText}>
                        {languages[languageValue].Attenlimit}
                      </Text>
                      <Text style={styles.abtEvntText}>
                        {getAttendeesLimit}
                      </Text>
                    </View>

                    <View style={styles.detailAttView}>
                      <Text style={styles.abtEvntText}>
                        {languages[languageValue].NoofMaximumGuest} (
                        {languages[languageValue].peruser})
                      </Text>
                      <Text style={styles.abtEvntText}>
                        {getMaxNumberGuest}
                      </Text>
                    </View>

                    <View style={styles.detailAttView}>
                      <Text style={styles.abtEvntText}>
                        {languages[languageValue].Noofattendees}
                      </Text>
                      <Text style={styles.abtEvntText}>
                        {getAttendeesNumber}
                      </Text>
                    </View>

                    <View style={styles.detailAttView}>
                      <Text style={styles.abtEvntText}>
                        {languages[languageValue].Remainingofattendeesallowed}
                      </Text>
                      <Text style={styles.abtEvntText}>
                        {getRemainingAttendees}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.venueDetailsCont}>
                    <View style={styles.titleButtonView}>
                      <Text style={styles.eventNameText2}>{eventTitle}</Text>
                    </View>
                    <View style={styles.abtEvntTextView}>
                      {/* <View style={styles.textCont1}> */}
                      <Text style={styles.addressText}>
                        {firstaddressline}
                        {secondaddressline}
                      </Text>
                      {/* </View> */}
                    </View>

                    <View style={styles.dtpCont}>
                      <View style={styles.mobCont}>
                        <Text style={styles.czmTxt}>
                          {languages[languageValue].City}
                        </Text>

                        <View style={styles.dateTxtView}>
                          <Text style={styles.czmDetTxt}>{city}</Text>
                        </View>
                      </View>
                      <View style={styles.verGreyBorder}></View>

                      <View style={styles.mobCont}>
                        <Text style={styles.czmTxt}>
                          {languages[languageValue].Zipcode}
                        </Text>
                        <View style={styles.timeTxtView}>
                          <Text style={styles.czmDetTxt}>{zipcode}</Text>
                        </View>
                      </View>
                      <View style={styles.verGreyBorder}></View>

                      <View style={styles.mobCont}>
                        <Text style={styles.czmTxt}>
                          {languages[languageValue].Mobile}
                        </Text>

                        <View style={styles.placeTxtView}>
                          <Text style={styles.czmDetTxt}>{phoneNumber}</Text>
                        </View>
                      </View>
                    </View>
                  </View>
                  <View style={styles.picBlogCont}>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                      }}>
                      <View>
                        <TouchableOpacity
                          onPress={() => setOnPhoto(true)}
                          style={styles.titleButtonView}>
                          <Text style={styles.eventNameText2}>
                            {languages[languageValue].EventPictures}
                          </Text>
                        </TouchableOpacity>
                        <View
                          style={
                            OnPhoto
                              ? styles.pegerYellowBorder2
                              : styles.pegerYellowBorder2_Off
                          }></View>
                      </View>
                      <View>
                        <TouchableOpacity
                          onPress={() => setOnPhoto(false)}
                          style={styles.titleButtonView}>
                          <Text style={styles.eventNameText2}>
                            {languages[languageValue].EventBlogs}
                          </Text>
                        </TouchableOpacity>
                        <View
                          style={
                            OnPhoto === false
                              ? styles.pegerYellowBorder2
                              : styles.pegerYellowBorder2_Off
                          }></View>
                      </View>
                    </View>
                    {OnPhoto ? (
                      <View>
                        {getEventImages.length > 0 ? (
                          <View>
                            <FlatList
                              horizontal={true}
                              data={getEventImages}
                              renderItem={({ item }) => {
                                return (
                                  <TouchableOpacity
                                    onPress={() => {
                                      showSlide(item.uploadedImage);
                                    }}
                                    style={styles.eventImageCont}>
                                    <Image
                                      style={styles.evntImg}
                                      source={{ uri: item.uploadedImage }}
                                    />
                                  </TouchableOpacity>
                                );
                              }}
                            />
                            <Modal
                              style={styles.imageModal}
                              isVisible={imageModalVisible}
                              backdropOpacity={0.9}
                              // transparent={true}
                              onBackdropPress={() =>
                                setImageModalVisible(false)
                              }>
                              <View style={styles.modalImageCont}>
                                <Image
                                  style={styles.imageModal}
                                  source={{ uri: itemval }}
                                />
                              </View>
                              <TouchableOpacity
                                style={{
                                  position: 'absolute',
                                  top: 110,
                                  left: 170,
                                }}
                                onPress={() => setImageModalVisible(false)}>
                                <Image
                                  style={styles.dcIcon2}
                                  source={require('../assets/images/cancelicon.png')}
                                />
                              </TouchableOpacity>
                            </Modal>
                          </View>
                        ) : (
                          <View
                            style={{
                              marginTop: 15,
                              justifyContent: 'center',
                              alignItems: 'center',
                            }}>
                            <Text style={styles.headerTxt2}>
                              {languages[languageValue].Nophotosforthiseventyet}
                              .
                            </Text>
                          </View>
                        )}
                      </View>
                    ) : (
                      <View>
                        {getEventBlogs.length > 0 ? (
                          <FlatList
                            // numColumns={2}
                            // showsVerticalScrollIndicator={false}
                            //horizontal={true}
                            data={getEventBlogs}
                            renderItem={({ item }) => {
                              return (
                                <View style={styles.subMainBox}>
                                  <TouchableOpacity
                                    onPress={() => {
                                      setBlogTitle(item.blogTitle);
                                      setBlogDescription(item.blogDescription);
                                      setCreateDate(item.createdAt);
                                      toggleblogModalVisible();
                                    }}>
                                    <LinearGradient
                                      colors={['#FCA62A', '#FCA62A', '#ED8015']}
                                      style={styles.contentBox2}>
                                      <View
                                        style={{
                                          justifyContent: 'center',
                                          alignItems: 'center',
                                          marginTop: 5,
                                          marginLeft: 10,
                                        }}>
                                        <Image
                                          resizeMode="contain"
                                          style={styles.commImg2}
                                          source={{ uri: item.thumbnailImage }}
                                        />
                                      </View>
                                      <View style={styles.textView}>
                                        <Text style={styles.contentBoxText2}>
                                          {item.blogTitle}
                                        </Text>
                                        <Text style={styles.descriptionText}>
                                          {`${removeTags(
                                            item.blogDescription,
                                          ).slice(0, 20)}... `}
                                        </Text>

                                        <View style={styles.dateTimeCont}>
                                          <Text style={styles.dateTimeText}>
                                            {getFormattedDate_FULL(
                                              item.createdAt,
                                            )}
                                          </Text>
                                        </View>
                                      </View>
                                      <View style={styles.arrowView2}>
                                        <Image
                                          style={styles.rightarrow2}
                                          source={require('../assets/images/rightarrow.png')}
                                        />
                                      </View>
                                    </LinearGradient>
                                  </TouchableOpacity>

                                  <Modal
                                    animationIn="swing"
                                    animationOut="zoomOut"
                                    style={styles.recurringModalView}
                                    isVisible={blogModalVisible}
                                    onDismiss={hideDialogblogModalVisible}
                                    backdropOpacity={0.5}
                                    onBackdropPress={toggleblogModalVisible}>
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
                                          {item.blogTitle}
                                        </Text>
                                        {blogDescription.length > 20 ? (
                                          <View style={styles.blogDesView}>
                                            <Text
                                              style={styles.descriptionText}>
                                              {`${removeTags(
                                                blogDescription,
                                              ).slice(0, 20)}... `}
                                            </Text>
                                          </View>
                                        ) : (
                                          <Text style={styles.descriptionText}>
                                            {removeTags(blogDescription)}
                                          </Text>
                                        )}

                                        <View style={styles.titleButtonView}>
                                          <Text style={styles.modTitleTxt2}>
                                            Created at :{' '}
                                            <Text style={styles.modTitleTxt}>
                                              {getFormattedDate_FULL(
                                                createDate,
                                              )}
                                            </Text>
                                          </Text>
                                        </View>
                                      </View>
                                      <View style={styles.amntView}>
                                        <View
                                          style={
                                            styles.evntModalDetailsCont
                                          }></View>

                                        <TouchableOpacity
                                          onPress={hideDialogblogModalVisible}
                                          style={styles.confirmPress}>
                                          <Text style={styles.confirmPressText}>
                                            Thank You
                                          </Text>
                                        </TouchableOpacity>
                                      </View>
                                    </LinearGradient>
                                  </Modal>
                                </View>
                              );
                            }}
                          />
                        ) : (
                          <View
                            style={{
                              marginTop: 15,
                              justifyContent: 'center',
                              alignItems: 'center',
                            }}>
                            <Text style={styles.headerTxt2}>
                              {languages[languageValue].NoBlogsforthiseventyet}
                            </Text>
                          </View>
                        )}
                      </View>
                    )}
                  </View>
                </View>
              </ScrollView>

              <View style={{ paddingBottom: 35 }}>
                {todayDate <= getFormattedDate_rsvp(rsvpEndTime) ? (
                  <View style={styles.buttonCont2}>
                    {rsvpStatus == 'Maybe' ? (
                      <View style={styles.buttonCont_maybe}>
                        {rsvpStatus == 'Not_Attending' ? (
                          <View></View>
                        ) : (
                          <TouchableOpacity
                            onPress={() => {
                              alert_event(invitedEventID);
                            }}
                            style={styles.acceptPressPaid_Maybe}>
                            <LinearGradient
                              colors={['#ED8015', '#FCA62A', '#ED8015']}
                              style={styles.acceptPressPaid_Maybe}>
                              <Text style={styles.acceptTxt}>
                                Change RSVP to Yes
                              </Text>
                              <Modal
                                style={styles.alertModalView}
                                isVisible={isEventAlertVisible}
                                onDismiss={hideDialogEventAlert}
                                backdropOpacity={0.5}
                                onBackdropPress={toggleEventAlertModal}>
                                <LinearGradient
                                  colors={['#ED8015', '#ED8015', '#FFB345']}
                                  style={styles.alertModal}>
                                  <View
                                    style={{
                                      justifyContent: 'flex-start',
                                      // alignItems: 'center',
                                      // bottom: 0,
                                      paddingLeft: 15,
                                      paddingRight: 15,
                                      marginTop: 10,
                                    }}>
                                    <Text style={styles.modTitleTxt}>
                                      Confirmation Alert{' '}
                                    </Text>
                                    <Text style={styles.modDesTxt}>
                                      {
                                        languages[languageValue]
                                          .YouhavealreadyRSVPanothereventson
                                      }{' '}
                                      <Text style={styles.modDesTxt2}>
                                        {getFormattedDate_FULL(eventStartDate)}
                                      </Text>
                                      .{' '}
                                      {
                                        languages[languageValue]
                                          .Doyouwanttocontinueforthiseventalso
                                      }
                                      ?
                                    </Text>
                                  </View>
                                  <View style={styles.amntView}>
                                    <View style={styles.evntModalDetailsCont}>
                                      <FlatList
                                        data={alterEventDetails}
                                        renderItem={({ item }) => {
                                          return (
                                            <View style={styles.cont1}>
                                              <View style={styles.modTextCont}>
                                                <Text style={styles.text3}>
                                                  {item.title}
                                                </Text>
                                                {/* 
                                        <View style={styles.txtButtonModCont}>
                                         
                                          {item.paymentStatus == 'Free' ? (
                                            <LinearGradient
                                              colors={[
                                                '#A3F4F2',
                                                '#A3F4F2',
                                                '#CAEBEA',
                                              ]}
                                              style={styles.statusModCont}>
                                              <Text style={styles.text5}>
                                                {' '}
                                                {item.paymentStatus}
                                              </Text>
                                            </LinearGradient>
                                          ) : (
                                            <LinearGradient
                                              colors={[
                                                '#FAF0E7',
                                                '#FAF0E7',
                                                '#FAF0E7',
                                              ]}
                                              style={styles.statusModCont}>
                                              <Text style={styles.text5}>
                                                {' '}
                                                {item.paymentStatus}
                                              </Text>
                                            </LinearGradient>
                                          )}
                                        </View> */}
                                                <View
                                                  style={
                                                    styles.bordergrey
                                                  }></View>
                                                <View
                                                  style={
                                                    styles.modDateTimeCont
                                                  }>
                                                  <Text style={styles.text1}>
                                                    {getFormattedTime_NEW(
                                                      item.time.from,
                                                    )}{' '}
                                                    {
                                                      languages[languageValue]
                                                        .to
                                                    }{' '}
                                                    {getFormattedTime_NEW(
                                                      item.time.to,
                                                    )}{' '}
                                                  </Text>
                                                </View>
                                              </View>
                                            </View>
                                          );
                                        }}
                                      />

                                      <View style={styles.amntView2}>
                                        <TouchableOpacity
                                          onPress={() => {
                                            // accept_reject(invitedEventID, 'Attending');
                                            // togglePaymentSuccessModal();
                                            hideDialogEventAlert();

                                            toggleAcceptanceModal();
                                          }}
                                          style={styles.confirmPress_alert}>
                                          <Text style={styles.confirmPressText}>
                                            {
                                              languages[languageValue]
                                                .yescontinue
                                            }
                                          </Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                          onPress={hideDialogEventAlert}
                                          style={styles.cancelPress_alert}>
                                          <Text style={styles.confirmPressText}>
                                            {languages[languageValue].cancel}
                                          </Text>
                                        </TouchableOpacity>
                                      </View>
                                    </View>
                                  </View>
                                </LinearGradient>
                              </Modal>

                              <Modal
                                animationIn="swing"
                                animationOut="zoomOut"
                                style={styles.recurringModalView}
                                isVisible={isAcceptanceVisible}
                                onDismiss={hideDialogAcceptance}
                                backdropOpacity={0.5}
                                onBackdropPress={toggleAcceptanceModal}>
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
                                      Confirmation Alert{' '}
                                    </Text>

                                    <Text style={styles.modDesTxt}>
                                      {
                                        languages[languageValue]
                                          .Youareinforevntstartedon
                                      }{' '}
                                      <Text style={styles.modDesTxt2}>
                                        {getFormattedDate_FULL(eventStartDate)}.
                                      </Text>
                                      {'\n'}
                                      {
                                        languages[languageValue]
                                          .Doyouwanttocontinueforthisevent
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
                                        accept_reject(
                                          invitedEventID,
                                          'Attending',
                                        );
                                        // togglePaymentSuccessModal();
                                        hideDialogAcceptance();
                                      }}
                                      style={styles.confirmPress}>
                                      <Text style={styles.confirmPressText}>
                                        {languages[languageValue].YesConfirm}
                                      </Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                      onPress={hideDialogAcceptance}
                                      style={styles.cancelPress}>
                                      <Text style={styles.confirmPressText}>
                                        {languages[languageValue].cancel}
                                      </Text>
                                    </TouchableOpacity>
                                  </View>
                                </LinearGradient>
                              </Modal>
                            </LinearGradient>
                          </TouchableOpacity>
                        )}
                      </View>
                    ) : (
                      <View
                        style={
                          Platform.OS === IOS
                            ? styles.cancelView_IOS
                            : styles.cancelView
                        }>
                        <View style={styles.buttonCont2}>
                          <TouchableOpacity
                            onPress={() => {
                              toggleRejectionModal(invitedEventID);
                            }}
                            style={styles.rejectPressPaid}>
                            <Text style={styles.acrejText}>
                              {languages[languageValue].Reject}
                            </Text>

                            <Modal
                              animationIn="swing"
                              animationOut="zoomOut"
                              style={styles.recurringModalView}
                              isVisible={isRejectionVisible}
                              onDismiss={hideDialogRejection}
                              backdropOpacity={0.5}
                              onBackdropPress={toggleRejectionModal}>
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
                                    {languages[languageValue].RejectionAlert}{' '}
                                  </Text>
                                  <Text style={styles.modDesTxt}>
                                    {languages[languageValue].Doyouwantto}{' '}
                                    <Text style={styles.modDesTxt2}>
                                      {languages[languageValue].Tentatively}
                                    </Text>{' '}
                                    {languages[languageValue].rejecttheevent}?{' '}
                                    {
                                      languages[languageValue]
                                        .Pleasenoteaftertentativelyrejectionsti
                                    }
                                    . {languages[languageValue].OnceYoy}{' '}
                                    <Text style={styles.modDesTxt2}>
                                      {languages[languageValue].permanently}
                                    </Text>{' '}
                                    {languages[languageValue].rejecttheevent},{' '}
                                    {
                                      languages[languageValue]
                                        .youcannotacceptitagain
                                    }
                                    .❤
                                  </Text>
                                </View>
                                <View style={styles.amntView}>
                                  <View
                                    style={styles.evntModalDetailsCont}></View>
                                  <TouchableOpacity
                                    onPress={() => {
                                      accept_reject(invitedEventID, 'Maybe');

                                      hideDialogRejection();
                                      // navigation.navigate('Events', {screen: 'Rejected'});
                                      // navigation.navigate('Rejected')
                                    }}
                                    style={styles.confirmPress}>
                                    <Text style={styles.confirmPressText}>
                                      {languages[languageValue].Tentatively}{' '}
                                      {languages[languageValue].Reject}
                                    </Text>
                                  </TouchableOpacity>
                                  <TouchableOpacity
                                    onPress={() => {
                                      console.log(
                                        '$$$$$$$$$$$ Not_Attending Id_next $$$$$$$$$$$$$',
                                        invitedEventID,
                                      );
                                      accept_reject(
                                        invitedEventID,
                                        'Not_Attending',
                                      );
                                      hideDialogRejection();

                                      // accept_reject(
                                      //   item.id,
                                      //   'Not_Attending',
                                      // );

                                      hideDialogRejection();
                                      // navigation.navigate('Events', {
                                      //   screen: 'Rejected',
                                      // });
                                      // navigation.navigate('Rejected')
                                    }}
                                    style={styles.confirmPress2}>
                                    <Text style={styles.confirmPressText}>
                                      {languages[languageValue].YesConfirm}{' '}
                                      {languages[languageValue].Reject}
                                    </Text>
                                  </TouchableOpacity>
                                  <TouchableOpacity
                                    onPress={
                                      hideDialogRejection
                                      // navigation.navigate('Events', {screen: 'Rejected'});
                                      // navigation.navigate('Rejected')
                                    }
                                    style={styles.cancelPress}>
                                    <Text style={styles.confirmPressText}>
                                      {languages[languageValue].cancel}
                                    </Text>
                                  </TouchableOpacity>
                                </View>
                              </LinearGradient>
                            </Modal>
                          </TouchableOpacity>
                          {/* )} */}
                          {/* <StripeProvider publishableKey="pk_test_51PfeV6FWMEQq952nIM9Wp2MRn3gMjZnCir210UHyLzYSPBvzWnVvVIEhbW7zJmf6BsbZaI8yren5Mda31oAIZmG500dRVOJuS9"> */}
                          <TouchableOpacity

                            onPress={() => {
                              alert_event(invitedEventID);
                              setPaidView(false);
                              setType('online');
                            }}
                            style={styles.payOnlinetPress}>
                            <Text style={styles.acrejText}>
                              {languages[languageValue].PayOnline}
                            </Text>
                            <Modal
                              animationIn="swing"
                              animationOut="zoomOut"
                              style={styles.recurringModalView}
                              isVisible={isPaymentFailedVisible}
                              onDismiss={hidePaymentFailed}
                              backdropOpacity={0.5}
                              onBackdropPress={togglePaymentFailedModal}>
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
                                    {languages[languageValue].comingsoon}
                                    {/* Payment Unsuccessful */}
                                  </Text>
                                  <Text style={styles.modDesTxt}>
                                    {/* Thanks for confirmation of your RSVP & complete your
payment for the event. You can cancel your RSVP
anytime from event details. Thanks.❤ */}
                                    {languages[languageValue].thanksforchoosing}
                                  </Text>
                                </View>
                                <View style={styles.paymentSuccessImgCont}>
                                  <View style={styles.whiteCircle}>
                                    <Image
                                      style={styles.paymentSuccessImg}
                                      source={require('../assets/images/paymentUnsuccess.png')}
                                    />
                                  </View>
                                  <TouchableOpacity
                                    onPress={hidePaymentFailed}
                                    style={styles.confirmPress}>
                                    <Text style={styles.confirmPressText}>
                                      {/* Try again */}{' '}
                                      {languages[languageValue].ThankYou}
                                    </Text>
                                  </TouchableOpacity>
                                </View>
                              </LinearGradient>
                            </Modal>

                            <Modal
                              style={styles.alertModalView}
                              isVisible={isEventAlertVisible}
                              onDismiss={hideDialogEventAlert}
                              backdropOpacity={0.5}
                              onBackdropPress={toggleEventAlertModal}>
                              {paidViewOn === false ? (
                                <LinearGradient
                                  colors={['#ED8015', '#ED8015', '#FFB345']}
                                  style={styles.alertModal}>
                                  <View
                                    style={{
                                      justifyContent: 'flex-start',
                                      // alignItems: 'center',
                                      // bottom: 0,
                                      paddingLeft: 15,
                                      paddingRight: 15,
                                      marginTop: 10,
                                    }}>
                                    <Text style={styles.modTitleTxt}>
                                      Confirmation Alert{' '}
                                    </Text>
                                    <Text style={styles.modDesTxt}>
                                      {
                                        languages[languageValue]
                                          .YouhavealreadyRSVPanothereventson
                                      }{' '}
                                      {getFormattedDate_FULL(eventStartDate)}.{' '}
                                      {
                                        languages[languageValue]
                                          .Doyouwanttocontinueforthiseventalso
                                      }
                                      ?
                                    </Text>
                                  </View>
                                  <View style={styles.amntView}>
                                    <View
                                      style={styles.evntModalDetailsContAlert}>
                                      <FlatList
                                        data={alterEventDetails}
                                        renderItem={({ item }) => {
                                          return (
                                            <View style={styles.cont1}>
                                              <View style={styles.modTextCont}>
                                                <Text style={styles.text3}>
                                                  {item.title}
                                                </Text>

                                                <View
                                                  style={
                                                    styles.bordergrey
                                                  }></View>
                                                <View
                                                  style={
                                                    styles.modDateTimeCont
                                                  }>
                                                  <Text style={styles.text1}>
                                                    {getFormattedTime_NEW(
                                                      item.time.from,
                                                    )}{' '}
                                                    {
                                                      languages[languageValue]
                                                        .to
                                                    }{' '}
                                                    {getFormattedTime_NEW(
                                                      item.time.to,
                                                    )}{' '}
                                                  </Text>
                                                </View>
                                              </View>
                                            </View>
                                          );
                                        }}
                                      />

                                      <View style={styles.amntView2}>
                                        <TouchableOpacity
                                          onPress={() => {
                                            setPaidView(true);
                                            // togglePaymentSuccessModal();
                                            // hideDialogAcceptance();
                                          }}
                                          style={styles.confirmPress_alert}>
                                          <Text style={styles.confirmPressText}>
                                            {
                                              languages[languageValue]
                                                .yescontinue
                                            }
                                          </Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                          onPress={hideDialogEventAlert}
                                          style={styles.cancelPress_alert}>
                                          <Text style={styles.confirmPressText}>
                                            {languages[languageValue].cancel}
                                          </Text>
                                        </TouchableOpacity>
                                      </View>
                                    </View>
                                  </View>
                                </LinearGradient>
                              ) : (
                                <View>
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
                                        Confirmation Alert{' '}
                                      </Text>

                                      <Text style={styles.modDesTxt}>
                                        {
                                          languages[languageValue]
                                            .Youareinforevntstartedon
                                        }{' '}
                                        <Text style={styles.modDesTxt2}>
                                          {getFormattedDate_FULL(
                                            eventStartDate,
                                          )}
                                          .
                                        </Text>
                                        {'\n'}
                                        {
                                          languages[languageValue]
                                            .Doyouwanttocontinueforthisevent
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
                                          accept_reject(
                                            invitedEventID,
                                            'Attending',
                                          );
                                          // openPaymentSheet();

                                          // togglePaymentSuccessModal();
                                          hideDialogEventAlert();
                                        }}
                                        style={styles.confirmPress}>
                                        <Text style={styles.confirmPressText}>
                                          {languages[languageValue].YesConfirm}
                                        </Text>
                                      </TouchableOpacity>
                                      <TouchableOpacity
                                        onPress={hideDialogEventAlert}
                                        style={styles.cancelPress}>
                                        <Text style={styles.confirmPressText}>
                                          {languages[languageValue].cancel}
                                        </Text>
                                      </TouchableOpacity>
                                    </View>
                                  </LinearGradient>
                                </View>
                              )}
                            </Modal>

                            <Modal
                              animationIn="swing"
                              animationOut="zoomOut"
                              style={styles.recurringModalView}
                              isVisible={isAcceptanceVisible}
                              onDismiss={hideDialogAcceptance}
                              backdropOpacity={0.5}
                              onBackdropPress={toggleAcceptanceModal}>
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
                                    Confirmation Alert{' '}
                                  </Text>

                                  <Text style={styles.modDesTxt}>
                                    {
                                      languages[languageValue]
                                        .Youareinforevntstartedon
                                    }{' '}
                                    <Text style={styles.modDesTxt2}>
                                      {getFormattedDate_FULL(eventStartDate)}.
                                    </Text>
                                    {'\n'}
                                    {
                                      languages[languageValue]
                                        .Doyouwanttocontinueforthisevent
                                    }
                                    ?
                                  </Text>
                                </View>
                                <View style={styles.amntView}>
                                  <View
                                    style={styles.evntModalDetailsCont}></View>
                                  <TouchableOpacity
                                    onPress={() => {
                                      accept_reject(
                                        invitedEventID,
                                        'Attending',
                                      );
                                      // togglePaymentSuccessModal();
                                      hideDialogEventAlert();
                                    }}
                                    style={styles.confirmPress}>
                                    <Text style={styles.confirmPressText}>
                                      {languages[languageValue].YesConfirm}
                                    </Text>
                                  </TouchableOpacity>
                                  <TouchableOpacity
                                    onPress={hideDialogAcceptance}
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
                              isVisible={isPaymentSuccessVisible}
                              onDismiss={hideDialogPaymentSuccess}
                              backdropOpacity={0.5}
                              onBackdropPress={togglePaymentSuccessModal}>
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
                                    Your Attendence is Noted
                                  </Text>
                                  <Text style={styles.modDesTxt}>
                                    Thanks for confirmation of your RSVP &
                                    complete your payment for the event. You can
                                    cancel your RSVP anytime from event details.
                                    Thanks.❤
                                  </Text>
                                </View>
                                <View style={styles.paymentSuccessImgCont}>
                                  {/* <Image
                                           style={styles.paymentSuccessImg}
                                           source={require('../assets/images/paysuccess.png')}
                                         /> */}
                                  <TouchableOpacity
                                    onPress={hideDialogPaymentSuccess}
                                    style={styles.confirmPress}>
                                    <Text style={styles.confirmPressText}>
                                      Ok, Thanks
                                    </Text>
                                  </TouchableOpacity>
                                </View>
                              </LinearGradient>
                            </Modal>
                          </TouchableOpacity>
                          {/* </StripeProvider> */}

                          <TouchableOpacity
                            onPress={() => {
                              alert_event(invitedEventID);
                              setPaidView(false);
                              setType('');
                            }}
                            style={styles.acceptPressPaid}>
                            <Text style={styles.acrejText}>
                              {languages[languageValue].PayOffline}
                            </Text>

                            <Modal
                              style={styles.alertModalView}
                              isVisible={isEventAlertVisible}
                              onDismiss={hideDialogEventAlert}
                              backdropOpacity={0.5}
                              onBackdropPress={toggleEventAlertModal}>
                              {paidViewOn === false ? (
                                <LinearGradient
                                  colors={['#ED8015', '#ED8015', '#FFB345']}
                                  style={styles.alertModal}>
                                  <View
                                    style={{
                                      justifyContent: 'flex-start',
                                      // alignItems: 'center',
                                      // bottom: 0,
                                      paddingLeft: 15,
                                      paddingRight: 15,
                                      marginTop: 10,
                                    }}>
                                    <Text style={styles.modTitleTxt}>
                                      Confirmation Alert{' '}
                                    </Text>
                                    <Text style={styles.modDesTxt}>
                                      {
                                        languages[languageValue]
                                          .YouhavealreadyRSVPanothereventson
                                      }{' '}
                                      {getFormattedDate_FULL(eventStartDate)}.{' '}
                                      {
                                        languages[languageValue]
                                          .Doyouwanttocontinueforthiseventalso
                                      }
                                      ?
                                    </Text>
                                  </View>
                                  <View style={styles.amntView}>
                                    <View
                                      style={styles.evntModalDetailsContAlert}>
                                      <FlatList
                                        data={alterEventDetails}
                                        renderItem={({ item }) => {
                                          return (
                                            <View style={styles.cont1}>
                                              <View style={styles.modTextCont}>
                                                <Text style={styles.text3}>
                                                  {item.title}
                                                </Text>

                                                <View
                                                  style={
                                                    styles.bordergrey
                                                  }></View>
                                                <View
                                                  style={
                                                    styles.modDateTimeCont
                                                  }>
                                                  <Text style={styles.text1}>
                                                    {getFormattedTime_NEW(
                                                      item.time.from,
                                                    )}{' '}
                                                    {
                                                      languages[languageValue]
                                                        .to
                                                    }{' '}
                                                    {getFormattedTime_NEW(
                                                      item.time.to,
                                                    )}{' '}
                                                  </Text>
                                                </View>
                                              </View>
                                            </View>
                                          );
                                        }}
                                      />

                                      <View style={styles.amntView2}>
                                        <TouchableOpacity
                                          onPress={() => {
                                            setPaidView(true);
                                            // togglePaymentSuccessModal();
                                            // hideDialogAcceptance();
                                          }}
                                          style={styles.confirmPress_alert}>
                                          <Text style={styles.confirmPressText}>
                                            {
                                              languages[languageValue]
                                                .yescontinue
                                            }
                                          </Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                          onPress={hideDialogEventAlert}
                                          style={styles.cancelPress_alert}>
                                          <Text style={styles.confirmPressText}>
                                            {languages[languageValue].cancel}
                                          </Text>
                                        </TouchableOpacity>
                                      </View>
                                    </View>
                                  </View>
                                </LinearGradient>
                              ) : (
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
                                      Confirmation Alert{' '}
                                    </Text>
                                    <Text style={styles.modDesTxt}>
                                      {
                                        languages[languageValue]
                                          .Youareinforevntstartedon
                                      }{' '}
                                      <Text style={styles.modDesTxt2}>
                                        {getFormattedDate_FULL(eventStartDate)}.
                                      </Text>
                                      {'\n'}
                                      {
                                        languages[languageValue]
                                          .Doyouwanttocontinueforthisevent
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
                                        accept_reject(
                                          invitedEventID,
                                          'Attending',
                                        );
                                        // togglePaymentSuccessModal();
                                        hideDialogEventAlert();
                                      }}
                                      style={styles.confirmPress}>
                                      <Text style={styles.confirmPressText}>
                                        {languages[languageValue].YesConfirm}
                                      </Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                      onPress={hideDialogEventAlert}
                                      style={styles.cancelPress}>
                                      <Text style={styles.confirmPressText}>
                                        {languages[languageValue].cancel}
                                      </Text>
                                    </TouchableOpacity>
                                  </View>
                                </LinearGradient>
                              )}
                            </Modal>

                            <Modal
                              animationIn="swing"
                              animationOut="zoomOut"
                              style={styles.recurringModalView}
                              isVisible={isAcceptanceVisible}
                              onDismiss={hideDialogAcceptance}
                              backdropOpacity={0.5}
                              onBackdropPress={toggleAcceptanceModal}>
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
                                    Confirmation Alert{' '}
                                  </Text>

                                  <Text style={styles.modDesTxt}>
                                    {
                                      languages[languageValue]
                                        .Youareinforevntstartedon
                                    }{' '}
                                    <Text style={styles.modDesTxt2}>
                                      {getFormattedDate_FULL(eventStartDate)}.
                                    </Text>
                                    {'\n'}
                                    {
                                      languages[languageValue]
                                        .Doyouwanttocontinueforthisevent
                                    }
                                    ?
                                  </Text>
                                </View>
                                <View style={styles.amntView}>
                                  <View
                                    style={styles.evntModalDetailsCont}></View>
                                  <TouchableOpacity
                                    onPress={() => {
                                      accept_reject(
                                        invitedEventID,
                                        'Attending',
                                      );
                                      // togglePaymentSuccessModal();
                                      hideDialogEventAlert();
                                    }}
                                    style={styles.confirmPress}>
                                    <Text style={styles.confirmPressText}>
                                      {languages[languageValue].YesConfirm}
                                    </Text>
                                  </TouchableOpacity>
                                  <TouchableOpacity
                                    onPress={hideDialogAcceptance}
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
                              isVisible={isPaymentSuccessVisible}
                              onDismiss={hideDialogPaymentSuccess}
                              backdropOpacity={0.5}
                              onBackdropPress={togglePaymentSuccessModal}>
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
                                    Your Attendence is Noted
                                  </Text>
                                  <Text style={styles.modDesTxt}>
                                    Thanks for confirmation of your RSVP &
                                    complete your payment for the event. You can
                                    cancel your RSVP anytime from event details.
                                    Thanks.❤
                                  </Text>
                                </View>
                                <View style={styles.paymentSuccessImgCont}>
                                  {/* <Image
                                           style={styles.paymentSuccessImg}
                                           source={require('../assets/images/paysuccess.png')}
                                         /> */}
                                  <TouchableOpacity
                                    onPress={hideDialogPaymentSuccess}
                                    style={styles.confirmPress}>
                                    <Text style={styles.confirmPressText}>
                                      Ok, Thanks
                                    </Text>
                                  </TouchableOpacity>
                                </View>
                              </LinearGradient>
                            </Modal>
                          </TouchableOpacity>
                        </View>
                      </View>
                    )}
                    {/* )} */}
                  </View>
                ) : (
                  <View
                    style={
                      Platform.OS === IOS
                        ? styles.cancelView_IOS
                        : styles.cancelView
                    }>
                    <View style={styles.buttonCont3}>
                      <View style={styles.acceptPressPaid_dateover}>
                        <Text style={styles.acrejText2}>
                          {
                            languages[languageValue]
                              .YoucannotacceptorrejectasRsvpdateisover
                          }
                        </Text>
                      </View>
                    </View>
                  </View>
                )}
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

const mapStateToProps = ({ dark, font, language }) => {
  console.log('language ' + language.currentlanguage);
  return {
    darkModeValue: dark.darkMode,
    fontSizeValue: font.fontSize,
    languageValue: language.currentlanguage,
  };
};

const mapDispatchToProps = dispatch => ({
  languageChanges: inputs => dispatch(languageChanges(inputs)),
  event_details: (client, inputs) => dispatch(event_details(client, inputs)),
  accept_reject_invited_event: (client, inputs) =>
    dispatch(accept_reject_invited_event(client, inputs)),
  event_attending_alert: (client, inputs) =>
    dispatch(event_attending_alert(client, inputs)),
  navigationUpdateAction: inputs => dispatch(navigationUpdateAction(inputs)),
  rejectNavigationUpdateAction: inputs =>
    dispatch(rejectNavigationUpdateAction(inputs)),
  event_payment_details: (client, inputs) =>
    dispatch(event_payment_details(client, inputs)),

  update_event_payment: (client, inputs) =>
    dispatch(update_event_payment(client, inputs)),
  logout: (client, inputs) => dispatch(logout(client, inputs)),
  settIdvalue: inputs => dispatch(settIdvalue(inputs)),
  // rsvp_response_edit: (client, inputs) =>
  //   dispatch(rsvp_response_edit(client, inputs)),
});
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(EventDetailsPaidPerHead);
