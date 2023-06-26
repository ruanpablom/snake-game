export type GameScreenProps = {
  rowsQty: number;
  colsQty: number;
  setScore?: React.Dispatch<React.SetStateAction<number>>;
  evaluateNewRecord?:() => void;
}

export type MoveTo = 'up' | 'down' | 'left' | 'right';