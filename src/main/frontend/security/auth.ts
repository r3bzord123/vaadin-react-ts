import { configureAuth } from '@vaadin/hilla-react-auth';
import { CurrentUserService } from 'Frontend/generated/endpoints';

const auth = configureAuth(CurrentUserService.getUserInfo);
export const useAuth = auth.useAuth;
export const AuthProvider = auth.AuthProvider;
