import React from 'react';
import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';
import RenderField from './RenderField';
import { submitFormData } from '../utils/backendService';
import styles from '../App.module.css';

const FormPreview = ({ uiSchema, selectedTab }) => {
  const {
    register,
    setValue,
    watch,
    handleSubmit,
    unregister,
    reset
  } = useForm();

  const onSubmit = async (data) => {
    try {
      await submitFormData(data);
    } catch (error) {
      console.error('Error submitting data:', error);
    }
  };

  const handleCancel = () => {
    reset();
  };

  return (
    <div className={styles.formContainer}>
      <h2 className={styles.heading}>Form Preview</h2>
      {uiSchema.length !== 0
        ? (
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

            <div className={styles.actionCta}>
              <button onClick={handleCancel}>Cancel</button>
              <button className={styles.submitCta} onClick={handleSubmit(onSubmit)}>Submit</button>
            </div>
          </div>
        )
        : (
          <div className={styles.guideText}>{' \' Please write your JSON in Json Editor \' '}</div>
        )}
    </div>
  );
};

FormPreview.propTypes = {
  uiSchema: PropTypes.array.isRequired,
  selectedTab: PropTypes.number.isRequired
};

export default FormPreview;
