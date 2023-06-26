import { KeyboardEvent, useEffect, useMemo, useRef, useState } from "react";
import { MoveToRule } from "./data";
import { GameScreenProps, MoveTo } from "./types";

export function useBloc({rowsQty, colsQty, setScore, evaluateNewRecord}: GameScreenProps) {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const point = useRef<string>(`${getRandomInt(rowsQty)}-${getRandomInt(colsQty)}`);
  const [snake, setSnake] = useState<string[]>(['1-1']);
  const moveTo = useRef<MoveTo>('right');

  const gameMatrix = useMemo<string[][]>(() => {
    const rows = new Array(rowsQty);
    
    for(let i=0; i<rowsQty; i++){
      const cols = new Array(colsQty);
      for(let j=0; j<colsQty; j++) {
        cols[j] = `${i}-${j}`;
      }
      rows[i] = [...cols]
    }

    return rows;
  }, [rowsQty, colsQty]);

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

  const snakeSegmentLinearGradientAngle = (segmentIndex: number) => {
    let prevSegmentIndex = segmentIndex - 1 >= 0 ? segmentIndex - 1 : 0;
    if(prevSegmentIndex === snake.length){
      prevSegmentIndex = segmentIndex;
    }else{
      if(snake[prevSegmentIndex] === snake[segmentIndex] && prevSegmentIndex != 0 && (prevSegmentIndex+1) < snake.length){
        prevSegmentIndex = prevSegmentIndex+1;
      } 
    }

    const [segmentRow, segmentCol] = snake[segmentIndex].split('-').map(el => Number(el));
    const [prevSegmentRow, prevSegmentCol] = snake[prevSegmentIndex].split('-').map(el => Number(el));

    if(prevSegmentRow-segmentRow <= -1){
      return '180deg'
    }
    if(prevSegmentRow-segmentRow >= 1){
      return '0deg'
    }
    if(prevSegmentCol-segmentCol >= 1){
      return '-90deg'
    }
    if(prevSegmentCol-segmentCol <= -1){
      return '90deg'
    }
    if(segmentIndex === prevSegmentIndex && segmentIndex === 0){
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

  const snakeHeadBorderRadius = () => {
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

  const snakeSegmentLinearGradient = (snakeSegmentIndex: number) => {
    const snakeLen = snake.length;
    const alpha = (snakeLen - snakeSegmentIndex)/snakeLen;
    const dividendAlpha2 = (snakeLen - snakeSegmentIndex - 1);
    const alpha2 = dividendAlpha2/snakeLen;
    const linearGradientAngle = snakeSegmentLinearGradientAngle(snakeSegmentIndex);

    return `linear-gradient(${linearGradientAngle ? `${linearGradientAngle},` : ''}rgba(67, 217, 173, ${alpha}) 0%, rgba(67, 217, 173, ${alpha2}) 100%)`
  }

  const snakeSegmentStyle = (snakeSegment: string) => {
    const snakeSegmentIndex = snake.indexOf(snakeSegment);

    if(snakeSegmentIndex === -1){
      return {}
    }

    let style: any = {};
    style.background = snakeSegmentLinearGradient(snakeSegmentIndex);
    if(snakeSegmentIndex === 0){
      style.borderRadius = snakeHeadBorderRadius();
    }

    return {
      ...style
    }
  }

  const makePoint = (snake: string[]) => {
    let isValidPoint = false;
    let newPoint = point.current;

    while(!isValidPoint){
      newPoint = `${getRandomInt(rowsQty)}-${getRandomInt(colsQty)}`;
      isValidPoint = !(newPoint === point.current || snake.includes(newPoint));
    }

    return point.current = newPoint;
  }

  const playGame = () => {
    const container = document.querySelector('.gameContainer') as HTMLElement;
    container.focus();

    setSnake(['1-1']);
    moveTo.current = 'right';
    makePoint(['1-1']);
    setIsPlaying(true);
  }

  const gameOver = () => {
    setIsPlaying(false);
  }

  const moveSnake = () => {
    setSnake(prevSnake => {
      const [row, col] = prevSnake[0].split('-').map(el => Number(el));

      const {addRow, addCol} = MoveToRule[moveTo.current];

      const snakeHead = `${row+addRow}-${col+addCol}`;

      if(
        row+addRow < 0 || 
        row+addRow === rowsQty || 
        col+addCol < 0 || 
        col+addCol === colsQty ||
        prevSnake.includes(snakeHead)
      ){
        gameOver();
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

  useEffect(() => {
    if(snake.includes(point.current)) makePoint(snake);

    if(setScore){
      setScore(snake.length);
    }
  }, [snake.length]);

  

  useEffect(() => {
    //Game Over Condition
    if(!isPlaying && evaluateNewRecord && snake.length > 1){
      evaluateNewRecord();
    }
  }, [isPlaying, snake.length]);

  useEffect(() => {
    function onTick() {
      setSnake(prevSnake => {
        const [row, col] = prevSnake[0].split('-').map(el => Number(el));
  
        const {addRow, addCol} = MoveToRule[moveTo.current];
  
        const snakeHead = `${row+addRow}-${col+addCol}`;
  
        if(
          row+addRow < 0 || 
          row+addRow === rowsQty || 
          col+addCol < 0 || 
          col+addCol === colsQty ||
          prevSnake.includes(snakeHead)
        ){
          gameOver();
          return [...prevSnake];
        }
  
        return [snakeHead];
      })
    }

    let tick: number | undefined;
    
    if(isPlaying){
      tick = setInterval(moveSnake, 100);
    }

    return () => clearInterval(tick);
  }, [isPlaying]);

  return {
    isPlaying,
    gameMatrix,
    point,
    snake,
    snakeSegmentStyle,
    playGame,
    handleKeyDown
  }
}

function getRandomInt(max: number) {
  return Math.floor(Math.random() * max);
}