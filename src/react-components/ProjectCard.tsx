import * as React from 'react';

export function ProjectCard() {
    return (
    <div className="project-card">
        <div className="card-header">
            <p
            style={{
                backgroundColor: "#ca8134",
                padding: 10,
                borderRadius: 8,
                aspectRatio: 1,
                minWidth: 20
            }}
            >
                HC
            </p>
            <div>
            <h5>
                ${"{"}this.name{"}"}
            </h5>
            <p>
                ${"{"}this.description{"}"}
            </p>
            </div>
        </div>
        <div className="card-content">
            <div className="card-property">
            <p style={{ color: "#969696" }}>Status</p>
            <p>
                ${"{"}this.status{"}"}
            </p>
            </div>
            <div className="card-property">
            <p style={{ color: "#969696" }}>Role</p>
            <p>
                ${"{"}this.role{"}"}
            </p>
            </div>
            <div className="card-property">
            <p style={{ color: "#969696" }}>Cost</p>
            <p>
                $${"{"}this.cost{"}"}
            </p>
            </div>
            <div className="card-property">
            <p style={{ color: "#969696" }}>Estimated Progress</p>
            <p>
                ${"{"}this.progress{"}"}
            </p>
            </div>
        </div>
    </div>

    )
}