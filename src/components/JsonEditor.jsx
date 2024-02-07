import React from 'react';
import PropTypes from 'prop-types';
import styles from '../App.module.css';

const JsonEditor = ({ onChange }) => {
  const handleInputChange = event => {
    try {
      const newUiSchema = JSON.parse(event.target.value);
      onChange(newUiSchema);
    } catch (error) {
      // Handle JSON parsing error
      console.error('Invalid JSON');
    }
  };

  return (
    <textarea
      placeholder='Paste UI Schema here...'
      onChange={handleInputChange}
      className={styles.jsonEditor}
    />
  );
};

JsonEditor.propTypes = {
  onChange: PropTypes.func.isRequired
};

export default JsonEditor;
