import { useCallback, useEffect, useState } from 'react';

import { useInterval } from '../hooks/useInterval';
import bellFinish from '../sounds/src_sounds_bell-finish.mp3';
import bellStart from '../sounds/src_sounds_bell-start.mp3';
import { secondsToTime } from '../utils/secondsToTime';
import Button from './Button';
import Timer from './Timer';

const audioStartWorking = new Audio(bellStart);
const audioStopWorking = new Audio(bellFinish);

interface Props {
  pomodoroTime: number;
  shortRestTime: number;
  longRestTime: number;
  cycles: number;
}

const PomodoroTimer = (props: Props) => {
  const [mainTime, setMainTime] = useState(props.pomodoroTime);
  const [timeCounting, setTimeCouting] = useState(false);
  const [working, setWorking] = useState(false);
  const [resting, setResting] = useState(false);
  const [cyclesQtdManager, setCyclesQtdManager] = useState(
    new Array(props.cycles - 1).fill(true),
  );
  const [completedCycles, setCompletedCycles] = useState(0);
  const [fullWorkingTime, setFullWorkingTime] = useState(0);
  const [numberOfPomodoros, setNumberOfPomodoros] = useState(0);

  useInterval(
    () => {
      setMainTime(mainTime - 1);
      if (working) setFullWorkingTime(fullWorkingTime + 1);
    },
    timeCounting ? 1000 : null,
  );

  const configureWork = useCallback(() => {
    setTimeCouting(true);
    setWorking(true);
    setResting(false);
    setMainTime(props.pomodoroTime);
    audioStartWorking.play();
  }, [setTimeCouting, setWorking, setResting, props.pomodoroTime]);

  const configureRest = useCallback(
    (long: boolean) => {
      setTimeCouting(true);
      setWorking(false);
      setResting(true);
      setMainTime(props.pomodoroTime);
      if (long) {
        setMainTime(props.longRestTime);
      } else {
        setMainTime(props.shortRestTime);
      }
      audioStopWorking.play();
    },
    [
      setTimeCouting,
      setWorking,
      setResting,
      setMainTime,
      props.longRestTime,
      props.pomodoroTime,
      props.shortRestTime,
    ],
  );

  useEffect(() => {
    if (working) document.body.classList.add('working');
    if (resting) document.body.classList.remove('working');

    if (mainTime > 0) return;

    if (working && cyclesQtdManager.length > 0) {
      configureRest(false);
      cyclesQtdManager.pop();
    } else if (working && cyclesQtdManager.length <= 0) {
      configureRest(true);
      setCyclesQtdManager(new Array(props.cycles - 1).fill(true));
      setCompletedCycles(completedCycles + 1);
    }

    if (working) setNumberOfPomodoros(numberOfPomodoros + 1);
    if (resting) configureWork();
  }, [
    working,
    resting,
    mainTime,
    completedCycles,
    configureRest,
    setCyclesQtdManager,
    configureWork,
    props.cycles,
  ]);

  return (
    <div className="pomodoro">
      <h2>You are: {working ? 'Working' : 'Resting'}</h2>
      <Timer mainTime={mainTime} />
      <div>
        <Button text="Work" onClick={configureWork} />
        <Button text="Rest" onClick={() => configureRest(false)} />
        {
          <Button
            className={!working && !resting ? 'hidden' : ''}
            text={timeCounting ? 'Pause' : 'Play'}
            onClick={() => setTimeCouting(!timeCounting)}
          />
        }
      </div>
      <div className="details">
        <p>Ciclos concluídos: {completedCycles}</p>
        <p>Horas trabalhadas: {secondsToTime(fullWorkingTime)}</p>
        <p>Pomodoros concluídos: {numberOfPomodoros}</p>
      </div>
    </div>
  );
};

export default PomodoroTimer;
