import { Helmet } from 'react-helmet-async';

const Meta = ({ title, description, keywords }) => {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name='description' content={description} />
      <meta name='keyword' content={keywords} />
    </Helmet>
  );
};

Meta.defaultProps = {
  title: 'Welcome To Market-Hub',
  description: 'Market Place is a web application that allows users to buy and sell products at single place.',
  keywords: 'market hub, buy computer parts, sell parts, paypal, cheap electronics',
};

export default Meta;
