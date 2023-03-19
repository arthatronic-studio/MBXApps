import Share from 'react-native-share';
import { fetchContentShare } from 'src/api/contentShare';

export const onShare = async(url, code) => {
    await Share.open({
        message: url,
    });

    // if (code) await fetchContentShare({ code });
}