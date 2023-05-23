import React from "react";
import {Link} from "react-router-dom";
import LinkDetails from "../../data/LinkDetails";

interface ApplicationHeaderProps {
    headerText?: String;
    links: LinkDetails[];
}

export const ApplicationHeader: React.FC<ApplicationHeaderProps> = ({headerText, links}) => {

    let key = 1;

    return (
        <header className="appHeader">
            <h2>{headerText}</h2>
            <div className="headerButtons">
            {links.map(link => (
                link.uri
                    ? <Link to={link.uri} key={key++}>
                        <button className="headerBtn btn" onClick={() => link.onClick?.()}>{link.text}</button>
                    </Link>
                    : <button key={key++} className="headerBtn btn" onClick={() => link.onClick?.()}>{link.text}</button>
            ))}
            </div>
        </header>
    );
}