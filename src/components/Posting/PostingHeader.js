import React from 'react';
import { View, Image } from 'react-native';
import PropTypes from 'prop-types';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Entypo from 'react-native-vector-icons/Entypo';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {
    Text,
    TouchableOpacity,
    Loading,
    useLoading,
    useColor,
} from '@src/components';
import { useNavigation } from '@react-navigation/core';
import { Container, Row } from 'src/styled';
import { imageContent } from '@assets/images/content';

const propTypes = {
    productCategory: PropTypes.string.isRequired,
    title: PropTypes.string,
    iconType: PropTypes.string,
    iconName: PropTypes.string,
    onSeeAllPress: PropTypes.func,
    showSeeAllText: PropTypes.bool,
    style: PropTypes.object,
};

const defaultProps = {
    productCategory: 'ALL',
    title: '',
    onSeeAllPress: () => {},
    showSeeAllText: true,
    style: {},
    iconType: null,
    iconName: null,
};

const PostingHeader = (props) => {
    const {
        productCategory,
        title,
        onSeeAllPress,
        showSeeAllText,
        style,
        iconType,
        iconName
    } = props;

    const {Color} = useColor();

    const getIconMenu = (iconType, iconName) => {
        switch(iconType) {
            case 'MaterialIcons':
                return <MaterialIcons name={iconName} size={32} style={{marginRight: 10}}/>
            case 'AntDesign':
                return <AntDesign name={iconName} size={28} style={{marginRight: 10}}/>
            case 'Ionicons': 
                return <Ionicons name={iconName} size={28} style={{marginRight: 10}}/>
            case 'Entypo':
                return <Entypo name={iconName} size={30} style={{marginRight: 10}}/>
            case 'MaterialCommunityIcons':
                return <MaterialCommunityIcons name={iconName} size={30} style={{marginRight: 10}}/>
        }
    }
    
    const validImage = productCategory && imageContent[productCategory];
    
    return (
        <Container
            width='100%'
            align='center'
            justify='space-between'
            style={{
                flexDirection: 'row',
                paddingHorizontal: 16,
                ...style,
            }}
        >
            <Row>
                {iconType && iconName && getIconMenu(iconType, iconName)}

                {/* {validImage && <View style={{ width: 24, aspectRatio: 1, marginRight: 8 }}>
                    <Image
                        source={imageContent[productCategory].ic_header}
                        style={{
                            width: '100%',
                            height: '100%',
                        }}
                    />
                </View>} */}

                <Text type="bold" align='left' size={16}>{title}</Text>
            </Row>
            {showSeeAllText && <Text
                onPress={() => onSeeAllPress()}
                size={12}
                color={Color.primaryDark}
            >
                Selengkapnya{' '}
                <Ionicons name="arrow-forward" size={12} color={Color.primaryDark} />
            </Text>}
        </Container>
    )
}

PostingHeader.propTypes = propTypes;
PostingHeader.defaultProps = defaultProps;
export default PostingHeader;