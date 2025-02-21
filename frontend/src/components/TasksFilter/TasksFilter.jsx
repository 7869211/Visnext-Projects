import React from "react";
import { Search ,ChevronDown} from "lucide-react";
import './TasksFilter.css';
const TasksFilter=({onSearch,filterButtons,toggleViews})=>{
    return(
        <div className="taskfilter-container">
            <div className="search-section">
                <Search className="search-icon"/>
                <input
                type="text"
                placeholder="Search"
                className="search-input"
                onChange={(e) => onSearch(e.target.value)}
                />
            </div>


            <div className="filter-buttons-section">
                {filterButtons.map((button, index) => (
                <button key={index} className="filter-btn" onClick={button.onClick}>
                    <span className="label-text">{button.label}</span>
                    <ChevronDown className="chevron-down-icon" />
                </button>
                ))}
            </div>

                <div className="view-toggle">
                    {toggleViews.map((icon, index) => (
                         <button key={index} className="view-icon" onClick={icon.onClick}>
                         {icon.icon}
                         </button>
                        
                        ))}
                </div>
        </div>
    )

};
export default TasksFilter;