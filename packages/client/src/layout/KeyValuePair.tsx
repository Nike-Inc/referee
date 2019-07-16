import { Button, FormControl, InputGroup } from 'react-bootstrap';
import * as React from 'react';

export default function KeyValuePair({
  handleDelete,
  index,
  onKeyChange,
  onValueChange,
  kvPair
}: {
  handleDelete: (i: number) => void;
  index: number;
  onKeyChange: (i: number, v: any) => void;
  onValueChange: (i: number, v: any) => void;
  kvPair: KvPair;
}): JSX.Element {
  return (
    <InputGroup>
      <InputGroup.Prepend>
        <InputGroup.Text>Key: </InputGroup.Text>
      </InputGroup.Prepend>
      <FormControl
        onChange={(e: any) => {
          onKeyChange(index, e.target.value);
        }}
        value={kvPair.key}
      />
      <InputGroup.Prepend>
        <InputGroup.Text>Value: </InputGroup.Text>
      </InputGroup.Prepend>
      <FormControl
        onChange={(e: any) => {
          onValueChange(index, e.target.value);
        }}
        value={kvPair.value}
      />
      <InputGroup.Append>
        <Button variant="outline-danger" onMouseDown={() => handleDelete(index)}>
          Delete
        </Button>
      </InputGroup.Append>
    </InputGroup>
  );
}
