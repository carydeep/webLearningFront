import { FieldProps } from "formik"
import React from "react"
import { Form } from "react-bootstrap"
import styles from "../../styles/InputFieldQuiz.module.css"

interface userName {
  type: string
  label: string
  placeholder: string
  readonly?: boolean
}

function InputFieldQuiz(props: FieldProps & userName) {
  const { field, form, type, label, placeholder, readonly } = props
  const { name } = field
  const { errors, touched }: { errors: any; touched: any } = form
  return (
    <div>
      <Form.Group controlId={name} className={styles.text}>
        {label && <Form.Label className={styles.formLabel}>{label}</Form.Label>}
        <Form.Control
          type={type}
          placeholder={placeholder}
          isInvalid={touched[name] && !!errors[name]}
          className={styles.input}
          readOnly={readonly}
          {...field}
        ></Form.Control>
        <Form.Control.Feedback type="invalid">
          {errors[name]}
        </Form.Control.Feedback>
      </Form.Group>
    </div>
  )
}

export default InputFieldQuiz
