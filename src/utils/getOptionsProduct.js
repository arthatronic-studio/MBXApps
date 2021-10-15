const PulsaPostpaidProvider = [
    { id: 'TELKOMPSTN', name: 'Telkom', images: { uri: '' }},
    { id: 'HPTSEL', name: 'Kartu Halo', images: { uri: '' }},
    { id: 'HPTHREE', name: 'Three (3) Pascabayar', images: { uri: '' }},
    { id: 'HPXL', name: 'XL Pascabayar', images: { uri: '' }},
    { id: 'HPMTRIX', name: 'Indosat Matrix', images: { uri: '' }},
    { id: 'HPSMART', name: 'Smartfren Pascabayar', images: { uri: '' }},
];

function getOptionsProduct(booking) {
    const { flights, tours, attractions, buses, hotels, vestabalance, prepaidTransaction, postpaidTransaction, vestaBiller } = booking;
    let prepaidCategory = null;
    if (prepaidTransaction) prepaidCategory = prepaidTransaction.category;

    let postpaidCategory = null;
    if (postpaidTransaction) postpaidCategory = postpaidTransaction;

    let navigateScreen = '', productType = 'Not Set', productName = '';

    if (!booking) {
        return {
            navigateScreen,
            productType,
        }
    }

    if (flights && flights.length > 0) {
        productType = 'FLIGHT';
    }
    else if (tours && tours.length > 0) {
        productType = 'TOUR';
    }
    else if (attractions) {
        productType = 'ATTRACTION';
    }
    else if (buses) {
        productType = 'BUS';
    }
    else if (hotels) {
        productType = 'HOTEL';
    }
    else if (vestabalance) {
        productType = 'TOPUP';
        productName = 'Topup';
        navigateScreen = 'TopUpOrderDetail';
    }
    else if (prepaidCategory == 'PULSA_HP') {
        productType = 'PULSA_HP';
        productName = 'Pulsa - ' + booking.prepaidTransaction.destinationNumber;
        navigateScreen = 'PulsaScreen';
    }
    else if (prepaidCategory == 'PAKET_DATA') {
        productType = 'PAKET_DATA';
        productName = 'Paket Data - ' + booking.prepaidTransaction.destinationNumber;
        navigateScreen = 'PulsaScreen';
    }
    else if (prepaidCategory == 'TOKEN_LISTRIK') {
        productType = 'TOKEN_LISTRIK';
        productName = 'Token Listrik - ' + booking.prepaidTransaction.destinationNumber;
        navigateScreen = 'PlnScreen';
    }
    else if (postpaidCategory) {
        for (const pulsaPostpaid of PulsaPostpaidProvider) {
            if (postpaidCategory.productCode === pulsaPostpaid.id) {
                productType = 'PULSAPOSTPAID';
                productName = postpaidCategory.customerSubscribeNumber + ' - ' + postpaidCategory.customerName;
                navigateScreen = 'PulsaScreen';
            }
        }

        if (postpaidCategory.productCode === 'PLNPOSTPAID') {
            productType = 'PLNPOSTPAID';
            productName = postpaidCategory.customerSubscribeNumber + ' - ' + postpaidCategory.customerName;
            navigateScreen = 'PlnScreen';
        }
        
        // PDAM default postpaid
        if (productType === 'Not Set') {
            productType = 'PDAMPOSTPAID';
            productName = postpaidCategory.customerSubscribeNumber + ' - ' + postpaidCategory.customerName;
            navigateScreen = 'PdamScreen';
        }
    }
    else if (vestaBiller) {
        if (vestaBiller.type === 'RECURE') {
            productType = 'SAMBATAN';
            productName = booking.name;
            navigateScreen = 'ReviewMandatoryDues';
        }
        else if (vestaBiller.type === 'ONETIME') {
            productType = 'SAMBATAN_O';
            productName = booking.name;
            navigateScreen = 'ReviewOrderDues';
        }
    }

        // buses ? 'buses' :
        // hotels ? 'hotels' :

    return {
        navigateScreen,
        productType,
        productName,
    }
}

export { getOptionsProduct };