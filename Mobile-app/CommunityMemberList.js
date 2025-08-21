import {
  View,
  Text,
  TextInput,
  Alert,
  SafeAreaView,
  StyleSheet,
  FlatList,
  Image,
  ScrollView,
  ImageBackground,
  Dimensions,
  TouchableOpacity,
  useColorScheme,
  KeyboardAvoidingView,
  RefreshControl,
  SectionList,
} from 'react-native';
import React, {useState, useEffect, useRef, createRef} from 'react';
import AsyncStorage from "@react-native-async-storage/async-storage";
import Spinner from 'react-native-loading-spinner-overlay';
import ImagePicker from 'react-native-image-crop-picker';
import Modal from 'react-native-modal';
import {RNS3} from 'react-native-aws3';
import {Dropdown} from 'react-native-element-dropdown';
// import DatePicker from 'react-native-date-picker';
import LinearGradient from 'react-native-linear-gradient';
import NetworkUtils from '../constants/networkUtils';
// import {AlphabetList} from 'react-native-section-alphabet-list';
import MapView, {Marker, Callout, Polyline, Polygon} from 'react-native-maps';
import SectionListModule from 'react-native-sectionlist-contacts';

import styles from '../styles/communitymemberlist';
import {connect, useSelector,useDispatch} from 'react-redux';
import {languages} from '../locales/languages';
import {languageChanges} from '../redux/actions/languageActions';
// import Modal from 'react-native-modal';
import NoInternet from '../components/NoInternet';
import {contactUpdateAction} from '../redux/actions/contactListUpdateAction';


import {useApolloClient} from '@apollo/client';
import {
  AuthToken,
  ProfileInfo,
  CommunityId,
  COMM_ITEM,
} from '../../src/constants/config';
import {
  community_memberContact_list,
  add_to_contact,
  bulk_import_contact,
  logout
} from '../redux/actions/userAuth';
import {textColor} from '../constants/colors';
import * as showMessage from '../constants/config';
import DelayInput from 'react-native-debounce-input';
import RNRestart from 'react-native-restart';

const CommunityMemberList = props => {
  const isUserLoggedIn = useSelector(state => {
    console.log('userDetails:: ', state.user.userDetails);
    return state.user.userDetails;
  });

  const client = useApolloClient();
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  //  Language Update *********

  const {languageValue} = props;

  //  Dark Mode Update *********
  const {darkModeValue} = props;
  console.log('darkModeValue:::', darkModeValue);

  //**** Font Size Update  ************/
  const {fontSizeValue} = props;
  console.log('fontSizeValue:::', fontSizeValue);

  const {navigation} = props;

  const theme = useColorScheme();
  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    handleCommunityMemberList();
    // wait(2000).then(() => setRefreshing(false));
  }, []);
  const inputRef = createRef();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('alphabetical');
  const [page, setPage] = useState(1);

  const [getMemberList, setGetMemberList] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [role, setRole] = useState('');
  const [commDet, setCommDet] = useState('');
  const [memberId, setMemberId] = useState('');
  const [community_id, setCommunity_id] = useState('');
  const [fanlist, setFanlist] = useState([]);
  const [memlist, setMemlist] = useState([]);
  const [exelist, setExelist] = useState([]);
  const [boalist, setBoalist] = useState([]);

  const [isAddContat, setIsAddContat] = useState(false);
  const [isConnect, setIsConnect] = useState(false);
  const toggleAddContat = () => {
    setIsAddContat(!isAddContat);
  };
  const hideisAddContat = () => setIsAddContat(false);

  const [isConnectBulk, setIsConnectBulk] = useState(false);
  const toggleAddContatBulk = () => {
    setIsConnectBulk(!isConnectBulk);
  };
  const hideisAddContatBulk = () => setIsConnectBulk(false);

  const searchFilterFunction = text => {
    // Check if searched text is not blank
    if (text) {
      // Inserted text is not blank
      // Filter the masterDataSource
      // Update FilteredDataSource
      const newData = getMemberList.filter(function (item) {
        console.log(
          '_____________ search__item*********',
          JSON.stringify(item),
        );
        var namedata = [];
        namedata = item.data;
        console.log('namedata::::::::::', namedata);
        for (let i = 0; i < namedata.length; i++) {
          const itemData = namedata[i]
            ? namedata[i].user.name.toUpperCase()
            : ''.toUpperCase();
          console.log('___________itemData::::::::::', namedata[i].user.name);
          const textData = text.toUpperCase();
          return itemData.indexOf(textData) > -1;
        }
      });
      setFilteredData(newData);
      setSearch(text);
    } else {
      // Inserted text is blank
      // Update FilteredDataSource with masterDataSource
      setFilteredData(getMemberList);
      setSearch(text);
    }
  };
  const [displayMessage, setDisplayMessage] = useState('');

  // const findSearchItem = query => {
  //   console.log('query: ', query);
  //   setFilteredData([]);
  //   if (query) {
  //     // const regex = new RegExp(`${query.trim()}`, 'i');
  //     const regex = query;
  //     console.log('regex: ', regex);
  //     setSearch(query);
  //     handleCommunityMemberList();
  //     // setFilteredData(communityList.filter((searchitem) => searchitem.communityName.search(regex) >= 0));
  //   } else {
  //     // If the query is null then return blank
  //     // setFilteredData(communityList)
  //   }
  // };

  useEffect(() => {
    const timeOutId = setTimeout(() => {
      setGetMemberList(search), 5000;
      handleCommunityMemberList();
    });
    return () => {
      clearTimeout(timeOutId);
    };
  }, [search]);

  useEffect(() => {
    handleCommunityMemberList();
  }, []);

  const handleCommunityMemberList = async () => {
    const isConnected = await NetworkUtils.isNetworkAvailable();
    console.log('getList!!!!');
    setLoading(true);
    let itemval = await AsyncStorage.getItem(CommunityId);
    console.log('*******Comm__id ********', itemval);
    let comm_id = JSON.parse(itemval);
    console.log('Comm__id 122 ', comm_id);

    console.log('**********comm_id??????', comm_id);

    let commval = await AsyncStorage.getItem(COMM_ITEM);
    setCommDet(JSON.parse(commval));
    console.log('******* comm___item', commval);
    let nameWiseFilter = 'alphabetical';
    let isAppPortal = true;
    let accessTokenval = await AsyncStorage.getItem(AuthToken);
    console.log('accessToken', accessTokenval);
    try {
      if (isConnected) {
        await props
          .community_memberContact_list(client, {
            accessTokenval,
            comm_id,
            search,
            isAppPortal
            // nameWiseFilter,
            // role,
          })
          .then(async response => {
            console.log(
              '***********________________communityMemberListRollWise____response log',
              JSON.stringify(response),
            );
            setLoading(false);
            setRefreshing(false);

            if (response.data.communityMemberListRollWise.code === 200) {
              console.log(
                '________________communityMemberListRollWise length >>',
                response.data.communityMemberListRollWise.data.length,
              );
              if (
                response.data.communityMemberListRollWise.data.communities
                  .length > 0
              ) {
                setGetMemberList(
                  response.data.communityMemberListRollWise.data.communities,
                );
                setFilteredData(
                  response.data.communityMemberListRollWise.data.communities,
                );
              } else {
                setGetMemberList([]);
              }
            }

            if(response.data.communityMemberListRollWise.code === 403){
              logoutval()
             
              RNRestart.Restart();
            }
          })
          .catch(err => {
            setLoading(false);
            setRefreshing(false);

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
      setRefreshing(false);
    }
  };

  const handleAddToContact = async memberId => {
    const isConnected = await NetworkUtils.isNetworkAvailable();
    console.log('getList!!!!');

    // let attendeesCount = 0;
    // const totalAttendeesCount_per_head =
    //   numberOfAdults + numberOfChildren + numberOfSenior;
    console.log('member___id!!!!', memberId);

    setLoading(true);
    let isAppPortal = true;
    let accessTokenval = await AsyncStorage.getItem(AuthToken);
    console.log('accessToken', accessTokenval);
    try {
      if (isConnected) {
        await props
          .add_to_contact(client, {
            accessTokenval,
            memberId,
            isAppPortal
          })
          .then(async response => {
            console.log('response log', JSON.stringify(response));
            setLoading(false);

            if (response.data.addToMyContact.code === 200) {
              showMessage.showToast(response.data.addToMyContact.message);
              handleCommunityMemberList();

              dispatch(contactUpdateAction(true));

              // navigation.navigate('Contacts', {
              //   screen: 'MyContacts',
              // });

            } else {
              showMessage.showToast(response.data.addToMyContact.message);
              hideisAddContat();
            }
            if(response.data.addToMyContact.code === 403){
              logoutval()
             
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
      if(response.data.addToMyContact.code === 403){
        logoutval()
       
        RNRestart.Restart();
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

  const handleBulkIMportContact = async community_id => {
    const isConnected = await NetworkUtils.isNetworkAvailable();
    console.log('getList!!!!');

    // let attendeesCount = 0;
    // const totalAttendeesCount_per_head =
    //   numberOfAdults + numberOfChildren + numberOfSenior;
    let itemval = await AsyncStorage.getItem(CommunityId);
    console.log('*******Comm__id ********', itemval);
    let comm_Id = JSON.parse(itemval);
    console.log('Comm__id 122 ', comm_Id);
    setCommunity_id(comm_Id);

    console.log('**********comm_id??????', comm_Id);
    setLoading(true);

    let accessTokenval = await AsyncStorage.getItem(AuthToken);
    console.log('accessToken', accessTokenval);
    try {
      if (isConnected) {
        await props
          .bulk_import_contact(client, {
            accessTokenval,
            comm_Id,
          })
          .then(async response => {
            console.log('response log', JSON.stringify(response));
            setLoading(false);
           
            if (response.data.bulkContactImport.code === 200) {
              showMessage.showToast(response.data.bulkContactImport.message);

              dispatch(contactUpdateAction(true));

              navigation.navigate('Contacts', {
                screen: 'MyContacts',
              });
              handleCommunityMemberList();
            } else {
              showMessage.showToast(response.data.bulkContactImport.message);
              hideisAddContatBulk();
            }

            if(response.data.bulkContactImport.code === 403){
              logoutval()
             
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
    // }
    // else {
    //   showMessage.showToast(
    //     'Total Package count and per head count must be same',
    //   );
    // }
  };
  const [isConnected, setIsConnected] = useState(false);
  const [selectedValue, setSelectedvalue] = useState([]);

  const logoutval = async () => {
    const isConnected = await NetworkUtils.isNetworkAvailable();
    console.log('out !!!!!');
    setLoading(true);
    let accessTokenval2 = await AsyncStorage.getItem(AuthToken);
    console.log('accessToken', accessTokenval2);

    try {
      if(isConnected){

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
      }
      else{
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
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : ''}
          style={{flex: 1}}>
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
              <View style={styles.appBar}>
                <TouchableOpacity
                  onPress={() => navigation.navigate('Contacts')}>
                  <Image
                    style={styles.arrowleft}
                    source={require('../assets/images/arrowleft.png')}
                  />
                </TouchableOpacity>
                <View style={styles.appBarTextView}>
                  <Text style={styles.appText}>{commDet}</Text>
                </View>
              </View>
              <View style={styles.searchFilterCont}>
                <View style={styles.searchCont}>
                  {/* <TextInput
                    placeholder="Search member by name"
                    placeholderTextColor="#6E6E6E"
                    style={styles.searchInput}
                    // onChangeText={text => {
                    //   setSearch(text);
                    //   if (text.length > 2 ){
                       
                    //     findSearchItem(text);
                    //   }
                     
                    // }}
                    onChangeText={text => {
                      setSearch(text);
                      // searchFilterFunction(text);
                      console.log(
                        '************** type letter',
                        text + '----' + search,
                      );
                    }}
                    value={search}
                  /> */}

                  <DelayInput
                    placeholder={languages[languageValue].Searchmemberbyname}
                    placeholderTextColor="#6E6E6E"
                    style={styles.searchInput}
                    value={search}
                    inputRef={inputRef}
                    onChangeText={text => {
                      setSearch(text);
                      // setSelectedvalue(text);
                      searchFilterFunction(text);
                    }}
                    delayTimeout={1000}
                  />

                  <TouchableOpacity style={styles.pressSearchStyle}>
                    <Image
                      style={styles.searchImg}
                      source={require('../assets/images/searchicon.png')}
                    />
                  </TouchableOpacity>
                </View>

                <TouchableOpacity
                  onPress={() => {
                    toggleAddContatBulk();
                  }}
                  style={styles.eventTypeCont}>
                  <LinearGradient
                    colors={['#06C0BA', '#06C0BA', '#008C88']}
                    style={styles.menuStyle}>
                    <Image
                      style={styles.menuImg}
                      source={require('../assets/images/arrow-down_1.png')}
                    />
                  </LinearGradient>

                  <Modal
                    animationIn="swing"
                    animationOut="zoomOut"
                    style={styles.recurringModalView}
                    isVisible={isConnectBulk}
                    onDismiss={hideisAddContat}
                    backdropOpacity={0.5}
                    onBackdropPress={toggleAddContatBulk}>
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
                          {languages[languageValue].Areyousuretoaddallthemembersofthiscommunityinyourcontactlist}?
                          </Text>
                        </View>
                        <Text style={styles.modDesTxt}>
                        {languages[languageValue].YouwillseethismembertoyourMyContactlist}
                        </Text>
                        {/* <Text>
                                    {' '}
                                    {memberId} **** {isConnect}{' '}
                                  </Text> */}
                        <Text style={styles.modDesTxt}>
                          {/* {removeTags(blogDescription)} */}
                        </Text>
                      </View>
                      <View style={styles.amntView}>
                        <View style={styles.evntModalDetailsCont}></View>

                        <TouchableOpacity
                          onPress={() => {
                            handleBulkIMportContact(community_id);
                            console.log('********comm_Id', community_id);
                            hideisAddContatBulk();

                          }}
                          style={styles.confirmPress}>
                          <Text style={styles.confirmPressText}>
                          {languages[languageValue].Yesaddtocontact}
                          </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                          onPress={hideisAddContatBulk}
                          style={styles.confirmPress2}>
                          <Text style={styles.confirmPressText}>{languages[languageValue].cancel}</Text>
                        </TouchableOpacity>
                      </View>
                    </LinearGradient>
                  </Modal>
                </TouchableOpacity>
              </View>
              {/* <ScrollView
            style={{bottom: 0}}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }> */}
              <View style={styles.body}>
                <LinearGradient
                  colors={['#FFFFFF', '#FFFFFF', '#FFFFFF', '#FFFFFF']}
                  style={styles.mainBox}>
                  <ScrollView
                    style={{bottom: 0}}
                    refreshControl={
                      <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                      />
                    }>
                    {filteredData.length > 0 ? (
                      <SectionList
                        sections={filteredData}
                        keyExtractor={(item, index) => item + index}
                        renderItem={({item}) => (
                          <View style={styles.subMainBox}>
                            <TouchableOpacity
                              onPress={() => {
                                setIsConnect(item.isContact);
                                setMemberId(item.user.id);
                              }}>
                              <LinearGradient
                                colors={[
                                  '#FFFFFF',
                                  '#FFFFFF',
                                  '#FFFFFF',
                                  '#FFFFFF',
                                ]}
                                style={styles.contentBox}>
                                {item.user.profileImage === null ||
                                item.user.profileImage === '' ? (
                                  <Image
                                    style={styles.commImg}
                                    source={require('../assets/images/noimg.png')}
                                  />
                                ) : (
                                  <Image
                                    style={styles.commImg}
                                    source={{uri: item.user.profileImage}}
                                  />
                                )}
                                <View style={styles.textView}>
                                  <Text style={styles.contentBoxText}>
                                    {item.user.name}
                                  </Text>
                                  <Text style={styles.descriptionText}>
                                    {item.user.email}
                                  </Text>

                                  <Text style={styles.descriptionText2}>
                                    {item.user.phoneCode} {item.user.phone}
                                  </Text>
                                  <Text style={styles.contactTxt}></Text>
                                </View>
                                {isUserLoggedIn.id === item.user.id ? (
                                  <View style={styles.arrowView2}>
                                    <Text style={styles.contactTxt2}>You</Text>
                                  </View>
                                ) : (
                                  <View>
                                    {item.user.isContact === false ? (
                                      <TouchableOpacity
                                        onPress={() => {
                                          setMemberId(item.user.id);

                                          console.log(
                                            '****connect ****>>>>',
                                            isConnect,
                                          );

                                          toggleAddContat(memberId, isConnect);
                                        }}
                                        style={styles.arrowView}>
                                        <Image
                                          style={styles.rightarrow}
                                          source={require('../assets/images/arrow-down.png')}
                                        />
                                      </TouchableOpacity>
                                    ) : (
                                      <View>
                                        <Image
                                          style={styles.tickadded}
                                          source={require('../assets/images/tickadded.png')}
                                        />
                                      </View>
                                    )}
                                  </View>
                                )}

                                <Modal
                                  animationIn="swing"
                                  animationOut="zoomOut"
                                  style={styles.recurringModalView}
                                  isVisible={isAddContat}
                                  onDismiss={hideisAddContat}
                                  backdropOpacity={0.5}
                                  onBackdropPress={toggleAddContat}>
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
                                        {languages[languageValue].Areyousuretoaddthismembertoyourcontactlist}?
?
                                        </Text>
                                      </View>
                                      <Text style={styles.modDesTxt}>
                                      {languages[languageValue].YouwillseethismembertoyourMyContactlist}
                                      </Text>

                                      <Text style={styles.modDesTxt}></Text>
                                    </View>
                                    <View style={styles.amntView}>
                                      <View
                                        style={
                                          styles.evntModalDetailsCont
                                        }></View>

                                      <TouchableOpacity
                                        onPress={() => {
                                          handleAddToContact(memberId);
                                          console.log(
                                            '*********mem__id',
                                            memberId,
                                          );
                                          
                                          hideisAddContat();

                                        }}
                                        style={styles.confirmPress}>
                                        <Text style={styles.confirmPressText}>
                                        {languages[languageValue].Yesaddtocontact}
                                        </Text>
                                      </TouchableOpacity>

                                      <TouchableOpacity
                                        onPress={hideisAddContat}
                                        style={styles.confirmPress2}>
                                        <Text style={styles.confirmPressText}>
                                        {languages[languageValue].cancel}
                                        </Text>
                                      </TouchableOpacity>
                                    </View>
                                  </LinearGradient>
                                </Modal>
                              </LinearGradient>
                            </TouchableOpacity>
                          </View>
                        )}
                        renderSectionHeader={({section: {title}}) => (
                          <View style={styles.subMainBox}>
                            {title == 'board_member' && title !== null && (
                              <Text style={styles.header}>Board Members</Text>
                            )}

                            {title == 'executive_member' && title !== null && (
                              <Text style={styles.header}>
                                Executive Members
                              </Text>
                            )}
                            {title == 'member' && title !== null && (
                              <Text style={styles.header}>Member</Text>
                            )}
                            {title == 'fan' && title !== null && (
                              <Text style={styles.header}>Fan</Text>
                            )}
                          </View>
                        )}
                      />
                    ) : (
                      <View
                        style={{
                          justifyContent: 'center',
                          alignItems: 'center',
                          //marginTop: 20,
                        }}>
                        <Text style={styles.text5}>
                        {languages[languageValue].Thiscommunityhasnomemberyet}!
                        </Text>
                      </View>
                    )}
                  </ScrollView>
                </LinearGradient>
              </View>
              {/* </ScrollView> */}
            </ImageBackground>
          </SafeAreaView>
        </KeyboardAvoidingView>
      ) : (
        <NoInternet isConnected={isConnected} setIsConnected={setIsConnected} />
      )}
    </>
  );
};
const mapStateToProps = ({dark, font, language}) => {
  console.log('language ' + language.currentlanguage);
  return {
    darkModeValue: dark.darkMode,
    fontSizeValue: font.fontSize,
    languageValue: language.currentlanguage,
  };
};

const mapDispatchToProps = dispatch => ({
  languageChanges: inputs => dispatch(languageChanges(inputs)),

  community_memberContact_list: (client, inputs) =>
    dispatch(community_memberContact_list(client, inputs)),
  add_to_contact: (client, inputs) => dispatch(add_to_contact(client, inputs)),
  bulk_import_contact: (client, inputs) =>
    dispatch(bulk_import_contact(client, inputs)),

  contactUpdateAction: inputs =>
    dispatch(contactUpdateAction(inputs)),

  logout: (client, inputs) => dispatch(logout(client, inputs)),
});
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(CommunityMemberList);
