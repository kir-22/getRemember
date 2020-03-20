import React from 'react';
import Forms from '../static/Forms.jsx';
import FormsEn from '../static/FormsEn.jsx';

export const Aboute = (props) => {
  let rus = props.lang === 'rus';
  return (
    <div>
      {
        (rus ? Forms : FormsEn).about
      }
    </div>
  );
}

// export default Aboute;
