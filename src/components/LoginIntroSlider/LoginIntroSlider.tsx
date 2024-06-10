import Slider from 'react-slick';
import styled from 'styled-components';
import slider1Img from '../../assets/imgs/general/slider1.svg';
import { palette } from '../../theme/colors';

const SLoginIntroSlider = styled.div`
  padding-bottom: 5vh;

  height: 45%;
  @media (min-height: 700px) {
    height: 59%;
  }
  @media (min-height: 1000px) {
    height: 40%;
  }
  .slick-slider,
  .slide-inner-div,
  .slick-list,
  .slick-track {
    height: 100%;
  }
  .slick-slide {
    height: 100%;
    div {
      height: 100%;
    }
  }

  .slick-dots {
    .slick-active ~ li {
      button {
        background-color: ${palette.lightGrey};
      }
    }
    button {
      width: 0;
      min-width: 10px;
      height: 10px;
      @media (max-height: 500px) {
        height: 4px;
      }
      border-radius: 10px;
      background-color: ${palette.gold};
      transition: min-width 0.4s ease, background-color 0.4s ease;
      &:before {
        display: none;
      }
    }

    .slick-active {
      button {
        min-width: 40px;
        background-color: ${palette.gold};
      }
      & + li {
        button {
          background-color: ${palette.gold};
        }
      }
    }
    .slick-active:last-child {
      button {
        min-width: 0px;
      }
    }
  }
`;

const SSlide = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
`;

const SImage = styled.img`
  margin: auto;
  height: 100%;
  aspect-ratio: 1;
`;
export const LoginIntroSlider = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 10000,
    adaptiveHeight: true,
    className: 'slide-inner-div',
  };

  return (
    <SLoginIntroSlider>
      <Slider {...settings}>
        <SSlide>
          <SImage src={slider1Img} alt="" />
        </SSlide>
        <SSlide>
          <SImage src={slider1Img} alt="" />
        </SSlide>
        <SSlide>
          <SImage src={slider1Img} alt="" />
        </SSlide>
        <SSlide>
          <SImage src={slider1Img} alt="" />
        </SSlide>
        <SSlide>
          <SImage src={slider1Img} alt="" />
        </SSlide>
        <SSlide>
          <SImage src={slider1Img} alt="" />
        </SSlide>
      </Slider>
    </SLoginIntroSlider>
  );
};
