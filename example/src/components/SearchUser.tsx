import React, {useState} from 'react';
import {Box, TextInput} from 'grommet';
import {useResource} from '../react-request-hook';
import useDebounce from '../useDebounce';
import api from '../api';

export default function SearchUser() {
  const [input, setInput] = useState<string>('Gabriel');
  const searchText = useDebounce(input);
  const [issues] = useResource(api.searchUser, [searchText]);
  return (
    <Box>
      <TextInput
        value={input}
        onChange={(ev: React.ChangeEvent<HTMLInputElement>) => {
          setInput(ev.target.value);
        }}
      />
      <Box>{JSON.stringify(issues.data)}</Box>
    </Box>
  );
}

