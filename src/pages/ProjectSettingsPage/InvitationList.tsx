import React, {useState} from "react";
import Invitation from "../../data/Invitation";
import {InvitationTableRow} from "./InvitationTableRow";

interface InvitationListProps {
    invitations: Invitation[];

    onInvitationAdd(invite: Invitation): void;

    onInvitationUpdate(invite: Invitation): void;

    onInvitationDelete(invite: Invitation): void;
}

export const InvitationList: React.FC<InvitationListProps> = (
    {
        invitations,
        onInvitationAdd,
        onInvitationUpdate,
        onInvitationDelete
    }) => {

    const [email, setEmail] = useState('');
    const [isAN, setIsAN] = useState(false);
    const [isQA, setIsQA] = useState(false);
    const [isPC, setIsPC] = useState(false);

    const handleInvitationAdd = () => {
        if (email.trim() !== '') {
            let roleIds = [];
            if (isAN) roleIds.push(1);
            if (isQA) roleIds.push(2);
            if (isPC) roleIds.push(3);
            if (roleIds.length !== 0) {
                onInvitationAdd(new Invitation(email, roleIds))
                setIsPC(false);
                setIsAN(false);
                setIsQA(false);
                setEmail('');
            }
        }
    }

    const centered: any = {
        textAlign: "center"
    }

    return (
        <div className="invitationTable" style={{width: "100%"}}>
            <h2>Invitations</h2>
            <table style={{width: "100%"}}>
                <thead>
                <tr>
                    <td width="60%">Email</td>
                    <td width="6%" style={centered}>AN</td>
                    <td width="6%" style={centered}>QA</td>
                    <td width="6%" style={centered}>PC</td>
                    <td width="11%" style={centered}>Action</td>
                    <td width="11%" style={centered}>Action</td>
                </tr>
                </thead>
                <tbody>
                {invitations.map(inv => (
                    <InvitationTableRow key={inv.id} invitation={inv} onInvitationUpdate={onInvitationUpdate} onInvitationDelete={onInvitationDelete} />
                ))}
                <tr>
                    <td width="60%"><input type={"text"} className="input-text" value={email} onChange={(e) => setEmail(e.target.value)}/></td>
                    <td width="6%" style={centered}><input type="checkbox" checked={isAN} onChange={(e) => setIsAN(e.target.checked)}/></td>
                    <td width="6%" style={centered}><input type="checkbox" checked={isQA} onChange={(e) => setIsQA(e.target.checked)}/></td>
                    <td width="6%" style={centered}><input type="checkbox" checked={isPC} onChange={(e) => setIsPC(e.target.checked)}/></td>
                    <td width="22%" colSpan={2}><button type="button" className="btn" onClick={() => handleInvitationAdd()}>Add</button></td>
                </tr>
                </tbody>
            </table>
        </div>
    )

}