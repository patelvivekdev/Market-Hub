// Create a component called Image that renders an <img> element.
// The <img> should use the src prop for its source.

import Image from 'react-bootstrap/Image';

const Img = ({ src, alt }) => {
	return (
		<Image src={src} alt={alt} fluid thumbnail />
	);
};

export default Img;