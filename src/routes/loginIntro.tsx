import axios from 'axios';
import { useEffect } from 'react';
import { Layout } from '../components/Layout/Layout';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { LoginIntro } from '../containers/LoginIntro/LoginIntro';
import { getItem } from '../utils/storage';

export const LoginIntroPage = () => {
  const navigation = useNavigate();
  const { pathname } = useLocation();

  useEffect(() => {
    axios
      .get(
        'https://translation-tool.ccstudio.lv/Cosafe/texts_export.php?lang=en'
      )
      .then(res => console.log(res.data));

    const user = getItem('user');
    if (user && user?.TwoFactorAuthCodeRequired === true) {
      return navigation('/2fv');
    } else if (user && user?.id) {
      return navigation('/dashboard');
    }
// change it to get intro page 
    if (pathname === '/') navigation(`/login`);
    if (pathname === '/intro') navigation(`/login`);
  }, [navigation]);

  return (
    <Layout backBtn isAuthLayout={false}>
      <Routes>
        <Route path="/" element={<LoginIntro />} />
        <Route path=":index" element={<LoginIntro />} />
      </Routes>
    </Layout>
  );
};
