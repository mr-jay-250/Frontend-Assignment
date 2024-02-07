import React, { useState } from 'react';
import initialUiSchema from './helper';
import styles from './App.module.css';
import JsonEditor from './components/JsonEditor';
import FormPreview from './components/FormPreview';

const App = () => {
  const [uiSchema, setUiSchema] = useState(initUiSchema);
  const [selectedTab, setSelectedTab] = useState(0);

  const handleJsonChange = newUiSchema => {
    setUiSchema(newUiSchema);
    // Reset selected tab when UI schema changes
    setSelectedTab(0);
  };

  const handleSubmit = values => {
    console.log('Form Data to be sent:', values);
  };

  return (
    <div className={styles.mainContainer}>
      <div className={styles.jsonContainer}>
        <h2>Json Editor</h2>
        <JsonEditor onChange={handleJsonChange} />
      </div>
      <div className={styles.previewContainer}>
        <FormPreview
          uiSchema={uiSchema}
          selectedTab={selectedTab}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  );
};

export default App;

const initUiSchema = initialUiSchema;
