import { Navigate, useLocation } from 'react-router';
import { selectUser, setUser } from '../containers/Login/LoginSlice';
import { useAppDispatch, useAppSelector } from '../hooks';
import { getItem } from '../utils/storage';

export const RequireAuth = ({ children }: { children: JSX.Element }) => {
  const user = getItem('user');
  const userState = useAppSelector(selectUser);
  let location = useLocation();
  const dispatch = useAppDispatch();

  // Dispatch user data only once
  if (user && !userState) {
    // keep the loginSlice updated with the user data.
    // could also come from GET api/account/info
    // if we decide not to store all user's data in the localStorage.
    dispatch(setUser(user));
  }
  if (!user) {
    // Redirect them to the /login page, but save the current location they were
    // trying to go to when they were redirected. This allows us to send them
    // along to that page after they login, which is a nicer user experience
    // than dropping them off on the home page.
    return (
      <Navigate
        to="/login"
        state={{ from: location.pathname === '/sidebar' ? '/' : location }}
      />
    );
  }

  return children;
};

// 1. ngOnChanges() ashxatum e input output kapi mej popoxutyun nkateluc
// 2. ngOnInit() ashxatum e ejy bacveluc
// 3. ngDoCheck() ashxatum e componentum popoxutyunneri jamanak
// 4. ngAfterContentInit() ashxatum e bovandakutyan proekti katarumic heto
// 5. ngAfterContentChecked() ashxatum e kontenti popoxuthay jamanak
// 6. ngAfterViewInit() ashxatum e erb component i view y full nkarvela aysinqn erb child componenty full ashxatela
// 7. ngAfterViewChecked() ashxatum e erb component i view um mi ban poxvuma
// 8. ngOnDestroy() ashxatuma componenti jnjveluc