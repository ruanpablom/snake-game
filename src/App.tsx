import { KeyboardEvent, useEffect, useMemo, useRef, useState } from 'react';
import bolt from './assets/bolt.svg';
import keyboardArrows from './assets/keyboardArrows.svg';
import './App.css';

type MoveTo = 'up' | 'down' | 'left' | 'right';

const MoveToRule = {
  up: {
    line: -1,
    col: 0
  },
  down: {
    line: 1,
    col: 0
  },
  left: {
    line: 0,
    col: -1
  },
  right: {
    line: 0,
    col: 1
  }
}

function getRandomInt(max: number) {
  return Math.floor(Math.random() * max);
}

type ScoreboardElement = {
  name: string;
  score: number;
}

const initialScoreBoard: ScoreboardElement[] = [{name: 'RUAN', score: 0}, {name: 'PABLO', score: 0}, {name: 'MEDEIROS', score: 0}];

type AppProps = {
  cols?: number;
  lns?: number;
}

function App({cols = 21, lns = 33}: AppProps) {
  const [snake, setSnake] = useState<string[]>(['1-1']);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [scoreboard, setScoreboard] = useState<ScoreboardElement[]>(initialScoreBoard);
  const [isDialogoRecordOpen, setIsDialogoRecordOpen] = useState<boolean>(false);

  const moveTo = useRef<MoveTo>('right');
  const point = useRef<string>(`${getRandomInt(lns)}-${getRandomInt(cols)}`);

  const columns = useMemo<number[]>(() => [...Array(cols).keys()], []);
  const lines = useMemo<number[]>(() => [...Array(lns).keys()], []);
  
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'ArrowUp') {
      moveTo.current = "up"
    }
    else if (e.key === 'ArrowDown') {
      moveTo.current = 'down';
    }
    else if (e.key === 'ArrowLeft') {
      moveTo.current = 'left';
    }
    else if (e.key === 'ArrowRight') {
      moveTo.current = 'right';
    }
  }

  const makePoint = (snake: string[]) => {
    let isValidPoint = false;
    let newPoint = point.current;

    while(!isValidPoint){
      newPoint = `${getRandomInt(lns)}-${getRandomInt(cols)}`;
      isValidPoint = !(newPoint === point.current || snake.includes(newPoint));
    }

    return point.current = newPoint;
  }

  const playGame = () => {
    const container = document.querySelector('.container') as HTMLElement;
    container.focus();

    setSnake(['1-1']);
    moveTo.current = 'right';
    makePoint(['1-1']);
    setIsPlaying(true);
  }

  const recordPositionOnScoreboard = (snakeSize: number) => {
    return scoreboard.findIndex((scoreElement) => scoreElement.score < snakeSize);
  }

  const gameOver = (snakeSize: number) => {
    setIsPlaying(false);

    const rps = recordPositionOnScoreboard(snakeSize);
    if(rps !== -1){
      setIsDialogoRecordOpen(true);
    }
  }

  const handleSalvarRecorde = () => {
    const rps = recordPositionOnScoreboard(snake.length);

    const name = (document.querySelector('input[id=nomeRecordista]') as HTMLInputElement).value;
    const score = snake.length;

    const newScoreBoard = [...scoreboard];
    newScoreBoard.splice(rps, 0,{name, score})
    newScoreBoard.splice(-1);
    
    setScoreboard(newScoreBoard);
    setIsDialogoRecordOpen(false);
  }

  const moveSnake = () => {  
    setSnake(prevSnake => {
      const [line, col] = prevSnake[0].split('-').map(el => Number(el));

      const {line: addLine, col: addCol} = MoveToRule[moveTo.current];

      const snakeHead = `${line+addLine}-${col+addCol}`;

      if(
        line+addLine < 0 || 
        line+addLine === lns || 
        col+addCol < 0 || 
        col+addCol === cols ||
        prevSnake.includes(snakeHead)
      ){
        gameOver(prevSnake.length);
        return prevSnake;
      }else {
        const snakeBody = [...prevSnake];

        snakeBody.splice(-1);

        if(snakeHead === point.current){
          return ([snakeHead, snakeHead, ...snakeBody]);
        }else {
          return [snakeHead, ...snakeBody];
        }
      }
    })
  }

  const snakePointStyle = (line: number, col: number) => {
    const snakePointPos = snake.indexOf(`${line}-${col}`);
    const snakeLen = snake.length;
    const alpha = (snakeLen - snakePointPos)/snakeLen;
    const dividendAlpha2 = (snakeLen - snakePointPos - 1);
    const alpha2 = dividendAlpha2/snakeLen;

    const calcAngle = (actualPointIndex: number, prevPointIndex:number) => {
      const [actualLine, actualCol] = snake[actualPointIndex].split('-').map(el => Number(el));
      const [prevLine, prevCol] = snake[prevPointIndex].split('-').map(el => Number(el));

      if(prevLine-actualLine <= -1){
        return '180deg'
      }
      if(prevLine-actualLine >= 1){
        return '0deg'
      }
      if(prevCol-actualCol >= 1){
        return '-90deg'
      }
      if(prevCol-actualCol <= -1){
        return '90deg'
      }
      if(actualPointIndex === prevPointIndex && actualPointIndex === 0){
        switch(moveTo.current) {
          case 'right':
            return '-90deg';
          case 'left':
            return '90deg';
          case 'up':
            return '180deg';
          case 'down':
            return '0deg ';
        }
      }
    }

    const calcBorderRadius = () => {
      switch(moveTo.current) {
        case 'right':
          return '0% 50% 50% 0%';
        case 'left':
          return '50% 0% 0% 50%';
        case 'up':
          return '50% 50% 0% 0%';
        case 'down':
          return '0% 0% 50% 50%';
      }
    }

    const actualPoint = snake[snakePointPos];
    let prevPointPosition = snakePointPos - 1 >= 0 ? snakePointPos - 1 : 0;
    let prevPoint;
    if(prevPointPosition === snakeLen){
      prevPointPosition = snakePointPos;
    }else{
      prevPoint = snake[prevPointPosition]
      if(prevPoint === actualPoint && prevPointPosition != 0 && (prevPointPosition+1) < snakeLen){
        prevPointPosition = prevPointPosition+1;
      } 
    }
    
    const angle = calcAngle(snakePointPos, prevPointPosition);

    return {
      background: `linear-gradient(${angle ? `${angle},` : ''}rgba(67, 217, 173, ${alpha}) 0%, rgba(67, 217, 173, ${alpha2}) 100%)`,
      borderRadius: snakePointPos === 0 ? calcBorderRadius() : '0px'
    }
  }

  useEffect(() => {
    if(snake.includes(point.current)) makePoint(snake)
  }, [snake]);

  useEffect(() => {
    let tick: number | undefined;

    if(isPlaying){
      tick = setInterval(() => moveSnake(), 150);
    }

    return () => clearInterval(tick);
  }, [isPlaying]);

  return (
    <div className="container" tabIndex={0} onKeyDown={handleKeyDown}>
      <div className="boltLeftTop">
        <img src={bolt} alt="" />
      </div>
      <div className="boltRightTop">
        <img src={bolt} alt="" />
      </div>
      <div className="boltRightBottom">
        <img src={bolt} alt="" />
      </div>
      <div className="boltLeftBottom">
        <img src={bolt} alt="" />
      </div>
      { isDialogoRecordOpen &&
        <div className="dialogo dialogo_ativo">
          <div className="dialogo__container">
            <h2>Novo Recorde!</h2>
            <div className="inputContainer">
              <label htmlFor="nomeRecordista">Nome</label>
              <input id="nomeRecordista" type="text" maxLength={9} />
            </div>
            <button className='buttonStart' type="button" onClick={handleSalvarRecorde}>Salvar</button>
          </div>
        </div>
      }
      <div className="content">
        <div className="gameContainer" >
          {lines.map(line => (
            <div key={line} className="line">
              {columns.map(col => (
                <span 
                  key={`${line}-${col}`}
                  className={point.current === `${line}-${col}` ? 'point' : ''} 
                  style={snake.includes(`${line}-${col}`) ? snakePointStyle(line, col) : {}} 
                  id={`${line}-${col}`}
                />
              ))}
            </div>
          ))}
          {!isPlaying && 
            <div className="buttonContainer">
              <button 
                className='buttonStart'
                type="button" 
                onClick={playGame}
              >
                start-game
              </button>
            </div>
          }
        </div>
        <div className="rightContainer">
          <div className="infoContainer">
            <h2>// Points: {snake.length}pts</h2>
          </div>
          <div className="infoContainer">
            <ul className='scoreBoardList'>
              <h2>// Scoreboard </h2>
              {scoreboard.map((element, index) => (
                <li key={index} className='scoreBoardItem'>
                  <h2 className='name'>{`${index+1} ${element.name}`}</h2>
                  <div className="separator"/>
                  <h2 className='score'>{element.score}pts</h2>
                </li>
                ))
              }
            </ul>
          </div>
          <div className="infoContainer">
            <h2>// use keyboard</h2>
            <h2>// arrows to play</h2>
            <img className='keyboardArrows' src={keyboardArrows} alt="" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
