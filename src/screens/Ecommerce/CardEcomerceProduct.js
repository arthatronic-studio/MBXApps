import React from 'react';
import {
	View,
	Image,
	Pressable,
	useWindowDimensions,
} from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';

import { Divider } from '@src/styled';
import {
	Text,
	useColor,
} from '@src/components';
import { shadowStyle } from '@src/styles';
import { FormatMoney } from 'src/utils';

const defaultProps = {
	isMyProduct: false,
};

const CardEcomerceProduct = ({ isMyProduct, item, index }) => {
	const { Color } = useColor();
	const {width, height} = useWindowDimensions();
    const navigation = useNavigation();

	return (
		<Pressable
			onPress={() => !isMyProduct && navigation.navigate('DetailProduct', { item })}
			style={{
				width: '50%',
				paddingHorizontal: 8,
				marginBottom: 16,
			}}
		>
			<View
				style={{
					backgroundColor: Color.theme,
					borderRadius: 8,
					padding: 8,
					...shadowStyle,
				}}
			>
				<View
					style={{
						width: '100%',
						aspectRatio: 5/6,
					}}
				>
					<Image
						source={{ uri: item.imageUrl }}
						style={{
							width: '100%',
							height: '100%',
							borderRadius: 4,
							backgroundColor: Color.border,
						}}
					/>
				</View>

				<View
					style={{
						backgroundColor: Color.error,
						width: '40%',
						position: 'absolute',
						borderBottomLeftRadius: 15,
						borderTopRightRadius: 15,
						alignSelf: 'flex-end',
						paddingVertical: 5
					}}
				>
					<Text style={{ fontSize: 10, color: Color.textInput }}>Diskon Harcode</Text>
					<Text style={{ fontSize: 18, color: Color.textInput, fontWeight: 'bold' }}>10%</Text>
				</View>

				<Divider height={8} />
				
				<Text
					type='bold'
					align='left'
				>
					{item.name}
				</Text>

				<View style={{ flexDirection: 'row' , marginTop: 8 }}>
					<Entypo name={'star'} style={{ color: Color.yellow }} />
					<Text style={{ fontSize: 10, color: Color.secondary, }}>{item.review} </Text>
					<View
						style={{
							backgroundColor: Color.secondary,
							height: 12,
							width: 1,
							marginHorizontal: 5
						}}
					/>
					<Text style={{ fontSize: 10, color: Color.secondary, marginHorizontal: 3 }}>{item.sold || 0}</Text>
					<Text style={{ fontSize: 10, color: Color.secondary }}>Terjual</Text>
				</View>

				<View style={{ marginTop: 8 }}>
					<Text
						style={{
							marginVertical: 1,
							textAlign: 'left',
							color: Color.secondary,
							fontSize: 8
						}}
					>
						Harga
					</Text>
					{/* <Text
						style={{
							marginVertical: 1,
							textAlign: 'left',
							textDecorationLine: 'line-through',
							fontSize: 10,
							color: Color.secondary,
							fontWeight: 'bold'
						}}
					>
						{FormatMoney.getFormattedMoney(item.hargaCoret)}
					</Text> */}
					<Text
						style={{
							marginVertical: 1,
							textAlign: 'left',
							color: Color.error,
							fontWeight: 'bold'
						}}
					>
						{FormatMoney.getFormattedMoney(item.price)}
					</Text>
				</View>
				{/* <View style={{paddingVertical: 5, backgroundColor: Color.error, width: 60, height: 42, position: 'absolute', alignSelf: 'flex-end', borderTopRightRadius: 10, borderBottomLeftRadius: 20}}>
					<Text style={{color: Color.textInput, fontSize: 10}}>Diskon</Text>
					<Text style={{fontSize: 14, fontWeight: 'bold', color: Color.textInput}}>{item.diskon}</Text>
				</View> */}
			</View>
		</Pressable>
	);
};

CardEcomerceProduct.defaultProps = defaultProps;
export default CardEcomerceProduct;