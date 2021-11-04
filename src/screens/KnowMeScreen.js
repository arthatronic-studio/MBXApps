import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, Image, SafeAreaView } from 'react-native';
import { CommonActions, useIsFocused } from '@react-navigation/native';
import { Tabs, Tab, TabHeading } from 'native-base';
import Styled from 'styled-components';
import { useSelector, useDispatch } from 'react-redux';

import {
  Submit,
  // Text,
  Popup, usePopup,
  Loading,
  HeaderBig,
  useColor
} from '@src/components';
import Text from '@src/components/Text';

import { guestLogin } from '@src/state/actions/user/auth';

const MainView = Styled(View)`
  flex: 1;
  alignItems: center;
  justifyContent: flex-end;
  paddingBottom: 130px;
`;

const AbsoluteBottomView = Styled(View)`
  width: 100%;
  bottom: 26px;
  position: absolute;
`;

const NavgationFooterView = Styled(View)`
  alignItems: center;
  flexDirection: row;
  justifyContent: space-between;
`;

const WarpperNavigationBottom = Styled(View)`
  flex: 1;
  flexDirection: row;
  justifyContent: center;
`;

const NavigationTextWarpperView = Styled(View)`
  justifyContent: center;
  width: 100%;
  alignItems: flex-start;
  paddingHorizontal: 16px;
`;

const NavigationTextWarpperCaption = Styled(Text)`
  fontSize: 27px;
  fontFamily: Raleway-Bold;
  paddingBottom: 6px;
  textAlign: left;
  lineHeight: 40px;
`;

const NavigationTextWarpperDescription = Styled(Text)`
  fontSize: 12px;
  textAlign: left;
  opacity: 0.6;
`;

const DotIndicator = Styled(View)`
  height: 6px;
  width: 6px;
  borderRadius: 3px;
  marginHorizontal: 5px;
  backgroundColor: ${props => props.backgroundColor};
`;

const sliderData = [
  { title: 'Tribes Community', subTitle: 'Tribes Community adalah adalah adalah adalah adalah adalah adalah adalah' },
  { title: 'Tribes Community', subTitle: 'Tribes Community adalah adalah adalah adalah adalah adalah adalah adalah' },
  { title: 'Tribes Community', subTitle: 'Tribes Community adalah adalah adalah adalah adalah adalah adalah' },
  { title: 'Tribes Community', subTitle: 'Tribes Community adalah adalah adalah adalah adalah adalah adalah adalah' },
];

const KnowMeScreen = ({ navigation, route }) => {
  const [tabPage, setTabPage] = useState(0);

  const [popupProps, showPopup] = usePopup();
  const { Color } = useColor();

  const user = useSelector(state => state['user.auth'].login.user);
  const { loading, error } = useSelector(state => state['user.auth']);

  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  
  useEffect(() => {
    if (isFocused) {
      if (error) {
        showPopup(error || 'Server Kami Sedang Maintenance', 'error');
        dispatch({ type: 'USER.LOGOUT' });
      }
      else if (user) {
        redirectTo('MainPage');
      }
    }
  }, [user, error, isFocused]);

  const redirectTo = (nav) => {
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [
          { name: nav }
        ],
      })
    );
  }

  const renderNavigationFooter = () => {
    return (
      <AbsoluteBottomView>
        <NavgationFooterView>
          <WarpperNavigationBottom>
            {sliderData.map((_, idx) =>
              <TouchableOpacity
                key={idx}
                onPress={() => setTabPage(idx)}
              >
                <DotIndicator
                  backgroundColor={tabPage === idx ? Color.primary : Color.primarySoft}
                />
              </TouchableOpacity>
            )}
          </WarpperNavigationBottom>
        </NavgationFooterView>

        <Submit
          buttonLabel='Mulai'
          buttonColor={Color.primary}
          type='bottomSingleButton'
          buttonBorderTopWidth={0}
          onPress={() => {
            // dispatch(guestLogin());
            redirectTo('LoginScreen');
          }}
          style={{backgroundColor: 'transparent'}}
        />
      </AbsoluteBottomView>
    );
  }

  const renderTabContent = () => {
    return (
      <Tabs
        page={tabPage}
        prerenderingSiblingsNumber={Infinity}
        tabContainerStyle={{elevation: 0, height: 0, backgroundColor: Color.theme}}
        tabBarUnderlineStyle={{backgroundColor: Color.theme, height: 0}}
        tabBarPosition='bottom'
        onChangeTab={({i}) => setTabPage(i)}
      >
        {sliderData.map((item, idx) =>
          <Tab key={idx} heading={<TabHeading style={{backgroundColor: Color.theme}} />}>
            {/* <Image
              style={{width: '100%', height: '100%', position: 'absolute', backgroundColor: '#000000'}}
              source={{uri: 'http://maudikenal.com:7070/assets/images-maudi/MAUDIKENAL.jpg'}}
              resizeMode='cover'
            /> */}
            <MainView style={{backgroundColor: Color.theme}}>
              <NavigationTextWarpperView>
                <NavigationTextWarpperCaption>{item.title}</NavigationTextWarpperCaption>
                <NavigationTextWarpperDescription>{item.subTitle}</NavigationTextWarpperDescription>
              </NavigationTextWarpperView>
            </MainView>
          </Tab>
        )}
      </Tabs>
    );
  }

  if (user) {
    return (
      <SafeAreaView style={{flex: 1, backgroundColor: Color.theme}}>
        <Loading visible />
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: Color.theme}}>
      <HeaderBig
        // titleRight='Masuk'
        // onPressRightButton={() => navigation.navigate('LoginScreen')}
        style={{backgroundColor: 'transparent', paddingTop: 16}}
      />

      {renderTabContent()}

      {renderNavigationFooter()}

      <Loading visible={loading} />

      <Popup {...popupProps} />

    </SafeAreaView>
  );
}

export default KnowMeScreen;
