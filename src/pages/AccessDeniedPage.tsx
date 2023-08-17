import React from 'react';
import {ApplicationHeader} from "./Header/ApplicationHeader";

const AccessDeniedPage: React.FC = () => {
    return (
        <>
            <ApplicationHeader links={[
                {text: "Projects", uri: "/projects"}
            ]} headerText="Access denied"/>
            <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                <img
                    src="https://previews.123rf.com/images/arcady31/arcady311101/arcady31110100005/8623333-access-denied-stamp.jpg" // Replace with the URL of your desired image
                    alt="Fancy Image"
                    style={{width: '300px', height: 'auto', marginBottom: '20px'}}
                />
                <h1 style={{textAlign: 'center'}}>403 Access Denied</h1>
                <p style={{textAlign: 'center'}}>Sorry, you do not have permission to access this page.</p>
            </div>
        </>
    );
};

export default AccessDeniedPage;