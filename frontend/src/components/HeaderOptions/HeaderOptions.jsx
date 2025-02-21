import React from "react";
import './HeaderOptions.css';


const HeaderOptions =({icon,title,onClick})=>{
    return(
        <div className="headeroption-container" onClick={onClick}>
        <div className="header-icon">{icon}</div>
        <p className="header-option-title">{title}</p>
        </div>
    )

}
export default HeaderOptions;