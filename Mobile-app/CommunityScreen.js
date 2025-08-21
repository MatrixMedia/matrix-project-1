import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  Image,
  Button,
  FlatList,
  Alert,
  Modal,
} from 'react-native';

import {useApolloClient} from '@apollo/client';
import styles from '../styles/communitylisting';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {Col, Row, Grid} from 'react-native-easy-grid';
import Spinner from 'react-native-loading-spinner-overlay';

const CommunityScreen = props => {
  const client = useApolloClient();
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    console.log('kkk', props.userCart);
  }, []);

  return (
    <View style={styles.container}>
      <Spinner
        visible={loading}
        textContent={''}
        textStyle={styles.spinnerTextStyle}
      />
      <Modal
        animationIn="swing"
        animationOut="zoomOut"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
        }}></Modal>
      <ScrollView style={styles.scrollView}></ScrollView>
    </View>
  );
};

export default CommunityScreen;
