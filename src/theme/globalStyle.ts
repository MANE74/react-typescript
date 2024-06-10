import { createGlobalStyle } from 'styled-components';
import { Fonts } from '../fonts/fonts';
import { palette } from './colors';

// import RobotoBlack from "/theme/fonts/roboto/Roboto-Black.woff";

const GlobalStyle = createGlobalStyle`

// Reset Styles start
html, body, div, span, applet, object, iframe,
h1, h2, h3, h4, h5, h6, p, blockquote, pre,
a, abbr, acronym, address, big, cite, code,
del, dfn, em, img, ins, kbd, q, s, samp,
small, strike, strong, sub, sup, tt, var,
b, u, i, center,
dl, dt, dd, ol, ul, li,
fieldset, form, label, legend,
table, caption, tbody, tfoot, thead, tr, th, td,
article, aside, canvas, details, embed, 
figure, figcaption, footer, header, hgroup, 
menu, nav, output, ruby, section, summary,
time, mark, audio, video {
	margin: 0;
	padding: 0;
	border: 0;
	font-size: 100%;
	font: inherit;
	vertical-align: baseline;
}
/* HTML5 display-role reset for older browsers */
article, aside, details, figcaption, figure, 
footer, header, hgroup, menu, nav, section {
	display: block;
}
body {
	line-height: 1;
}
ol, ul {
	list-style: none;
}
blockquote, q {
	quotes: none;
}
blockquote:before, blockquote:after,
q:before, q:after {
	content: '';
	content: none;
}
table {
	border-collapse: collapse;
	border-spacing: 0;
}
// Reset Styles end

// declaring fonts 
${Fonts}


// Global Styles start

.skolon-button-wrapper {
	position: fixed;
	top: 25px;
	right: 25px;
	z-index: 1500;
  }

 /* width */
 ::-webkit-scrollbar {
    width: 10px;
  }
  /* Track */
  ::-webkit-scrollbar-track {
    background: #f1f1f1; 
    border: 2px solid #FFB100; 
    border-radius: 10px;
  }
  /* Handle */
  ::-webkit-scrollbar-thumb {
    background: #FFB100; 
    border-radius: 10px;
  }
  
  /* Handle on hover */
  ::-webkit-scrollbar-thumb:hover {
    background: #555; 
    cursor: pointer;
  }

//Google Maps Searchbox
.pac-container{
	margin-top: -1px;
	border: none;
	box-shadow: none;
	background-color: ${({ theme }) => theme.palette.background.searchBar};
	border-radius: 10px;
}
.pac-matched{
	color: ${palette.honeyYellow};
	font-family: 'Roboto-Regular';
	font-weight: 400;
	font-size: 0.8rem;
}
.pac-item{
	background-color: ${({ theme }) => theme.palette.background.searchBar};
	border:none;

	:hover{
		background-color: ${({ theme }) => theme.palette.background.primary};
	}

}
.pac-item-query{
	color: ${palette.silver};
	font-family: 'Roboto-Regular';
	font-weight: 400;
	font-size: 0.8rem;
}

//Disable scrollbar
body, html{
	-ms-overflow-style: none;  /* IE and Edge */
	scrollbar-width: none;  /* Firefox */

	/* Hide scrollbar for Chrome, Safari and Opera */
	&::-webkit-scrollbar{
		display: none;
	}
}

body{
  background-color: ${palette.darkblack};
  color: ${(props) => props.theme.palette.text.primary};
  overflow-x: hidden;
  min-height: 100vh;
}
html{
  font-size: 16px;
  font-family: 'Roboto',sans-serif;
  @media (max-width: 768px){
    overflow-x: hidden;
  }

}
*,*::after,*::before{
  box-sizing: border-box;
  -webkit-box-sizing: border-box; 
}
p{
	line-height: 1.3em
}

//Typography
h1{
	font-family: "Roboto-Medium";
	font-size: 26px;
}
h2{
	font-family: "Roboto-Medium";
	font-size: 24px;
}
h3{
	font-family: "Roboto-Medium";
	font-size: 20px;
}
h4{
	font-family: "Roboto-Medium";
	font-size: 18px;
}
h5{
	font-family: "Roboto-Regular";
	font-size: 18px;
}
`;

export default GlobalStyle;
