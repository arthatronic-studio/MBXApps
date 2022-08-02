import React from 'react';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useSelector } from 'react-redux';
import Config from 'react-native-config';

import {
    useColor,
    Header,
} from '@src/components';
import Scaffold from '@src/components/Scaffold';
import { Container, Divider, Row } from 'src/styled';
import ListContentProduct from 'src/components/Content/ListContentProduct';
import { accessClient } from 'src/utils/access_client';
import { useIsFocused } from '@react-navigation/native';
import HighlightContentProductV2 from 'src/components/Content/HighlightContentProductV2';
import moment from 'moment';
import { ScrollView } from 'react-native';

const ContentProductSaveScreen = ({ navigation, route }) => {
    const { title, userProfileId } = route.params;
    const isMainScreen =  route.params && route.params.routeIndex;

    const user = useSelector(
      state => state['user.auth'].login.user
    );
    const { Color } = useColor();
    const isFocused = useIsFocused();

    let canGeneratedContent = accessClient.UserGeneratedContent === 'ALL_USER';
    if (accessClient.UserGeneratedContent === 'ONLY_ADMIN' && user && user.isDirector === 1) canGeneratedContent = true;
    else if (accessClient.UserGeneratedContent === 'ONLY_MEMBER' && user && user.organizationId) canGeneratedContent = true;
    
    return (
        <Scaffold
            header={
              <Header
                title={title}
                showLeftButton={!isMainScreen}
                // actions={
                //   canGeneratedContent && <Row justify='center' align='center'>
                //     <Ionicons
                //       name='search'
                //       color={Color.primary}
                //       size={22}
                //       onPress={() => navigation.navigate('MainSearch')}
                //     />
                //   </Row>
                // }
              />
            }
        >
          <ScrollView>
            {isFocused && <HighlightContentProductV2
              userProfileId={userProfileId}
              productCategory='EMERGENCY'
              name="Help Me"
              saved
              title='HelpMe'
              showEmpty
              timeStart={moment().subtract(7,'d').format('YYYY-MM-DD')}
            />}

            {isFocused && <HighlightContentProductV2
              userProfileId={userProfileId}
              productCategory='FORUM'
              name='Forum'
              saved
              title='Forum'
              showEmpty
              timeStart={moment().subtract(7,'d').format('YYYY-MM-DD')}
            />}

            {isFocused && <HighlightContentProductV2
              userProfileId={userProfileId}
              productCategory='POSTING'
              name='Artikel'
              saved
              title='Artikel'
              showEmpty
              timeStart={moment().subtract(7,'d').format('YYYY-MM-DD')}
            />}

            {isFocused && <HighlightContentProductV2
              userProfileId={userProfileId}
              productCategory='EVENT'
              name='Event'
              saved
              title='Event'
              showEmpty
              timeStart={moment().subtract(7,'d').format('YYYY-MM-DD')}
            />}

            {isFocused && <HighlightContentProductV2
              userProfileId={userProfileId}
              productCategory='JOBS'
              name='Loker'
              saved
              title='Loker'
              showEmpty
              timeStart={moment().subtract(7,'d').format('YYYY-MM-DD')}
            />}

            {isFocused && <HighlightContentProductV2
              userProfileId={userProfileId}
              productCategory='NEARBY_PLACE'
              name='Tempat'
              saved
              title='Tempat Terdekat'
              showEmpty
              timeStart={moment().subtract(7,'d').format('YYYY-MM-DD')}
            />}
          </ScrollView>
        </Scaffold>
    )
}

export default ContentProductSaveScreen;