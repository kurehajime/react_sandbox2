import { atom } from 'recoil';

export default atom({
  key: 'gameState',
  default: [
    {
      id: 0,
      map: [],
      hover: null
    },
  ],
});