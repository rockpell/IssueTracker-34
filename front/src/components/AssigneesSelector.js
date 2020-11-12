import React, { useState, useEffect, useContext } from 'react';
import styled, { keyframes } from 'styled-components';
import SettingSvg from '../svgs/SettingSvg';
import CheckSvg from '../svgs/CheckSvg';
import { IssueContext } from '../App';
import userAPI from '../apis/user.api';
import issueAPI from '../apis/issue.api';

const AssigneesSelectorDiv = styled.div`
  position: relative;
  width: 100%;
`;

const AssigneesButton = styled.button`
  display: flex;
  background-color: white;
  border: 0;
  width: 100%;
  height: 34px;
  flex-direction: rows;
  justify-content: space-between;
  align-items: center;
  outline: 0;
  &:hover {
    color: blue;
  }

  &:hover svg {
    fill: blue;
  }
`;

const DropDownOverlay = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 80;
  display: block;
  background: transparent;
`;

const slideDownAnimation = keyframes`{
  0% { opacity: 0; transform: translateY(-5%); }   
100% { opacity: 1; transform: translateY(0%); }
}`;

const DropdownMenu = styled.div`
  position: absolute;
  margin-top: 12px;
  right: 0;
  bottom: auto;
  left: auto;
  width: 230px;
  top: 20px;
  padding: 0;
  z-index: 99;
  background-color: #fff;
  border-radius: 6px;
  border: 1px solid #ddd;
  animation: ${slideDownAnimation} 0.1s ease-out;
`;

const Header = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 12px;
  padding: 7px 9px 7px 16px;
  font-weight: 600;
  background-color: #fafbfc;
`;

const Hr = styled.hr`
  margin: 0;
  padding: 0;
  width: 100%;
  border: 1px solid #eee;

  margin-top: ${(props) => props.marginTop || '0'};
`;

const DropDownListWrapper = styled.div`
  max-height: 285px;
  overflow-y: auto;
  overflow-x: hidden;
`;

const AssigneeDiv = styled.div`
  display: flex;
  align-items: center;
  height: 34px;
  margin: 0px 16px;
`;

const CheckedAssigneeDiv = styled.div`
  display: flex;
  align-items: center;
  height: 34px;
  font-size: 12px;
  margin-left: 6px;
`;

const Unchecked = styled.div`
  width: 16px;
  height: 16px;
`;

const Avatar = styled.img`
  width: 20px;
  height: 20px;
  border-radius: 50%;
  margin-left: 8px;
  margin-right: 8px;
`;

const AssigneeName = styled.span`
  font-size: 12px;
  color: #6a737d;
`;

const AssigneeId = styled.span`
  font-size: 12px;
  font-weight: 500;
  margin-right: 8px;
  color: #000;
`;

const Span = styled.span`
  &:hover {
    color: blue;
  }
  cursor: pointer;
`;

const AssigneesSelector = ({ status, assignees, setAssignee, issueId }) => {
  const [isOpen, setIsOpen] = useState(false);
  const loginedUser = 1;

  useEffect(async () => {
    let users = await userAPI.getUsers();

    setAssignee(users);
  }, []);

  let checkedAssigneesCnt = 0;
  const checkedAssignees = assignees.map((assignee, idx) => {
    if (assignee.checked) {
      checkedAssigneesCnt++;
      return (
        <CheckedAssigneeDiv key={idx}>
          <Avatar src={assignee.profile_url}></Avatar>
          <AssigneeId>{assignee.name}</AssigneeId>
        </CheckedAssigneeDiv>
      );
    }
  });

  //TODO: api 호출로 데이터베이스 값 변경.
  //db에 저장된 id로 확인을 하고 있어서 나중에 수정이 필요하지 않을까 싶음.
  const selectAssignee = (id) => {
    const newAssignees = assignees.map((assignee) => {
      if (assignee.id === id) {
        if (checkedAssigneesCnt >= 10 && !assignee.checked) {
          return assignee;
        }
        assignee.checked = !assignee.checked;
      }
      return assignee;
    });

    setAssignee(newAssignees);
  };

  const allAssignees = assignees.map((assignee, idx) => {
    return (
      <div
        key={`assignee-selector-${idx}`}
        onClick={() => selectAssignee(assignee.id)}
      >
        <AssigneeDiv>
          {assignee.checked ? <CheckSvg /> : <Unchecked />}
          <Avatar src={assignee.profile_url}></Avatar>
          <AssigneeId>{assignee.name}</AssigneeId>
          {/* {assignee.name && <AssigneeName>{assignee.name}</AssigneeName>} */}
        </AssigneeDiv>
        <Hr />
      </div>
    );
  });

  const editIssueAssignees = () => {
    setIsOpen(false);
    if (status === 'MakePage') return;

    let assigneeIdList = [];
    assignees.forEach((assignee) => {
      if (assignee.checked) {
        assigneeIdList.push(assignee.id);
      }
    });
    issueAPI.editIssueAssignees(issueId, assigneeIdList);
  };

  return (
    <AssigneesSelectorDiv>
      <AssigneesButton onClick={() => setIsOpen(true)}>
        <div>Assignees</div>
        <SettingSvg />
      </AssigneesButton>
      {checkedAssigneesCnt === 0 ? (
        <CheckedAssigneeDiv>
          No one—
          <Span onClick={() => selectAssignee(loginedUser)}>
            assign yourself
          </Span>
        </CheckedAssigneeDiv>
      ) : (
        <> {checkedAssignees} </>
      )}

      {isOpen && (
        <>
          <DropDownOverlay onClick={editIssueAssignees} />
          <DropdownMenu>
            <Header>
              <span>Assign up to 10 people to this issue</span>
            </Header>
            <Hr />
            <DropDownListWrapper>{allAssignees}</DropDownListWrapper>
          </DropdownMenu>
        </>
      )}
      <Hr marginTop={'15px'} />
    </AssigneesSelectorDiv>
  );
};

export default AssigneesSelector;
