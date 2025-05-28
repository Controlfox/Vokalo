import React from "react";
import { User } from "../../Types";

interface ChildSelectorI {
    childrenList: User[];
    selectedChild: string;
    onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

const ChildSelector: React.FC<ChildSelectorI> = ({ childrenList, selectedChild, onChange}) => (
    <div className="child-select">
        <label>Välj barn:</label>
        <select value={selectedChild} onChange={onChange}>
            {childrenList.map(c => <option key={c.username} value={c.username}>{c.username}</option>)}
        </select>
    </div>
);

export default ChildSelector;