import React, { useState, useEffect, useRef } from 'react';
import { View } from 'react-native';
import Styled from 'styled-components';

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

const MainComponent = Styled(View)`
    flex: 1;
`;

const defaultProps = {
};

const Component = (props) => {
    const [state, setState] = useState();

    const ref = useRef();

    useEffect(() => {

    }, []);

    return (
        <MainComponent>
        </MainComponent>
    )
}

Component.defaultProps = defaultProps;

export default Component;