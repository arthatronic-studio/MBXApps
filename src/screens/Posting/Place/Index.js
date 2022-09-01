import React from 'react';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useSelector } from 'react-redux';
import Config from 'react-native-config';

import {
    useColor,
    Header,
} from '@src/components';
import Scaffold from '@src/components/Scaffold';
import { Row } from 'src/styled';
import ListContentProduct from 'src/components/Content/ListContentProduct';
import { accessClient } from 'src/utils/access_client';
import { useIsFocused } from '@react-navigation/native';
import { useCurrentUser } from 'src/hooks/useCanGenerateContent';

const PlaceScreen = ({ navigation, route }) => {
    const { title, userProfileId } = route.params;
    const isMainScreen =  route.params && route.params.routeIndex;

    const user = useSelector(
      state => state['user.auth'].login.user
    );
    const { Color } = useColor();
    const isFocused = useIsFocused();
    const {canGeneratedContent} = useCurrentUser();
    
    return (
        <Scaffold
            header={
              <Header
                title={title}
                showLeftButton={!isMainScreen}
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
                      onPress={() => navigation.navigate('CreateThreadScreen', {
                        title,
                        productType: Config.PRODUCT_TYPE,
                        productCategory: '',
                        productSubCategory: 'NEARBY_PLACE',
                      })}
                    />
                  </Row>
                }
              />
            }
        >
          {isFocused && <ListContentProduct
            userProfileId={userProfileId}
            productCategory='NEARBY_PLACE'
            name='Tempat'
          />}
        </Scaffold>
    )
}

export default PlaceScreen;