import * as React from 'react';
import classNames from 'classnames';
import { InputGroup } from 'react-bootstrap';
import { Button, FormControl } from 'react-bootstrap';
import handleKeys from '../../util/keyPressInputHelper';
import { RefObject } from 'react';
import { Popover } from '../../layout/Popover';

export const GroupTabsSection = ({
  groups,
  selectedGroup,
  isEditCurGroup,
  updateSelectedGroup,
  finishEditingCurrentGroup,
  editCurrentGroup,
  groupEdit,
  updateGroupName,
  createNewGroup,
  deleteGroup
}: {
  groups: string[];
  selectedGroup: string;
  isEditCurGroup: boolean;
  updateSelectedGroup: (group: string) => void;
  finishEditingCurrentGroup: () => void;
  editCurrentGroup: () => void;
  groupEdit: string & RefObject<HTMLInputElement>;
  updateGroupName: (curName: string, newName: string) => void;
  createNewGroup: () => void;
  deleteGroup: (group: string) => void;
}): JSX.Element => {
  return (
    <div id="group-tabs">
      {groups.map(group => {
        const classes = classNames('group-tab', {
          selected: selectedGroup === group
        });
        return (
          <div className={classes} key={group}>
            {(!isEditCurGroup || (isEditCurGroup && selectedGroup !== group)) && (
              <div
                className="group-tap-content"
                onClick={() => {
                  updateSelectedGroup(group);
                }}
              >
                <div className="label">{group}</div>
                {selectedGroup === group && group !== 'all' && (
                  <div
                    className="edit-btn"
                    onClick={() => {
                      editCurrentGroup();
                    }}
                  />
                )}
              </div>
            )}
            {isEditCurGroup && selectedGroup === group && (
              <div className="group-name-input">
                <InputGroup
                  size="sm"
                  onBlur={() => {
                    finishEditingCurrentGroup();
                  }}
                >
                  <FormControl
                    autoFocus={true}
                    defaultValue={group}
                    ref={groupEdit}
                    onKeyDown={(e: any) => {
                      handleKeys(e, finishEditingCurrentGroup, () => {
                        updateGroupName(group, groupEdit.current!.value);
                      });
                    }}
                  />
                  <InputGroup.Append>
                    <Button
                      variant="outline-warning"
                      onMouseDown={() => {
                        finishEditingCurrentGroup();
                      }}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="outline-dark"
                      onMouseDown={() => {
                        updateGroupName(group, groupEdit.current!.value);
                      }}
                    >
                      Update
                    </Button>
                    <Button
                      variant="outline-danger"
                      onMouseDown={() => {
                        deleteGroup(group);
                      }}
                    >
                      Delete
                    </Button>
                  </InputGroup.Append>
                </InputGroup>
              </div>
            )}
          </div>
        );
      })}
      <div className="btn-wrapper">
        <Button
          size="sm"
          onClick={() => {
            createNewGroup();
          }}
          variant="outline-dark"
        >
          Add Group
        </Button>
      </div>
      <Popover
        header="Groups"
        text="Metric groups are used to logically organize metrics in order to weight the importance of different groups.
        A canary config can include any number of metric groups, but we recommend starting with Errors, Latency, and Saturation."
        color="black"
      />
    </div>
  );
};
