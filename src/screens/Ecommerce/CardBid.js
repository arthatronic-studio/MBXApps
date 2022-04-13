import React from 'react';
import { View, ImageBackground, Dimensions, Image, TextInput } from 'react-native';
import { Header } from '@src/components';
import { Divider } from 'src/styled';
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

const CardBid = ({ navigation }) => {
	const { Color } = useColor();

	return (
		<ScrollView>
			<View
				style={{
					borderBottomWidth: 1,
					marginVertical: 24,
					borderColor: Color.grayLight
				}}
			>
				<View
					style={{
						alignSelf: 'baseline',

						flexDirection: 'row'
					}}
				>
					<Text
						style={{
							fontSize: 14,
							marginLeft: 26,
							marginTop: 9.5
						}}
					>
						1
					</Text>
					<Image
						source={ImagesPath.profile}
						style={{
							marginLeft: 20
						}}
					/>
					<View
						style={{
							flexDirection: 'column',
							marginHorizontal: 10,
							marginTop: 3.5,
							alignSelf: 'baseline'
						}}
					>
						<Text
							style={{
								fontSize: 8
							}}
						>
							Nama Penawar
						</Text>
						<Text style={{ fontSize: 14 }}>Tantri N.</Text>
					</View>
					<View
						style={{
							flexDirection: 'column',
							marginTop: 3.5,
							marginLeft: 117
						}}
					>
						<Text
							style={{
								fontSize: 8
							}}
						>
							Jumlah Penawaran
						</Text>
						<View style={{ flexDirection: 'row' }}>
							<Text style={{ fontSize: 14 }}>150.000 </Text>

							<Text style={{ fontSize: 11, marginTop: 3.5, fontWeight: 'bold' }}>Poin</Text>
						</View>
					</View>
				</View>
			</View>
		</ScrollView>
	);
};

export default CardBid;
