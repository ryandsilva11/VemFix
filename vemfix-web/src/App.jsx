import { Flex } from '@chakra-ui/react';
import Header from './components/Header';
import Footer from './components/Footer';
import Feed from './pages/Feed';

function App() {
  return (
    <Flex direction="column" minH="100vh" bg="vemfix.pageBg">
      <Header />
      <Feed />
      <Footer />
    </Flex>
  );
}

export default App;
