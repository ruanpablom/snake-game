import { NewRecordDialogProps } from "./types";

export function useBloc({onSaveRecord}: Omit<NewRecordDialogProps, 'isOpen'>){
  const handleSaveRecord = () => {
    const name = (document.querySelector('input[id=playerName]') as HTMLInputElement).value;

    onSaveRecord(name)    
  }
  return {
    handleSaveRecord
  }
}