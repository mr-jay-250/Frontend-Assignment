import React, { useEffect } from 'react';
import FormFields from './FormFields';
import PropTypes from 'prop-types';
import styles from '../App.module.css';

const RenderField = ({
  uiSchema,
  register,
  setValue,
  watch,
  parentJsonKey,
  isConditionalFields = false,
  parentUiType,
  parentLevel,
  unregister
}) => {
  useEffect(() => {
    uiSchema?.forEach(field => {
      if (!(field.validate?.required && watch(`${parentJsonKey}_conditional`))) {
        unregister(`${parentJsonKey}.${field.jsonKey}`);
      }
    });
  }, []);

  useEffect(() => {
    setValue(`${parentJsonKey}_conditional`, true);
  }, []);

  return (
    <>
      {uiSchema?.map((field, index) => {
        const isDisplay = field.conditions
          ? field.conditions?.every(condition => {
            const value = watch(condition.jsonKey);
            switch (condition.op) {
            case '==':
              return value === condition.value;
            case '!=':
              return value !== condition.value;
            default:
              return false;
            }
          })
          : true;

        return (
          isDisplay && (
            <div
              key={index}
              style={
                {
                  // display: isDisplay ? 'block' : 'none'
                }
              }
            >
              {field.uiType === 'Ignore' && (
                <FormFields.FieldGroup
                  field={field}
                  register={register}
                  setValue={setValue}
                  watch={watch}
                  parentJsonKey={field.jsonKey}
                  unregister={unregister}
                />
              )}
              {field.uiType === 'Input' &&
                (field.validate?.required ||
                  watch(`${parentJsonKey}_conditional`)) && (
                <FormFields.FieldInput
                  field={field}
                  register={register}
                  parentJsonKey={parentJsonKey}
                  level={field.level}
                />
              )}
              {field.uiType === 'Radio' &&
                (field.validate?.required ||
                  watch(`${parentJsonKey}_conditional`)) && (
                <FormFields.FieldRadio
                  field={field}
                  register={register}
                  setValue={setValue}
                  watch={watch}
                  parentJsonKey={parentJsonKey}
                  level={field.level}
                />
              )}
              {field.uiType === 'Select' &&
                (field.validate?.required ||
                  watch(`${parentJsonKey}_conditional`)) && (
                <FormFields.FieldSelect
                  field={field}
                  register={register}
                  setValue={setValue}
                  watch={watch}
                  parentJsonKey={parentJsonKey}
                  level={field.level}
                />
              )}
              {field.uiType === 'Switch' &&
                (field.validate?.required ||
                  watch(`${parentJsonKey}_conditional`)) && (
                <FormFields.FieldSwitch
                  field={field}
                  register={register}
                  setValue={setValue}
                  watch={watch}
                  parentJsonKey={parentJsonKey}
                  level={field.level}
                />
              )}
              {field.uiType === 'Group' && (
                <FormFields.FieldGroup
                  field={field}
                  register={register}
                  setValue={setValue}
                  watch={watch}
                  parentJsonKey={field.jsonKey}
                  unregister={unregister}
                  level={field.level}
                />
              )}
            </div>
          )
        );
      })}
      {isConditionalFields &&
        parentUiType === 'Group' &&
        parentLevel < uiSchema?.[0]?.level && (
        <div className={styles.conditionalFields}>
          <label className={styles.switch}>
            <input
              type='checkbox'
              {...register(`${parentJsonKey}_conditional`, {
                required: false
              })}
              // defaultChecked={true}
            />
            <span className={styles.slider}></span>
          </label>
          <label>Show Advanced Fields for {parentJsonKey}</label>
        </div>
      )}
    </>
  );
};

RenderField.propTypes = {
  uiSchema: PropTypes.array.isRequired,
  register: PropTypes.func.isRequired,
  setValue: PropTypes.func.isRequired,
  watch: PropTypes.func.isRequired,
  parentJsonKey: PropTypes.string,
  isConditionalFields: PropTypes.bool,
  parentUiType: PropTypes.string,
  parentLevel: PropTypes.number,
  unregister: PropTypes.func.isRequired
};

export default RenderField;
