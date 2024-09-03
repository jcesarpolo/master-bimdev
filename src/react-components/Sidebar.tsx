import * as React from "react";
import { div } from "three/examples/jsm/nodes/Nodes.js";

export function Sidebar() {
    return (
        <aside id="sidebar">
        <img id="company-logo" src="./assets/company-logo.svg" alt="Construction Company"/>
        <ul id="nav-buttons">
            <li id="projects-nav-btn"><span className="material-icons-round">apartment</span>
                Projects
            </li>
            <li><span className="material-icons-round">person</span>
                Users
            </li>
        </ul>
    </aside>
    )
}