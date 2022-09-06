import React from 'react';
import { View, Platform, SafeAreaView } from 'react-native';
import PropTypes from 'prop-types';
import Styled from 'styled-components';

const MainView = Styled(SafeAreaView)`
    flex: 1;
`;

// ==================== Container ====================
const Container = (props) => (
    <View
        {...props}
        style={[
            props.flex && { flex: props.flex },
            props.height && { height: props.height },
            props.width && { width: props.width },
            props.radius && { borderRadius: props.radius },
            props.borderWidth && { borderWidth: props.borderWidth },
            props.borderColor && { borderColor: props.borderColor },
            props.color && { backgroundColor: props.color },
            props.align && { alignItems: props.align },
            props.justify && { justifyContent: props.justify },
            props.opacity && { opacity: props.opacity },
            props.padding && { padding: props.padding },
            props.paddingVertical && { paddingVertical: props.paddingVertical },
            props.paddingHorizontal && { paddingHorizontal: props.paddingHorizontal },
            props.paddingTop && { paddingTop: props.paddingTop },
            props.paddingRight && { paddingRight: props.paddingRight },
            props.paddingBottom && { paddingBottom: props.paddingBottom },
            props.paddingLeft && { paddingLeft: props.paddingLeft },
            props.margin && { margin: props.margin },
            props.marginVertical && { marginVertical: props.marginVertical },
            props.marginHorizontal && { marginHorizontal: props.marginHorizontal },
            props.marginTop && { marginTop: props.marginTop },
            props.marginRight && { marginRight: props.marginRight },
            props.marginBottom && { marginBottom: props.marginBottom },
            props.marginLeft && { marginLeft: props.marginLeft },
            props.style && { ...props.style },
        ]}
    />
)
Container.propTypes = {
    flex: PropTypes.number,
    height: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    radius: PropTypes.number,
    borderWidth: PropTypes.number,
    borderColor: PropTypes.string,
    color: PropTypes.string,
    align: PropTypes.string,
    justify: PropTypes.string,
    opacity: PropTypes.number,
    style: PropTypes.object,
    padding: PropTypes.number,
    paddingVertical: PropTypes.number,
    paddingHorizontal: PropTypes.number,
    paddingTop: PropTypes.number,
    paddingRight: PropTypes.number,
    paddingBottom: PropTypes.number,
    paddingLeft: PropTypes.number,
    margin: PropTypes.number,
    marginVertical: PropTypes.number,
    marginHorizontal: PropTypes.number,
    marginTop: PropTypes.number,
    marginRight: PropTypes.number,
    marginBottom: PropTypes.number,
    marginLeft: PropTypes.number,
};

// ==================== Shadow ====================
const Shadow = Platform.OS === 'ios' ?
    Styled(View)`
        shadowOpacity: 0.2;
        shadowRadius: 1px;
        shadowColor: #000000;
        shadowOffset: 0px 1px;
    `
    : Styled(View)`
        elevation: 2;
    `
;

// ==================== Card ====================
const StyledCard = Styled(Shadow)`
    backgroundColor: ${props => props.color || '#FFFFFF'};
    borderRadius: ${props => typeof props.radius === 'string' ? props.radius : props.radius ? props.radius + 'px' : '0px'};
    padding: ${props => `${props.padding || props.paddingVertical || props.paddingTop || 0}px ${props.padding || props.paddingHorizontal || props.paddingRight || 0}px ${props.padding || props.paddingVertical || props.paddingBottom || 0}px ${props.padding || props.paddingHorizontal || props.paddingLeft || 0}px`};
    margin: ${props => `${props.margin || props.marginVertical || props.marginTop || 0}px ${props.margin || props.marginHorizontal || props.marginRight || 0}px ${props.margin || props.marginVertical || props.marginBottom || 0}px ${props.margin || props.marginHorizontal || props.marginLeft || 0}px`};
`;
const Card = (props) => <StyledCard {...props} />;
Card.propTypes = {
    color: PropTypes.string,
    radius: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    padding: PropTypes.number,
    paddingVertical: PropTypes.number,
    paddingHorizontal: PropTypes.number,
    paddingTop: PropTypes.number,
    paddingRight: PropTypes.number,
    paddingBottom: PropTypes.number,
    paddingLeft: PropTypes.number,
    margin: PropTypes.number,
    marginVertical: PropTypes.number,
    marginHorizontal: PropTypes.number,
    marginTop: PropTypes.number,
    marginRight: PropTypes.number,
    marginBottom: PropTypes.number,
    marginLeft: PropTypes.number,
};

// ==================== Divider ====================
const StyledDivider = Styled(View)`
    height: ${props => props.height || 16}px;
    width: ${props => props.width || 16}px;
`;
const Divider = (props) => <StyledDivider {...props} />;
Divider.propTypes = {
    height: PropTypes.number,
    width: PropTypes.number,
};

// ==================== Padding ====================
const SPadding = Styled(View)`
    backgroundColor: ${props => props.color};
    borderRadius: ${props => props.radius}px;
    paddingTop: ${props => `${props.t}px`};
    paddingRight: ${props => `${props.r}px`};
    paddingBottom: ${props => `${props.b}px`};
    paddingLeft: ${props => `${props.l}px`};
`;
const Padding = (props) => {
    return (
        <SPadding
            color={props.color || 'transparent'}
            radius={props.radius || 0}
            t={props.top || props.padding || props.vertical || 0}
            r={props.right || props.padding || props.horizontal || 0}
            b={props.bottom || props.padding || props.vertical || 0}
            l={props.left || props.padding || props.horizontal || 0}
            {...props.style}
        >
            {props.children}
        </SPadding>
    )
};
Padding.propTypes = {
    color: PropTypes.string,
    radius: PropTypes.number,
    padding: PropTypes.number,
    vertical: PropTypes.number,
    horizontal: PropTypes.number,
    top: PropTypes.number,
    right: PropTypes.number,
    bottom: PropTypes.number,
    left: PropTypes.number,
};

// ==================== Row ====================
const SRow = Styled(View)`
    flexDirection: row;
    alignItems: ${props => props.align || 'center'};
    justifyContent: ${props => props.justify || 'flex-start'};
    backgroundColor: ${props => props.color || 'transparent'};
`;
const Row = (props) => <SRow {...props} />;
Row.propTypes = {
    color: PropTypes.string,
    align: PropTypes.string,
    justify: PropTypes.string,
};

// ==================== Column ====================
const SColumn = Styled(View)`
    flexDirection: column;
    alignItems: ${props => props.align || 'flex-start'};
    justifyContent: ${props => props.justify || 'flex-start'};
    backgroundColor: ${props => props.color || 'transparent'};
`;
const Column = (props) => <SColumn {...props} />;
Column.propTypes = {
    color: PropTypes.string,
    align: PropTypes.string,
    justify: PropTypes.string,
};

// ==================== Circle ====================
const SCircle = Styled(View)`
    minHeight: ${props => props.size || 8}px;
    minWidth: ${props => props.size || 8}px;
    borderRadius: ${props => (props.size || 8) / 2}px;
    backgroundColor: ${props => props.color || 'transparent'};
    borderColor: ${props => props.borderColor || 'transparent'};
    borderWidth: ${props => props.borderWidth || 0}px;
    alignItems: center;
    justifyContent: center;
`;
const Circle = (props) => <SCircle {...props} />;
Circle.propTypes = {
    size: PropTypes.number,
    color: PropTypes.string,
    borderColor: PropTypes.string,
    borderWidth: PropTypes.number,
};

// ==================== Line ====================
const SLine = Styled(View)`
    height: ${props => typeof props.height === 'string' ? props.height : props.height ? props.height + 'px' : '2px'};
    width: ${props => typeof props.width === 'string' ? props.width : props.width ? props.width + 'px' : '2px'};
    borderRadius: ${props => props.radius || 0}px;
    backgroundColor: ${props => props.color || 'transparent'};
    alignSelf: center;
`;
const Line = (props) => <SLine {...props} />;
Line.propTypes = {
    height: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    radius: PropTypes.number,
    color: PropTypes.string,
};

// ==================== Box ====================
const SBox = Styled(View)`
    minHeight: ${props => typeof props.size === 'string' ? props.size : props.size ? props.size + 'px' : '2px'};
    minWidth: ${props => typeof props.size === 'string' ? props.size : props.size ? props.size + 'px' : '2px'};
    borderRadius: ${props => typeof props.radius === 'string' ? props.radius : props.radius ? props.radius + 'px' : '0px'};
    backgroundColor: ${props => props.color || 'transparent'};
    alignSelf: center;
    alignItems: center;
    justifyContent: center;
`;
const Box = (props) => <SBox {...props} style={props.style} />;
Box.propTypes = {
    size: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    radius: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    color: PropTypes.string,
    style: PropTypes.object,
};

export {
    MainView,
    Container,
    Card,
    Shadow,
    Divider,
    Padding,
    Row,
    Column,
    Circle,
    Line,
    Box,
};