import React from 'react';
import {View, Text, SafeAreaView, ScrollView} from 'react-native';
import Styled from 'styled-components';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {
  Header,
  TouchableOpacity,
  Grid,
  Row,
  Col,
  useColor,
} from '@src/components';
import AntDesign from 'react-native-vector-icons/AntDesign';

const MainView = Styled(SafeAreaView)`
    flex: 1;
`;

const CommunityAdmin = ({navigation}) => {
  const {Color} = useColor();

  return (
    <MainView style={{backgroundColor: Color.theme}}>
      <Header title="Community Admin" />
      <Grid
        style={{
          backgroundColor: Color.theme,
          borderTopWidth: 0.5,
          borderColor: Color.border,
        }}>
        <TouchableOpacity onPress={() => navigation.navigate('NumbersInput')}>
          <Row>
            <Col size={0.75} justify="center">
              <AntDesign
                name="form"
                color={Color.text}
                style={{marginTop: 2}}
              />
            </Col>
            <Col align="flex-start" size={8} justify="center">
              <Text size={12} type="medium">
                Input Nomor Punggung
              </Text>
            </Col>
            <Col align="flex-end" size={3.25} justify="center">
              <FontAwesome name="angle-right" color={Color.text} size={20} />
            </Col>
          </Row>
        </TouchableOpacity>
      </Grid>
      <Grid
        style={{
          backgroundColor: Color.theme,
          borderTopWidth: 0.5,
          borderColor: Color.border,
        }}>
        <TouchableOpacity onPress={() => navigation.navigate('ApproveMember')}>
          <Row>
            <Col size={0.75} justify="center">
              <AntDesign
                name="form"
                color={Color.text}
                style={{marginTop: 2}}
              />
            </Col>
            <Col align="flex-start" size={8} justify="center">
              <Text size={12} type="medium">
                Approve Member
              </Text>
            </Col>
            <Col align="flex-end" size={3.25} justify="center">
              <FontAwesome name="angle-right" color={Color.text} size={20} />
            </Col>
          </Row>
        </TouchableOpacity>
      </Grid>
    </MainView>
  );
};

export default CommunityAdmin;
