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

const VideoScreen = ({ navigation, route }) => {
    const { title, userProfileId } = route.params;

    const user = useSelector(
      state => state['user.auth'].login.user
    );
    const [popupProps, showPopup] = usePopup();
    const [loadingProps, showLoading, hideLoading] = useLoading();
    const { Color } = useColor();

    return (
        <Scaffold
          header={
            <Header
              title={title}
                actions={
                  <Row justify='center' align='center'>
                    {/* <Ionicons
                      name='search'
                      color={Color.primary}
                      size={22}
                      onPress={() => navigation.navigate('MainSearch')}
                    />
                    <Divider /> */}
                    {/* <MaterialIcons
                      name='add'
                      color={Color.primary}
                      size={26}
                      onPress={() => {
                        const isJoinMember = user && user.organizationId;
                        if (!isJoinMember) {
                          showLoading('error', 'Fitur ini hanya untuk anggota komunitas');
                          return;
                        }

                        navigation.navigate('CreateThreadScreen', {
                          title,
                          productType: Config.PRODUCT_TYPE,
                          productCategory: '',
                          productSubCategory: 'YOUTUBE_VIDEO',
                        });
                      }}
                    /> */}
                  </Row>
                }
              />
            }
            popupProps={popupProps}
            loadingProps={loadingProps}
        >
          <ListContentProduct
            userProfileId={userProfileId}
            productCategory='NEWEST_VIDEO'
            name='Video Terbaru'
            style={{paddingHorizontal: 0}}
          />
        </Scaffold>
    )
}

export default VideoScreen;