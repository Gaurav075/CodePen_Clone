import React from 'react';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/material.css';
import 'codemirror/theme/mdn-like.css'; 
import 'codemirror/mode/xml/xml';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/mode/css/css';
import { Controlled as ControlledEditor } from 'react-codemirror2';

export default function Editor(props) {
  const { language, value, onChange, theme } = props;

  function handleChange(editor, data, value) {
    onChange(value);
  }

  return (
    <ControlledEditor
      onBeforeChange={handleChange}
      value={value}
      className="code-mirror-wrapper"
      options={{
        lineWrapping: true,
        lint: true,
        mode: language,
        theme: theme === 'dark' ? 'material' : 'mdn-like',
        lineNumbers: true,
        matchBrackets: true,
        autoCloseBrackets: true
      }}
    />
  );
}