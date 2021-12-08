import React from 'react';
import { View } from 'react-native'
import Styled from 'styled-components';

const Container = Styled(View)`
    padding: 16px;
`;

const Grid = (props) => {
    return (
        <Container>
            {props.children}
        </Container>
    )
}

export default Grid;