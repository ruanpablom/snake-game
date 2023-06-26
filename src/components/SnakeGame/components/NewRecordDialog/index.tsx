import { useBloc } from "./bloc";
import { NewRecordDialogProps } from "./types";

import './index.css';

export function NewRecordDialog({isOpen, onSaveRecord}:NewRecordDialogProps):JSX.Element{
  const { handleSaveRecord } = useBloc({onSaveRecord});
  return(
    <div className={`dialog ${isOpen ? 'dialog_active' : ''}`}>
      <div className="dialog__container">
        <h2>New Record!</h2>
        <div className="inputContainer">
          <label htmlFor="playerName">Player Name</label>
          <input id="playerName" type="text" maxLength={9} />
        </div>
        <button className='button' type="button" onClick={handleSaveRecord} >Save</button>
      </div>
    </div>
  );
}