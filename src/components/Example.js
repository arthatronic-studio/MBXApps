import React, { useState, useEffect, useRef } from 'react';
import { View } from 'react-native';

import {
    Alert,
    AlertModal,
    Button,
    Grid, Row, Col,
    Header,
    HeaderBig,
    Loading, useLoading,
    ModalListAction,
    Popup, usePopup,
    ScreenEmptyData,
    ScreenIndicator,
    ListSlider,
    Submit,
    Text,
    TouchableOpacity,
    useColor
} from '@src/components';

const defaultProps = {
};

const Component = (props) => {
    const [state, setState] = useState();

    const ref = useRef();

    useEffect(() => {

    }, []);

    return (
        <View>

        </View>
    )
}

Component.defaultProps = defaultProps;
export default Component;