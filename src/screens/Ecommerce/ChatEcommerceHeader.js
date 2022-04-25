import { View, Text, TextInput, Pressable, SafeAreaView, TouchableOpacity, Touchable, Image } from 'react-native';
import React from 'react';
import Styled from 'styled-components';
import { useNavigation } from '@react-navigation/core';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Octicons from 'react-native-vector-icons/Octicons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useColor, Header, Row } from '@src/components';
import ImagesPath from 'src/components/ImagesPath';
import Entypo from 'react-native-vector-icons/Entypo';

const MainView = Styled(SafeAreaView)`
      flex: 1;
  `;

const ChatEcommerceHeader = (props) => {
	const {
    name,
		merchant
  } = props;
	const { Color } = useColor();

	const navigation = useNavigation();
	return (
		<View
			style={{
				marginTop: 5,
				marginBottom: 5,
				width: '100%',
				justifyContent: 'center',
				alignItems: 'center',
				height: '7%',
				flexDirection: 'row'
			}}
		>
			<Pressable onPress={() => navigation.goBack()} style={{ width: '8%' }}>
				<AntDesign name={'arrowleft'} size={20} />
			</Pressable>
			<View style={{ width: '80%' }}>
				<View style={{ flexDirection: 'row', alignItems: 'center' }}>
					<Text
						style={{
							paddingVertical: 7,
							paddingHorizontal: 10,
							fontWeight: 'bold'
						}}
					>
						{name}
					</Text>
					<Image source={ImagesPath.toko} style={{}} />
				</View>
				{merchant &&
					<Text
						style={{
							paddingHorizontal: 10,
							fontSize: 10
						}}
					>	
						Akun Merchant
					</Text>
				}
			</View>

			<TouchableOpacity>
				<Entypo name={'dots-three-vertical'} size={22} style={{ marginHorizontal: 5 }} />
			</TouchableOpacity>
		</View>
	);
};

export default ChatEcommerceHeader;
