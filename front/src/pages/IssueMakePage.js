import React, { useState } from 'react';
import styled from 'styled-components';
import AssigneesSelector from '../components/AssigneesSelector';
import IssueWriteSection from '../components/IssueWriteSection';
import LabelsSelector from './../components/LabelsSelector';

export const IssueContext = React.createContext();

const BodyDiv = styled.div`
  display: flex;
  flex-direction: row;
  margin-top: 20px;
`;

const LeftDiv = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 2;
  padding: 0 16px;
`;

const RightDiv = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  padding: 0 16px;
`;

const IssueMakePage = () => {
  const [assignees, setAssignee] = useState([]);
  const [labels, setLabel] = useState([]);
  const status = 'MakePage';
  return (
    <BodyDiv>
      <LeftDiv>
        <IssueWriteSection assignees={assignees} labels={labels} />
      </LeftDiv>
      <RightDiv>
        <AssigneesSelector
          status={status}
          assignees={assignees}
          setAssignee={setAssignee}
        />
        <LabelsSelector status={status} labels={labels} setLabel={setLabel} />
      </RightDiv>
    </BodyDiv>
  );
};

export default IssueMakePage;
