import React from 'react';
import { Spinner } from 'reactstrap';
import "../css/loading.css";

function Loader() {
    return (
        <div className="divPadre">
            <div className="divHijo">
                <Spinner 
                color="success" 
                animation="border"
                size="md"
                role="status"
                aria-hidden="true" 
                />
           </div>
        </div>
    )
};
 
export default Loader;