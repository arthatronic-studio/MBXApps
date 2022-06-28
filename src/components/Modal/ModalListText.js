import React, {useRef, forwardRef} from 'react';
import {
  View,
  TouchableOpacity,
  useWindowDimensions,
  ScrollView,
  Image
} from 'react-native';
import {Modalize} from 'react-native-modalize';
import {Text, useColor} from '@src/components';

import {useCombinedRefs} from '@src/hooks';
import {statusBarHeight} from 'src/utils/constants';

const defaultProps = {
  data: [],
  adjust: true,
  selected: null,
  name: '',
  image:'',
  onPress: () => {},
  onClose: () => {},
  style: {},
};

const ModalListText = forwardRef((props, ref) => {
  const {data,image, selected, adjust, onPress, onClose, children, style, name} = props;

  const modalizeRef = useRef(null);
  const combinedRef = useCombinedRefs(ref, modalizeRef);

  const {Color} = useColor();
  const {width} = useWindowDimensions();

  const renderContent = () => {
    return data.map((item, idx) => {
      if (item.show === false) return <View key={idx} />;

      return (
        <View>
          
        <View style={{flexDirection:'row',marginTop:10}}>
        <Image
                                        style={{ height: 25, width: 25 }}
                                        source={item.image}/>
         <TouchableOpacity style={{marginHorizontal:10,marginBottom:10}}>
          <Text style={{fontWeight:'bold'}}>{item.name}</Text>
         </TouchableOpacity>
        </View>
        </View>
      );
    });
  };

  return (
    <Modalize
      ref={combinedRef}
      withHandle
      adjustToContentHeight={adjust}
      handlePosition="inside"
      handleStyle={{
        width: width / 6,
        height: 4,
        backgroundColor: Color.primary,
        marginTop: 8,
      }}
      childrenStyle={{
        backgroundColor: Color.theme,
        alignItems: 'flex-start',
        padding: 16,
        paddingBottom: statusBarHeight,
        borderTopLeftRadius: 12,
        borderTopRightRadius: 12,
        ...style,
      }}
      modalStyle={{
        backgroundColor: Color.theme,
      }}
      onClose={() => onClose()}>
      <View style={{flex: 1}}>
      <Text style={{fontWeight:'bold',textAlign:'left'}}>Text Proferty</Text>
        <ScrollView>{data.length > 0 ? renderContent() : children}</ScrollView>
      </View>
    </Modalize>
  );
});

ModalListText.defaultProps = defaultProps;
export default ModalListText;
