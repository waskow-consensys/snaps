import { logError } from '@metamask/snaps-utils';
import type { ChangeEvent, FormEvent, FunctionComponent } from 'react';
import { useState } from 'react';
import { Button, Form } from 'react-bootstrap';

import { Tag, useInvokeMutation } from '../../../../api';
import { Result } from '../../../../components';
import { getSnapId } from '../../../../utils';
import { MANAGE_STATE_PORT, MANAGE_STATE_SNAP_ID } from '../constants';

export const GetState: FunctionComponent<{ encrypted: boolean }> = ({
  encrypted,
}) => {
  const [key, setKey] = useState('');
  const [invokeSnap, { isLoading, data, error }] = useInvokeMutation();

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setKey(event.target.value);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    invokeSnap({
      snapId: getSnapId(MANAGE_STATE_SNAP_ID, MANAGE_STATE_PORT),
      method: 'getState',
      params: {
        key,
        encrypted,
      },
      tags: [encrypted ? Tag.TestState : Tag.UnencryptedTestState],
    }).catch(logError);
  };

  return (
    <>
      <Form onSubmit={handleSubmit} className="mb-3">
        <Form.Group>
          <Form.Label>Key</Form.Label>
          <Form.Control
            type="text"
            placeholder="Key"
            value={key}
            onChange={handleChange}
            id={encrypted ? 'getState' : 'getUnencryptedState'}
            className="mb-3"
          />
        </Form.Group>

        <Button
          type="submit"
          id={encrypted ? 'sendGetState' : 'sendGetUnencryptedState'}
          disabled={isLoading}
        >
          Get State
        </Button>
      </Form>

      <Result className="mb-3">
        <span id={encrypted ? 'getStateResult' : 'getStateUnencryptedResult'}>
          {JSON.stringify(data, null, 2)}
          {JSON.stringify(error, null, 2)}
        </span>
      </Result>
    </>
  );
};
