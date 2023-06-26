import { ScoreProps } from "./types";

export function Score({value}: ScoreProps):JSX.Element {
  return(
    <div className="infoContainer">
      <h2>// Score: {value}pts</h2>
    </div>
  );
}