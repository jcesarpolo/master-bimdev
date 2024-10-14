import * as React from "react";
import { div } from "three/examples/jsm/nodes/Nodes.js";
import { IProject, ProjectStatus, UserRole } from "../class/Project";
import { ProjectsManager } from "../class/ProjectsManager";
import { ProjectCard } from "./ProjectCard";

export function ProjectsPage() {
    const projectsManager = new ProjectsManager()

    const onNewProjectClick = () => {
        const modal = document.getElementById("new-project-modal")
        if (!(modal && modal instanceof HTMLDialogElement)) {return}
        modal.showModal()
    }

    const onFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        const projectForm = document.getElementById("new-project-form")
        if (!(projectForm && projectForm instanceof HTMLFormElement)) {return}
        e.preventDefault()
        const formData = new FormData(projectForm)
        const projectData : IProject = {
            name: formData.get("name") as string,
            description: formData.get("description") as string,
            role: formData.get("role") as UserRole,
            status: formData.get("status") as ProjectStatus,
            finishDate: new Date(formData.get("finish-date") as string).getTime()? new Date(formData.get("finish-date") as string) : new Date()
        }
        try{
            const project = projectsManager.newProject(projectData)
            projectForm.reset()
            const modal = document.getElementById("new-project-modal")
            if (!(modal && modal instanceof HTMLDialogElement)) {return}
            modal.close()
        }
        catch (error) {
            //const message = popup.querySelector("#error-popup-text")
            // if (!message) {return}
            // message.textContent = error.message
            const modal = document.getElementById("new-project-modal")
            if (!(modal && modal instanceof HTMLDialogElement)) {return}
            modal.close()
        }
    }


    return (
        <div className="page" id="projects-page">
        <dialog id="new-project-modal">
            <form onSubmit={(e) => {onFormSubmit(e)}} id="new-project-form">
            <h2>New Project</h2>
            <div className="input-list">
                <div className="form-field-container">
                <label>
                    <span className="material-icons-round">apartment</span>Name
                </label>
                <input
                    name="name"
                    type="text"
                    placeholder="What's the name of your project?"
                />
                <p
                    style={{
                    color: "gray",
                    fontSize: "var(--font-sm)",
                    fontStyle: "italic",
                    marginTop: 5
                    }}
                >
                    TIP: Whatever
                </p>
                </div>
                <div className="form-field-container">
                <label>
                    <span className="material-icons-round">subject</span>Description
                </label>
                <textarea
                    name="description"
                    cols={30}
                    rows={5}
                    placeholder="Give your description here."
                    defaultValue={""}
                />
                </div>
                <div className="form-field-container">
                <label>
                    <span className="material-icons-round">account_circle</span>Role
                </label>
                <select name="role">
                    <option>Architect</option>
                    <option>Engineer</option>
                    <option>Developer</option>
                </select>
                </div>
                <div className="form-field-container">
                <label>
                    <span className="material-icons-round">not_listed_location</span>
                    Status
                </label>
                <select name="status">
                    <option>Pending</option>
                    <option>Active</option>
                    <option>Finished</option>
                </select>
                </div>
                <div className="form-field-container" />
                <div className="form-field-container">
                <label>
                    <span className="material-icons-round">today</span>Finish Date
                </label>
                <input name="finish-date" type="date" />
                </div>
                <div className="form-field-container" />
            </div>
            <div id="form-buttons">
                <button type="reset" className="cancel-button">
                Cancel
                </button>
                <button type="submit" className="accept-button">
                Accept
                </button>
            </div>
            </form>
        </dialog>
        <dialog id="error-popup">
            <div style={{ display: "flex", flexDirection: "row" }}>
            <div style={{ backgroundColor: "#fb5757", padding: 30, aspectRatio: 1 }}>
                <span className="material-icons-outlined" style={{ color: "white" }}>
                error
                </span>
            </div>
            <div
                style={{
                display: "flex",
                flexDirection: "row",
                backgroundColor: "var(--background-200)",
                alignItems: "center"
                }}
            >
                <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    rowGap: 5,
                    padding: 15
                }}
                >
                <h2 style={{ color: "white" }}>Error</h2>
                <p id="error-popup-text" style={{ color: "#969696" }} />
                </div>
            </div>
            </div>
        </dialog>
        <header>
            <h2>Projects</h2>
            <div style={{ display: "flex", alignItems: "center", columnGap: 15 }}>
            <span
                id="import-projects-btn"
                className="material-icons-round action-icon"
            >
                file_upload
            </span>
            <span
                id="export-projects-btn"
                className="material-icons-round action-icon"
            >
                file_download
            </span>
            <button onClick={onNewProjectClick} id="new-project-btn">
                <span className="material-icons-round">add</span>
                New Project
            </button>
            </div>
        </header>
        <div id="projects-list">
            <ProjectCard></ProjectCard>
            <ProjectCard></ProjectCard>
            <ProjectCard></ProjectCard>
        </div>
        </div>
    )
}