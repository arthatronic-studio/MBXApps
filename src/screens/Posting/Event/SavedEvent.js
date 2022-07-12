import React, {useState, useEffect, useRef} from 'react';
import Header from '@src/components/Header';
import {useLoading, usePopup, useColor, Alert, Row, Col} from '@src/components';
import Scaffold from '@src/components/Scaffold';
import HighlightContentProduct from 'src/components/Content/HighlightContentProduct';
import { Container, Divider, Padding } from 'src/styled';
import ListContentProductV2 from 'src/components/Content/ListContentProductV2';


const SavedEvent = ({route}) => {

    const {Color} = useColor();

  const [popupProps, showPopup] = usePopup();
  const [loadingProps, showLoading, hideLoading] = useLoading();
  return (
    <Scaffold
      fallback={false}
      empty={false}
      popupProps={popupProps}
      loadingProps={loadingProps}
      header={
        <Header
          type="bold"
          centerTitle={false}
          title="Event Disimpan"
        />
      }
    >
    {/* <Divider height={50}/> */}
    <ListContentProductV2
      productCategory='EVENT'
      name='Event'
      bookmarked={true}
    />
    <Divider height={20}/>
    </Scaffold>
  )
}

export default SavedEvent