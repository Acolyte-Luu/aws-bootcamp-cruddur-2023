import { json } from 'react-router-dom';
import './FormErrors.css';
import './FormErrorItem.js' ;

export default function FormErrors(props) {
    let el_errors = null


    if (props.errors.Object.keys() > 0){
        el_errors_items
        {Object.keys(props.errors).map((key,index) => (  
            return <FormErrorItem key={index} value={props.errors[key]}/>
        ))}

    }

    return(
        <div classname = "errorsWrap">
            
        </div>
    )

}