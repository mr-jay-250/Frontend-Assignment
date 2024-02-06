import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import initialUiSchema from './helper'
import styles from './App.module.css'

const JsonEditor = ({ onChange }) => {
  const handleInputChange = event => {
    try {
      const newUiSchema = JSON.parse(event.target.value)
      onChange(newUiSchema)
    } catch (error) {
      // Handle JSON parsing error
      console.error('Invalid JSON')
    }
  }

  return (
    <textarea
      placeholder='Paste UI Schema here...'
      onChange={handleInputChange}
      className={styles.jsonEditor}
    />
  )
}

const FieldInput = ({ field, register, parentJsonKey, level }) => (
  <div className={styles.inputField}>
    <div className={styles.sectionHeading}>{field.label}</div>
    <input
      className={styles.input}
      type='text'
      {...register(
        level === 0 ? field.jsonKey : `${parentJsonKey}.${field.jsonKey}`,
        {
          required: field.validate.required
        }
      )}
    />
  </div>
)

const FieldRadio = ({
  field,
  register,
  setValue,
  watch,
  parentJsonKey,
  level
}) => {
  // console.log('parentJsonKey', parentJsonKey)
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
              setValue(`${parentJsonKey}.${field.jsonKey}`, e.target.value)
            }}
          />
          <label className={styles.styledLabel} for={option.value}>
            {option.label}
          </label>
        </div>
      ))}
    </div>
  )
}

const FieldSelect = ({ field, register, watch, parentJsonKey, level }) => (
  <div className={styles.selectContainer}>
    <div className={styles.sectionHeading}>{field.label}</div>
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
)

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
)

const FieldGroup = ({
  field,
  register,
  watch,
  setValue,
  parentJsonKey,
  unregister
}) => {
  // console.log('parentJsonKey2', parentJsonKey)
  return (
    <>
      <div className={styles.sectionHeading}>{field.label}</div>
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
  )
}

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
        // console.log('unregister', `${parentJsonKey}.${field.jsonKey}`)
        unregister(`${parentJsonKey}.${field.jsonKey}`)
      }
    })
  }, [])

  useEffect(() => {
    setValue(`${parentJsonKey}_conditional`, true)
  }, [])

  return (
    <>
      {uiSchema?.map((field, index) => {
        const isDisplay = field.conditions
          ? field.conditions?.every(condition => {
              const value = watch(condition.jsonKey)
              switch (condition.op) {
                case '==':
                  return value === condition.value
                case '!=':
                  return value !== condition.value
                default:
                  return false
              }
            })
          : true

        return (
          isDisplay && (
            <div
              style={
                {
                  // display: isDisplay ? 'block' : 'none'
                }
              }
            >
              {field.uiType === 'Ignore' && (
                <FieldGroup
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
                  <FieldInput
                    field={field}
                    register={register}
                    parentJsonKey={parentJsonKey}
                    level={field.level}
                  />
                )}
              {field.uiType === 'Radio' &&
                (field.validate?.required ||
                  watch(`${parentJsonKey}_conditional`)) && (
                  <FieldRadio
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
                  <FieldSelect
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
                  <FieldSwitch
                    field={field}
                    register={register}
                    setValue={setValue}
                    watch={watch}
                    parentJsonKey={parentJsonKey}
                    level={field.level}
                  />
                )}
              {field.uiType === 'Group' && (
                <FieldGroup
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
        )
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
  )
}

const FormPreview = ({ uiSchema, selectedTab }) => {
  const {
    register,
    setValue,
    watch,
    handleSubmit,
    unregister,
    formState: { errors }
  } = useForm()

  const onSubmit = data => {
    // console.log('data', watch())
    console.log('data', data)
  }

  // console.log('errors', errors)

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
  )
}

const App = () => {
  const [uiSchema, setUiSchema] = useState(initUiSchema)
  const [selectedTab, setSelectedTab] = useState(0)

  const handleJsonChange = newUiSchema => {
    setUiSchema(newUiSchema)
    // Reset selected tab when UI schema changes
    setSelectedTab(0)
  }

  const handleSubmit = values => {
    console.log('Form Data to be sent:', values)
    // Logic to gather data for the selected tab
    // const formData = uiSchema[selectedTab]
    // // Send formData to the backend
    // console.log('Form Data to be sent:', formData)
  }

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
        {/* <button onClick={handleSubmit}>Submit</button> */}
      </div>
    </div>
  )
}

export default App

const initUiSchema = initialUiSchema
