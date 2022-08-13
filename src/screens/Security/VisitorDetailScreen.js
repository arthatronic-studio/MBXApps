import React from 'react';
import { View, useWindowDimensions } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { Button, Scaffold, Text, useColor } from '@src/components';
import SearchBar from 'src/components/SearchBar';
import { Container, Divider, Row } from 'src/styled';
import { TouchableOpacity } from 'react-native-gesture-handler';

const VisitorDetailScreen = () => {
  const { Color } = useColor();

  return (
    <Scaffold

    >
      <Container padding={16}>
        <Container>
          <Row>
            <Container height={48} width={48} radius={48 / 2} color={Color.border} marginRight={12}>

            </Container>
            <Container>
              <Text align='left' type='medium'>Adang Susanyo</Text>
              <Text align='left' size={12} color={Color.placeholder}>Laki-laki</Text>
            </Container>
          </Row>
        </Container>

        <Divider />

        <Row>
        <Container flex={1}>
          <Text align='left' letterSpacing={0.5} size={11} color={Color.placeholder} type='medium'>Tanggal Masuk</Text>
          <Text align='left' letterSpacing={0.25}>22 Agustus 2022</Text>
        </Container>
      </Row>

      <Divider />

      <Row>
        <Container flex={1}>
          <Text align='left' letterSpacing={0.5} size={11} color={Color.placeholder} type='medium'>Jam Masuk</Text>
          <Text align='left' letterSpacing={0.25}>22:00</Text>
        </Container>

        <Container flex={1}>
        <Text align='left' letterSpacing={0.5} size={11} color={Color.placeholder} type='medium'>Jam Keluar</Text>
          <Text align='left' letterSpacing={0.25}>-</Text>
        </Container>
      </Row>

      <Divider />

      <Button
        outline
        color={Color.error}
      >
        Laporkan
      </Button>
      </Container>
    </Scaffold>
  )
}

export default VisitorDetailScreen;
