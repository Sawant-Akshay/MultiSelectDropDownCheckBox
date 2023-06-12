import React from 'react';
import ReactDOM from 'react-dom/client';
import './multiselectdropcheckbox/style.css'
import MultiSelect from './multiselectdropcheckbox/MultiSelect';






const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
          <div>
              
                <React.StrictMode>
                     <MultiSelect value={['India','Australia']} readonly={false}/>
                </React.StrictMode>
          </div>
);


