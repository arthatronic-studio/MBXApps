import React, {useRef, forwardRef, useState} from 'react';
import {
  View,
  TouchableOpacity,
  useWindowDimensions,
  ScrollView,
  Image,
  Platform,
} from 'react-native';
import {Modalize} from 'react-native-modalize';
import Moment from 'moment';
import Ionicons from 'react-native-vector-icons/Ionicons';

import {Text, useColor} from '@src/components';
import {useCombinedRefs} from '@src/hooks';
import {isIphoneNotch, statusBarHeight} from 'src/utils/constants';
import FormInput from '../FormInput';
import { Container, Divider, Row } from 'src/styled';
import CardComment from '../Card/CardComment';

const defaultProps = {
  selectedComment: null,
  onSubmit: () => {},
  onClose: () => {},
  style: {},
};

const ModalCommentReply = forwardRef((props, ref) => {
  const { productOwnerId, selectedComment, onSubmit, onClose, style} = props;

  const [textReply, setTextReply] = useState('');

  const modalizeRef = useRef(null);
  const combinedRef = useCombinedRefs(ref, modalizeRef);

  const {Color} = useColor();
  const {width} = useWindowDimensions();

  return (
    <Modalize
      ref={combinedRef}
      withHandle
      handlePosition="inside"
      adjustToContentHeight
      handleStyle={{
        width: width / 6,
        height: 4,
        backgroundColor: Color.primary,
        marginTop: 8,
      }}
      childrenStyle={{
        backgroundColor: Color.theme,
        alignItems: 'flex-start',
        paddingTop: 16,
        paddingBottom: isIphoneNotch() ? statusBarHeight : 0,
        borderTopLeftRadius: 12,
        borderTopRightRadius: 12,
        ...style,
      }}
      modalStyle={{
        backgroundColor: Color.theme,
      }}
      onClose={() => onClose()}
    >
      <>
        <Divider />

        {selectedComment && 
          <>
            <Container>
              <CardComment
                item={selectedComment}
                productOwnerId={productOwnerId}
              />
            </Container>

            {Array.isArray(selectedComment.replies) && selectedComment.replies.map((itemReply, idx) => {
              return (
                <Container paddingLeft={32}>
                  <CardComment
                    key={idx}
                    item={itemReply}
                    productOwnerId={productOwnerId}
                  />
                </Container>
              )
            })}
          </>
        }

        <View style={{paddingTop: 8, paddingHorizontal: 16}}>
          <FormInput
            placeholder='Masukan balasan komentar'
            multiline
            value={textReply}
            onChangeText={(val) => setTextReply(val)}
            suffixIcon={
              <TouchableOpacity
                onPress={() => {
                  onSubmit(textReply);
                  setTextReply('');
                }}
                style={{width: 40, height: 40, alignItems: 'center', justifyContent: 'center'}}
              >
                <View style={{width: 28, height: 28, borderRadius: 14, backgroundColor: Color.primary, alignItems: 'center', justifyContent: 'center'}}>
                  <Ionicons name='arrow-forward' color={Color.theme} size={18} />
                </View>
              </TouchableOpacity>
            }
          />
        </View>
      </>
    </Modalize>
  );
});

ModalCommentReply.defaultProps = defaultProps;
export default ModalCommentReply;
