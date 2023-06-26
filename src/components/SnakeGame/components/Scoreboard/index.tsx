import { ScoreboardProps } from "./types";

import './index.css'

export function Scoreboard({scoreboardList}: ScoreboardProps): JSX.Element {
  return (
    <div className="infoContainer">
      <ul className='scoreBoardList'>
        <h2>// Scoreboard </h2>
        {scoreboardList.map((element, index) => (
          <li key={index} className='scoreBoardItem'>
            <h2 className='name'>{`${index+1} ${element.name}`}</h2>
            <div className="separator"/>
            <h2 className='score'>{element.score}pts</h2>
          </li>
          ))
        }
      </ul>
    </div>
  );
}