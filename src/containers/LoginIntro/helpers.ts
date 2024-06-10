import Intro0 from '../../assets/imgs/loginIntro/intro0.svg';
import Intro1 from '../../assets/imgs/loginIntro/intro1.svg';
import Intro2 from '../../assets/imgs/loginIntro/intro2.svg';
import Intro3 from '../../assets/imgs/loginIntro/intro3.svg';
import Intro4 from '../../assets/imgs/loginIntro/intro4.svg';

export interface IntroSlide {
  pic: string;
  title: string;
  disc: string;
  next: string;
  back?: string;
}

export const introTutorial: IntroSlide[] = [
  // actuall route /intro
  {
    disc: 'Login_intro_1_description',
    pic: Intro0,
    title: 'Login_intro_1_title',
    next: '/intro/1',
  },
  // actuall route /intro/1
  {
    disc: 'Login_intro_2_description',
    pic: Intro1,
    title: 'Login_intro_2_title',
    next: '/intro/2',
    back: '/intro',
  },
  // actuall route /intro/2
  {
    disc: 'Login_intro_3_description',
    pic: Intro2,
    title: 'Login_intro_3_title',
    next: '/intro/3',
    back: '/intro/1',
  },
  // actuall route /intro/3
  {
    disc: 'Login_intro_4_description',
    pic: Intro3,
    title: 'Login_intro_4_title',
    next: '/intro/4',
    back: '/intro/2',
  },
  // actuall route /intro/4
  {
    disc: 'Login_intro_5_description',
    pic: Intro4,
    title: 'Login_intro_5_title',
    next: '/login',
    back: '/intro/3',
  },
];
