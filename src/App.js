import React, { useState } from 'react';
import styles from './App.module.css';
import JsonEditor from './components/JsonEditor';
import FormPreview from './components/FormPreview';

const App = () => {
  const [uiSchema, setUiSchema] = useState([]);
  const [selectedTab, setSelectedTab] = useState(0);

  const handleJsonChange = newUiSchema => {
    setUiSchema(newUiSchema);

    setSelectedTab(0);
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
        />
      </div>
    </div>
  );
};

export default App;
