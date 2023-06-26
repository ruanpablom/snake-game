import { useMemo, useState } from "react";
import { ScoreboardElement } from "./components/Scoreboard/types";

const initialScoreBoard: ScoreboardElement[] = [{name: 'RUAN', score: 0}, {name: 'PABLO', score: 0}, {name: 'MEDEIROS', score: 0}];

export function useBloc(){
  const [score, setScore] = useState<number>(1);
  const [scoreboard, setScoreboard] = useState<ScoreboardElement[]>(initialScoreBoard);
  const [isNewRecordDialogOpen, setIsNewRecordDialogOpen] = useState<boolean>(false);

  const recordIndexOnTheScoreboard = useMemo(() => 
    (scoreboard.findIndex((scoreElement) => scoreElement.score < score))
    ,[score]
  );

  const evaluateNewRecord = () => {
    if(recordIndexOnTheScoreboard !== -1){
      setIsNewRecordDialogOpen(true);
    }
  }

  const handleSaveRecord = (name: string) => {
    const newScoreBoard = [...scoreboard];
    newScoreBoard.splice(recordIndexOnTheScoreboard, 0,{name, score})
    newScoreBoard.splice(-1);
    
    setScoreboard(newScoreBoard);
    setIsNewRecordDialogOpen(false);
  }

  return {
    score,
    setScore,
    scoreboard,
    isNewRecordDialogOpen,
    evaluateNewRecord,
    handleSaveRecord
  };
}