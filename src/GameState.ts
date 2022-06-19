import { atom } from 'recoil';
import { Hand } from './logic/rule';
export enum Mode {
  game,
  result,
  log,
}
export const $turn_player = atom<number>({
  key: 'turn_player',
  default: 0,
});
export const $map = atom<number[]>({
  key: 'map',
  default: [],
});
export const $hover = atom<number | null>({
  key: 'hover',
  default: null,
});
export const $cover = atom<boolean>({
  key: 'cover',
  default: false,
});
export const $score = atom<boolean>({
  key: 'score',
  default: false,
});
export const $hand = atom<Hand | null>({
  key: 'hand',
  default: null,
});
export const $message = atom<string>({
  key: 'message',
  default: '',
});
export const $blueScore = atom<number>({
  key: 'blueScore',
  default: 0,
});
export const $redScore = atom<number>({
  key: 'redScore',
  default: 0,
});
export const $level = atom<number>({
  key: 'level',
  default: 0,
});
export const $winner = atom<number | null>({
  key: 'winner',
  default: null,
});
export const $map_list = atom<{ [index: string]: number; }>({
  key: 'map_list',
  default: {},
});
export const $mode = atom<Mode>({
  key: 'mode',
  default: Mode.game,
});

