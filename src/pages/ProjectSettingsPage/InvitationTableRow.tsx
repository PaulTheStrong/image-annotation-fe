import Invitation from "../../data/Invitation";
import React, {useState} from "react";

interface InvitationTableRowProps {
    invitation: Invitation;

    onInvitationUpdate(invite: Invitation): void;

    onInvitationDelete(invite: Invitation): void;
}

export const InvitationTableRow: React.FC<InvitationTableRowProps> = (
    {
        invitation,
        onInvitationUpdate,
        onInvitationDelete
    }) => {

    const centered: any = {
        textAlign: "center"
    }

    const [email] = useState(invitation.email);
    const [isAN, setIsAN] = useState(invitation.roles.findIndex(id => id === 1) !== -1);
    const [isQA, setIsQA] = useState(invitation.roles.findIndex(id => id === 2) !== -1);
    const [isPC, setIsPC] = useState(invitation.roles.findIndex(id => id === 3) !== -1);

    const handleInvitationUpdate = () => {
        if (email.trim() !== '') {
            let roleIds = [];
            if (isAN) roleIds.push(1);
            if (isQA) roleIds.push(2);
            if (isPC) roleIds.push(3);
            if (roleIds.length !== 0) {
                onInvitationUpdate(new Invitation(email, roleIds, invitation.id))
            }
        }
    }

    return (
        <tr>
            <td width="60%"><input type={"email"} className="input-text" value={email}/></td>
            <td width="6%" style={centered}><input type="checkbox" onChange={(e) => setIsAN(e.target.checked)} checked={isAN}/></td>
            <td width="6%" style={centered}><input type="checkbox" onChange={(e) => setIsQA(e.target.checked)} checked={isQA}/></td>
            <td width="6%" style={centered}><input type="checkbox" onChange={(e) => setIsPC(e.target.checked)} checked={isPC}/></td>
            <td width="11%"><button type="button" className="btn" value="Update" onClick={() => handleInvitationUpdate()}>Update</button></td>
            <td width="11%"><button type="button" className="btn" value="Delete" onClick={() => onInvitationDelete(invitation)}>Delete</button></td>
        </tr>
    )

}
