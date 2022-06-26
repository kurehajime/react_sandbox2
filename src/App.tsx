import './App.css';
import Colamone from './components/Colamone';
import { useEffect } from 'react';
import i18n from './i18n/configs';
import { Util } from './static/Util';

function App() {

  useEffect(() => {
    const lang = Util.getLang()
    i18n.changeLanguage(lang);
  }, []);



  return (
      <Colamone></Colamone>
  );
}

export default App;
