import { useBloc } from "./bloc";
import { GameScreenProps } from "./types";

import './index.css';
import { MemoizedGameMatrix } from "./GameMatrix";

export function GameScreen({rowsQty, colsQty, setScore, evaluateNewRecord}: GameScreenProps): JSX.Element {
  const { 
    isPlaying, 
    gameMatrix,  
    playGame, 
    handleKeyDown,
    snake,
    point,
    snakeSegmentStyle 
  } = useBloc({rowsQty, colsQty, setScore, evaluateNewRecord});

  return (
    <div className="gameContainer" tabIndex={0} onKeyDown={handleKeyDown}>
      <MemoizedGameMatrix gameMatrix={gameMatrix} snake={snake} snakeSegmentStyle={snakeSegmentStyle} point={point.current} />
      {
        !isPlaying ?
        (
          <div className="buttonContainer">
            <button 
              className='button'
              type="button" 
              onClick={playGame}
            >
              start-game
            </button>
          </div>
        ) :
        (<></>)
      }
      
      
    </div>
  );
}