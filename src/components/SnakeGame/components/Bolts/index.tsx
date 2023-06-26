import bolt from '../../assets/bolt.svg';

import './index.css';

export function Bolts():JSX.Element {
  return(
    <>
      <div className="boltLeftTop">
        <img src={bolt} alt="" />
      </div>
      <div className="boltRightTop">
        <img src={bolt} alt="" />
      </div>
      <div className="boltRightBottom">
        <img src={bolt} alt="" />
      </div>
      <div className="boltLeftBottom">
        <img src={bolt} alt="" />
      </div>
    </>
  );
}