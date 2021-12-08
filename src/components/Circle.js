import React from 'react';
import { View } from 'react-native';
import PropTypes from 'prop-types';
import Styled from 'styled-components';

const propTypes = {
    children: PropTypes.node,
    size: PropTypes.number,
    color: PropTypes.string,
    style: PropTypes.object,
};

const defaultProps = {
    size: 0,
    color: 'red',
    style: {},
};

const Container = Styled(View)`
    height: ${props => props.size};
    width: ${props => props.size};
    borderRadius: ${props => props.size / 2};
    backgroundColor: ${props => props.color};
`;

const Circle = (props) => {
    const {
        children,
        size,
        color,
        style,
    } = props;

    return (
        <Container
            size={size}
            color={color}
            style={style}
        >
            {children}
        </Container>
    )
};

Circle.propTypes = propTypes;
Circle.defaultProps = defaultProps;

export default Circle;