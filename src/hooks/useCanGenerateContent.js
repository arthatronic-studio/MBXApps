import { store } from '@src/state/redux';
import { useSelector } from 'react-redux';
import { accessClient } from 'src/utils/access_client';

export const useCurrentUser = (isRoot) => {
    const user = isRoot
        ? store.getState()['user.auth'].login.user
        : useSelector(state => state['user.auth'].login.user);

    let canGeneratedContent = accessClient.UserGeneratedContent === 'ALL_USER';
    if (user && user.guest) canGeneratedContent = false;
    else if (accessClient.UserGeneratedContent === 'ONLY_ADMIN' && user && user.isDirector === 1) canGeneratedContent = true;
    else if (accessClient.UserGeneratedContent === 'ONLY_MEMBER' && user && user.organizationId) canGeneratedContent = true;
    
    const isBusinessCompany = user && user.businessCompany;
    const isAdmin = user && user.isDirector === 1;

    return {canGeneratedContent, isBusinessCompany, isAdmin};
};
