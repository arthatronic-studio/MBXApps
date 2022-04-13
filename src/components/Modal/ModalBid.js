import React, { useRef, forwardRef, useState } from 'react';
import { Dimensions, TouchableOpacity, useWindowDimensions, View, TextInput, FlatList } from 'react-native';
import { Modalize } from 'react-native-modalize';
import Styled from 'styled-components';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Popup, usePopup, Loading, useLoading, Text, useColor } from '@src/components';
import { useCombinedRefs } from 'src/hooks';
import { FormatMoney } from 'src/utils';
import { TextInputMask } from 'react-native-masked-text';
import { useSelector } from 'react-redux';
import { navigationRef } from 'App';
import { Col } from '../Grid';

const { width } = Dimensions.get('window');

const defaultProps = {
	onPress: () => {}
};

const CustomTextInput = Styled(TextInput)`
  width: 95%;
  height: 100%;
  fontFamily: OpenSans-Regular;
  backgroundColor: transparent;
  fontSize: 18px;
`;

const InputNumberView = Styled(TextInputMask)`
  width: 100%;
  fontFamily: OpenSans-Regular;
  alignContent: flex-start;
  fontSize: 14px;
`;

const EmailRoundedView = Styled(View)`
  width: ${width - 32};
  paddingHorizontal: 10;
  alignItems: center;
  justifyContent: center;
  flexDirection: column;
  borderRadius: 4px;
  marginBottom: 10;
`;

const SubmitButton = Styled(TouchableOpacity)`
  width: 100%;
  height: 45px;
  marginTop: 16px;
  borderRadius: 120px;
  justifyContent: center;
`;

const amountData = [
	{ id: 1, bid: 5000 },
	{ id: 2, bid: 10000 },
	{ id: 3, bid: 25000 },
	{ id: 4, bid: 50000 },
	{ id: 5, bid: 100000 },
	{ id: 6, bid: 200000 }
];

const ModalBid = forwardRef((props, ref) => {
	const { onPress, data } = props;
	const modalizeRef = useRef(null);
	const combinedRef = useCombinedRefs(ref, modalizeRef);
	const [ handle, setHandle ] = useState(false);
	const [ loadingProps, showLoading ] = useLoading();
	const [ popupProps, showPopup ] = usePopup();
	const { Color } = useColor();
	const { width } = useWindowDimensions();
	const handlePosition = (position) => {
		setHandle(position === 'top');
	};
	const amountBid = useRef();

	// selector
	const user = useSelector((state) => state['user.auth'].login.user);

	// state
	const [ text, setText ] = useState('');
	const [ selectedAmount, setSelectedAmount ] = useState();

	const submit = () => {
		if (text !== '') {
			if (amountBid.current.getRawValue() < 5000) {
				showPopup('Minimal bid adalah Rp 5.000', 'warning');
			} else {
				data.push({ name: user.firstName, bid: amountBid.current.getRawValue() });
				combinedRef.current.close();
				navigationRef.current.navigate('CartScreen');
			}
		} else {
			showPopup('Silakan masukan nominal bid terlebih dulu', 'warning');
		}
		setText('');
		setSelectedAmount();
	};

	const renderContent = () => {
		return (
			<FlatList
				key="listBidValue"
				keyExtractor={(item, index) => item.toString() + index}
				data={amountData}
				numColumns={3}
				keyboardShouldPersistTaps="handled"
				columnWrapperStyle={{ justifyContent: 'space-between' }}
				ItemSeparatorComponent={() => <View style={{ height: 10, backgroundColor: Color.theme }} />}
				showsHorizontalScrollIndicator={false}
				// contentContainerStyle={{justifyContent: 'space-between', borderWidth: 1}}
				renderItem={({ item, index }) => {
					const isSelected = selectedAmount && selectedAmount.id === item.id;
					return (
						<TouchableOpacity
							activeOpacity={1}
							onPress={() => {
								setText(item.bid.toString());
								setSelectedAmount(item);
							}}
							style={[
								{
									borderRadius: 120,
									paddingVertical: 12,
									flexDirection: 'row',
									justifyContent: 'center',
									width: '32%',
									height: 46,
									backgroundColor: Color.grayLight
								},
								isSelected && { borderWidth: 2 }
							]}
						>
							<Text size={14} color={isSelected ? Color.primary : Color.textInput}>
								{FormatMoney.getFormattedMoney(item.bid)}
							</Text>
						</TouchableOpacity>
					);
				}}
			/>
		);
	};

	return (
		<Modalize
			ref={combinedRef}
			withHandle={false}
			handlePosition="inside"
			adjustToContentHeight
			handleStyle={{ width: width / 4, height: handle ? 4 : 4, backgroundColor: Color.primary, marginTop: 8 }}
			onPositionChange={handlePosition}
			childrenStyle={{
				width: width,
				alignItems: 'center',
				marginTop: 10,
				padding: 8,
				paddingBottom: 16,
				borderTopLeftRadius: 12,
				borderTopRightRadius: 12
			}}
			modalStyle={{
				backgroundColor: Color.theme,
				width: width
			}}
		>
			<View
				style={{
					flexDirection: 'row',
					justifyContent: 'space-between',
					marginBottom: 10,
					alignItems: 'center'
				}}
			>
				<Text size={11} color={Color.text} style={{ fontWeight: 'bold' }}>
					Pasang Tawaran
				</Text>
				<TouchableOpacity
					style={{ marginRight: 7 }}
					onPress={() => {
						combinedRef.current.close();
					}}
				>
					<Ionicons name="chevron-down-outline" color={Color.text} size={18} />
				</TouchableOpacity>
			</View>
			<View style={{ flexDirection: 'row', marginBottom: 16 }}>
				<View style={{ flexDirection: 'column', marginRight: 24, alignItems: 'baseline' }}>
					<Text style={{ color: Color.grayLight }}>Harga saat ini</Text>
					<Text style={{ fontWeight: 'bold' }}>150.000 Poin</Text>
				</View>
				<View style={{ flexDirection: 'column', alignItems: 'baseline' }}>
					<Text style={{ color: Color.grayLight }}>Penawaranmu</Text>
					<Text style={{ fontWeight: 'bold' }}>-</Text>
				</View>
			</View>

			{renderContent()}
			<View style={{ flexDirection: 'column', marginRight: 24, alignItems: 'baseline', marginTop: 16 }}>
				<Text style={{ color: Color.grayLight }}>Poinku</Text>
				<Text style={{ fontWeight: 'bold' }}>250.000 Poin</Text>
			</View>
			<SubmitButton onPress={() => submit()} style={{ backgroundColor: Color.grayLight }}>
				<Text color={Color.textInput} size={16}>
					Pasang Tawaran
				</Text>
			</SubmitButton>

			<Loading {...loadingProps} />

			<Popup {...popupProps} />
		</Modalize>
	);
});

ModalBid.defaultProps = defaultProps;

export default ModalBid;
