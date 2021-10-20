import { useState } from "react";
import React, { Fragment } from 'react';


export default function SelectedCurvas(props) {

  
  const trazas = props.curvas

  const [checkedState, setCheckedState] = useState([]);

  
  const handleOnChange = (position) => {
    const updatedCheckedState = checkedState.map((item, index) =>
      index === position ? !item : item
    );

    setCheckedState(updatedCheckedState);

  };

  return (
    <div className="App">
      <ul className="toppings-list">
        {trazas.map((name, index) => {
          return (
            <li key={index}>
              <div className="toppings-list-item">
                <div className="left-section">
                  <input
                    type="checkbox"
                    id={`custom-checkbox-${index}`}
                    name={name}
                    value={name} defaultChecked={true}
                    checked={checkedState[index]}
                    onChange={() => handleOnChange(index)}
                  />
                  <label htmlFor={`custom-checkbox-${index}`}>{name}</label>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}