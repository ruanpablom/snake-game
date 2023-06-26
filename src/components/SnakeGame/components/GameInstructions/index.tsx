import keyboardArrows from '../../assets/keyboardArrows.svg'

import './index.css';

export function GameInstructions():JSX.Element {
  return(
    <div className="infoContainer">
      <h2>// use keyboard</h2>
      <h2>// arrows to play</h2>
      <img className='keyboardArrows' src={keyboardArrows} alt="" />
    </div>
  );
}