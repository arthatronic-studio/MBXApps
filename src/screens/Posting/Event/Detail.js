import React, {useState, useEffect, useRef} from 'react';
import {View, Image, ScrollView, Platform, Linking} from 'react-native';
import Styled from 'styled-components';
import Ionicons from 'react-native-vector-icons/Ionicons';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useLoading, usePopup, useColor} from '@src/components';
import Text from '@src/components/Text';
import Scaffold from '@src/components/Scaffold';
import {TouchableOpacity} from '@src/components/Button';

import {shadowStyle} from '@src/styles';

import Client from '@src/lib/apollo';
import {queryAddLike} from '@src/lib/query';
import ImagesPath from 'src/components/ImagesPath';
import Foundation from 'react-native-vector-icons/Foundation';
import Entypo from 'react-native-vector-icons/Entypo';
import Octions from 'react-native-vector-icons/Octicons';

const Example = Styled(View)`
`;

export default ({navigation, route}) => {
  const {Color} = useColor();
  //   const {item} = route.params;

  //   const [state, changeState] = useState({
  //     im_like: item.im_like,
  //   });

  //   const setState = obj => changeState({...state, ...obj});

  //   const [popupProps, showPopup] = usePopup();
  //   const [loadingProps, showLoading, hideLoading] = useLoading();

  //   const {Color} = useColor();

  //   // useEffect(() => {
  //   //     const timeout = trigger ? setTimeout(() => {
  //   //         fetchAddLike();
  //   //     }, 500) : null;

  //   //     return () => {
  //   //         clearTimeout(timeout);
  //   //     }
  //   // }, [trigger]);

  //   const fetchAddLike = () => {
  //     showLoading();

  //     Client.query({
  //       query: queryAddLike,
  //       variables: {
  //         productId: item.id,
  //       },
  //     })
  //       .then(res => {
  //         console.log(res, 'res add like');
  //         if (res.data.contentAddLike.id) {
  //           if (res.data.contentAddLike.status === 1) {
  //             showLoading('success', 'Berhasil diikuti');
  //             setState({im_like: true});
  //           } else {
  //             showLoading('info', 'Berhasil batal ikuti');
  //             setState({im_like: false});
  //           }
  //         }
  //       })
  //       .catch(err => {
  //         console.log(err, 'err add like');
  //         hideLoading();
  //       });
  //   };

  //   console.log(route);

  return (
    // <Scaffold
    //   headerTitle=""
    //   fallback={false}
    //   empty={false}
    //   popupProps={popupProps}
    //   loadingProps={loadingProps}>
    //   <ScrollView contentContainerStyle={{paddingBottom: 16}}>
    //     {/* <Image
    //                 source={{uri: item.image}}
    //                 style={{width: '100%', aspectRatio: 1.5, backgroundColor: Color.border}}
    //             />

    //             <View style={{padding: 24, marginTop: -16, borderTopLeftRadius: 24, borderTopRightRadius: 24, flexDirection: 'row', justifyContent: 'flex-end', backgroundColor: Color.theme}} />

    //             <View style={{paddingHorizontal: 24}}>
    //                 <View style={{paddingBottom: 12}}>
    //                     <Text size={24} type='bold' align='left'>
    //                         {item.productName}
    //                     </Text>
    //                 </View>

    //                 <View style={{paddingBottom: 8}}>
    //                     <Text align='left'>
    //                         {item.productDescription}
    //                     </Text>
    //                 </View>

    //                 <View style={{paddingBottom: 12}}>
    //                     <Text size={12} align='left' style={{opacity: 0.6}}>
    //                         Buka Jam 09:00 - 22:00
    //                     </Text>
    //                 </View>
    //             </View>

    //             <View style={{flexDirection: 'row', justifyContent: 'space-around'}}>
    //                 <View style={{alignItems: 'center'}}>
    //                     <View style={{height: 70, width: 70, borderRadius: 35, backgroundColor: Color.textInput, justifyContent: 'center', alignItems: 'center'}}>
    //                         <Text size={22} type='bold'>{item.like}</Text>
    //                     </View>
    //                     <Text size={12} style={{marginTop: 16}}>Ramah Disabilitas</Text>
    //                 </View>

    //                 <View style={{alignItems: 'center'}}>
    //                     <View style={{height: 70, width: 70, borderRadius: 35, backgroundColor: Color.textInput, justifyContent: 'center', alignItems: 'center'}}>
    //                         <MaterialCommunityIcons name='ticket-percent' size={30} color={Color.green} />
    //                     </View>
    //                     <Text size={12} style={{marginTop: 16}}>Voucher</Text>
    //                 </View>

    //                 <View style={{alignItems: 'center'}}>
    //                     <TouchableOpacity
    //                         onPress={() => {
    //                             const daddr = `-6.311272,106.793541`;
    //                             if (Platform.OS === 'ios') {
    //                                 Linking.openURL('http://maps.apple.com/maps?daddr=' + daddr);
    //                             } else {
    //                                 Linking.openURL('http://maps.google.com/maps?daddr=' + daddr);
    //                             }
    //                         }}
    //                         style={{height: 70, width: 70, borderRadius: 35, backgroundColor: Color.textInput, justifyContent: 'center', alignItems: 'center'}}
    //                     >
    //                         <Ionicons name='location' size={30} color={Color.primary} />
    //                     </TouchableOpacity>
    //                     <Text size={12} style={{marginTop: 16}}>Lihat Lokasi</Text>
    //                 </View>
    //             </View> */}
    //   </ScrollView>

    //   {/* <View style={{height: 60, width: '100%', alignItems: 'center', justifyContent: 'center', backgroundColor: Color.textInput, ...shadowStyle}}>
    //             <TouchableOpacity
    //                 onPress={() => {
    //                     fetchAddLike();
    //                 }}
    //                 style={{
    //                     height: 40,
    //                     width: '50%',
    //                     borderRadius: 20,
    //                     flexDirection: 'row',
    //                     backgroundColor: state.im_like ? Color.success : Color.info,
    //                     justifyContent: 'center',
    //                     alignItems: 'center',
    //                 }}
    //             >
    //                 <Ionicons
    //                     name={state.im_like ? 'checkmark' : 'bookmark-outline'}
    //                     size={20}
    //                     color={Color.textInput}
    //                 />
    //                 <Text
    //                     color={Color.textInput}
    //                     style={{marginBottom: 4, marginLeft: 4}}
    //                 >
    //                     {state.im_like ? 'Applied' : 'Apply Now'}
    //                 </Text>
    //             </TouchableOpacity>
    //         </View> */}
    // </Scaffold>
    <Scaffold headerTitle="Detail" fallback={false} empty={false}>
      <ScrollView>
        <View style={{backgroundColor: 'yellow'}}>
          <Image
            source={ImagesPath.detailEvent}
            style={{width: '100%', height: 200}}
          />
        </View>
        <View
          style={{
            backgroundColor: Color.theme,
            width: '100%',
            height: 30,
            borderRadius: 20,
            position: 'absolute',
            marginVertical: '44%',
          }}></View>
        <View
          style={{
            backgroundColor: Color.theme,
            width: '100%',
            height: '100%',
          }}>
          <View>
            <Text
              style={{
                color: Color.info,
                fontWeight: 'bold',
                fontSize: 11,
                textAlign: 'left',
                paddingHorizontal: 20,
                marginVertical: 10,
              }}>
              OFFICIAL EVENT
            </Text>
            <Text
              style={{
                color: Color.text,
                fontSize: 18,
                fontWeight: 'bold',
                width: '70%',
                textAlign: 'justify',
                paddingHorizontal: 20,
              }}>
              Geek Con by TRIBESOCIAL at Kota Kasablanka
            </Text>
          </View>
          <View style={{flexDirection: 'row', paddingVertical: 18}}>
            <View
              style={{
                flexDirection: 'row',
                paddingHorizontal: 10,
                width: '40%',
              }}>
              <Foundation
                name={'calendar'}
                size={22}
                style={{paddingHorizontal: 15}}
              />
              <Text style={{fontWeight: 'bold'}}>08 Feb 2022</Text>
            </View>
            <View
              style={{
                width: '60%',
                flexDirection: 'row',
              }}>
              <Entypo
                name={'location-pin'}
                size={20}
                style={{paddingHorizontal: 10}}
              />
              <Text style={{fontWeight: 'bold'}}>Jakarta Selatan</Text>
            </View>
          </View>
          <View>
            <Text
              style={{
                textAlign: 'left',
                paddingHorizontal: 20,
                fontWeight: 'bold',
                fontSize: 15,
                paddingVertical: 10,
              }}>
              Deskripsi
            </Text>
            <Text
              style={{
                textAlign: 'justify',
                width: '97%',
                paddingHorizontal: 20,
                color: Color.secondary,
              }}>
              Cupcake ipsum dolor sit amet. Jelly-o dessert pudding pie sweet
              roll. Donut brownie caramels pastry toffee pastry cupcake. Dragée
              cotton candy macaroon muffin sweet donut. Chupa chups topping
              croissant chupa chups sweet roll biscuit cupcake. Cheesecake
              jujubes gingerbread jelly-o chupa chups donut jujubes icing. Lemon
              drops lemon drops oat cake croissant halvah. Pudding marshmallow
              soufflé bear claw marshmallow cheesecake cupcake. Pudding dragée
              apple pie wafer marzipan croissant toffee macaroon jelly-o.
              Topping chocolate powder fruitcake jelly pie ice cream. Ice cream
              liquorice bonbon marzipan sweet roll jelly macaroon sugar plum
              toffee. Gummies chocolate cake chocolate candy croissant candy
              canes.
              {'\n'}
              {'\n'}Pudding chocolate gummi bears cotton candy dessert powder
              muffin candy canes jujubes. Brownie danish pudding wafer bear claw
              cheesecake dragée candy. Jujubes tootsie roll lollipop chocolate
              toffee caramels. Shortbread lollipop halvah cotton candy icing
              carrot cake cheesecake caramels icing. Bear claw jujubes muffin
              wafer toffee gummi bears. Fruitcake powder marshmallow ice cream
              apple pie danish. Croissant bear claw pudding carrot cake lollipop
              topping soufflé cookie. Brownie sesame snaps candy wafer pudding.
              Cotton candy sesame snaps carrot cake tootsie roll marshmallow
              sweet. Powder muffin sesame snaps tootsie roll marzipan. Topping
              jelly beans jelly-o sweet shortbread wafer lemon drops. Bonbon
              dessert soufflé bonbon chocolate bar tootsie roll. Donut pudding
              carrot cake pudding cheesecake sweet lemon drops dragée. Macaroon
              candy canes tart sweet roll chocolate cake biscuit. Cake dragée
              chocolate bar toffee cake.
              {'\n'}
              {'\n'}Gummies halvah pudding candy canes dragée. Jelly bonbon
              gummi bears jelly beans jelly-o pastry icing brownie. Tart
              croissant gummies apple pie liquorice pie. Dessert fruitcake ice
              cream dragée wafer carrot cake. Gingerbread topping oat cake
              bonbon bear claw sweet macaroon candy canes carrot cake. Jujubes
              carrot cake icing ice cream lemon drops topping carrot cake sesame
              snaps. Tart chupa chups jelly-o chocolate bar pastry chupa chups
              toffee halvah caramels. Wafer cake chupa chups icing dragée muffin
              wafer ice cream. Danish gingerbread fruitcake gummies halvah
              lollipop. Chocolate cake muffin pastry cookie cake jelly-o
              marzipan. Biscuit powder biscuit jelly muffin tootsie roll jelly.
              Powder caramels dragée carrot cake halvah apple pie chocolate
              cake. Fruitcake fruitcake gingerbread gingerbread fruitcake.
              Macaroon cookie shortbread chocolate bar danish powder pie
              chocolate. Gummi bears oat cake icing oat cake fruitcake brownie
              sesame snaps liquorice cupcake. Bear claw marzipan gummies cake
              oat cake soufflé. Fruitcake bear claw icing apple pie cotton
              candy.
              {'\n'}
              {'\n'}Oat cake candy canes tart tart dragée. Muffin donut biscuit
              sesame snaps candy canes. Sesame snaps candy halvah croissant
              icing dessert sweet roll apple pie. Bonbon donut sweet roll
              topping sweet roll bear claw jelly-o chocolate bar. Macaroon
              chocolate bar pastry shortbread oat cake lemon drops chocolate
              cake. Wafer jelly-o croissant fruitcake danish cookie cake wafer
              biscuit. Gummies muffin wafer caramels soufflé jujubes sweet roll.
              Wafer jujubes brownie pie dessert. Chocolate biscuit oat cake
              bonbon bonbon brownie tart. Powder jujubes brownie candy donut
              carrot cake topping gummies. Caramels fruitcake toffee bonbon
              lemon drops halvah danish lollipop. Marzipan gingerbread caramels
              sugar plum tart toffee jujubes. Gummi bears fruitcake sweet donut
              candy apple pie sweet. Pie icing cake chupa chups cotton candy
              chocolate carrot cake macaroon apple pie. Powder tootsie roll
              wafer muffin oat cake cupcake dragée.
              {'\n'}
              {'\n'}Caramels marshmallow donut cupcake fruitcake tiramisu sweet
              roll apple pie. Gummi bears dragée gummi bears gummi bears
              biscuit. Candy brownie brownie marshmallow bonbon muffin bear claw
              cookie. Oat cake halvah lemon drops lollipop soufflé chupa chups
              soufflé carrot cake lollipop. Toffee dragée sweet apple pie
              cupcake pie dessert cake tart. Chocolate cake donut sugar plum
              wafer croissant.
            </Text>
          </View>
          <View>
            <Text
              style={{
                fontWeight: 'bold',
                fontSize: 14,
                textAlign: 'left',
                paddingHorizontal: 20,
                color: Color.text,
              }}>
              Detail Acara
            </Text>
            <View style={{flexDirection: 'row', paddingVertical: 12}}>
              <Text
                style={{
                  color: Color.secondary,
                  fontWeight: 'bold',
                  textAlign: 'left',
                  fontSize: 16,
                  paddingHorizontal: 20,
                  width: '36%',
                }}>
                Lokasi
              </Text>
              <Text
                style={{
                  color: Color.secondary,
                  fontWeight: 'bold',
                  textAlign: 'left',
                  fontSize: 16,
                  width: '5%',
                }}>
                :
              </Text>
              <Text
                style={{
                  color: Color.primary,
                  fontWeight: 'bold',
                  textAlign: 'justify',
                  fontSize: 16,
                  width: '52%',
                  lineHeight: 23,
                }}>
                Jl. Casablanca Raya Kav. 88, Menteng Dalam, Kec. Tebet, Daerah
                Khusus Ibukota Jakarta 12870
              </Text>
            </View>
            <View style={{flexDirection: 'row'}}>
              <Text
                style={{
                  color: Color.secondary,
                  fontWeight: 'bold',
                  textAlign: 'left',
                  fontSize: 16,
                  paddingHorizontal: 20,
                  width: '36%',
                }}>
                Tanggal
              </Text>
              <Text
                style={{
                  color: Color.secondary,
                  fontWeight: 'bold',
                  textAlign: 'left',
                  fontSize: 16,
                  width: '5%',
                }}>
                :
              </Text>
              <Text
                style={{
                  color: Color.secondary,
                  fontWeight: 'bold',
                  textAlign: 'justify',
                  fontSize: 16,
                  width: '52%',
                  lineHeight: 23,
                }}>
                08 Februari 2022
              </Text>
            </View>
            <View style={{flexDirection: 'row', paddingVertical: 10}}>
              <Text
                style={{
                  color: Color.secondary,
                  fontWeight: 'bold',
                  textAlign: 'left',
                  fontSize: 16,
                  paddingHorizontal: 20,
                  width: '36%',
                }}>
                Penyelenggara
              </Text>
              <Text
                style={{
                  color: Color.secondary,
                  fontWeight: 'bold',
                  textAlign: 'left',
                  fontSize: 16,
                  width: '5%',
                }}>
                :
              </Text>
              <Text
                style={{
                  color: Color.text,
                  fontWeight: 'bold',
                  textAlign: 'justify',
                  fontSize: 16,
                  width: '23%',
                  lineHeight: 23,
                }}>
                Tribesocial
              </Text>
              <Octions
                name={'verified'}
                size={20}
                style={{color: Color.blue}}
              />
            </View>
          </View>
        </View>
      </ScrollView>
      <View style={{alignItems: 'center'}}>
        <TouchableOpacity
          style={{
            backgroundColor: Color.primary,
            width: '90%',
            height: 50,
            borderRadius: 25,
            justifyContent: 'center',
          }}>
          <Text
            style={{color: Color.textInput, fontSize: 16, fontWeight: 'bold'}}>
            Pesan Tiket
          </Text>
        </TouchableOpacity>
      </View>
    </Scaffold>
  );
};
