import React, { useState } from "react";

function GroupCreationForm(props) {
  const [groupName, setGroupName] = useState("");
  const [groupDescription, setGroupDescription] = useState("");
  const [groupLocation, setGroupLocation] = useState("");
  const [groupRules, setGroupRules] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Group Name:
        <input
          type="text"
          value={groupName}
          onChange={(event) => setGroupName(event.target.value)}
        />
      </label>
      <br />
      <label>
        Group Description:
        <textarea
          value={groupDescription}
          placeholder={"What is the purpose of your group?"}
          onChange={(event) => setGroupDescription(event.target.value)}
        />
      </label>
      <label>
        Group Location:
        <textarea
          value={groupLocation}
          placeholder={"Add a location to your group"}
          onChange={(event) => setGroupLocation(event.target.value)}
        />
      </label>
      <br />
      <label>
        Group Rules:
        <textarea
          value={groupRules}
          placeholder={"Set the tone and expectations of your group"}
          onChange={(event) => setGroupRules(event.target.value)}
        />
      </label>
      <button type="submit">Create</button>
    </form>
  );
}

export default GroupCreationForm;
