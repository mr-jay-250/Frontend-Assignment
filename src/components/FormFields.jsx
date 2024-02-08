import React from 'react';
import PropTypes from 'prop-types';
import RenderField from './RenderField';
import styles from '../App.module.css';

const FieldInput = ({ field, register, parentJsonKey, level, watch }) => (
  <div className={styles.inputField}>
    <div className={styles.sectionHeading}>
      {field.label}
      {field.validate && field.validate.required && <span className={styles.requiredAsterisk}>*</span>}
    </div>
    <input
      className={styles.input}
      type='text'
      value={watch(level === 0 ? field.jsonKey : `${parentJsonKey}.${field.jsonKey}`) || ''} // Set value using watch
      {...register(
        level === 0 ? field.jsonKey : `${parentJsonKey}.${field.jsonKey}`,
        {
          required: field.validate.required
        }
      )}
    />
  </div>
);

const FieldRadio = ({
  field,
  register,
  setValue,
  watch,
  parentJsonKey,
  level
}) => {
  return (
    <div className={styles.radioContainer}>
      {field.validate.options.map(option => (
        <div className={styles.radioBtn} key={option.value}>
          <input
            className={styles.styledRadio}
            type='radio'
            name={field.jsonKey}
            {...register(
              level === 0 ? field.jsonKey : `${parentJsonKey}.${field.jsonKey}`,
              {
                required: field.validate.required
              }
            )}
            value={option.value}
            onChange={e => {
              setValue(`${parentJsonKey}.${field.jsonKey}`, e.target.value);
            }}
          />
          <label className={styles.styledLabel} htmlFor={option.value}>
            {option.label}
          </label>
        </div>
      ))}
    </div>
  );
};

const FieldSelect = ({ field, register, watch, parentJsonKey, level }) => (
  <div className={styles.selectContainer}>
    <div className={styles.sectionHeading}>
      {field.label}
      {field.validate && field.validate.required && <span className={styles.requiredAsterisk}>*</span>}
    </div>
    <select
      {...register(
        level === 0 ? field.jsonKey : `${parentJsonKey}.${field.jsonKey}`,
        {
          required: field.validate.required
        }
      )}
      value={watch(field.jsonKey)}
    >
      {field.validate.options.map(option => (
        <option
          key={option.value}
          value={option.value}
          selected={option.value === field.validate.defaultValue}
        >
          {option.label}
        </option>
      ))}
    </select>
  </div>
);

const FieldSwitch = ({ field, register, parentJsonKey, level }) => (
  <>
    <div className={styles.switchContainer} key={field.jsonKey}>
      <label>{field.label}</label>
      <input
        type='checkbox'
        defaultChecked={field.validate.defaultValue}
        {...register(
          level === 0 ? field.jsonKey : `${parentJsonKey}.${field.jsonKey}`,
          {
            required: field.validate.required
          }
        )}
      />
    </div>
  </>
);

const FieldGroup = ({
  field,
  register,
  watch,
  setValue,
  parentJsonKey,
  unregister
}) => {
  return (
    <>
      <div className={styles.sectionHeading}>
        {field.label}
        {field.validate && field.validate.required && <span className={styles.requiredAsterisk}>*</span>}
      </div>
      <RenderField
        uiSchema={field.subParameters}
        register={register}
        setValue={setValue}
        watch={watch}
        parentJsonKey={parentJsonKey}
        isConditionalFields={field.subParameters.some(
          subField => !subField.validate?.required
        )}
        parentUiType={field.uiType}
        parentLevel={field.level}
        unregister={unregister}
      />
    </>
  );
};

FieldGroup.propTypes = {
  field: PropTypes.object.isRequired,
  register: PropTypes.func.isRequired,
  setValue: PropTypes.func.isRequired,
  watch: PropTypes.func.isRequired,
  parentJsonKey: PropTypes.string.isRequired,
  unregister: PropTypes.func.isRequired
};

FieldRadio.propTypes = {
  field: PropTypes.object.isRequired,
  register: PropTypes.func.isRequired,
  setValue: PropTypes.func.isRequired,
  watch: PropTypes.func.isRequired,
  parentJsonKey: PropTypes.string.isRequired,
  level: PropTypes.number.isRequired
};

FieldSwitch.propTypes = {
  field: PropTypes.object.isRequired,
  register: PropTypes.func.isRequired,
  parentJsonKey: PropTypes.string.isRequired,
  level: PropTypes.number.isRequired
};

FieldSelect.propTypes = {
  field: PropTypes.object.isRequired,
  register: PropTypes.func.isRequired,
  parentJsonKey: PropTypes.string,
  watch: PropTypes.func.isRequired,
  level: PropTypes.number.isRequired
};

FieldInput.propTypes = {
  field: PropTypes.object.isRequired,
  register: PropTypes.func.isRequired,
  parentJsonKey: PropTypes.string,
  watch: PropTypes.func,
  level: PropTypes.number.isRequired
};

export default { FieldInput, FieldGroup, FieldRadio, FieldSelect, FieldSwitch };
