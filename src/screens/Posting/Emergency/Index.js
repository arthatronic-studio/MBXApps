import React from 'react';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useSelector } from 'react-redux';
import Config from 'react-native-config';

import {
    useLoading,
    usePopup,
    useColor,
    Header,
    Row
} from '@src/components';
import Scaffold from '@src/components/Scaffold';
import ListContentProduct from 'src/components/Content/ListContentProduct';
import { accessClient } from 'src/utils/access_client';
import { useIsFocused } from '@react-navigation/native';
import { useCurrentUser } from 'src/hooks/useCanGenerateContent';

const EmergencyScreen = ({ navigation, route }) => {
    const { title, userProfileId } = route.params;

    const user = useSelector(
      state => state['user.auth'].login.user
    );
    const [popupProps, showPopup] = usePopup();
    const [loadingProps, showLoading, hideLoading] = useLoading();
    const { Color } = useColor();
    const isFocused = useIsFocused();
    const {canGeneratedContent} = useCurrentUser();

    return (
        <Scaffold
          header={
            <Header
              title={title}
                actions={
                  canGeneratedContent && <Row justify='center' align='center'>
                    {/* <Ionicons
                      name='search'
                      color={Color.primary}
                      size={22}
                      onPress={() => navigation.navigate('MainSearch')}
                    />
                    <Divider /> */}
                    <MaterialIcons
                      name='add'
                      color={Color.primary}
                      size={26}
                      onPress={() => {
                        const isJoinMember = user && user.organizationId;;
                        if (!isJoinMember) {
                          showLoading('error', 'Fitur ini hanya untuk anggota komunitas');
                          return;
                        }

                        navigation.navigate('CreateThreadScreen', {
                          title,
                          productType: Config.PRODUCT_TYPE,
                          productCategory: '',
                          productSubCategory: 'EMERGENCY',
                        });
                      }}
                    />
                  </Row>
                }
              />
            }
            popupProps={popupProps}
            loadingProps={loadingProps}
        >
          {isFocused && <ListContentProduct
            userProfileId={userProfileId}
            productCategory='EMERGENCY'
            name='Help Me'
          />}
        </Scaffold>
    )
}

export default EmergencyScreen;