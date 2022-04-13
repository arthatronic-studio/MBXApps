import React, { useRef } from 'react';
import { View, ImageBackground, Dimensions, Image, TextInput } from 'react-native';
import { Header } from '@src/components';
import { Divider } from 'src/styled';
import Styled from 'styled-components';
import { useWindowDimensions } from 'react-native';
import { MainView } from '@src/styled';
import Octicons from 'react-native-vector-icons/Octicons';
import Entypo from 'react-native-vector-icons/Entypo';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Col, Scaffold, Text, TouchableOpacity, useColor } from '@src/components';
import { shadowStyle } from '@src/styles';
import { TabBar, TabView, SceneMap } from 'react-native-tab-view';
import { FlatList, ScrollView } from 'react-native-gesture-handler';
import ImagesPath from 'src/components/ImagesPath';
import CardBid from './CardBid';
import { FormatMoney } from 'src/utils';
import ModalBid from 'src/components/Modal/ModalBid';

const DATA = [
	{
		nama: 'Tes',
		image: 'imgage',
		harga: '15000'
	}
];

const ButtonView = Styled(View)`
    width: 100%;
    marginHorizontal: 16;
    paddingVertical: 16;
    flexDirection: column;
    justifyContent: flex-start;
    alignItems: flex-start;
    borderTopLeftRadius: 16;
    borderTopRightRadius: 16;
`;

const EnterButton = Styled(TouchableOpacity)`
    width: 140;
    paddingVertical: 13;
    borderRadius: 120px;
    justifyContent: center;
    alignItems: center;
	height:48;
`;

const BidAuction = ({ navigation }) => {
	const { Color } = useColor();

	const { width, height } = useWindowDimensions();
	const modalBidRef = useRef();

	return (
		<Scaffold
			header={<Header customIcon title="Lelang" type="bold" style={{ paddingTop: 16 }} centerTitle={false} />}
		>
			<View style={{ justifyContent: 'space-between', height: height - 55 }}>
				<View>
					<View
						style={{
							flexDirection: 'row',
							marginHorizontal: 16,
							marginTop: 33
						}}
					>
						<Image source={ImagesPath.nisa} style={{}} />
						<View
							style={{
								flexDirection: 'column',
								alignSelf: 'baseline',
								marginLeft: 16
							}}
						>
							<Text
								style={{
									fontWeight: 'bold',
									fontSize: 14,
									width: '75%',
									alignSelf: 'baseline',
									textAlign: 'left',
									marginBottom: 4
								}}
							>
								Pashmina Pink Nissa Sabyan
							</Text>
							<Text style={{ alignSelf: 'baseline', fontSize: 10 }}>Hijab</Text>
						</View>
						<View
							style={{
								backgroundColor: '#3C58C1',
								flexDirection: 'column',
								height: 30,
								width: 62,
								borderRadius: 120,
								marginHorizontal: 16,
								justifyContent: 'center'
							}}
						>
							<View style={{ marginHorizontal: 16, marginVertical: 4 }}>
								<Text style={{ fontSize: 5, color: '#FFFFFF' }}>Sisa Waktu</Text>
								<Text style={{ fontSize: 9, color: '#FFFFFF' }}>12:05</Text>
							</View>
						</View>
					</View>
					<View
						style={{
							flexDirection: 'row',
							marginHorizontal: 16
						}}
					>
						<View
							style={{
								backgroundColor: Color.grayLight,
								width: '100%',
								flexDirection: 'row',
								borderRadius: 10
							}}
						>
							<View
								style={{
									alignSelf: 'baseline',
									marginHorizontal: 10,
									marginVertical: 15
								}}
							>
								<Text style={{ fontSize: 8 }}>Penawaranmu</Text>
								<View style={{ flexDirection: 'row' }}>
									<Text style={{ fontSize: 18, alignSelf: 'baseline', fontWeight: 'bold' }}>0 </Text>
									<Text style={{ fontSize: 11, marginTop: 6, fontWeight: 'bold' }}>Poin</Text>
								</View>
							</View>
							<View
								style={{
									alignSelf: 'baseline',
									marginHorizontal: 10
								}}
							>
								<Text style={{ fontSize: 8, alignSelf: 'baseline' }}>Penawaranmu</Text>
								<View style={{ flexDirection: 'row' }}>
									<Text style={{ fontSize: 18, alignSelf: 'baseline', fontWeight: 'regular' }}>
										50.000{' '}
									</Text>
									<Text style={{ fontSize: 11, marginTop: 6, fontWeight: 'bold' }}>Poin</Text>
								</View>
							</View>
						</View>
					</View>
					<View style={{ backgroundColor: '#F3771D', marginTop: 16 }}>
						<View style={{ alignSelf: 'baseline', marginHorizontal: 16, marginVertical: 16 }}>
							<Text style={{ fontSize: 14, color: Color.textInput }}>Penawar</Text>
						</View>
					</View>

					<FlatList
						data={DATA}
						keyExtractor={(item, index) => item.toString() + index}
						renderItem={({ item }) => {
							return (
								<TouchableOpacity>
									<CardBid data={item} />
								</TouchableOpacity>
							);
						}}
					/>
				</View>
				<View style={{ backgroundColor: Color.theme }}>
					<ButtonView style={{ ...shadowStyle, backgroundColor: Color.theme }}>
						<Text size={11} style={{ color: Color.text }}>
							Pasang Tawaran
						</Text>
						<Divider height={10} />
						<View
							style={{
								flexDirection: 'row',
								justifyContent: 'flex-start',
								alignItems: 'center'
							}}
						>
							<EnterButton
								style={{
									backgroundColor: '#9CA3A5'
								}}
							>
								<Text size={14} letterSpacing={0.02} color={Color.textInput}>
									+{FormatMoney.getFormattedMoney(5000)}
								</Text>
							</EnterButton>
							<EnterButton style={{ backgroundColor: '#9CA3A5', marginLeft: 10 }}>
								<Text size={14} letterSpacing={0.02} color={Color.textInput}>
									+{FormatMoney.getFormattedMoney(10000)}
								</Text>
							</EnterButton>
							<TouchableOpacity
								style={{
									width: 43,
									height: 43,
									backgroundColor: Color.primary,
									aspectRatio: 1,
									marginLeft: 20,
									borderRadius: 120,
									alignItems: 'center',
									justifyContent: 'center'
								}}
								onPress={() => {
									modalBidRef.current.open();
								}}
							>
								<Ionicons name="chevron-up-outline" color={Color.textInput} size={20} />
							</TouchableOpacity>
						</View>
					</ButtonView>
				</View>
			</View>
			<ModalBid ref={modalBidRef} />
		</Scaffold>
	);
};
export default BidAuction;
