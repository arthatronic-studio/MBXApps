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

const PlaceScreen = ({ navigation, route }) => {
    const { title, userProfileId } = route.params;

    const user = useSelector(
      state => state['user.auth'].login.user
    );
    const { Color } = useColor();

    let canGeneratedContent = accessClient.UserGeneratedContent === 'ALL_USER';
    if (accessClient.UserGeneratedContent === 'ONLY_ADMIN' && user && user.isDirector === 1) canGeneratedContent = true;
    else if (accessClient.UserGeneratedContent === 'ONLY_MEMBER' && user && user.organizationId) canGeneratedContent = true;
    
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
          <ListContentProduct
            userProfileId={userProfileId}
            productCategory='NEARBY_PLACE'
            name='Tempat'
          />
        </Scaffold>
    )
}

export default PlaceScreen;