import React from 'react';
import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';
import RenderField from './RenderField';
import styles from '../App.module.css';

const FormPreview = ({ uiSchema, selectedTab }) => {
  const {
    register,
    setValue,
    watch,
    handleSubmit,
    unregister
  } = useForm();

  const onSubmit = data => {
    console.log('data', data);
  };

  return (
    <div className={styles.formContainer}>
      <h2 className={styles.heading}>Form Preview</h2>
      <div className={styles.formBody}>
        {/* Render form fields based on the selected tab */}
        {uiSchema && (
          <RenderField
            uiSchema={uiSchema}
            register={register}
            setValue={setValue}
            watch={watch}
            unregister={unregister}
          />
        )}

        <button onClick={handleSubmit(onSubmit)}>Submit</button>
      </div>
    </div>
  );
};

FormPreview.propTypes = {
  uiSchema: PropTypes.array.isRequired,
  selectedTab: PropTypes.number.isRequired
};

export default FormPreview;
