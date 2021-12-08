import React from 'react';
import { View } from 'react-native'
import Styled from 'styled-components';

const Container = Styled(View)`
    flexDirection: row;
    flexWrap: wrap;
`

const Row = (props) => {
    return (
        <Container>
            {props.children}
        </Container>
    )
}

export default Row;