import { useBloc } from './bloc';
import { Bolts } from './components/Bolts';
import { GameInstructions } from './components/GameInstructions';
import { GameScreen } from './components/GameScreen';
import { NewRecordDialog } from './components/NewRecordDialog';
import { Score } from './components/Score';
import { Scoreboard } from './components/Scoreboard';
import { SnakeGameProps } from './type';

import './index.css';

export function SnakeGame({colsQty = 21, rowsQty = 33}: SnakeGameProps) {
  const {
    score, 
    scoreboard, 
    isNewRecordDialogOpen, 
    handleSaveRecord, 
    setScore, 
    evaluateNewRecord
  } = useBloc();

  return (
    <div className="container">
      <Bolts />
      <div className="content">
        <GameScreen rowsQty={rowsQty} colsQty={colsQty} setScore={setScore} evaluateNewRecord={evaluateNewRecord} />
        <div className="rightContainer">
          <Score value={score} />
          <Scoreboard scoreboardList={scoreboard} />
          <GameInstructions />
        </div>
      </div>
      <NewRecordDialog key={score} isOpen={isNewRecordDialogOpen} onSaveRecord={handleSaveRecord} />
    </div>
  )
}
