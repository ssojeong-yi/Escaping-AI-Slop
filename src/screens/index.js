import BaselineScreen from './BaselineScreen.jsx';
import MinimalCardScreen from './MinimalCardScreen.jsx';
import TypographyScreen from './TypographyScreen.jsx';
import NoHeroScreen from './NoHeroScreen.jsx';
import InfoFirstScreen from './InfoFirstScreen.jsx';
import FinalScreen from './FinalScreen.jsx';

// variants.js 의 id → 화면 컴포넌트
export const screens = {
  baseline: BaselineScreen,
  minimal: MinimalCardScreen,
  typography: TypographyScreen,
  nohero: NoHeroScreen,
  info: InfoFirstScreen,
  final: FinalScreen,
};
