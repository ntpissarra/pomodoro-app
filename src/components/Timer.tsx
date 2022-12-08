import { secondsToMinutes } from '../utils/secondsToMinutes';

interface Props {
  mainTime: number;
}

const Timer = (props: Props) => {
  return <div className="timer">{secondsToMinutes(props.mainTime)}</div>;
};

export default Timer;
