import { memo } from "react"
import { useBloc } from "../bloc"

type GameMatrixProps = {
  gameMatrix: string[][]
  snake: string[]
  snakeSegmentStyle: (segment: string) => {}
  point: string
}

function GameMatrix({gameMatrix, snake, snakeSegmentStyle, point}: GameMatrixProps): JSX.Element {
  return (
    <>
      {gameMatrix.map((row, rowIndex) => (
        <div key={rowIndex} className="row">
          {row.map((el) => (
            <span 
              key={el}
              id={el}
              className={point === el ? "point" : " "}
              style={snake.includes(el) ? snakeSegmentStyle(el) : {}}
            />
          ))}
        </div>
      ))}
    </>
  )
}

export const MemoizedGameMatrix = memo(GameMatrix)